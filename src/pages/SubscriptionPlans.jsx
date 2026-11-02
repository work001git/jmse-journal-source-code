import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Check, QrCode, Shield, Download, FileText, 
  Clock, CheckCircle2, AlertCircle, Loader2, ArrowRight
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const SubscriptionPlans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mySubscription, setMySubscription] = useState(null);

  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    const { data: pData } = await supabase.from('subscription_plans').select('*');
    const { data: sData } = await supabase.from('settings').select('*').single();
    
    setPlans(pData || []);
    setSettings(sData || {});

    if (user) {
      const { data: userSubs } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (userSubs && userSubs.length > 0) {
        setMySubscription(userSubs[0]);
      }
    }
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in or register before subscribing.');
      navigate('/login');
      return;
    }
    if (!selectedPlan) {
      toast.error('Please select a subscription pass.');
      return;
    }
    if (!utrNumber || utrNumber.length < 8) {
      toast.error('Please enter a valid 12-digit transaction UTR number.');
      return;
    }

    setSubmitting(true);
    try {
      let screenshotUrl = '';
      if (screenshotFile) {
        const ext = screenshotFile.name.split('.').pop();
        const filePath = `subscriptions/${user.id}/${Date.now()}.${ext}`;
        const { data: uploadRes } = await supabase.storage.from('manuscripts').upload(filePath, screenshotFile);
        screenshotUrl = uploadRes?.publicUrl || '';
      }

      await supabase.from('subscriptions').insert([{
        user_id: user.id,
        user_name: user.full_name,
        user_email: user.email,
        plan_id: selectedPlan.id,
        plan_name: selectedPlan.name,
        amount: selectedPlan.price,
        currency: selectedPlan.currency || 'INR',
        duration_days: selectedPlan.duration_days,
        utr_number: utrNumber,
        screenshot_url: screenshotUrl,
        status: 'PENDING_VERIFICATION',
        created_at: new Date().toISOString()
      }]);

      setSubmittedSuccess(true);
      toast.success('Subscription payment submitted! Editorial staff will verify your receipt.');
      fetchPlans();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit subscription request');
    } finally {
      setSubmitting(false);
    }
  };

  const upiDetails = settings?.upi_details || {
    upi_id: 'jmesjournal@upi',
    account_name: 'Journal of Mathematics and Environmental Statistics',
    qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=jmesjournal@upi%26pn=JMES%20Journal%26cu=INR'
  };

  const isSubActive = mySubscription && mySubscription.status === 'ACTIVE' && new Date(mySubscription.expiry_date) > new Date();

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <Toaster position="top-right" />
      <div className="section-container">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Reader & Institutional Access
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4">
            Full Research Paper Subscription
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed italic">
            Unlock complete uninhibited reading and downloading access to all peer-reviewed research papers, archival mathematical proofs, and environmental modeling datasets.
          </p>
        </div>

        {/* Active Subscription Banner if exists */}
        {isSubActive && (
          <div className="max-w-2xl mx-auto mb-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
            <h3 className="text-lg font-bold text-emerald-900">You Have an Active Research Subscription!</h3>
            <p className="text-xs text-emerald-700">
              Plan: <strong>{mySubscription.plan_name}</strong> ? Valid Until: <strong>{new Date(mySubscription.expiry_date).toLocaleDateString()}</strong>
            </p>
            <p className="text-xs text-emerald-600 font-medium">You have unrestricted access to read and download all published JMES PDFs.</p>
          </div>
        )}

        {/* Subscription Plan Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-[2.5rem] p-8 border shadow-premium flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected ? 'border-secondary ring-4 ring-secondary/10 scale-105' : 'border-gray-100 hover:border-primary/30'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-full">
                      {plan.duration_days} Days Access
                    </span>
                    {plan.id === 'plan-annual' && (
                      <span className="px-2.5 py-0.5 bg-accent text-white text-[9px] font-black uppercase tracking-wider rounded-md">
                        Best Value
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-3xl font-black font-heading text-secondary">{plan.currency || 'INR'} {plan.price}</span>
                    <span className="text-xs text-gray-400 font-bold">/ {plan.duration_days === 365 ? 'year' : plan.duration_days === 30 ? 'month' : 'pass'}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6 italic">{plan.description}</p>

                  <ul className="space-y-2.5 border-t border-gray-100 pt-6 text-xs text-gray-600">
                    {plan.features?.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check size={14} className="text-secondary shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6 border-t border-gray-50">
                  <button
                    type="button"
                    className={`w-full py-3 rounded-2xl text-xs font-bold transition-all ${
                      isSelected ? 'bg-secondary text-white shadow-lg' : 'bg-gray-50 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* UPI Checkout Section */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100"
          >
            <div className="text-center mb-8">
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">
                Instant UPI Subscription
              </span>
              <h3 className="text-2xl font-bold text-primary">Complete Subscription via UPI</h3>
              <p className="text-xs text-gray-400 mt-1">
                Selected: <strong>{selectedPlan.name}</strong> ? Amount: <strong>INR {selectedPlan.price}</strong>
              </p>
            </div>

            {submittedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
                <h4 className="text-lg font-bold text-primary">Payment Submitted Successfully!</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Our editorial staff will manually verify your 12-digit UTR and activate full-paper reading permissions immediately.
                </p>
                <Link to="/published-papers" className="btn-primary py-2.5 px-6 text-xs inline-block mt-4">
                  Explore Research Papers
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center space-y-3">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Scan QR with Google Pay, PhonePe, or Paytm</p>
                  <div className="bg-white p-3 rounded-2xl inline-block shadow-sm">
                    <img src={upiDetails.qr_code_url} alt="JMES UPI QR" className="w-44 h-44 mx-auto object-contain rounded-xl" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-700 font-mono">{upiDetails.upi_id}</p>
                    <p className="text-[11px] text-gray-400">{upiDetails.account_name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                    12-Digit UTR / Transaction Reference Number *
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="Enter UTR from payment confirmation"
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:border-secondary"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                    Transaction Proof Screenshot (Optional)
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshotFile(e.target.files[0])}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-secondary py-4 text-xs font-bold flex items-center justify-center gap-2 shadow-xl"
                >
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                  Submit Subscription Payment for Verification
                </button>
              </form>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default SubscriptionPlans;
