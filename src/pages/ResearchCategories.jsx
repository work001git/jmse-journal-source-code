import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, TrendingUp, Leaf, Cpu, Globe2, 
  Binary, Compass, ShieldCheck, ArrowRight, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ResearchCategories = () => {
  const categories = [
    {
      title: 'Environmental Statistics',
      icon: <BarChart2 size={32} className="text-secondary" />,
      desc: 'Statistical methods applied to environmental observation networks, air quality monitoring, and spatial correlation analysis.',
      subtopics: [
        'Spatio-Temporal Atmospheric Modeling',
        'Extreme Value Environmental Analytics',
        'Bayesian Hierarchical Ecology Modeling',
        'Remote Sensing Multispectral Calibration',
        'Aerosol & PM2.5 Dispersal Statistics'
      ]
    },
    {
      title: 'Applied Environmental Mathematics',
      icon: <Binary size={32} className="text-primary" />,
      desc: 'Differential equations, dynamical systems, and analytical mechanics describing ecosystems and hydrological systems.',
      subtopics: [
        'Stochastic Differential Equations in Ecology',
        'Hydrodynamic & Oceanographic Flow Systems',
        'Nonlinear Population Dynamics',
        'Topological Data Analysis in Biodiversity',
        'Optimization in Renewable Grid Systems'
      ]
    },
    {
      title: 'Environmental Econometrics',
      icon: <TrendingUp size={32} className="text-accent" />,
      desc: 'Quantitative econometrics evaluating carbon taxation, climate risk valuation, and sustainable natural resource management.',
      subtopics: [
        'Dynamic Panel Data Carbon Modeling',
        'ESG Investment & Macroeconomic Growth',
        'Agricultural Price Volatility under Climate Shock',
        'Cost-Benefit Econometric Analysis of Net-Zero',
        'Hedonic Pricing of Ecosystem Services'
      ]
    },
    {
      title: 'AI & Climate Analytics',
      icon: <Cpu size={32} className="text-secondary" />,
      desc: 'Machine learning, neural networks, and stochastic algorithms for environmental prediction and crisis mitigation.',
      subtopics: [
        'Deep Learning for Rainforest Deforestation Detection',
        'Predictive Wildfire & Flood Forecasting Neural Models',
        'Automated Sensor Anomaly Detection',
        'Reinforcement Learning in Smart Grid Efficiency',
        'Generative Modeling for Climate Scenario Projections'
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="section-container">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Journal Scope & Taxonomic Index
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4">
            Research Categories
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed italic">
            Journal of Mathematics and Environmental Statistics (JMES) welcomes original mathematical, statistical, and econometric contributions across four foundational interdisciplinary domains.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-premium border border-gray-100 flex flex-col justify-between hover:border-secondary/30 transition-all"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-primary">{cat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed italic">{cat.desc}</p>
                
                <div className="pt-4 border-t border-gray-50 space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Key Quantitative Specializations:</p>
                  <ul className="text-xs text-gray-600 space-y-1.5">
                    {cat.subtopics.map((sub, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-50">
                <Link to="/submit-paper" className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1.5">
                  Submit Research in this Area &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ResearchCategories;
