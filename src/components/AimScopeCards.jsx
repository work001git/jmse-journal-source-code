import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, LineChart, Leaf, Droplets, Cpu } from 'lucide-react';

const categories = [
  {
    title: "Environmental Statistics",
    icon: BarChart3,
    items: ["Environmental Data Analysis", "Spatial Statistics", "Climate Analytics", "Biodiversity Statistics", "AI in Environmental Studies"],
    color: "from-blue-500 to-primary"
  },
  {
    title: "Environmental Econometrics",
    icon: LineChart,
    items: ["Time Series Models", "Panel Data Analysis", "Bayesian Methods", "Carbon Emission Modeling", "Sustainable Development"],
    color: "from-emerald-500 to-secondary"
  },
  {
    title: "Climate Change & Sustainability",
    icon: Leaf,
    items: ["Renewable Energy", "Climate Policy", "Circular Economy", "ESG", "SDGs"],
    color: "from-green-500 to-green-700"
  },
  {
    title: "Natural Resources",
    icon: Droplets,
    items: ["Water Resource Management", "Agriculture", "Forestry", "Pollution Control", "Carbon Pricing"],
    color: "from-cyan-500 to-blue-600"
  },
  {
    title: "Emerging Technologies",
    icon: Cpu,
    items: ["Artificial Intelligence", "Green Innovation", "Smart Cities", "Digital Sustainability", "Environmental Health"],
    color: "from-purple-500 to-indigo-600"
  }
];

const AimScopeCards = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="text-accent font-bold text-sm uppercase tracking-widest mb-4 block">Academic Focus</span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-primary">Aim & Scope</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Our journal covers a broad spectrum of quantitative research, focusing on critical environmental challenges and econometric modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 border border-gray-100 flex flex-col h-full"
            >
              <div className={`h-2 bg-gradient-to-r ${cat.color}`}></div>
              <div className="p-8 flex-grow">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white duration-300">
                  <cat.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-6 text-primary group-hover:text-secondary transition-colors italic">{cat.title}</h3>
                <ul className="space-y-3">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8 pb-8">
                <button className="text-sm font-bold text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                  Learn More <span className="text-accent">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AimScopeCards;
