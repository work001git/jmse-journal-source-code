import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { placeholder, value } = e.target;
    const field = placeholder.toLowerCase().replace('your ', '');
    setFormData(prev => ({ ...prev, [field === 'name' ? 'name' : field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <Toaster position="top-right" />
      <div className="section-container">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-6 italic">Contact Us</h1>
          <p className="text-gray-500 italic max-w-xl mx-auto">
            Hate forms? Reach out directly via email or visit our editorial office.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-primary rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <h2 className="text-2xl font-bold mb-8 italic">Editorial Office</h2>
               <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase font-bold tracking-widest mb-1 font-body">Location</p>
                      <p className="text-sm font-medium leading-relaxed font-heading">School of Mathematics, Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology, Chennai, India</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase font-bold tracking-widest mb-1 font-body">Email</p>
                      <p className="text-sm font-medium font-heading">d.pachiyappan321@gmail.com</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100 italic">
               <div className="flex items-center gap-4 mb-4 text-secondary">
                 <Clock size={24} />
                 <h3 className="font-bold">Operating Hours</h3>
               </div>
               <p className="text-sm text-gray-500 leading-relaxed font-medium">
                 Our editorial staff is available Monday to Friday, 9:00 AM – 5:00 PM (IST). We typically respond within 48 hours.
               </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-100"
             >
                <div className="flex items-center gap-3 mb-10">
                  <MessageSquare className="text-accent" size={28} />
                  <h2 className="text-2xl font-bold text-primary italic">Send a Message</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input 
                      required type="text" placeholder="Your Name" value={formData.name} onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium font-body" 
                    />
                    <input 
                      required type="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium font-body" 
                    />
                  </div>
                  <input 
                    required type="text" placeholder="Subject" value={formData.subject} onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium font-body" 
                  />
                  <textarea 
                    required rows="6" placeholder="Your Message" value={formData.message} onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium resize-none font-body"
                  ></textarea>
                  <button 
                    type="submit" disabled={loading}
                    className="w-full btn-secondary py-5 text-lg font-bold flex items-center justify-center gap-3 shadow-xl italic disabled:opacity-70 disabled:cursor-wait"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
             </motion.div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-20 rounded-[3rem] overflow-hidden shadow-2xl relative h-96 bg-gray-200">
           <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1500" alt="Map" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-primary/20"></div>
           <div className="absolute inset-x-0 bottom-0 p-8 flex justify-center">
              <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-full shadow-lg text-primary font-bold text-sm flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                View on Google Maps
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
