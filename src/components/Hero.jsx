import React from 'react';
import { motion } from 'framer-motion';
import { Send, FileText, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-primary">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
          alt="Environmental background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        {/* Abstract shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-block px-3.5 py-1 bg-accent/20 border border-accent/40 rounded-full text-accent font-bold text-xs uppercase tracking-widest">
              ISSN: 2765-9821 (Online)
            </span>
            <span className="inline-block px-3.5 py-1 bg-white/10 border border-white/20 rounded-full text-white font-medium text-xs">
              Peer-Reviewed Scholarly Journal
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight mb-6">
            Journal of <span className="text-accent underline decoration-4 decoration-accent/40 underline-offset-8">Mathematics</span> and Environmental Statistics
          </h1>
          
          <p className="text-lg text-gray-300 mb-10 max-w-xl leading-relaxed">
            Advancing global research across Pure & Applied Mathematics, Environmental Statistics, Econometric Modeling, and Stochastic Sustainability Analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/submit-paper" className="btn-secondary group flex items-center justify-center gap-3 py-4 px-8 shadow-xl hover:-translate-y-1">
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span className="font-bold">Submit Manuscript</span>
            </Link>
            <Link to="/current-issue" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
              <FileText size={20} />
              Current Issue
            </Link>
            <Link to="/published-papers" className="bg-primary/60 border border-accent/40 text-accent px-6 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-accent/20 transition-all">
              <BookOpen size={18} />
              Explore Repository
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6 text-sm text-gray-400">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=author${i}`} alt="author" />
                </div>
              ))}
            </div>
            <p><span className="text-white font-bold">1,200+</span> Researchers & Institutional Subscribers</p>
          </div>
        </motion.div>

        {/* Visual Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden lg:block relative"
        >
          <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Impact Factor</p>
                  <p className="text-3xl font-bold text-accent">4.821</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Citescore</p>
                  <p className="text-xl font-bold text-white">6.5</p>
                </div>
              </div>
              <div className="h-40 flex items-end gap-2">
                {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-secondary to-accent rounded-t-sm"
                  ></motion.div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <span>2020</span>
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
                <span>2026</span>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-xs text-gray-300">Environmental Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span className="text-xs text-gray-300">Mathematical Models</span>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Ring */}
          <div className="absolute -inset-10 border-2 border-white/5 rounded-full animate-pulse"></div>
          <div className="absolute -inset-20 border border-white/5 rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
