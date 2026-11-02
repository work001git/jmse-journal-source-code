import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Search, Menu, X, ChevronDown, Send, User, 
  LogOut, Shield, Users, BookOpen, CreditCard, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Aim & Scope', path: '/aim-scope' },
    { name: 'Categories', path: '/research-categories' },
    { name: 'Current Issue', path: '/current-issue' },
    { name: 'Published', path: '/published-papers' },
    { name: 'Archives', path: '/archives' },
    { name: 'Guidelines', path: '/author-guidelines' },
    { name: 'APC', path: '/apc' },
    { name: 'Subscriptions', path: '/subscriptions' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5' : 'bg-primary/95 backdrop-blur-md py-3.5 text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo & Branding */}
          <Link to="/" className="flex flex-col shrink-0">
            <span className={`text-2xl font-heading font-black tracking-tight ${scrolled ? 'text-primary' : 'text-white'}`}>
              JMES
            </span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${scrolled ? 'text-secondary' : 'text-accent'}`}>
              Mathematics & Environmental Statistics
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `text-xs font-bold transition-colors hover:text-accent ${
                    isActive 
                      ? (scrolled ? 'text-secondary font-black' : 'text-accent font-black') 
                      : (scrolled ? 'text-gray-700' : 'text-gray-200')
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Elements */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* User Profile or 3-Portal Login Selector */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                    scrolled ? 'bg-gray-100 text-primary hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-bold">
                    {(user.full_name || 'U')[0]}
                  </div>
                  <span className="truncate max-w-[120px]">{user.full_name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 overflow-hidden text-gray-700 z-50"
                    >
                      <div className="px-4 pb-2 border-b border-gray-50">
                        <p className="text-xs font-bold text-primary truncate">{user.full_name}</p>
                        <p className="text-[10px] font-mono text-gray-400">{user.email}</p>
                        <span className="mt-1 inline-block px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-md">
                          Role: {user.role?.toUpperCase()}
                        </span>
                      </div>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-primary hover:bg-gray-50"
                        >
                          <Shield size={16} className="text-accent" /> Admin Directorate
                        </Link>
                      )}

                      {(user.role === 'staff' || user.role === 'admin') && (
                        <Link
                          to="/staff"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-secondary hover:bg-gray-50"
                        >
                          <Users size={16} /> Staff Review Dashboard
                        </Link>
                      )}

                      <Link
                        to="/my-submissions"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                      >
                        <BookOpen size={16} /> My Submissions
                      </Link>

                      <Link
                        to="/subscriptions"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                      >
                        <CreditCard size={16} /> Research Subscription Pass
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-gray-50 mt-1"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Three Separate Login Portals Dropdown */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLoginMenu(!showLoginMenu)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
                    scrolled ? 'border-primary/20 text-primary hover:bg-gray-50' : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  <User size={14} />
                  Login Portals
                  <ChevronDown size={12} className={`transition-transform ${showLoginMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showLoginMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden text-gray-700 z-50 text-xs font-medium"
                    >
                      <Link
                        to="/login"
                        onClick={() => setShowLoginMenu(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-primary font-bold"
                      >
                        <span className="flex items-center gap-2"><User size={14} /> Author Login</span>
                        <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">User</span>
                      </Link>

                      <Link
                        to="/staff/login"
                        onClick={() => setShowLoginMenu(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-secondary font-bold"
                      >
                        <span className="flex items-center gap-2"><Users size={14} /> Staff Login</span>
                        <span className="text-[9px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded">Reviewer</span>
                      </Link>

                      <Link
                        to="/admin/login"
                        onClick={() => setShowLoginMenu(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-accent font-bold"
                      >
                        <span className="flex items-center gap-2"><Shield size={14} /> Admin Login</span>
                        <span className="text-[9px] bg-accent/20 text-primary px-1.5 py-0.5 rounded">Director</span>
                      </Link>

                      <div className="border-t border-gray-50 mt-1 pt-1 px-4 py-2">
                        <Link to="/register" onClick={() => setShowLoginMenu(false)} className="text-[11px] text-gray-500 hover:text-primary font-bold">
                          Register New Author Account &rarr;
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Primary Action Button */}
            <Link
              to="/submit-paper"
              className="btn-secondary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0"
            >
              <Send size={13} />
              Submit Paper
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl ${scrolled ? 'text-primary' : 'text-white'}`}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white text-gray-800 border-t border-gray-100 shadow-xl overflow-y-auto max-h-[85vh]"
          >
            <div className="px-5 pt-4 pb-8 space-y-3">
              {/* User Profile Card on Mobile */}
              {user ? (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-primary text-sm">{user.full_name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{user.email}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black uppercase rounded">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsOpen(false)} className="text-xs font-bold text-accent">Admin Directorate</Link>
                    )}
                    {(user.role === 'staff' || user.role === 'admin') && (
                      <Link to="/staff" onClick={() => setIsOpen(false)} className="text-xs font-bold text-secondary">Staff Dashboard</Link>
                    )}
                    <Link to="/my-submissions" onClick={() => setIsOpen(false)} className="text-xs font-bold text-primary">My Submissions</Link>
                    <button onClick={logout} className="text-xs text-red-500 font-bold ml-auto">Log Out</button>
                  </div>
                </div>
              ) : (
                /* Login Portals on Mobile */
                <div className="grid grid-cols-3 gap-2 py-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-center p-2.5 bg-gray-50 rounded-xl text-xs font-bold text-primary border border-gray-100">
                    Author Login
                  </Link>
                  <Link to="/staff/login" onClick={() => setIsOpen(false)} className="text-center p-2.5 bg-emerald-50 rounded-xl text-xs font-bold text-secondary border border-emerald-100">
                    Staff Login
                  </Link>
                  <Link to="/admin/login" onClick={() => setIsOpen(false)} className="text-center p-2.5 bg-amber-50 rounded-xl text-xs font-bold text-amber-800 border border-amber-100">
                    Admin Login
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => 
                      `p-2 rounded-xl text-xs font-bold ${
                        isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/submit-paper"
                  onClick={() => setIsOpen(false)}
                  className="w-full btn-secondary py-3 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Submit Manuscript
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
