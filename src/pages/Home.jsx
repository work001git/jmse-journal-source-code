import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import AboutSection from '../components/AboutSection';
import AimScopeCards from '../components/AimScopeCards';
import PaperCard from '../components/PaperCard';
import { usePapers } from '../hooks/usePapers';
import { editorialBoard } from '../data/editorialBoard';
import { motion } from 'framer-motion';
import { Mail, Send, ArrowRight, UserCheck, BookOpen, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { allPapers, loading } = usePapers();
  const latestPublished = allPapers.slice(0, 2);

  return (
    <div>
      <Hero />
      <Stats />
      <AboutSection />
      
      {/* Latest Papers Preview */}
      <section className="bg-white py-24">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-secondary font-bold text-sm uppercase tracking-widest mb-4 block italic">Current Research</span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-primary italic">Latest Articles</h2>
            </div>
            <Link to="/current-issue" className="flex items-center gap-3 text-primary font-black hover:gap-5 transition-all italic text-sm uppercase tracking-widest">
              View All Papers <ArrowRight size={20} className="text-secondary" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {loading ? (
              <div className="lg:col-span-2 text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <div className="animate-spin text-secondary mb-4 mx-auto w-10 h-10 border-4 border-secondary border-t-transparent rounded-full font-black"></div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Research Archives...</p>
              </div>
            ) : latestPublished.length > 0 ? (
              latestPublished.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))
            ) : (
              <div className="lg:col-span-2 text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                <Newspaper size={48} className="text-gray-200 mb-6" />
                <h3 className="text-xl font-bold text-gray-400">No published articles yet</h3>
                <p className="text-gray-300 italic mt-2">The editorial team is currently reviewing new submissions.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <AimScopeCards />

      {/* Editorial Board Preview */}
      <section className="bg-white py-24">
        <div className="section-container">
           <div className="text-center mb-16">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest mb-4 block">Our Experts</span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-primary italic">Editorial Leadership</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {editorialBoard.slice(0, 1).map((editor, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-xl border border-gray-100"
              >
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-[2rem] overflow-hidden shadow-2xl shrink-0 -mt-16 md:mt-0">
                  <img src={editor.image} alt={editor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                      {editor.role}
                    </span>
                    <span className="text-accent italic font-medium text-sm">Editor-in-Chief</span>
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-2 italic">{editor.name}</h3>
                  <p className="text-secondary font-semibold mb-6 italic">{editor.title} at {editor.institution.split(',')[0]}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                      <UserCheck size={20} className="text-accent shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Research focus</p>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed italic">{editor.researchAreas.join(' • ')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <BookOpen size={20} className="text-accent shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Impact</p>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed italic">{editor.publications}</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/editorial-board" className="btn-outline text-sm italic">Meet Full Board</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden bg-[#0A2647]">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-secondary/10 skew-x-12 -translate-x-1/2"></div>

        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl"
          >
             <Newspaper size={64} className="text-accent mx-auto mb-8 opacity-50" />
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8 italic">Ready to Impact the Science?</h2>
            <p className="text-gray-300 text-lg mb-12 leading-relaxed italic">
              Submit your original research and join an international network of researchers dedicated to environmental statistics and econometrics.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/submit-paper" className="btn-secondary px-10 py-5 text-lg font-bold flex items-center justify-center gap-3">
                <Send size={24} />
                Submit Manuscript
              </Link>
              <Link to="/author-guidelines" className="bg-white text-primary px-10 py-5 text-lg font-bold rounded-full hover:bg-gray-100 transition-all flex items-center justify-center gap-3 italic">
                Author Guidelines
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
