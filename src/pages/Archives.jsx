import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Archive, Calendar, BookOpen, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Archives = () => {
  const [publishedPapers, setPublishedPapers] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data }) => setSettings(data));
    supabase.from('manuscripts').select('*').eq('status', 'PUBLISHED').then(({ data }) => {
      setPublishedPapers(data || []);
    });
  }, []);

  const years = [
    {
      year: '2026',
      issues: [
        { volume: 'Vol 12', issue: 'Issue 2 (June 2026)', desc: 'Spatio-Temporal Analytics & Carbon Econometrics' },
        { volume: 'Vol 12', issue: 'Issue 1 (March 2026)', desc: 'Stochastic Differential Modeling in Natural Ecology' }
      ]
    },
    {
      year: '2025',
      issues: [
        { volume: 'Vol 11', issue: 'Issue 4 (December 2025)', desc: 'Artificial Intelligence in Environmental Studies' },
        { volume: 'Vol 11', issue: 'Issue 3 (September 2025)', desc: 'Quantitative Public Policy & ESG Optimization' }
      ]
    },
    {
      year: '2024',
      issues: [
        { volume: 'Vol 10', issue: 'Annual Compendium (2024)', desc: 'Econometric Estimators in Atmospheric Pollution Monitoring' }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="section-container">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Permanent Scientific Record
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4">
            Journal Archives
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed italic">
            Chronological access to all past volumes, issues, and peer-reviewed articles published in the Journal of Mathematics and Environmental Statistics (JMES).
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {years.map((y, idx) => (
            <motion.div
              key={y.year}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-premium border border-gray-100"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <span className="text-3xl font-heading font-black text-primary font-mono">{y.year}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Publication Archive</span>
              </div>

              <div className="grid gap-4">
                {y.issues.map((iss, i) => (
                  <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-secondary/30 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-primary text-white text-[10px] font-bold rounded-md">{iss.volume}</span>
                        <h4 className="text-sm font-bold text-primary">{iss.issue}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 italic">{iss.desc}</p>
                    </div>

                    <Link to="/published-papers" className="btn-primary text-xs py-2 px-5 shrink-0 flex items-center gap-1.5 font-bold">
                      <BookOpen size={14} /> Browse Articles
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Archives;
