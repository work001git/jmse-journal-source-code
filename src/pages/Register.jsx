import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, School, Globe, Building2, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    institution: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError('');

    const result = await register({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      institution: formData.institution,
      department: formData.department,
      password: formData.password
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/my-submissions'), 1500);
    } else {
      setError(result.message || 'Registration failed. Email might already be registered.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100"
      >
        {success ? (
          <div className="text-center py-12">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-lg shadow-emerald-100"
            >
              <CheckCircle2 size={44} />
            </motion.div>
            <h2 className="text-3xl font-heading font-extrabold text-primary mb-3">Welcome to JMES!</h2>
            <p className="text-gray-500 italic mb-8 max-w-sm mx-auto">Your author account is ready. Redirecting you to your User Dashboard...</p>
            <Link to="/my-submissions" className="btn-secondary px-8 py-3.5 inline-block font-bold text-sm">
              Open Author Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary">
                <UserPlus size={30} />
              </div>
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">
                Author Registration
              </span>
              <h1 className="text-3xl font-heading font-extrabold text-primary">Create Author Account</h1>
              <p className="text-xs text-gray-400 mt-1 italic">Journal of Mathematics and Environmental Statistics (JMES)</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-semibold">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      id="full_name"
                      type="text"
                      placeholder="Dr. Jane Doe"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 2. Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      id="email"
                      type="email"
                      placeholder="author@university.edu"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 3. Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 4. Country */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Country *</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      id="country"
                      type="text"
                      placeholder="India / United Kingdom / etc."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 5. Institution / Organization */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Institution / Organization *</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      id="institution"
                      type="text"
                      placeholder="University / Research Institute"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.institution}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 6. Department */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Department *</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      id="department"
                      type="text"
                      placeholder="Mathematics / Statistics / Environmental"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 7. Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 8. Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-secondary py-4 text-base font-bold shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  <UserPlus size={20} />
                  {loading ? 'Creating Author Account...' : 'Complete Author Registration'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Already registered? <Link to="/login" className="text-primary font-bold hover:underline">Sign In here</Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
