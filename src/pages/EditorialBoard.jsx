import React from 'react';
import { editorialBoard } from '../data/editorialBoard';
import { motion } from 'framer-motion';
import { Mail, GraduationCap, Microscope, Award } from 'lucide-react';

const EditorialBoard = () => {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-accent font-bold text-sm uppercase tracking-widest mb-4 block">Our Scholarship</span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-8 underline decoration-accent decoration-4 underline-offset-8">Editorial Board</h1>
          <p className="text-lg text-gray-500 leading-relaxed italic">
            Comprising world-renowned experts in environmental metrics, our board ensures the highest standards of scientific rigor and academic excellence.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {editorialBoard.map((editor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-16 rounded-[3rem] shadow-premium border border-gray-100 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <span className="inline-block px-6 py-2 bg-primary/5 text-primary text-[11px] font-black uppercase tracking-[0.2em] rounded-full">
                    {editor.role}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-primary italic">
                    {editor.name}
                  </h2>
                  <p className="text-xl font-bold text-secondary italic">{editor.title}</p>
                </div>

                <div className="flex items-center justify-center gap-4 text-gray-500 bg-gray-50 px-8 py-5 rounded-[2rem] border border-gray-100 shadow-sm max-w-2xl mx-auto">
                  <GraduationCap className="text-secondary" size={28} />
                  <span className="font-bold text-sm leading-relaxed">{editor.institution}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative group hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-center gap-3 mb-6 text-primary">
                      <Microscope size={24} className="text-secondary" />
                      <h4 className="font-black text-xs uppercase tracking-widest">Research Focus</h4>
                    </div>
                    <ul className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 font-bold italic">
                      {editor.researchAreas.map((area, idx) => (
                        <li key={idx} className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 group-hover:bg-white transition-colors">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative group hover:border-primary/20 transition-all flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-3 mb-6 text-primary">
                      <Award size={24} className="text-secondary" />
                      <h4 className="font-black text-xs uppercase tracking-widest">Academic Contribution</h4>
                    </div>
                    <p className="text-lg font-bold text-gray-600 italic leading-relaxed px-4">
                      {editor.publications}
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20">
                    <Mail size={18} />
                    Direct Contact
                  </button>
                  <button className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs border border-gray-100 hover:bg-gray-50 transition-all">
                    University Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EditorialBoard;
