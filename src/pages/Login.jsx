import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Shield, Users, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      const from = location.state?.from?.pathname || '/my-submissions';
      navigate(from);
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center px-4">
      {/* Portal Switcher Banner */}
      <div className="max-w-md w-full mb-6 flex justify-between items-center text-xs font-bold text-gray-500 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-gray-100 shadow-sm">
        <span className="px-3 py-1 bg-primary text-white rounded-xl">Author Portal</span>
        <div className="flex gap-2">
          <Link to="/staff/login" className="px-3 py-1 hover:text-primary transition-colors flex items-center gap-1">
            <Users size={12} /> Staff
          </Link>
          <Link to="/admin/login" className="px-3 py-1 hover:text-accent transition-colors flex items-center gap-1">
            <Shield size={12} /> Admin
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <User size={30} />
          </div>
          <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Author & Researcher Login
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-primary">Welcome Back</h1>
          <p className="text-xs text-gray-400 mt-1 italic">Journal of Mathematics and Environmental Statistics (JMES)</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-semibold">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Registered Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                required
                type="email"
                placeholder="author@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-secondary uppercase hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-base font-bold shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
            >
              <LogIn size={20} />
              {loading ? 'Authenticating...' : 'Sign In to Author Portal'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
          <p className="text-xs text-gray-500">
            Don't have an author account?{' '}
            <Link to="/register" className="text-secondary font-bold hover:underline">Register New Account</Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
