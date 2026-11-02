import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  FileText, Search, Calendar, User, Download, 
  ExternalLink, Filter, BookOpen, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PublishedPapers = () => {
  const [papers, setPapers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetchPublished();
  }, []);

  const fetchPublished = async () => {
    setLoading(true);
    const { data: setts } = await supabase.from('settings').select('*').single();
    setSettings(setts || {});

    // If Global Publication toggle is OFF, don't expose public papers
    if (setts?.global_publication_visible === false) {
      setPapers([]);
      setLoading(false);
      return;
    }

    const { data: pData } = await supabase
      .from('manuscripts')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false });

    setPapers(pData || []);
    setLoading(false);
  };

  const isGlobalOffline = settings?.global_publication_visible === false;

  const categories = [
    'ALL',
    'Environmental Statistics',
    'Environmental Econometrics',
    'Emerging Technologies',
    'Applied Environmental Mathematics'
  ];

  const filteredPapers = papers.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.subject_area === selectedCategory;
    const cleanSearch = searchTerm.toLowerCase();
    const matchSearch = 
      (p.paper_title || p.title || '').toLowerCase().includes(cleanSearch) ||
      (p.submission_id || '').toLowerCase().includes(cleanSearch) ||
      (p.corresponding_author || '').toLowerCase().includes(cleanSearch) ||
      (p.keywords || '').toLowerCase().includes(cleanSearch);
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="section-container">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3.5 py-1 bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Peer-Reviewed Open Repository
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4">
            Published Research Papers
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed italic">
            Explore original quantitative contributions in mathematics, econometrics, and environmental statistical systems published in JMES.
          </p>
        </div>

        {/* Global Offline Notice if Admin toggled OFF (Prompt Section 15) */}
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
          <>
            {/* Search & Filter Controls */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search by Paper ID, Title, Author, Keyword..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs focus:bg-white focus:border-primary transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      selectedCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Papers List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-3">Loading Published Articles...</p>
              </div>
            ) : filteredPapers.length > 0 ? (
              <div className="grid gap-6">
                {filteredPapers.map((paper, idx) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-premium border border-gray-100 hover:border-secondary/30 transition-all flex flex-col md:flex-row justify-between items-start gap-8"
                  >
                    <div className="space-y-4 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary font-mono text-xs font-black rounded-lg">
                          {paper.submission_id}
                        </span>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-wider rounded-full">
                          Vol {paper.volume || 12}, Issue {paper.issue || 2} ({new Date(paper.publication_date || paper.created_at).getFullYear()})
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          DOI: {paper.doi || '10.5555/jmes.' + paper.submission_id}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-heading font-extrabold text-primary leading-tight hover:text-secondary transition-colors">
                        <Link to={`/paper/${paper.submission_id}`}>
                          {paper.paper_title || paper.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-gray-500 font-medium">
                        Authors: <span className="font-bold text-gray-700">{paper.corresponding_author}</span> ? {paper.institution || 'JMES Research Network'}
                      </p>

                      <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-3">
                        {paper.abstract}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {(paper.keywords || '').split(',').slice(0, 4).map((kw, i) => (
                          <span key={i} className="text-[10px] bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col gap-2.5 w-full md:w-48 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 border-gray-100">
                      <Link
                        to={`/paper/${paper.submission_id}`}
                        className="btn-primary text-xs py-3 flex items-center justify-center gap-2 font-bold shadow-md text-center"
                      >
                        <BookOpen size={14} /> View Article
                      </Link>
                      <Link
                        to={`/paper/${paper.submission_id}`}
                        className="btn-outline text-xs py-2.5 flex items-center justify-center gap-2 font-bold text-center"
                      >
                        <Download size={14} /> Full PDF Access
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <p className="text-sm font-bold text-gray-400">No published papers match your search criteria.</p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default PublishedPapers;
