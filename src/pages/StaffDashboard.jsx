import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle2, XCircle, Clock, FileText, User, 
  Calendar, ExternalLink, ShieldCheck, Filter, 
  Search, Download, RefreshCcw, Send, AlertCircle,
  Loader2, MessageSquare, Eye, Lock, FileUp, Check, Users
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals for Staff Actions
  const [rejectModal, setRejectModal] = useState({ open: false, paperId: null, paperTitle: '', reason: '' });
  const [revisionModal, setRevisionModal] = useState({ open: false, paperId: null, paperTitle: '', comments: '' });
  const [previewPaper, setPreviewPaper] = useState(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('manuscripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load manuscripts');
    } else {
      setPapers(data || []);
    }
    setLoading(false);
  };

  if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
    return <Navigate to="/staff/login" replace />;
  }

  // Calculate 8 Staff Dashboard Metrics
  const totalSubmissions = papers.length;
  const pendingReviews = papers.filter(p => p.status === 'UNDER REVIEW' || p.status === 'Submitted' || p.status === 'Editorial Review').length;
  const underReview = papers.filter(p => p.status === 'UNDER REVIEW').length;
  const acceptedPapers = papers.filter(p => p.status === 'ACCEPTED' || p.status === 'Accepted').length;
  const rejectedPapers = papers.filter(p => p.status === 'REJECTED' || p.status === 'Rejected').length;
  const revisionRequested = papers.filter(p => p.status === 'REVISION REQUESTED' || p.status === 'Revision Required').length;
  const paymentVerified = papers.filter(p => p.apc_status === 'PAYMENT VERIFIED' || p.status === 'PAYMENT VERIFIED').length;
  const completedPapers = papers.filter(p => p.status === 'PUBLISHED' || p.status === 'Published').length;

  // Review Actions
  const handleAccept = async (paper) => {
    if (!window.confirm(`Accept manuscript "${paper.submission_id}" for publication? This will notify the author and enable the APC payment process.`)) return;

    const { error } = await supabase
      .from('manuscripts')
      .update({ 
        status: 'ACCEPTED', 
        apc_status: 'PAYMENT PENDING',
        reviewed_by: user.full_name || 'Staff Reviewer',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', paper.id);

    if (error) {
      toast.error('Failed to accept paper');
    } else {
      toast.success(`Manuscript ${paper.submission_id} ACCEPTED. APC payment enabled.`);
      
      // Notify Author
      await supabase.from('notifications').insert([{
        user_id: paper.user_id,
        title: 'Manuscript Accepted!',
        message: `Congratulations! Your manuscript "${paper.paper_title}" (${paper.submission_id}) has been ACCEPTED by the editorial review board. Please proceed to your dashboard to complete the APC payment.`,
        type: 'success',
        created_at: new Date().toISOString()
      }]);

      fetchPapers();
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal.reason.trim()) {
      toast.error('Rejection rationale is required.');
      return;
    }

    const { error } = await supabase
      .from('manuscripts')
      .update({ 
        status: 'REJECTED',
        rejection_reason: rejectModal.reason,
        reviewed_by: user.full_name || 'Staff Reviewer',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', rejectModal.paperId);

    if (error) {
      toast.error('Failed to reject paper');
    } else {
      toast.success('Manuscript has been marked as REJECTED.');
      
      const targetPaper = papers.find(p => p.id === rejectModal.paperId);
      if (targetPaper) {
        await supabase.from('notifications').insert([{
          user_id: targetPaper.user_id,
          title: 'Manuscript Decision Issued',
          message: `Your manuscript "${targetPaper.paper_title}" (${targetPaper.submission_id}) was not accepted for publication. Editorial Feedback: ${rejectModal.reason}`,
          type: 'error',
          created_at: new Date().toISOString()
        }]);
      }

      setRejectModal({ open: false, paperId: null, paperTitle: '', reason: '' });
      fetchPapers();
    }
  };

  const handleRevisionSubmit = async () => {
    if (!revisionModal.comments.trim()) {
      toast.error('Revision instructions are required.');
      return;
    }

    const targetPaper = papers.find(p => p.id === revisionModal.paperId);
    const existingHistory = targetPaper?.revision_history || [];
    const newRevisionRecord = {
      round: existingHistory.length + 1,
      requested_at: new Date().toISOString(),
      requested_by: user.full_name || 'Staff Reviewer',
      comments: revisionModal.comments
    };

    const { error } = await supabase
      .from('manuscripts')
      .update({ 
        status: 'REVISION REQUESTED',
        revision_comments: revisionModal.comments,
        revision_history: [...existingHistory, newRevisionRecord]
      })
      .eq('id', revisionModal.paperId);

    if (error) {
      toast.error('Failed to request revision');
    } else {
      toast.success('Revision requested. Author has been notified to re-upload.');

      if (targetPaper) {
        await supabase.from('notifications').insert([{
          user_id: targetPaper.user_id,
          title: 'Revision Requested by Editorial Staff',
          message: `The review team requested revisions on "${targetPaper.paper_title}" (${targetPaper.submission_id}). Comments: ${revisionModal.comments}`,
          type: 'warning',
          created_at: new Date().toISOString()
        }]);
      }

      setRevisionModal({ open: false, paperId: null, paperTitle: '', comments: '' });
      fetchPapers();
    }
  };

  const filteredPapers = papers.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const cleanSearch = searchTerm.toLowerCase();
    const matchesSearch = 
      (p.paper_title || '').toLowerCase().includes(cleanSearch) ||
      (p.submission_id || '').toLowerCase().includes(cleanSearch) ||
      (p.corresponding_author || '').toLowerCase().includes(cleanSearch) ||
      (p.keywords || '').toLowerCase().includes(cleanSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <Toaster position="top-right" />
      <div className="section-container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 text-secondary font-bold text-xs uppercase tracking-widest mb-2">
              <Users size={18} />
              Editorial Staff Review Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary">Staff Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1">Logged in as {user.full_name} ({user.department || 'Editorial Reviewer'})</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchPapers}
              className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 text-gray-500 shadow-sm transition-all"
              title="Refresh Queue"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        {/* 8 Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
          {[
            { label: 'Total Submissions', count: totalSubmissions, color: 'text-primary bg-primary/5 border-primary/20' },
            { label: 'Pending Reviews', count: pendingReviews, color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { label: 'Under Review', count: underReview, color: 'text-blue-600 bg-blue-50 border-blue-200' },
            { label: 'Accepted', count: acceptedPapers, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { label: 'Rejected', count: rejectedPapers, color: 'text-red-600 bg-red-50 border-red-200' },
            { label: 'Revision Reqd', count: revisionRequested, color: 'text-purple-600 bg-purple-50 border-purple-200' },
            { label: 'Payment Verified', count: paymentVerified, color: 'text-teal-600 bg-teal-50 border-teal-200' },
            { label: 'Completed (Pub)', count: completedPapers, color: 'text-green-700 bg-green-100 border-green-300' }
          ].map((stat, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border text-center transition-all ${stat.color}`}>
              <p className="text-2xl font-heading font-extrabold">{stat.count}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider mt-1 line-clamp-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-5 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search Paper ID, Title, Author..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-medium focus:bg-white focus:border-secondary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {['ALL', 'UNDER REVIEW', 'ACCEPTED', 'REVISION REQUESTED', 'REJECTED', 'PUBLISHED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  filter === st ? 'bg-primary text-white shadow-sm' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Manuscripts List */}
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
                <Loader2 className="animate-spin mx-auto text-primary" size={36} />
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-3">Loading Editorial Queue...</p>
              </div>
            ) : filteredPapers.length > 0 ? (
              filteredPapers.map((paper) => (
                <motion.div
                  key={paper.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2rem] p-6 md:p-8 shadow-premium border border-gray-100 hover:border-secondary/30 transition-all flex flex-col xl:flex-row gap-6 items-start"
                >
                  <div className="flex-grow space-y-4 w-full">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary font-mono text-xs font-black rounded-lg">
                          {paper.submission_id}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          paper.status === 'PUBLISHED' ? 'bg-green-600 text-white' :
                          paper.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                          paper.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                          paper.status === 'REVISION REQUESTED' ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {paper.status}
                        </span>
                        {paper.apc_status && (
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold rounded-md">
                            APC: {paper.apc_status}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(paper.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-heading font-bold text-primary leading-snug">
                      {paper.paper_title || paper.title}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-gray-500 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Corresponding Author</span>
                        <p className="font-bold text-gray-700 mt-0.5">{paper.corresponding_author}</p>
                        <p className="text-[11px] text-gray-400 truncate">{paper.corresponding_email}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Institution & Country</span>
                        <p className="font-bold text-gray-700 mt-0.5 truncate">{paper.institution || 'N/A'}</p>
                        <p className="text-[11px] text-gray-400">{paper.country || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Subject Category</span>
                        <p className="font-bold text-primary mt-0.5">{paper.subject_area || 'General'}</p>
                        <p className="text-[11px] text-gray-400">{paper.article_type}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 italic bg-white p-3 rounded-xl border border-gray-100/80">
                      <span className="font-bold text-gray-400 not-italic uppercase text-[9px] tracking-widest block mb-1">Abstract</span>
                      {paper.abstract}
                    </p>

                    {/* Rejection or Revision Notices if existing */}
                    {paper.rejection_reason && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                        <strong>Rejection Reason:</strong> {paper.rejection_reason}
                      </div>
                    )}
                    {paper.revision_comments && (
                      <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-700">
                        <strong>Revision Notes:</strong> {paper.revision_comments}
                      </div>
                    )}
                  </div>

                  {/* Staff Review Actions Column */}
                  <div className="w-full xl:w-56 shrink-0 flex flex-col gap-2.5 pt-4 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-6 border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Staff Actions</p>

                    {/* Download / View Manuscript */}
                    <a
                      href={paper.manuscript_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-sm transition-all"
                    >
                      <Download size={14} /> Download PDF
                    </a>

                    {paper.status === 'UNDER REVIEW' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAccept(paper)}
                          className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-sm transition-all"
                        >
                          <CheckCircle2 size={14} /> Accept Paper
                        </button>
                        <button
                          type="button"
                          onClick={() => setRevisionModal({ open: true, paperId: paper.id, paperTitle: paper.paper_title, comments: '' })}
                          className="w-full py-2.5 px-4 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-100 transition-all"
                        >
                          <FileUp size={14} /> Request Revision
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectModal({ open: true, paperId: paper.id, paperTitle: paper.paper_title, reason: '' })}
                          className="w-full py-2.5 px-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                        >
                          <XCircle size={14} /> Reject Paper
                        </button>
                      </>
                    )}

                    {paper.status === 'ACCEPTED' && (
                      <div className="p-3 bg-emerald-50 rounded-xl text-center text-xs font-bold text-emerald-700">
                        Accepted for Publication. Waiting for APC payment settlement.
                      </div>
                    )}

                    {paper.status === 'REJECTED' && (
                      <div className="p-3 bg-red-50 rounded-xl text-center text-xs font-bold text-red-600">
                        Paper Rejected. Rejection notice issued.
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <p className="text-sm font-bold text-gray-400">No manuscripts found for the selected filter.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Staff Policy & Restrictions Notice (Prompt Section 9) */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-3xl p-6 text-xs text-gray-500 space-y-2">
          <p className="font-bold text-gray-700 flex items-center gap-2">
            <Lock size={14} className="text-secondary" /> Staff Authority & Governance Restrictions:
          </p>
          <p>
            As an Editorial Staff member, you have authorization to review submissions, request revisions, and issue accept/reject peer review recommendations. 
            Financial verifications (APC & Subscriptions), Fee Waiver determinations, and final public issue assignment are reserved strictly for the Chief Editorial Directorate.
          </p>
        </div>

      </div>

      {/* Rejection Reason Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-2">Reject Manuscript</h3>
            <p className="text-xs text-gray-400 mb-4 line-clamp-1 italic">{rejectModal.paperTitle}</p>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
              Required Rejection Reason *
            </label>
            <textarea
              rows="4"
              placeholder="State explicit methodological flaws, lack of novelty, out-of-scope reasons, or high similarity index..."
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:border-red-500 mb-4"
              value={rejectModal.reason}
              onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, paperId: null, paperTitle: '', reason: '' })}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Comments Modal */}
      {revisionModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-2">Request Manuscript Revision</h3>
            <p className="text-xs text-gray-400 mb-4 line-clamp-1 italic">{revisionModal.paperTitle}</p>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
              Reviewer Revision Instructions *
            </label>
            <textarea
              rows="4"
              placeholder="List specific changes required: e.g. clarify mathematical theorem proof, include comparative baseline models, update citations..."
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:border-purple-500 mb-4"
              value={revisionModal.comments}
              onChange={(e) => setRevisionModal(prev => ({ ...prev, comments: e.target.value }))}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRevisionModal({ open: false, paperId: null, paperTitle: '', comments: '' })}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevisionSubmit}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffDashboard;
