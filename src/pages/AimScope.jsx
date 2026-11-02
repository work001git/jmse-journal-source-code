import React from 'react';
import AimScopeCards from '../components/AimScopeCards';
import { motion } from 'framer-motion';
import { Target, Search, BarChart, Globe, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const AimScope = () => {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 font-body">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Target size={48} className="text-accent mx-auto mb-6 animate-pulse" />
          <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">Editorial Focus & Rigor</span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-6">Aims & Scope</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            The <strong>Journal of Mathematics and Environmental Statistics (JMES)</strong> invites high-caliber original research articles, rigorous reviews, and mathematical case analyses dedicated to advancing quantitative solutions for environmental and socio-economic systems.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/research-categories" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
              <BookOpen size={16} /> Explore 4 Research Categories <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
           {[
             { icon: Search, title: "Original Mathematical Research", desc: "Rigorous analytical formulations, differential equation models, and stochastic simulations applied to environmental dynamics." },
             { icon: BarChart, title: "Applied Environmental Statistics", desc: "Advanced spatial-temporal models, extreme value analysis, machine learning forecasting, and uncertainty quantification." },
             { icon: Globe, title: "Econometric & Policy Impact", desc: "Empirical econometric evaluations informing carbon pricing, circular economy adoption, and global sustainability mandates." }
           ].map((role, i) => (
             <div key={i} className="text-center p-8 bg-white rounded-3xl shadow-premium border border-gray-100 flex flex-col items-center group">
               <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                 <role.icon size={28} />
               </div>
               <h3 className="text-xl font-bold text-primary mb-3">{role.title}</h3>
               <p className="text-sm text-gray-500 leading-relaxed font-medium">{role.desc}</p>
             </div>
           ))}
        </div>

        {/* Categories Section (Reusing Component) */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
           <AimScopeCards />
        </div>

        {/* Detailed Points */}
        <div className="mt-20 bg-white rounded-[2.5rem] p-10 md:p-16 shadow-premium border border-gray-100">
           <h2 className="text-3xl font-bold text-primary mb-10 border-b border-gray-100 pb-6">Specific Areas of Interest</h2>
           <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <h4 className="font-heading font-bold text-secondary uppercase tracking-widest text-xs flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-accent"></div>
                   Mathematical & Statistical Methodology
                 </h4>
                 <ul className="space-y-3 text-sm text-gray-600 font-medium">
                   <li>? Stochastic differential equations in climate and marine modeling</li>
                   <li>? Extreme value theory for heatwaves, floods, and meteorological anomalies</li>
                   <li>? Deep Bayesian networks and physics-informed neural networks (PINNs)</li>
                   <li>? High-dimensional spatiotemporal data analysis in biodiversity monitoring</li>
                   <li>? Non-parametric and robust estimators for missing sensor data</li>
                 </ul>
              </div>
              <div className="space-y-6">
                 <h4 className="font-heading font-bold text-secondary uppercase tracking-widest text-xs flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-accent"></div>
                   Environmental Econometrics & Resource Governance
                 </h4>
                 <ul className="space-y-3 text-sm text-gray-600 font-medium">
                   <li>? Panel data models measuring industrial carbon emission abatement costs</li>
                   <li>? Renewable energy grid integration and stochastic pricing mechanisms</li>
                   <li>? Natural capital accounting and ecosystem service valuation frameworks</li>
                   <li>? Spatial econometrics of land-use transformation and urban heat islands</li>
                   <li>? Policy impact evaluations on COP agreements and UN SDGs</li>
                 </ul>
              </div>
           </div>

           <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                Ready to contribute your research to JMES? Review our author formatting template before submission.
              </p>
              <div className="flex gap-3">
                <Link to="/author-guidelines" className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50">
                  Formatting Guidelines
                </Link>
                <Link to="/submit-paper" className="btn-secondary py-2.5 px-6 text-sm">
                  Submit Paper
                </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AimScope;
