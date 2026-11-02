import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShieldCheck, Award, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ArticleProcessingCharges = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  const rates = settings?.apc_rates || {
    india: { amount: 4500, currency: 'INR' },
    south_asia: { amount: 100, currency: 'USD' },
    female_authorship: { amount: 100, currency: 'USD' },
    rest_of_world: { amount: 150, currency: 'USD' }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="section-container">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Transparent Scholarly Publishing
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4">
            Article Processing Charges (APC)
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed italic">
            Journal of Mathematics and Environmental Statistics (JMES) operates a sustainable Open-Access scholarly framework. APC covers peer-review administration, CrossRef DOI indexing, digital preservation, and XML typesetting.
          </p>
        </div>

        {/* APC Tier Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              category: 'India (Domestic)',
              fee: `${rates.india.currency} ${rates.india.amount}`,
              description: 'Authors and researchers affiliated with Indian institutions and universities.',
              badge: 'Domestic Rate',
              color: 'border-primary/20 bg-white'
            },
            {
              category: 'Other South Asian Countries',
              fee: `${rates.south_asia.currency} ${rates.south_asia.amount}`,
              description: 'Bangladesh, Nepal, Sri Lanka, Bhutan, Pakistan, Maldives, Afghanistan.',
              badge: 'Regional Support',
              color: 'border-emerald-200 bg-emerald-50/40'
            },
            {
              category: 'Female Authorship',
              fee: `${rates.female_authorship.currency} ${rates.female_authorship.amount}`,
              description: 'Regardless of country of affiliation, to promote gender diversity in STEM & statistics.',
              badge: 'Global Equity Rate',
              color: 'border-purple-200 bg-purple-50/40'
            },
            {
              category: 'Rest of the World',
              fee: `${rates.rest_of_world.currency} ${rates.rest_of_world.amount}`,
              description: 'International authors from North America, Europe, Asia-Pacific, Africa, and Americas.',
              badge: 'Standard International',
              color: 'border-blue-200 bg-blue-50/40'
            }
          ].map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-[2.5rem] p-8 border shadow-premium flex flex-col justify-between ${tier.color}`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-white/80 px-3 py-1 rounded-full border border-gray-100 inline-block mb-4">
                  {tier.badge}
                </span>
                <h3 className="text-xl font-bold text-primary mb-2">{tier.category}</h3>
                <p className="text-3xl font-black font-heading text-secondary mb-4">{tier.fee}</p>
                <p className="text-xs text-gray-500 leading-relaxed italic">{tier.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100/60">
                <Link to="/submit-paper" className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1">
                  Submit Manuscript &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Policy Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-secondary">
              <ShieldCheck size={24} />
              <h3 className="text-lg font-bold text-primary">When is the APC Payable?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>No Submission Fee:</strong> Submission of manuscripts to JMES is 100% free of charge. Authors only pay the Article Processing Charge after formal peer review acceptance.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              If a manuscript is rejected during editorial review, <strong>no fee is ever charged</strong>.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Award size={24} />
              <h3 className="text-lg font-bold text-primary">Need a Fee Waiver?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              JMES provides fee waivers of up to <strong>50%</strong> for authors from developing countries, low-income economies, or unfunded graduate scholars.
            </p>
            <Link to="/fee-waiver" className="btn-secondary py-2 px-5 text-xs font-bold inline-block">
              Learn About Fee Waiver Program
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArticleProcessingCharges;
