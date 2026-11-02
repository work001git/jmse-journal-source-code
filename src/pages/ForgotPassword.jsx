import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-premium border border-gray-100"
      >
        {!sent ? (
          <>
            <div className="mb-10">
              <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-xs font-black uppercase tracking-widest mb-8">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
              <h1 className="text-3xl font-heading font-extrabold text-primary italic">Forgot Password?</h1>
              <p className="text-sm text-gray-500 mt-3 italic">Enter your email and we'll send you a recovery link.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:border-secondary transition-all text-sm italic"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg font-extrabold shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? 'Sending...' : 'Send Recovery Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-heading font-extrabold text-primary italic mb-4">Check Your Inbox</h2>
            <p className="text-gray-500 leading-relaxed italic mb-10">
              We've sent a password reset link to <span className="font-bold text-primary">{email}</span>. Please check your email to continue.
            </p>
            <Link to="/login" className="btn-secondary w-full py-4 block font-black uppercase tracking-widest text-xs">
              Return to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
