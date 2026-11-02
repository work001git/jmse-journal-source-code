import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, BookOpen, Clock } from 'lucide-react';

const stats = [
  { label: 'Research Publications', value: '20+', icon: BookOpen, color: 'bg-primary' },
  { label: 'International Peer Reviewed', value: 'Quality', icon: Clock, color: 'bg-secondary' },
  { label: 'Global Authors', value: '45+', icon: Users, color: 'bg-accent' },
  { label: 'Open Access Research', value: 'YES', icon: Globe, color: 'bg-primary' },
];

const Stats = () => {
  return (
    <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-premium hover:shadow-premium-hover transition-all border border-gray-100 group"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
              <p className="text-gray-500 font-medium text-sm border-t border-gray-50 pt-4">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
