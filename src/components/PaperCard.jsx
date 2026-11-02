import React from 'react';
import { FileText, Download, Share2, Calendar, User, Lock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PaperCard = ({ paper }) => {
  const formattedDate = paper.publication_date || (paper.created_at 
    ? new Date(paper.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : paper.date || '2026');

  const paperId = paper.submission_id || `JMES-2026-${String(paper.id).padStart(4, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-gray-100 hover:border-secondary/40 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-150"></div>
      
      <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
        <span className="font-mono text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-lg">
          {paperId}
        </span>
        <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest bg-accent/5 px-4 py-1.5 rounded-full">
          <Calendar size={12} />
          {formattedDate}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest bg-secondary/5 px-4 py-1.5 rounded-full">
          DOI: {paper.doi || `10.5555/jmes.${paperId}`}
        </div>
      </div>

      <h3 className="text-2xl font-heading font-extrabold mb-4 text-primary leading-tight group-hover:text-secondary transition-colors cursor-pointer italic line-clamp-2">
        <Link to={`/paper/${paperId}`}>
          {paper.paper_title || paper.title}
        </Link>
      </h3>
      
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 font-bold italic">
        <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs not-italic">
          {(paper.corresponding_author || (Array.isArray(paper.authors) ? paper.authors[0]?.full_name : paper.authors) || 'A')[0]}
        </div>
        <span>{paper.corresponding_author || (Array.isArray(paper.authors) ? paper.authors.map(a => a.full_name || a).join(', ') : paper.authors)}</span>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 italic opacity-80">
        {paper.abstract}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-gray-50 relative z-10">
        <Link 
          to={`/paper/${paperId}`}
          className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-xs px-6 py-3 font-bold"
        >
          <BookOpen size={16} />
          Read Full Paper
        </Link>
        <Link 
          to={`/paper/${paperId}`}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-black text-gray-600 hover:text-secondary transition-all py-3 px-6 rounded-full border-2 border-gray-100 hover:border-secondary/20"
        >
          <Download size={16} />
          PDF Access
        </Link>
      </div>
    </motion.div>
  );
};

export default PaperCard;
