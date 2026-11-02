import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, Users, User, ArrowRight, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A2647] text-white pt-16 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="text-3xl font-heading font-black text-white italic tracking-tight">JMES</span>
              <p className="text-xs text-secondary font-black uppercase tracking-[0.3em]">
                Journal of Mathematics and Environmental Statistics
              </p>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed italic max-w-sm">
              An international peer-reviewed academic journal dedicated to high-impact research at the intersection of mathematical theory, spatial statistics, and environmental econometrics.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <p>ISSN (Online): <span className="font-mono text-white">2765-9821</span></p>
              <p>Publisher: <span className="text-white font-medium">JMES Academic Press</span></p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-accent">Scholarly Pages</h4>
            <ul className="text-xs text-gray-300 space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">About the Journal</Link></li>
              <li><Link to="/editorial-board" className="hover:text-white transition-colors">Editorial Board</Link></li>
              <li><Link to="/aim-scope" className="hover:text-white transition-colors">Aims & Scope</Link></li>
              <li><Link to="/research-categories" className="hover:text-white transition-colors">Research Categories</Link></li>
              <li><Link to="/current-issue" className="hover:text-white transition-colors">Current Issue</Link></li>
              <li><Link to="/published-papers" className="hover:text-white transition-colors">Published Papers</Link></li>
              <li><Link to="/archives" className="hover:text-white transition-colors">Journal Archives</Link></li>
            </ul>
          </div>

          {/* Author & Publishing */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-secondary">Author Resources</h4>
            <ul className="text-xs text-gray-300 space-y-2">
              <li><Link to="/author-guidelines" className="hover:text-white transition-colors">Author Guidelines</Link></li>
              <li><Link to="/submit-paper" className="hover:text-white transition-colors">Submit Manuscript</Link></li>
              <li><Link to="/apc" className="hover:text-white transition-colors">Article Processing Charges (APC)</Link></li>
              <li><Link to="/fee-waiver" className="hover:text-white transition-colors">Fee Waiver Program</Link></li>
              <li><Link to="/subscriptions" className="hover:text-white transition-colors">Subscription Plans</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Editorial Office</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Login Portals</h4>
            <ul className="text-xs text-gray-300 space-y-2">
              <li>
                <Link to="/login" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <User size={13} className="text-secondary" /> Author Login
                </Link>
              </li>
              <li>
                <Link to="/staff/login" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Users size={13} className="text-secondary" /> Staff & Reviewer Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Shield size={13} className="text-accent" /> Admin Directorate
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register Author Account
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <p>? {new Date().getFullYear()} Journal of Mathematics and Environmental Statistics (JMES). All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white">Peer-Reviewed Open Access</span>
            <span className="hover:text-white">COPE Ethics Compliant</span>
            <span className="hover:text-white">CC BY 4.0 License</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
