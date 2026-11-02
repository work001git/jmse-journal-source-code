import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, ShieldCheck, Zap, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 font-body">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">Scholarly Publishing Excellence</span>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-primary mb-6">About JMES</h1>
            <p className="text-gray-500 font-medium">Journal of Mathematics and Environmental Statistics ? ISSN: 2765-9821</p>
            <div className="h-1.5 w-32 bg-accent mx-auto rounded-full mt-6"></div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-12">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-premium border border-gray-100"
            >
              <p className="text-xl font-medium text-gray-800 mb-8 border-l-4 border-accent pl-6 leading-relaxed">
                The <strong>Journal of Mathematics and Environmental Statistics (JMES)</strong> is an international peer-reviewed scholarly journal dedicated to publishing high-quality, innovative research at the convergence of pure and applied mathematics, environmental statistics, econometrics, sustainability analytics, and quantitative policy modeling.
              </p>
              <p className="mb-6">
                JMES serves as a premier international platform for mathematicians, statisticians, environmental scientists, and economists to exchange methodological breakthroughs and empirical discoveries. Our overarching mission is to promote rigorous mathematical formulations that empower evidence-based environmental policy, climate risk quantification, and sustainable economic transitions.
              </p>
              <p>
                Led by prominent academicians including Dr. Pachiyappan (Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology), JMES bridges the critical divide between theoretical theorems and empirical environmental stewardship.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck, title: "Rigorous Peer Review", desc: "Strict double-blind peer review process conducted by distinguished international domain specialists." },
                { icon: Zap, title: "Rapid Turnaround", desc: "Initial editorial screening within 7-10 days and first decision within 35-45 days." },
                { icon: Award, title: "Global Indexing", desc: "Indexed in leading abstracting & citation registries with persistent CrossRef DOIs." },
                { icon: Users, title: "Academic Community", desc: "A vibrant international network of over 1,500 active researchers, reviewers, and institutions." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary text-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute bottom-0 right-0 p-12 opacity-10">
                 <ShieldCheck size={160} />
               </div>
               <h2 className="text-2xl md:text-3xl font-bold mb-6">Publication Ethics & COPE Compliance</h2>
               <p className="text-gray-300 mb-8 leading-relaxed">
                 JMES strictly adheres to the Code of Conduct and Best Practice Guidelines set forth by the Committee on Publication Ethics (COPE). We maintain an absolute zero-tolerance policy regarding plagiarism, data falsification, duplicate submission, and author dispute manipulation.
               </p>
               <ul className="space-y-4 mb-8">
                 {["Double-blind peer review integrity", "Mandatory similarity screening via Turnitin / iThenticate", "Transparent conflict of interest declarations", "Strict adherence to research data confidentiality and ethical clearance"].map((item, i) => (
                   <li key={i} className="flex items-center gap-3">
                     <CheckCircle2 size={18} className="text-accent shrink-0" />
                     <span className="text-sm font-medium">{item}</span>
                   </li>
                 ))}
               </ul>

               <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                 <Link to="/submit-paper" className="btn-secondary py-3 px-6 text-sm">
                   Submit Manuscript
                 </Link>
                 <Link to="/editorial-board" className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-full text-sm font-semibold transition-all">
                   View Editorial Board
                 </Link>
                 <Link to="/apc" className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-full text-sm font-semibold transition-all">
                   View APC Policies
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
