import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PaperCard from '../components/PaperCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, ListFilter, Search, AlertCircle, Shield } from 'lucide-react';

const CurrentIssue = () => {
  const [papers, setPapers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCurrentIssue();
  }, []);

  const fetchCurrentIssue = async () => {
    setLoading(true);
    const { data: setts } = await supabase.from('settings').select('*').single();
    setSettings(setts || {});

    if (setts?.global_publication_visible === false) {
      setPapers([]);
      setLoading(false);
      return;
    }

    const { data: pData } = await supabase
      .from('manuscripts')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    setPapers(pData || []);
    setLoading(false);
  };

  const isGlobalOffline = settings?.global_publication_visible === false;

  const filteredPapers = papers.filter(p => 
    (p.paper_title || p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.submission_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="section-container">
        
        {/* Header */}
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden mb-16 shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <FileText size={300} />
          </div>
          <div className="relative z-10 max-w-3xl">
            <span className="bg-secondary text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full mb-8 inline-block shadow-lg">
              Official JMES Issue
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 italic leading-tight">Current Issue</h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic opacity-90 max-w-2xl">
              "Volume 12, Issue 2 - June 2026: Advances in Environmental Statistics, Stochastic Dynamics, and Econometric Models"
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/published-papers" className="btn-secondary px-8 py-3.5 flex items-center gap-2 font-bold text-xs">
                Browse Table of Contents
              </Link>
              <Link to="/subscriptions" className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3.5 rounded-full font-bold text-xs flex items-center gap-2">
                Subscribe for Full Access
              </Link>
            </div>
          </div>
        </div>

        {isGlobalOffline ? (
          <div className="max-w-xl mx-auto p-12 bg-white rounded-[2.5rem] shadow-premium border border-gray-100 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary">Public Repository Offline</h3>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              The public manuscript catalog is temporarily undergoing scheduled editorial maintenance. Issue browsing will resume shortly.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="flex-grow space-y-8">
              <div className="flex flex-col sm:flex-row items-end justify-between border-b border-gray-200 pb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary italic">Table of Contents</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Peer-reviewed quantitative articles published in Volume 12, Issue 2</p>
                </div>
                
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search current issue..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-primary font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-3">Loading Current Issue...</p>
                </div>
              ) : filteredPapers.length > 0 ? (
                <div className="grid gap-6">
                  {filteredPapers.map((paper) => (
                    <PaperCard key={paper.id} paper={paper} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-400 text-xs italic">
                  No published papers in this issue category.
                </div>
              )}
            </div>

            {/* Sidebar Meta */}
            <div className="lg:w-80 shrink-0 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-premium border border-gray-100 space-y-4">
                <h3 className="text-base font-bold text-primary border-b border-gray-100 pb-3">Issue Information</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Editor-in-Chief</span>
                    <p className="font-bold text-gray-700">Dr. Pachiyappan</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Frequency</span>
                    <p className="font-bold text-gray-700">Quarterly (4 Issues / Year)</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">ISSN (Online)</span>
                    <p className="font-mono font-bold text-primary">2765-9821</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Publisher</span>
                    <p className="font-bold text-secondary">JMES Academic Press</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-3xl p-8 text-white space-y-4 shadow-xl">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80 block">Call for Papers</span>
                <h4 className="text-lg font-bold">Submit for Next Issue (Vol 13, Issue 1)</h4>
                <p className="text-xs text-emerald-100 leading-relaxed italic">
                  Peer-reviewed rapid publication with comprehensive mathematical and statistical indexing.
                </p>
                <Link to="/submit-paper" className="w-full bg-white text-secondary py-3 rounded-xl font-bold text-xs inline-block text-center hover:bg-gray-50 shadow-md">
                  Submit Manuscript Now
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CurrentIssue;
