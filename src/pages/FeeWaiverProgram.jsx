import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, FileText, Send, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeeWaiverProgram = () => {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="section-container max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="px-3.5 py-1 bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Scholarly Support & Financial Inclusivity
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4">
            JMES Fee Waiver Program
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed italic">
            Ensuring that lack of financial funding or economic disparity never hinders the publication of breakthrough mathematical and environmental science.
          </p>
        </div>

        {/* Policy Statement Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-100 space-y-6 mb-12"
        >
          <div className="flex items-center gap-3 text-secondary">
            <HeartHandshake size={28} />
            <h2 className="text-2xl font-bold text-primary">Official Fee Waiver Policy</h2>
          </div>

          <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-sm text-emerald-900 leading-relaxed font-medium">
            "JMES offers fee waivers to authors facing financial constraints. Authors may apply for a waiver of <strong>up to 50%</strong>. Decisions are strictly evaluated based on demonstrated financial needs and the scholarly merit of the research work."
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Eligibility Criteria</h4>
              <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-secondary shrink-0 mt-0.5" />
                  <span>Researchers affiliated with institutions with limited research library budgets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-secondary shrink-0 mt-0.5" />
                  <span>Graduate scholars and postdoctoral fellows without active external grant sponsorship.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-secondary shrink-0 mt-0.5" />
                  <span>Authors residing in low-income or lower-middle-income economies.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Timing of Application</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fee waiver requests <strong>must be submitted before or at the time of manuscript submission</strong> directly within the online submission portal. Requests submitted after final publication cannot be considered.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 7-Step Workflow */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-100 mb-12 space-y-6">
          <h3 className="text-xl font-bold text-primary mb-6">Fee Waiver Decision Workflow</h3>
          
          <div className="space-y-4">
            {[
              { step: 1, title: 'Author submits fee waiver request', desc: 'Select "Apply for APC Fee Waiver" during initial manuscript submission and state your circumstances.' },
              { step: 2, title: 'Admin receives request', desc: 'The submission and waiver application enter the Chief Editorial Directorate queue.' },
              { step: 3, title: 'Editorial review', desc: 'Admin evaluates research merit and declared funding constraints.' },
              { step: 4, title: 'Decision determination', desc: 'Admin approves or rejects the fee waiver application.' },
              { step: 5, title: 'Waiver percentage selection', desc: 'Admin selects approved waiver percentage up to 50% discount.' },
              { step: 6, title: 'System calculation', desc: 'The platform dynamically recalculates the revised payable APC.' },
              { step: 7, title: 'Author views final payable amount', desc: 'Upon paper acceptance, the author dashboard reflects the exact discounted payable amount.' }
            ].map((wf) => (
              <div key={wf.step} className="flex items-start gap-4 p-3.5 bg-gray-50 rounded-2xl">
                <span className="w-7 h-7 bg-primary text-white rounded-full font-bold flex items-center justify-center text-xs shrink-0">{wf.step}</span>
                <div>
                  <h4 className="text-xs font-bold text-primary">{wf.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{wf.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link to="/submit-paper" className="btn-secondary py-4 px-10 text-sm font-bold shadow-xl inline-flex items-center gap-2">
            <Send size={16} /> Submit Manuscript with Fee Waiver Option
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FeeWaiverProgram;
