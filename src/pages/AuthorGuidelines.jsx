import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, CheckCircle2, ChevronRight, PenTool, ClipboardCheck, Scale, Globe, Download, DollarSign, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadSampleDocx, downloadSamplePdf } from '../utils/sampleTemplate';

const guidelines = [
  { icon: PenTool, title: "15-Part Formatting", desc: "Manuscripts must be submitted following the standardized 15-section JMES template (Times New Roman 12pt, 1.5 spacing)." },
  { icon: FileDown, title: "Official Templates", desc: "Download our verified MS Word (.docx) and PDF sample formatting templates with pre-configured equation styles." },
  { icon: Scale, title: "Publication Ethics", desc: "JMES strictly follows COPE guidelines. Plagiarism above 10% is not tolerated." },
  { icon: ClipboardCheck, title: "Rigorous Peer Review", desc: "Double-blind peer review involving at least two independent mathematical & environmental modeling reviewers." },
  { icon: Globe, title: "Global Open Access", desc: "CC BY 4.0 license applies to all published research articles upon verified APC settlement." },
  { icon: Award, title: "Fee Waiver Inclusivity", desc: "Waivers of up to 50% are available for scholars facing genuine institutional financial constraints." }
];

const AuthorGuidelines = () => {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="section-container">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-3 block">Contributor Resources</span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4 italic">Author Guidelines</h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto italic leading-relaxed">
            Journal of Mathematics and Environmental Statistics (JMES) ensures high-quality scientific communication through rigorous peer review and standardized quantitative formatting.
          </p>
        </div>

        {/* Download Sample Format Banner */}
        <div className="bg-gradient-to-r from-primary to-[#0A2647] rounded-[2.5rem] p-8 md:p-10 text-white mb-16 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-accent/20 border border-accent/40 text-accent text-[10px] font-black uppercase tracking-widest rounded-full inline-block">
              Required Submission Format
            </span>
            <h3 className="text-2xl font-bold">Download JMES Sample Research Paper Format</h3>
            <p className="text-xs text-gray-300 italic">Pre-formatted Microsoft Word & PDF documents containing all 15 required sections.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadSampleDocx}
              className="bg-white text-primary hover:bg-gray-100 px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Download size={16} className="text-accent" />
              Download DOCX
            </button>
            <button
              onClick={downloadSamplePdf}
              className="bg-secondary text-white hover:bg-emerald-700 px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Guidelines Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
           {guidelines.map((g, i) => (
             <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-premium border border-gray-100 hover:shadow-premium-hover transition-all group"
             >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <g.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 italic">{g.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{g.desc}</p>
             </motion.div>
           ))}
        </div>

        {/* Links to APC and Waivers */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest block mb-1">Fee Transparency</span>
              <h4 className="text-xl font-bold text-primary">Article Processing Charges (APC)</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed italic">
                India: INR 4500 ? Other South Asian Countries: USD 100 ? Female Authorship: USD 100 ? Rest of the World: USD 150.
              </p>
            </div>
            <Link to="/apc" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
              View Detailed Fee Structure &rarr;
            </Link>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">Financial Inclusion</span>
              <h4 className="text-xl font-bold text-primary">Fee Waiver Assistance</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed italic">
                Authors with verified funding constraints may apply for up to a 50% waiver directly during submission.
              </p>
            </div>
            <Link to="/fee-waiver" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Read Fee Waiver Criteria &rarr;
            </Link>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="bg-primary rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
           <h2 className="text-3xl font-bold mb-12 text-center italic">Publication Workflow</h2>
           <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 text-center">
             {[
               { num: '01', title: 'Submission', desc: 'Online submission & Paper ID' },
               { num: '02', title: 'Editorial Screen', desc: 'Scope & similarity evaluation' },
               { num: '03', title: 'Peer Review', desc: 'Double-blind expert review' },
               { num: '04', title: 'Decision', desc: 'Acceptance or revision notice' },
               { num: '05', title: 'APC Settlement', desc: 'Manual UPI proof verification' },
               { num: '06', title: 'Publication', desc: 'Assigned Volume & DOI' }
             ].map((step, idx) => (
               <div key={idx} className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
                 <span className="text-2xl font-heading font-black text-accent">{step.num}</span>
                 <h4 className="text-xs font-bold">{step.title}</h4>
                 <p className="text-[10px] text-gray-300 leading-tight">{step.desc}</p>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AuthorGuidelines;
