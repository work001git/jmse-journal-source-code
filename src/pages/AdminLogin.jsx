import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Shield, Users, ArrowRight, KeyRound } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Administrator authentication failed. Unauthorized credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center px-4">
      {/* Portal Switcher Banner */}
      <div className="max-w-md w-full mb-6 flex justify-between items-center text-xs font-bold text-gray-500 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-gray-100 shadow-sm">
        <Link to="/login" className="px-3 py-1 hover:text-primary transition-colors">
          Author Portal
        </Link>
        <Link to="/staff/login" className="px-3 py-1 hover:text-secondary transition-colors flex items-center gap-1">
          <Users size={12} /> Staff Portal
        </Link>
        <span className="px-3 py-1 bg-accent text-white rounded-xl flex items-center gap-1">
          <Shield size={12} /> Admin Portal
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent">
            <Shield size={32} />
          </div>
          <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Chief Editorial Authority
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-primary">Admin Sign In</h1>
          <p className="text-xs text-gray-400 mt-1 italic">Full Management & Publishing Control</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-semibold">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Admin ID / Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                required
                type="email"
                placeholder="admin@jmes.org"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-accent focus:bg-white transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Admin Secret Key / Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-accent focus:bg-white transition-all text-sm font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-white py-4 text-base font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 transition-all hover:shadow-primary/30"
            >
              <KeyRound size={20} className="text-accent" />
              {loading ? 'Authenticating Admin...' : 'Access Admin Directorate'}
            </button>
          </div>
        </form>


      </motion.div>
    </div>
  );
};

export default AdminLogin;
