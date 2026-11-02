import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const AboutSection = () => {
  const highlights = [
    "Rigorous Double-Blind Peer Review",
    "Continuous Online Publishing & DOIs",
    "Subscription & Open Access Tiers",
    "Interdisciplinary Quantitative Scope",
    "International Editorial Board",
    "Indexed in Reputable Academic Databases"
  ];

  return (
    <section className="section-container">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-secondary font-bold text-sm uppercase tracking-widest mb-4 block">Our Identity & Mission</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-primary">About JMES</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            The <strong>Journal of Mathematics and Environmental Statistics (JMES)</strong> is an international peer-reviewed scholarly journal dedicated to publishing high-quality original research at the intersection of mathematical theory, environmental statistics, econometrics, sustainability analytics, and public policy.
          </p>
          <p className="text-gray-500 leading-relaxed mb-10">
            JMES bridges the gap between theoretical modeling and empirical real-world decision-making. We invite researchers, academicians, and practitioners to submit cutting-edge papers exploring stochastic processes, spatial analytics, ecological econometrics, and computational algorithms.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-secondary shrink-0" />
                <span className="text-sm font-semibold text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000" 
              alt="Collaboration" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating Card */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-premium border border-gray-100 max-w-xs"
          >
            <p className="text-accent font-bold text-4xl mb-2 italic">"Rigorous"</p>
            <p className="text-sm text-gray-500 font-medium">Mathematical foundations powering empirical environmental solutions.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
