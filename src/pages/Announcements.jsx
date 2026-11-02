import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, ArrowRight, Tag } from 'lucide-react';

const news = [
  {
    title: "Call for Papers: Special Issue on AI in Biodiversity",
    date: "July 12, 2026",
    category: "Special Issue",
    desc: "We invite original research on the application of deep learning models for monitoring and predicting biodiversity metrics in tropical ecosystems."
  },
  {
    title: "Volume 12, Issue 2 Released",
    date: "June 20, 2026",
    category: "Publication",
    desc: "The latest issue featuring research on Bayesian spatio-temporal modeling and carbon economics is now available online."
  },
  {
    title: "Upcoming Conference: Environmental Econometrics 2026",
    date: "June 05, 2026",
    category: "Event",
    desc: "JESE will be hosting a satellite workshop during the international conference on stats and economics in Geneva."
  }
];

const Announcements = () => {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 font-body">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-6 italic">News & Announcements</h1>
            <p className="text-gray-500 font-medium italic">
              Stay updated with the latest calls for papers, volume releases, and academic events from the JESE Editorial Office.
            </p>
          </div>
          <Megaphone size={120} className="text-accent opacity-10 hidden lg:block" />
        </div>

        <div className="grid gap-8">
           {news.map((item, i) => (
             <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] p-8 md:p-12 shadow-premium border border-gray-100 flex flex-col md:flex-row gap-8 items-start group"
             >
                <div className="shrink-0">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex flex-col items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                    <Calendar size={24} />
                    <span className="text-[10px] font-bold mt-1">2026</span>
                  </div>
                </div>
                
                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] bg-secondary/5 px-3 py-1 rounded-full flex items-center gap-2 italic">
                      <Tag size={12} />
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-primary italic leading-tight group-hover:text-secondary transition-colors cursor-pointer">
                    {item.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed max-w-3xl">
                    {item.desc}
                  </p>
                  <button className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-4 transition-all pt-4">
                    Read Full Article <ArrowRight size={18} className="text-accent" />
                  </button>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
