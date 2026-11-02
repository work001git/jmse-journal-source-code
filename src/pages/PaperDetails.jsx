import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  FileText, Download, Lock, CheckCircle2, Share2, 
  Calendar, User, BookOpen, Quote, ShieldAlert, ArrowLeft
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const PaperDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  useEffect(() => {
    fetchPaperAndSubscription();
  }, [id, user]);

  const fetchPaperAndSubscription = async () => {
    setLoading(true);
    // Fetch Paper
    const { data: pData } = await supabase
      .from('manuscripts')
      .select('*')
      .or(`submission_id.eq.${id},id.eq.${id}`)
      .single();

    if (pData) {
      setPaper(pData);
    }

    // Check user active subscription or role
    if (user) {
      if (user.role === 'admin' || user.role === 'staff') {
        setHasActiveSubscription(true);
      } else {
        const { data: subs } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'ACTIVE');

        if (subs && subs.some(s => new Date(s.expiry_date) > new Date())) {
          setHasActiveSubscription(true);
        }
      }
    }
    setLoading(false);
  };

  const handleAccessFullPaper = () => {
    if (hasActiveSubscription) {
      window.open(paper.manuscript_file, '_blank');
    } else {
      setShowSubscribeModal(true);
    }
  };

  const copyCitation = () => {
    if (!paper) return;
    const authorList = paper.corresponding_author || 'JMES Author';
    const year = new Date(paper.publication_date || paper.created_at).getFullYear();
    const citation = `${authorList} (${year}). ${paper.paper_title || paper.title}. Journal of Mathematics and Environmental Statistics, ${paper.volume || 12}(${paper.issue || 2}), ${paper.pages || '101-125'}. https://doi.org/${paper.doi || '10.5555/jmes.' + paper.submission_id}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    toast.success('APA Citation copied to clipboard');
    setTimeout(() => setCopiedCitation(false), 3000);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Paper Archive...</p>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background text-center px-4">
        <h1 className="text-2xl font-bold text-primary">Paper Not Found</h1>
        <p className="text-xs text-gray-400 mt-2">The requested research manuscript could not be found.</p>
        <Link to="/published-papers" className="btn-primary mt-6 inline-block text-xs py-3 px-6">
          Browse Published Papers
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <Toaster position="top-right" />
      <div className="section-container">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/published-papers" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to Published Papers
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Article Details */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-100 space-y-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-primary/10 text-primary font-mono text-xs font-black rounded-lg">
                  {paper.submission_id}
                </span>
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full">
                  Vol {paper.volume || 12}, Issue {paper.issue || 2} ({new Date(paper.publication_date || paper.created_at).getFullYear()})
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-mono rounded-md">
                  DOI: {paper.doi || '10.5555/jmes.' + paper.submission_id}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-heading font-extrabold text-primary leading-tight">
                {paper.paper_title || paper.title}
              </h1>

              {/* Authors List */}
              <div className="text-xs font-bold text-gray-700 flex flex-wrap items-center gap-2 pt-2">
                <span className="text-gray-400 font-normal">Authors:</span>
                {Array.isArray(paper.authors) ? (
                  paper.authors.map((a, i) => (
                    <span key={i} className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                      {a.full_name || a} {a.institution ? `(${a.institution})` : ''}
                    </span>
                  ))
                ) : (
                  <span>{paper.corresponding_author}</span>
                )}
              </div>

              {/* Structured Abstract */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Abstract</h3>
                <p className="text-sm text-gray-600 leading-relaxed italic bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  {paper.abstract}
                </p>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {(paper.keywords || '').split(',').map((kw, i) => (
                    <span key={i} className="text-xs bg-primary/5 text-primary font-medium px-3 py-1 rounded-full border border-primary/10">
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Limited Preview Barrier Section (Prompt Section 13) */}
              <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 relative overflow-hidden space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2">
                  <BookOpen size={16} className="text-secondary" /> Extended Excerpt & Research Methodology Preview
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-3">
                  1. Mathematical Formulations & Stochastic Estimations: The empirical model integrates multi-scale temporal autoregressive terms with spatially correlated error structures. Let Y(s, t) denote the environmental concentration index at location s and time t. Parameter estimation was conducted using Markov Chain Monte Carlo (MCMC) simulations across 50,000 iterations...
                </p>

                {/* Restricted Access Callout */}
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                      <Lock size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">Full Research Paper Access Protected</p>
                      <p className="text-[11px] text-gray-500">
                        {hasActiveSubscription 
                          ? 'Your active subscription gives you full access to view and download this complete PDF.' 
                          : 'Full PDF requires an active JMES Research Pass or subscription access.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAccessFullPaper}
                    className="btn-secondary text-xs py-3 px-6 shrink-0 flex items-center gap-2 font-bold shadow-md"
                  >
                    {hasActiveSubscription ? <Download size={14} /> : <Lock size={14} />}
                    {hasActiveSubscription ? 'Download Full PDF' : 'Read Full Paper'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Citation & Issue Metadata */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-gray-100 space-y-5">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest border-b border-gray-100 pb-3">
                Publication Details
              </h3>

              <div className="space-y-4 text-xs font-medium">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Journal</span>
                  <p className="text-primary font-bold mt-0.5">Journal of Mathematics and Environmental Statistics (JMES)</p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Volume & Issue</span>
                  <p className="text-gray-700 font-bold mt-0.5">Volume {paper.volume || 12}, Issue {paper.issue || 2}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Page Numbers</span>
                  <p className="text-gray-700 font-bold mt-0.5">{paper.pages || '101-125'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Published Date</span>
                  <p className="text-gray-700 font-bold mt-0.5">{new Date(paper.publication_date || paper.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <button
                  type="button"
                  onClick={copyCitation}
                  className="w-full btn-outline text-xs py-2.5 flex items-center justify-center gap-2 font-bold"
                >
                  <Quote size={14} />
                  {copiedCitation ? 'Citation Copied!' : 'Copy APA Citation'}
                </button>
              </div>
            </div>

            {/* Subscription Pass Card */}
            <div className="bg-gradient-to-br from-[#0F3D75] to-[#0A2647] rounded-3xl p-6 text-white space-y-3 shadow-xl">
              <span className="text-[9px] font-black text-accent uppercase tracking-widest block">Scholarly Access</span>
              <h4 className="text-base font-bold">Need Regular Research Access?</h4>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                Subscribe starting at INR 499/month for unlimited downloads of all mathematical & econometric archives.
              </p>
              <Link to="/subscriptions" className="btn-secondary text-xs py-2 px-4 inline-block font-bold mt-2">
                View Subscription Plans &rarr;
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Subscription Barrier Modal (Section 13) */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-heading font-extrabold text-primary">
              Subscribe to access the complete research paper
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              Unrestricted full-text access and complete PDF downloading require an active JMES Research Pass. Choose an affordable monthly or annual pass to unlock the entire repository.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/subscriptions" className="btn-secondary py-3 text-xs font-bold">
                View Subscription Passes (From INR 499)
              </Link>
              <button
                type="button"
                onClick={() => setShowSubscribeModal(false)}
                className="text-xs text-gray-400 hover:text-primary font-bold py-2"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaperDetails;
