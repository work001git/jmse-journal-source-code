import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { githubDB, getGitHubConfig, setGitHubConfig, testGitHubConnection, saveGitHubFile } from '../lib/githubStorage';
import { 
  CheckCircle2, XCircle, Clock, FileText, User, 
  Calendar, ExternalLink, ShieldCheck, Filter, 
  Search, Download, RefreshCcw, Send, AlertCircle,
  Loader2, Settings, Users, CreditCard, QrCode, 
  BookOpen, Globe, ToggleLeft, ToggleRight, Plus, 
  Trash2, Edit, Check, Eye, DollarSign, Award, Bell
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submissions');
  const [loading, setLoading] = useState(true);

  // Collections State
  const [papers, setPapers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [settings, setSettings] = useState(null);
  const [feeWaivers, setFeeWaivers] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [subscriptionsList, setSubscriptionsList] = useState([]);
  const [plansList, setPlansList] = useState([]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  // GitHub Storage State
  const [ghConfig, setGhConfig] = useState(() => getGitHubConfig());
  const [ghTesting, setGhTesting] = useState(false);
  const [ghStatus, setGhStatus] = useState(null);
  const [ghSyncing, setGhSyncing] = useState(false);

  const handleTestGitHub = async () => {
    setGhTesting(true);
    setGhStatus(null);
    const res = await testGitHubConnection(ghConfig);
    setGhTesting(false);
    setGhStatus(res);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleSaveGitHubConfig = () => {
    setGitHubConfig(ghConfig);
    toast.success('GitHub Repository configuration saved!');
  };

  const handleSyncAllToGitHub = async () => {
    setGhSyncing(true);
    try {
      const collections = ['manuscripts', 'users', 'profiles', 'payments', 'subscriptions', 'fee_waivers', 'settings'];
      let syncedCount = 0;
      for (const col of collections) {
        const data = await githubDB.getCollection(col);
        const ok = await saveGitHubFile('data/' + col + '.json', data, 'Sync ' + col + ' records from JMES Admin Panel');
        if (ok) syncedCount++;
      }
      toast.success('Synced ' + syncedCount + ' collections to GitHub Repository!');
    } catch (e) {
      toast.error('Sync error: ' + e.message);
    }
    setGhSyncing(false);
  };

  // Modals & Action States
  const [staffForm, setStaffForm] = useState({ open: false, isEdit: false, id: '', full_name: '', email: '', password: '', department: '', is_active: true });
  const [publicationModal, setPublicationModal] = useState({ open: false, paperId: '', volume: '12', issue: '2', pubDate: new Date().toISOString().split('T')[0], pages: '101-125', doi: '' });
  const [feeWaiverModal, setFeeWaiverModal] = useState({ open: false, waiverId: '', submissionId: '', percent: 50, notes: '' });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const { data: pData } = await supabase.from('manuscripts').select('*').order('created_at', { ascending: false });
      const { data: uData } = await supabase.from('users').select('*');
      const { data: sData } = await supabase.from('settings').select('*').single();
      const { data: fData } = await supabase.from('fee_waivers').select('*').order('created_at', { ascending: false });
      const { data: payData } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      const { data: subData } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false });
      const { data: planData } = await supabase.from('subscription_plans').select('*');

      setPapers(pData || []);
      const allUsers = uData || [];
      setUsersList(allUsers.filter(u => u.role === 'user'));
      setStaffList(allUsers.filter(u => u.role === 'staff'));
      setSettings(sData || {});
      setFeeWaivers(fData || []);
      setPaymentsList(payData || []);
      setSubscriptionsList(subData || []);
      setPlansList(planData || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load administrative data');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  // Calculate 15 Metrics for Admin Dashboard (Prompt Section 14)
  const totalUsers = usersList.length;
  const totalStaff = staffList.length;
  const totalSubmissions = papers.length;
  const pendingReviews = papers.filter(p => p.status === 'UNDER REVIEW' || p.status === 'Submitted').length;
  const acceptedPapers = papers.filter(p => p.status === 'ACCEPTED' || p.status === 'Accepted').length;
  const rejectedPapers = papers.filter(p => p.status === 'REJECTED' || p.status === 'Rejected').length;
  const revisionRequests = papers.filter(p => p.status === 'REVISION REQUESTED').length;
  const apcPaymentsPending = papers.filter(p => p.status === 'ACCEPTED' && (!p.apc_status || p.apc_status === 'PAYMENT PENDING')).length;
  const paymentVerificationPending = paymentsList.filter(p => p.status === 'PAYMENT VERIFICATION').length;
  const paymentVerified = paymentsList.filter(p => p.status === 'PAYMENT VERIFIED').length;
  const feeWaiverRequests = feeWaivers.filter(f => f.status === 'PENDING').length;
  const subscriptionRequests = subscriptionsList.filter(s => s.status === 'PENDING_VERIFICATION').length;
  const activeSubscriptions = subscriptionsList.filter(s => s.status === 'ACTIVE').length;
  const expiredSubscriptions = subscriptionsList.filter(s => s.status === 'EXPIRED').length;
  const publishedPapers = papers.filter(p => p.status === 'PUBLISHED').length;

  // 1. Staff Management Handlers (Admin Only)
  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.email || !staffForm.full_name) {
      toast.error('Name and email are required');
      return;
    }

    const currentUsers = await githubDB.getCollection('users');
    let updatedUsers = [...(currentUsers || [])];

    if (staffForm.isEdit) {
      updatedUsers = updatedUsers.map(u => {
        if (u.id === staffForm.id) {
          return {
            ...u,
            full_name: staffForm.full_name,
            department: staffForm.department,
            is_active: staffForm.is_active,
            ...(staffForm.password ? { password: staffForm.password } : {})
          };
        }
        return u;
      });
      toast.success('Staff account updated successfully');
    } else {
      if (updatedUsers.some(u => (u.email || '').toLowerCase() === staffForm.email.toLowerCase())) {
        toast.error('An account already exists with this email');
        return;
      }
      const newStaff = {
        id: `staff-${Date.now()}`,
        email: staffForm.email.toLowerCase().trim(),
        password: staffForm.password || 'staff123',
        full_name: staffForm.full_name,
        role: 'staff',
        department: staffForm.department || 'Mathematics & Review Board',
        institution: 'Journal of Mathematics and Environmental Statistics',
        is_active: true,
        created_at: new Date().toISOString()
      };
      updatedUsers.push(newStaff);
      toast.success('Staff account created successfully! Login: ' + newStaff.email);
    }

    await githubDB.saveCollection('users', updatedUsers);
    setStaffForm({ open: false, isEdit: false, id: '', full_name: '', email: '', password: '', department: '', is_active: true });
    fetchAllData();
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff account?')) return;
    const currentUsers = await githubDB.getCollection('users');
    const updated = currentUsers.filter(u => u.id !== staffId);
    await githubDB.saveCollection('users', updated);
    toast.success('Staff account deleted');
    fetchAllData();
  };

  const handleToggleStaffActive = async (staffMember) => {
    const currentUsers = await githubDB.getCollection('users');
    const updated = currentUsers.map(u => {
      if (u.id === staffMember.id) {
        return { ...u, is_active: !u.is_active };
      }
      return u;
    });
    await githubDB.saveCollection('users', updated);
    toast.success(`Staff status: ${!staffMember.is_active ? 'Activated' : 'Deactivated'}`);
    fetchAllData();
  };

  // 2. APC & Pricing Management Handlers
  const handleUpdateAPCRates = async (updatedRates, overlapPriority) => {
    const newSettings = {
      ...settings,
      apc_rates: updatedRates,
      overlap_priority: overlapPriority
    };
    await githubDB.saveCollection('settings', newSettings);
    setSettings(newSettings);
    toast.success('APC Fee rules and overlap priority updated');
  };

  // 3. UPI QR & Payment Account Settings Handlers
  const handleUpdateUPI = async (updatedUPI) => {
    const newSettings = {
      ...settings,
      upi_details: updatedUPI
    };
    await githubDB.saveCollection('settings', newSettings);
    setSettings(newSettings);
    toast.success('UPI Payment details & QR settings updated');
  };

  // 4. Manual Payment Verification Handlers
  const handleVerifyPayment = async (payment, action, note = '') => {
    const status = action === 'approve' ? 'PAYMENT VERIFIED' : 'PAYMENT REJECTED';

    // Update payment record
    const allPayments = await githubDB.getCollection('payments');
    const updatedPayments = allPayments.map(p => {
      if (p.id === payment.id) {
        return {
          ...p,
          status,
          admin_notes: note,
          verified_at: new Date().toISOString(),
          verified_by: user.full_name
        };
      }
      return p;
    });
    await githubDB.saveCollection('payments', updatedPayments);

    // Update corresponding manuscript
    await supabase
      .from('manuscripts')
      .update({
        apc_status: status,
        status: action === 'approve' ? 'READY FOR PUBLICATION' : 'PAYMENT PENDING'
      })
      .eq('submission_id', payment.submission_id);

    // Notify Author
    await supabase.from('notifications').insert([{
      user_id: payment.user_id,
      title: action === 'approve' ? 'APC Payment Verified!' : 'Payment Verification Issue',
      message: action === 'approve' 
        ? `Your payment of ${payment.currency} ${payment.final_payable} for manuscript ${payment.submission_id} has been verified. The paper is now READY FOR PUBLICATION.`
        : `Payment verification failed for ${payment.submission_id}: ${note || 'UTR mismatch with bank statement.'}`,
      type: action === 'approve' ? 'success' : 'error',
      created_at: new Date().toISOString()
    }]);

    toast.success(`Payment status set to: ${status}`);
    fetchAllData();
  };

  // 5. Fee Waiver Approval Handlers
  const handleApproveWaiver = async () => {
    const waiverId = feeWaiverModal.waiverId;
    const approvedPercent = Number(feeWaiverModal.percent);

    const allWaivers = await githubDB.getCollection('fee_waivers');
    const updatedWaivers = allWaivers.map(w => {
      if (w.id === waiverId) {
        return {
          ...w,
          status: 'APPROVED',
          approved_percentage: approvedPercent,
          admin_notes: feeWaiverModal.notes,
          decided_at: new Date().toISOString()
        };
      }
      return w;
    });
    await githubDB.saveCollection('fee_waivers', updatedWaivers);

    // Update manuscript fee waiver status
    await supabase
      .from('manuscripts')
      .update({
        fee_waiver_status: 'APPROVED',
        fee_waiver_approved_percent: approvedPercent
      })
      .eq('submission_id', feeWaiverModal.submissionId);

    toast.success(`Fee Waiver of ${approvedPercent}% APPROVED`);
    setFeeWaiverModal({ open: false, waiverId: '', submissionId: '', percent: 50, notes: '' });
    fetchAllData();
  };

  // 6. Subscription Management Handlers
  const handleVerifySubscription = async (sub, action) => {
    const status = action === 'activate' ? 'ACTIVE' : 'REJECTED';
    const startDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + (sub.duration_days || 30) * 24 * 60 * 60 * 1000).toISOString();

    const allSubs = await githubDB.getCollection('subscriptions');
    const updatedSubs = allSubs.map(s => {
      if (s.id === sub.id) {
        return {
          ...s,
          status,
          start_date: startDate,
          expiry_date: expiryDate,
          verified_by: user.full_name,
          verified_at: new Date().toISOString()
        };
      }
      return s;
    });
    await githubDB.saveCollection('subscriptions', updatedSubs);

    toast.success(`Subscription ${action === 'activate' ? 'ACTIVATED' : 'REJECTED'}`);
    fetchAllData();
  };

  // 7. Publication Management Handlers
  const handlePublishPaper = async () => {
    const { paperId, volume, issue, pubDate, pages, doi } = publicationModal;

    const paper = papers.find(p => p.id === paperId);
    const finalDoi = doi || `10.5555/jmes.${new Date(pubDate).getFullYear()}.${paper?.submission_id?.replace('JMES-', '') || '0001'}`;

    await supabase
      .from('manuscripts')
      .update({
        status: 'PUBLISHED',
        volume: Number(volume),
        issue: Number(issue),
        pages: pages,
        doi: finalDoi,
        published_at: new Date(pubDate).toISOString(),
        publication_date: pubDate
      })
      .eq('id', paperId);

    // Notify Author
    if (paper) {
      await supabase.from('notifications').insert([{
        user_id: paper.user_id,
        title: 'Your Research Paper is Published!',
        message: `Congratulations! Your manuscript "${paper.paper_title}" has officially been published in JMES Vol ${volume}, Issue ${issue}. DOI: ${finalDoi}`,
        type: 'success',
        created_at: new Date().toISOString()
      }]);
    }

    toast.success('Paper PUBLISHED! Visible in public Current Issue & Archives.');
    setPublicationModal({ open: false, paperId: '', volume: '12', issue: '2', pubDate: '', pages: '', doi: '' });
    fetchAllData();
  };

  const handleUnpublishPaper = async (paperId) => {
    if (!window.confirm('Unpublish this paper? It will be removed from public view but preserved in records.')) return;
    await supabase
      .from('manuscripts')
      .update({ status: 'UNPUBLISHED' })
      .eq('id', paperId);
    toast.success('Paper Unpublished');
    fetchAllData();
  };

  // 8. Global Website ON/OFF Control Toggle (Prompt Section 15)
  const handleToggleGlobalVisibility = async () => {
    const current = settings?.global_publication_visible !== false;
    const newSettings = {
      ...settings,
      global_publication_visible: !current
    };
    await githubDB.saveCollection('settings', newSettings);
    setSettings(newSettings);
    toast.success(`Global Public Repository is now ${!current ? 'ONLINE (ON)' : 'OFFLINE (MAINTENANCE MODE)'}`);
  };

  const filteredSubmissions = papers.filter(p => {
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const cleanS = searchTerm.toLowerCase();
    const matchSearch = (p.paper_title || '').toLowerCase().includes(cleanS) || (p.submission_id || '').toLowerCase().includes(cleanS) || (p.corresponding_author || '').toLowerCase().includes(cleanS);
    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <Toaster position="top-right" />
      <div className="section-container">

        {/* Admin Header with Global ON/OFF Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-1">
              <ShieldCheck size={18} /> Chief Editorial Directorate
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary">Admin Control Center</h1>
            <p className="text-xs text-gray-400 mt-1">Journal of Mathematics and Environmental Statistics (JMES)</p>
          </div>

          {/* Global Publication ON/OFF Control Button */}
          <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Repository</p>
              <p className="text-xs font-bold text-primary">
                {settings?.global_publication_visible !== false ? 'PUBLIC ACCESS (ON)' : 'MAINTENANCE (OFF)'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleGlobalVisibility}
              className={`p-2 rounded-xl transition-all ${
                settings?.global_publication_visible !== false 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-red-500 text-white shadow-md'
              }`}
              title="Toggle Global Public Repository Visibility"
            >
              {settings?.global_publication_visible !== false ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </div>
        </div>

        {/* 15 Metrics KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {[
            { label: 'Total Users', count: totalUsers, color: 'bg-white text-primary border-gray-100' },
            { label: 'Total Staff', count: totalStaff, color: 'bg-white text-secondary border-gray-100' },
            { label: 'Total Submissions', count: totalSubmissions, color: 'bg-white text-primary border-gray-100' },
            { label: 'Pending Reviews', count: pendingReviews, color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: 'Accepted Papers', count: acceptedPapers, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { label: 'Rejected Papers', count: rejectedPapers, color: 'bg-red-50 text-red-600 border-red-200' },
            { label: 'Revision Requests', count: revisionRequests, color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'APC Pending', count: apcPaymentsPending, color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Payment Verif. Due', count: paymentVerificationPending, color: 'bg-amber-100 text-amber-900 border-amber-300' },
            { label: 'Payment Verified', count: paymentVerified, color: 'bg-teal-50 text-teal-700 border-teal-200' },
            { label: 'Waiver Requests', count: feeWaiverRequests, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
            { label: 'Sub. Requests', count: subscriptionRequests, color: 'bg-pink-50 text-pink-700 border-pink-200' },
            { label: 'Active Subs', count: activeSubscriptions, color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'Expired Subs', count: expiredSubscriptions, color: 'bg-gray-100 text-gray-500 border-gray-200' },
            { label: 'Published Papers', count: publishedPapers, color: 'bg-primary text-white border-primary shadow-md' }
          ].map((stat, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border text-center transition-all ${stat.color}`}>
              <p className="text-2xl font-heading font-black">{stat.count}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-1 truncate">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          {[
            { id: 'submissions', label: 'Submissions', icon: <FileText size={14} /> },
            { id: 'staff', label: 'Staff Management', icon: <Users size={14} /> },
            { id: 'payments', label: 'Payment Verification', icon: <CreditCard size={14} />, badge: paymentVerificationPending },
            { id: 'waivers', label: 'Fee Waivers', icon: <Award size={14} />, badge: feeWaiverRequests },
            { id: 'subscriptions', label: 'Subscriptions', icon: <DollarSign size={14} />, badge: subscriptionRequests },
            { id: 'apc', label: 'APC Fee Settings', icon: <Settings size={14} /> },
            { id: 'upi', label: 'UPI QR Settings', icon: <QrCode size={14} /> },
            { id: 'publication', label: 'Issue Publishing', icon: <BookOpen size={14} /> },
            { id: 'github', label: 'GitHub Repo Storage', icon: <Globe size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: SUBMISSIONS & WORKFLOW */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search Paper ID, Title, Author..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs focus:bg-white focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'UNDER REVIEW', 'ACCEPTED', 'REVISION REQUESTED', 'READY FOR PUBLICATION', 'PUBLISHED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      statusFilter === st ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {filteredSubmissions.map((paper) => (
                <div key={paper.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start gap-6">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary font-mono text-xs font-black rounded-lg">{paper.submission_id}</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-full uppercase">{paper.status}</span>
                      <span className="text-[10px] text-gray-400">{new Date(paper.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary">{paper.paper_title || paper.title}</h3>
                    <p className="text-xs text-gray-500 font-medium">Author: {paper.corresponding_author} ({paper.corresponding_email}) ? {paper.country || 'N/A'}</p>
                    <p className="text-xs text-gray-400 line-clamp-2 italic">{paper.abstract}</p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 w-full xl:w-48">
                    <a href={paper.manuscript_file} target="_blank" rel="noreferrer" className="btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5">
                      <Download size={14} /> Download PDF
                    </a>
                    {paper.status === 'READY FOR PUBLICATION' && (
                      <button
                        onClick={() => setPublicationModal({ open: true, paperId: paper.id, volume: '12', issue: '2', pubDate: new Date().toISOString().split('T')[0], pages: '101-125', doi: '' })}
                        className="btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5"
                      >
                        <BookOpen size={14} /> Assign Issue & Publish
                      </button>
                    )}
                    {paper.status === 'PUBLISHED' && (
                      <button
                        onClick={() => handleUnpublishPaper(paper.id)}
                        className="bg-red-50 text-red-600 border border-red-200 text-xs py-2 rounded-xl font-bold hover:bg-red-100"
                      >
                        Unpublish Paper
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STAFF MANAGEMENT (Admin Only) */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-primary">Editorial Staff & Reviewers</h3>
                <p className="text-xs text-gray-400">Create and oversee editorial reviewer accounts. Staff cannot self-register.</p>
              </div>
              <button
                type="button"
                onClick={() => setStaffForm({ open: true, isEdit: false, id: '', full_name: '', email: '', password: '', department: 'School of Mathematics', is_active: true })}
                className="btn-secondary text-xs py-3 px-5 flex items-center gap-2 font-bold"
              >
                <Plus size={16} /> Add New Staff Member
              </button>
            </div>

            <div className="grid gap-4">
              {staffList.map((st) => (
                <div key={st.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary text-base">{st.full_name}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${st.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                        {st.is_active !== false ? 'Active' : 'Deactivated'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{st.email} ? Dept: {st.department || 'Editorial'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStaffActive(st)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      {st.is_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setStaffForm({ open: true, isEdit: true, id: st.id, full_name: st.full_name, email: st.email, password: '', department: st.department || '', is_active: st.is_active !== false })}
                      className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100"
                      title="Edit Staff Credentials"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(st.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
                      title="Delete Staff"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT VERIFICATION (Manual Check by Admin) */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-amber-50/60 p-5 rounded-3xl border border-amber-200 text-xs text-amber-800 space-y-1">
              <p className="font-bold">Strict Verification Rule (Section 12):</p>
              <p className="italic">
                Admins must manually verify the bank/UPI transaction statement. A screenshot alone must never automatically verify payment.
              </p>
            </div>

            <div className="grid gap-4">
              {paymentsList.map((pay) => (
                <div key={pay.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-start gap-6">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-lg">{pay.submission_id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        pay.status === 'PAYMENT VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                        pay.status === 'PAYMENT REJECTED' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {pay.status}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(pay.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Author</span>
                        <p className="font-bold text-gray-700">{pay.author_name}</p>
                        <p className="text-gray-400">{pay.author_email}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Bank 12-Digit UTR</span>
                        <p className="font-mono font-black text-primary text-sm mt-0.5">{pay.utr_number}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Settlement Amount</span>
                        <p className="font-bold text-secondary text-sm mt-0.5">{pay.currency} {pay.final_payable}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 w-full lg:w-56">
                    {pay.screenshot_url && (
                      <a href={pay.screenshot_url} target="_blank" rel="noreferrer" className="w-full btn-outline text-xs py-2.5 flex items-center justify-center gap-1.5">
                        <ExternalLink size={14} /> View Bank Receipt
                      </a>
                    )}
                    {pay.status === 'PAYMENT VERIFICATION' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerifyPayment(pay, 'approve')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md"
                        >
                          Verify UTR
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('State rejection rationale for this payment:');
                            if (reason) handleVerifyPayment(pay, 'reject', reason);
                          }}
                          className="flex-1 bg-red-50 text-red-600 border border-red-200 text-xs font-bold py-2.5 rounded-xl hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {paymentsList.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-400 text-xs font-bold">
                  No payment verification requests in queue.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: FEE WAIVER APPROVALS */}
        {activeTab === 'waivers' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-1">Fee Waiver Requests (Up to 50%)</h3>
              <p className="text-xs text-gray-400">Evaluate financial constraints and research merit to approve discounted APC rates.</p>
            </div>

            <div className="grid gap-4">
              {feeWaivers.map((waiver) => (
                <div key={waiver.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-start gap-6">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-lg">{waiver.submission_id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        waiver.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {waiver.status}
                      </span>
                      <span className="text-xs text-gray-400">Requested: {waiver.requested_percent}%</span>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                      <p className="font-bold text-gray-700">Author: {waiver.author_name} ({waiver.country})</p>
                      <p className="italic text-gray-600">Financial Circumstances: {waiver.financial_circumstances}</p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full lg:w-48 space-y-2">
                    {waiver.document_url && (
                      <a href={waiver.document_url} target="_blank" rel="noreferrer" className="w-full btn-outline text-xs py-2 flex items-center justify-center gap-1">
                        <Download size={12} /> View Proof Doc
                      </a>
                    )}
                    {waiver.status === 'PENDING' && (
                      <button
                        onClick={() => setFeeWaiverModal({ open: true, waiverId: waiver.id, submissionId: waiver.submission_id, percent: waiver.requested_percent || 50, notes: '' })}
                        className="w-full btn-secondary text-xs py-2.5 font-bold"
                      >
                        Approve / Set Waiver %
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SUBSCRIPTION MANAGEMENT */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-primary mb-1">Subscriber Passes & Requests</h3>
                <p className="text-xs text-gray-400">Verify reader UPI payments and manage active subscriber access permissions.</p>
              </div>
            </div>

            <div className="grid gap-4">
              {subscriptionsList.map((sub) => (
                <div key={sub.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary text-sm">{sub.user_name || sub.user_email}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-gray-500">Plan: <strong>{sub.plan_name}</strong> ? Amount: INR {sub.amount} ? UTR: <span className="font-mono">{sub.utr_number}</span></p>
                    {sub.expiry_date && <p className="text-gray-400">Expires: {new Date(sub.expiry_date).toLocaleDateString()}</p>}
                  </div>

                  <div className="flex gap-2">
                    {sub.screenshot_url && (
                      <a href={sub.screenshot_url} target="_blank" rel="noreferrer" className="btn-outline text-xs py-2 px-3">
                        View Proof
                      </a>
                    )}
                    {sub.status === 'PENDING_VERIFICATION' && (
                      <>
                        <button onClick={() => handleVerifySubscription(sub, 'activate')} className="btn-secondary text-xs py-2 px-4">
                          Activate Subscription
                        </button>
                        <button onClick={() => handleVerifySubscription(sub, 'reject')} className="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-xl border border-red-200">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {subscriptionsList.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-400 text-xs">
                  No pending subscription payments.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: APC FEE SETTINGS (Section 10) */}
        {activeTab === 'apc' && settings?.apc_rates && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary mb-1">Article Processing Charges (APC) Fee Rules</h3>
              <p className="text-xs text-gray-400">Admin-controlled fee structure and category overlap priorities.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">India Domestic Rate (INR)</label>
                <input 
                  type="number"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  value={settings.apc_rates.india.amount}
                  onChange={(e) => setSettings({
                    ...settings,
                    apc_rates: { ...settings.apc_rates, india: { ...settings.apc_rates.india, amount: Number(e.target.value) } }
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Other South Asian Countries (USD)</label>
                <input 
                  type="number"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  value={settings.apc_rates.south_asia.amount}
                  onChange={(e) => setSettings({
                    ...settings,
                    apc_rates: { ...settings.apc_rates, south_asia: { ...settings.apc_rates.south_asia, amount: Number(e.target.value) } }
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Female Authorship Worldwide Rate (USD)</label>
                <input 
                  type="number"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  value={settings.apc_rates.female_authorship.amount}
                  onChange={(e) => setSettings({
                    ...settings,
                    apc_rates: { ...settings.apc_rates, female_authorship: { ...settings.apc_rates.female_authorship, amount: Number(e.target.value) } }
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Rest of the World (USD)</label>
                <input 
                  type="number"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  value={settings.apc_rates.rest_of_world.amount}
                  onChange={(e) => setSettings({
                    ...settings,
                    apc_rates: { ...settings.apc_rates, rest_of_world: { ...settings.apc_rates.rest_of_world, amount: Number(e.target.value) } }
                  })}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
                Category Overlap Priority Rule:
              </label>
              <div className="flex gap-4 text-xs font-bold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="overlap" 
                    checked={settings.overlap_priority === 'female_first'}
                    onChange={() => setSettings({ ...settings, overlap_priority: 'female_first' })}
                  />
                  <span>Female Authorship Priority (USD 100 applies globally if female author)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="overlap" 
                    checked={settings.overlap_priority === 'country_first'}
                    onChange={() => setSettings({ ...settings, overlap_priority: 'country_first' })}
                  />
                  <span>Country Category Priority (India INR 4500 takes precedence)</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => handleUpdateAPCRates(settings.apc_rates, settings.overlap_priority)}
              className="btn-secondary py-3 px-8 text-xs font-bold"
            >
              Save APC Configuration
            </button>
          </div>
        )}

        {/* TAB 7: UPI QR & SETTINGS (Section 12) */}
        {activeTab === 'upi' && settings?.upi_details && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary mb-1">Manual UPI QR & Bank Settings</h3>
              <p className="text-xs text-gray-400">Configure the official UPI ID, QR Code and payee details displayed to authors.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Official UPI ID</label>
                <input 
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold font-mono"
                  value={settings.upi_details.upi_id}
                  onChange={(e) => setSettings({ ...settings, upi_details: { ...settings.upi_details, upi_id: e.target.value } })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Account Holder / Payee Name</label>
                <input 
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  value={settings.upi_details.account_name}
                  onChange={(e) => setSettings({ ...settings, upi_details: { ...settings.upi_details, account_name: e.target.value } })}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">QR Code Image URL (Direct PNG/SVG)</label>
                <input 
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  value={settings.upi_details.qr_code_url}
                  onChange={(e) => setSettings({ ...settings, upi_details: { ...settings.upi_details, qr_code_url: e.target.value } })}
                />
              </div>
            </div>

            <button
              onClick={() => handleUpdateUPI(settings.upi_details)}
              className="btn-secondary py-3 px-8 text-xs font-bold"
            >
              Save UPI Details
            </button>
          </div>
        )}

        {/* TAB 8: PUBLICATION ASSIGNMENT (Section 14 & 16) */}
        {activeTab === 'publication' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-1">Payment-Verified Papers Ready for Publication</h3>
              <p className="text-xs text-gray-400">Assign final Volume, Issue, Publication Date, Page Numbers, and DOI to officially publish articles.</p>
            </div>

            <div className="grid gap-4">
              {papers.filter(p => p.status === 'READY FOR PUBLICATION' || p.status === 'PUBLISHED').map((paper) => (
                <div key={paper.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-start gap-6">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-lg">{paper.submission_id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        paper.status === 'PUBLISHED' ? 'bg-green-600 text-white' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {paper.status}
                      </span>
                      {paper.doi && <span className="text-xs font-mono text-gray-400">DOI: {paper.doi}</span>}
                    </div>
                    <h4 className="text-lg font-bold text-primary">{paper.paper_title || paper.title}</h4>
                    <p className="text-xs text-gray-500">Author: {paper.corresponding_author} ? Issue: Vol {paper.volume || '12'}, Issue {paper.issue || '2'}, Pages {paper.pages || 'N/A'}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setPublicationModal({
                        open: true,
                        paperId: paper.id,
                        volume: String(paper.volume || '12'),
                        issue: String(paper.issue || '2'),
                        pubDate: paper.publication_date || new Date().toISOString().split('T')[0],
                        pages: paper.pages || '101-125',
                        doi: paper.doi || ''
                      })}
                      className="btn-secondary text-xs py-2.5 px-4"
                    >
                      {paper.status === 'PUBLISHED' ? 'Edit Issue Metadata' : 'Assign Issue & Publish'}
                    </button>
                    {paper.status === 'PUBLISHED' && (
                      <button onClick={() => handleUnpublishPaper(paper.id)} className="bg-red-50 text-red-600 border border-red-200 text-xs py-2.5 px-4 rounded-xl font-bold">
                        Unpublish
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GitHub Repo Storage Tab */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Active Storage Engine</span>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Supabase Removed (100% Free)</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary">Single GitHub Repository Storage</h3>
                  <p className="text-xs text-gray-500">All manuscripts, author details, payments, and PDF uploads are stored inside your GitHub Repository.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={handleTestGitHub}
                    disabled={ghTesting}
                    className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2"
                  >
                    {ghTesting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                    Test Connection
                  </button>
                  <button 
                    type="button"
                    onClick={handleSyncAllToGitHub}
                    disabled={ghSyncing}
                    className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
                  >
                    {ghSyncing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Sync All Data to GitHub
                  </button>
                </div>
              </div>

              {ghStatus && (
                <div className={"p-4 rounded-2xl mb-6 text-xs font-bold border flex items-center gap-3 " + (ghStatus.success ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200")}>
                  {ghStatus.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{ghStatus.message}</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">GitHub Repository Owner (Username or Org)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. my-academic-org" 
                    className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-mono font-bold"
                    value={ghConfig.owner}
                    onChange={(e) => setGhConfig({ ...ghConfig, owner: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Your GitHub account username or organization name.</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">GitHub Repository Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. jmes-journal-data" 
                    className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-mono font-bold"
                    value={ghConfig.repo}
                    onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">The single GitHub repository where all files & records are committed.</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Repository Branch</label>
                  <input 
                    type="text" 
                    placeholder="main" 
                    className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-mono font-bold"
                    value={ghConfig.branch}
                    onChange={(e) => setGhConfig({ ...ghConfig, branch: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Target branch (defaults to 'main').</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">GitHub Personal Access Token (PAT)</label>
                  <input 
                    type="password" 
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                    className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-mono font-bold"
                    value={ghConfig.token}
                    onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Token generated with 'repo' or 'contents:write' permission.</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={handleSaveGitHubConfig}
                  className="btn-primary text-xs py-3 px-6"
                >
                  Save GitHub Configuration
                </button>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-xs text-gray-600 space-y-3">
              <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                <ShieldCheck size={16} /> How Single GitHub Repo Storage Works:
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                <li><strong>No Supabase Required:</strong> Supabase has been completely removed. There are zero paid limits or trial expirations.</li>
                <li><strong>Single Repository:</strong> All journal tables are serialized as structured JSON files inside <code className="bg-white px-1.5 py-0.5 rounded border font-mono">data/</code> (<code className="font-mono">manuscripts.json</code>, <code className="font-mono">users.json</code>, <code className="font-mono">payments.json</code>, etc.).</li>
                <li><strong>PDF Manuscript Uploads:</strong> Uploaded papers and payment screenshots are committed directly to <code className="bg-white px-1.5 py-0.5 rounded border font-mono">uploads/</code> in the repository.</li>
                <li><strong>Offline & Fail-Safe:</strong> Local cache guarantees zero downtime even if GitHub API is experiencing rate limits or network latency.</li>
              </ul>
            </div>
          </div>
        )}


      </div>

      {/* Staff Create/Edit Modal */}
      {staffForm.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-4">{staffForm.isEdit ? 'Edit Staff Account' : 'Create Staff Account'}</h3>
            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Full Name</label>
                <input required type="text" className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold" value={staffForm.full_name} onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Staff Email</label>
                <input required type="email" disabled={staffForm.isEdit} className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold disabled:opacity-60" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{staffForm.isEdit ? 'New Password (Leave blank to keep)' : 'Password'}</label>
                <input type="password" required={!staffForm.isEdit} className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold" value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Department</label>
                <input type="text" className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold" value={staffForm.department} onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setStaffForm({ open: false, isEdit: false, id: '', full_name: '', email: '', password: '', department: '', is_active: true })} className="btn-outline text-xs py-2 px-4">Cancel</button>
                <button type="submit" className="btn-primary text-xs py-2 px-6">Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publication Assignment Modal */}
      {publicationModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-4">Official Journal Issue Publication</h3>
            <div className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 uppercase tracking-widest block mb-1">Volume Number</label>
                  <input type="number" className="w-full p-3 bg-gray-50 border rounded-xl" value={publicationModal.volume} onChange={(e) => setPublicationModal({ ...publicationModal, volume: e.target.value })} />
                </div>
                <div>
                  <label className="text-gray-400 uppercase tracking-widest block mb-1">Issue Number</label>
                  <input type="number" className="w-full p-3 bg-gray-50 border rounded-xl" value={publicationModal.issue} onChange={(e) => setPublicationModal({ ...publicationModal, issue: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-gray-400 uppercase tracking-widest block mb-1">Page Numbers (e.g. 101-125)</label>
                <input type="text" className="w-full p-3 bg-gray-50 border rounded-xl" value={publicationModal.pages} onChange={(e) => setPublicationModal({ ...publicationModal, pages: e.target.value })} />
              </div>

              <div>
                <label className="text-gray-400 uppercase tracking-widest block mb-1">Publication Date</label>
                <input type="date" className="w-full p-3 bg-gray-50 border rounded-xl" value={publicationModal.pubDate} onChange={(e) => setPublicationModal({ ...publicationModal, pubDate: e.target.value })} />
              </div>

              <div>
                <label className="text-gray-400 uppercase tracking-widest block mb-1">DOI (Leave blank for auto-generation)</label>
                <input type="text" placeholder="10.5555/jmes.2026.xxxx" className="w-full p-3 bg-gray-50 border rounded-xl font-mono" value={publicationModal.doi} onChange={(e) => setPublicationModal({ ...publicationModal, doi: e.target.value })} />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setPublicationModal({ open: false, paperId: '', volume: '12', issue: '2', pubDate: '', pages: '', doi: '' })} className="btn-outline text-xs py-2 px-4">Cancel</button>
                <button type="button" onClick={handlePublishPaper} className="btn-secondary text-xs py-2 px-6">Confirm Publication</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fee Waiver Determination Modal */}
      {feeWaiverModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-2">Approve Fee Waiver</h3>
            <p className="text-xs text-gray-500 mb-4">Paper: <span className="font-mono font-bold text-primary">{feeWaiverModal.submissionId}</span></p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Approved Waiver Discount % (Max 50%)</label>
                <select className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold" value={feeWaiverModal.percent} onChange={(e) => setFeeWaiverModal({ ...feeWaiverModal, percent: Number(e.target.value) })}>
                  <option value="25">25% Discount</option>
                  <option value="35">35% Discount</option>
                  <option value="50">50% Maximum Discount</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Administrative Notes</label>
                <textarea rows="3" placeholder="Approved based on institutional verification..." className="w-full p-3 bg-gray-50 border rounded-xl text-xs" value={feeWaiverModal.notes} onChange={(e) => setFeeWaiverModal({ ...feeWaiverModal, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setFeeWaiverModal({ open: false, waiverId: '', submissionId: '', percent: 50, notes: '' })} className="btn-outline text-xs py-2 px-4">Cancel</button>
                <button type="button" onClick={handleApproveWaiver} className="btn-secondary text-xs py-2 px-6">Approve Waiver</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
