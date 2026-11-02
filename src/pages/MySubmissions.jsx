import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  FileText, Calendar, Clock, Eye, Download, ArrowRight, 
  Loader2, Search, CreditCard, RefreshCw, CheckCircle, 
  AlertCircle, XCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadSampleDocx, downloadSamplePdf } from '../utils/sampleTemplate';

const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('manuscripts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setSubmissions(data || []);
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'UNDER REVIEW':
      case 'Submitted':
      case 'Editorial Review':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Under Review',
          icon: Clock
        };
      case 'REVISION REQUESTED':
      case 'Revision Required':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Revision Requested',
          icon: AlertCircle
        };
      case 'ACCEPTED':
      case 'Accepted':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Accepted (APC Pending)',
          icon: CheckCircle
        };
      case 'PAYMENT VERIFICATION':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Payment Verifying',
          icon: RefreshCw
        };
      case 'PAYMENT VERIFIED':
        return {
          bg: 'bg-teal-100 text-teal-800 border-teal-200',
          label: 'Payment Verified',
          icon: CheckCircle
        };
      case 'PUBLISHED':
      case 'Published':
        return {
          bg: 'bg-green-700 text-white border-green-800',
          label: 'Published',
          icon: CheckCircle
        };
      case 'REJECTED':
      case 'Rejected':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          label: 'Rejected',
          icon: XCircle
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          label: status || 'Under Review',
          icon: Clock
        };
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    (s.paper_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.submission_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div>
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-1">Author Portal</span>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary mb-2">My Submissions</h1>
            <p className="text-gray-500">Track and manage your JMES research manuscripts</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Paper ID or Title..."
                className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:border-primary transition-all w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to="/submit-paper" className="btn-secondary flex items-center gap-2 justify-center text-sm py-3 px-6 shadow-md">
              Submit Manuscript
            </Link>
          </div>
        </div>

        {/* Template Quick Download Banner */}
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h4 className="font-bold text-primary text-sm">Need the Official JMES Paper Format?</h4>
              <p className="text-xs text-gray-500">Download the 15-section academic template for preparing submissions or revisions.</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={downloadSampleDocx}
              className="px-3.5 py-2 bg-white border border-gray-200 text-primary text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              DOCX Template
            </button>
            <button 
              onClick={downloadSamplePdf}
              className="px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              PDF Guidelines
            </button>
          </div>
        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-premium border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <FileText size={40} />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">No Manuscripts Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
              {searchTerm ? 'No submissions match your search query.' : "You haven't submitted any research manuscripts yet. Begin your submission process today."}
            </p>
            <Link to="/submit-paper" className="btn-primary py-3 px-8 text-sm">Submit Now</Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredSubmissions.map((sub, index) => {
              const badge = getStatusBadge(sub.status);
              const BadgeIcon = badge.icon;
              return (
                <motion.div 
                  key={sub.id || sub.submission_id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                >
                  <div className="flex-grow space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                        {sub.submission_id}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                        <BadgeIcon size={12} />
                        {badge.label}
                      </span>
                      {sub.category && (
                        <span className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                          {sub.category}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-primary leading-snug hover:text-secondary transition-colors">
                      <Link to={`/submission/${sub.submission_id}`}>
                        {sub.paper_title}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-6 text-gray-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        Submitted: {new Date(sub.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        Last Activity: {new Date(sub.updated_at || sub.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
                    {sub.status === 'ACCEPTED' && (
                      <Link 
                        to={`/submission/${sub.submission_id}`}
                        className="px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-secondary/90 transition-all shadow-sm"
                      >
                        <CreditCard size={14} />
                        Pay APC
                      </Link>
                    )}
                    {sub.status === 'REVISION REQUESTED' && (
                      <Link 
                        to={`/submission/${sub.submission_id}`}
                        className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-amber-600 transition-all shadow-sm"
                      >
                        <RefreshCw size={14} />
                        Re-upload Revision
                      </Link>
                    )}
                    {sub.status === 'PUBLISHED' && (
                      <Link 
                        to={`/paper/${sub.submission_id}`}
                        className="px-4 py-2.5 bg-green-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-green-800 transition-all shadow-sm"
                      >
                        <CheckCircle size={14} />
                        View Published Paper
                      </Link>
                    )}
                    <Link 
                      to={`/submission/${sub.submission_id}`}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-gray-200 transition-all"
                    >
                      <Eye size={14} />
                      Details
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;
