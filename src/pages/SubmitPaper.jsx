import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Send, FileText, User, Mail, School, 
  Globe, Hash, CheckCircle2, Lock, Plus, Trash2, 
  ShieldCheck, Info, FileUp, AlertTriangle, Loader2,
  Download, HelpCircle, Phone, Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { githubDB } from '../lib/githubStorage';
import { downloadSampleDocx, downloadSamplePdf, SAMPLE_TEMPLATE_SECTIONS, FORMATTING_GUIDELINES } from '../utils/sampleTemplate';
import { toast, Toaster } from 'react-hot-toast';

const SubmitPaper = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  const [formData, setFormData] = useState({
    paper_title: '',
    running_title: '',
    abstract: '',
    keywords: '',
    subject_area: 'Environmental Statistics',
    article_type: 'Research Article',
    research_area: 'Mathematical & Spatial Statistics',
    authors: [
      { 
        full_name: user?.full_name || '', 
        email: user?.email || '', 
        phone: user?.phone || '',
        institution: user?.institution || '', 
        department: user?.department || '', 
        country: user?.country || '', 
        orcid: user?.orcid || '',
        is_corresponding: true,
        is_female: false
      }
    ],
    apply_fee_waiver: false,
    waiver_financial_circumstances: '',
    waiver_requested_percentage: 50,
    funding_info: '',
    conflict_of_interest: '',
    ethics_approval: '',
    acknowledgements: '',
    data_availability: '',
    suggested_reviewers: '',
    editor_comments: '',
    declarations: {
      original_work: false,
      plagiarism_free: false,
      not_under_consideration: false,
      copyright_agreement: false,
      journal_policy: false
    }
  });

  const [files, setFiles] = useState({
    manuscript: null,
    coverLetter: null,
    supplementary: null,
    waiverDoc: null
  });

  const fileInputRefs = {
    manuscript: useRef(null),
    coverLetter: useRef(null),
    supplementary: useRef(null),
    waiverDoc: useRef(null)
  };

  const researchCategories = [
    'Environmental Statistics',
    'Applied Environmental Mathematics',
    'Environmental Econometrics',
    'Climate Change & Sustainability Analytics',
    'Natural Resource Quantitative Modeling',
    'AI & Stochastic Environmental Systems'
  ];

  const articleTypes = [
    'Research Article',
    'Review Article',
    'Methodological Note',
    'Case Study in Quantitative Ecology',
    'Short Communication'
  ];

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleDeclarationChange = (e) => {
    const { id, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      declarations: { ...prev.declarations, [id]: checked }
    }));
  };

  const handleAuthorChange = (index, field, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index][field] = value;
    setFormData(prev => ({ ...prev, authors: newAuthors }));
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [
        ...prev.authors, 
        { 
          full_name: '', 
          email: '', 
          phone: '',
          institution: '', 
          department: '', 
          country: '', 
          orcid: '', 
          is_corresponding: false,
          is_female: false 
        }
      ]
    }));
  };

  const removeAuthor = (index) => {
    if (formData.authors.length === 1) return;
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, authors: newAuthors }));
  };

  const setCorrespondingAuthor = (index) => {
    const newAuthors = formData.authors.map((author, i) => ({
      ...author,
      is_corresponding: i === index
    }));
    setFormData(prev => ({ ...prev, authors: newAuthors }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size exceeds 50MB limit');
        return;
      }
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const removeFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    if (fileInputRefs[type].current) fileInputRefs[type].current.value = '';
  };

  const uploadFile = async (file, path) => {
    const fileExt = file.name.split('.').pop();
    const fileName = Math.random().toString(36).substring(2, 9) + '.' + fileExt;
    const filePath = path + '/' + fileName;

    const { error: uploadError, data } = await supabase.storage
      .from('manuscripts')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('manuscripts')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { declarations } = formData;
    if (!Object.values(declarations).every(val => val)) {
      toast.error('Please accept all ethical, originality and journal declarations.');
      return;
    }

    if (!files.manuscript) {
      toast.error('Main manuscript document (.pdf or .docx) is required.');
      return;
    }

    if (formData.keywords.split(',').length < 3) {
      toast.error('Please provide at least 3 keywords separated by commas.');
      return;
    }

    setLoading(true);

    try {
      const sid = await githubDB.getNextPaperId();

      const manuscriptUrl = await uploadFile(files.manuscript, sid + '/manuscript');
      let coverLetterUrl = '';
      if (files.coverLetter) {
        coverLetterUrl = await uploadFile(files.coverLetter, sid + '/cover_letter');
      }
      let supplementaryUrl = '';
      if (files.supplementary) {
        supplementaryUrl = await uploadFile(files.supplementary, sid + '/supplementary');
      }
      let waiverDocUrl = '';
      if (files.waiverDoc) {
        waiverDocUrl = await uploadFile(files.waiverDoc, sid + '/waiver_proof');
      }

      const corresponding = formData.authors.find(a => a.is_corresponding) || formData.authors[0];

      const newManuscript = {
        submission_id: sid,
        user_id: user ? user.id : 'guest',
        paper_title: formData.paper_title,
        title: formData.paper_title,
        running_title: formData.running_title,
        abstract: formData.abstract,
        keywords: formData.keywords,
        subject_area: formData.subject_area,
        article_type: formData.article_type,
        research_area: formData.research_area,
        corresponding_author: corresponding.full_name,
        corresponding_email: corresponding.email,
        corresponding_phone: corresponding.phone || '',
        institution: corresponding.institution,
        department: corresponding.department || '',
        country: corresponding.country,
        authors: formData.authors,
        has_female_author: formData.authors.some(a => a.is_female),
        manuscript_file: manuscriptUrl,
        cover_letter: coverLetterUrl,
        supplementary_file: supplementaryUrl,
        status: 'UNDER REVIEW',
        apc_status: 'PAYMENT PENDING',
        
        fee_waiver_applied: formData.apply_fee_waiver,
        fee_waiver_circumstances: formData.waiver_financial_circumstances,
        fee_waiver_requested_percent: formData.waiver_requested_percentage,
        fee_waiver_document: waiverDocUrl,
        fee_waiver_status: formData.apply_fee_waiver ? 'PENDING_ADMIN_REVIEW' : 'NOT_APPLIED',
        fee_waiver_approved_percent: 0,

        declarations: formData.declarations,
        funding_info: formData.funding_info,
        conflict_of_interest: formData.conflict_of_interest,
        ethics_approval: formData.ethics_approval,
        data_availability: formData.data_availability,
        suggested_reviewers: formData.suggested_reviewers,
        editor_comments: formData.editor_comments,
        created_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('manuscripts')
        .insert([newManuscript]);

      if (dbError) throw dbError;

      if (formData.apply_fee_waiver) {
        await supabase.from('fee_waivers').insert([{
          submission_id: sid,
          user_id: user ? user.id : 'guest',
          author_name: corresponding.full_name,
          country: corresponding.country,
          financial_circumstances: formData.waiver_financial_circumstances,
          document_url: waiverDocUrl,
          requested_percent: formData.waiver_requested_percentage,
          status: 'PENDING',
          created_at: new Date().toISOString()
        }]);
      }

      if (user) {
        await supabase.from('notifications').insert([{
          user_id: user.id,
          title: 'Manuscript Received',
          message: 'Your research manuscript "' + formData.paper_title + '" has been assigned unique ID: ' + sid + ' and is now UNDER REVIEW.',
          type: 'success',
          created_at: new Date().toISOString()
        }]);
      }

      setSubmissionId(sid);
      setSubmitted(true);
      toast.success('Manuscript ' + sid + ' submitted successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error submitting manuscript');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full mx-auto text-center bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-sm">
            <Lock size={40} />
          </div>
          <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Author Authentication Required
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-primary mb-4">Sign In to Submit Manuscript</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed italic">
            To ensure academic authorship integrity, generate a unique Paper ID, and allow real-time status tracking in your User Dashboard, please sign in or register an author account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary py-3.5 px-8 text-sm font-bold shadow-lg">
              Sign In as Author
            </Link>
            <Link to="/register" className="btn-outline py-3.5 px-8 text-sm font-bold">
              Register New Author
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full mx-auto text-center bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-md shadow-emerald-100">
            <CheckCircle2 size={44} />
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
            Status: UNDER REVIEW
          </span>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary mb-3">Manuscript Successfully Submitted!</h1>
          
          <div className="my-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Permanent Paper ID</p>
            <p className="text-2xl font-mono font-black text-primary">{submissionId}</p>
          </div>

          <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed italic">
            Your manuscript has entered the formal editorial peer-review queue. You can track peer-review progression, fee waiver determinations, and decisions in your dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/submission/${submissionId}`} className="btn-secondary py-3.5 px-8 text-sm font-bold shadow-lg">
              Track Paper Status
            </Link>
            <Link to="/my-submissions" className="btn-outline py-3.5 px-8 text-sm font-bold">
              My Submissions Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <Toaster position="top-right" />
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-3 block">
              Journal of Mathematics and Environmental Statistics (JMES)
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4">
              Submit Manuscript
            </h1>
            <p className="text-sm text-gray-500 italic max-w-xl mx-auto">
              Submit your original quantitative research for rigorous peer review and global scholarly indexing.
            </p>
          </div>

          {/* DEDICATED SECTION: DOWNLOAD JMES SAMPLE RESEARCH PAPER FORMAT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-gradient-to-br from-primary to-[#0A2647] rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="px-3 py-1 bg-accent/20 border border-accent/40 text-accent text-[10px] font-black uppercase tracking-widest rounded-full inline-block">
                  Author Resources
                </span>
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  DOWNLOAD JMES SAMPLE RESEARCH PAPER FORMAT
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed italic">
                  Ensure rapid editorial screening by preparing your manuscript according to the official 15-section JMES template.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  type="button"
                  onClick={downloadSampleDocx}
                  className="bg-white text-primary hover:bg-gray-100 px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Download size={16} className="text-accent" />
                  Download Sample Paper ? DOCX
                </button>
                <button
                  type="button"
                  onClick={downloadSamplePdf}
                  className="bg-secondary text-white hover:bg-emerald-700 px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Download size={16} />
                  Download Sample Paper ? PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuidelinesModal(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <HelpCircle size={16} />
                  15 Formatting Rules
                </button>
              </div>
            </div>
          </motion.div>

          {showGuidelinesModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 shadow-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold text-primary">JMES 15-Section Standardized Template</h3>
                  <button onClick={() => setShowGuidelinesModal(false)} className="text-gray-400 hover:text-primary font-bold text-lg">&times;</button>
                </div>
                <div className="space-y-3 mb-6">
                  {SAMPLE_TEMPLATE_SECTIONS.map((sec) => (
                    <div key={sec.num} className="p-3 bg-gray-50 rounded-xl text-xs flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0 text-[10px]">{sec.num}</span>
                      <div>
                        <p className="font-bold text-primary">{sec.title}</p>
                        <p className="text-gray-500 mt-0.5">{sec.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <button onClick={() => setShowGuidelinesModal(false)} className="btn-primary py-2 px-6 text-xs">Close Guidelines</button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. PAPER INFORMATION */}
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-bold text-xs">1</div>
                <h2 className="text-2xl font-bold text-primary">Paper Information</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label htmlFor="paper_title" className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">
                    Research Paper Title *
                  </label>
                  <textarea 
                    required
                    id="paper_title"
                    rows="2"
                    placeholder="Enter the complete title of your research paper"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-semibold italic"
                    value={formData.paper_title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="subject_area" className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">
                      Research Category *
                    </label>
                    <select
                      id="subject_area"
                      value={formData.subject_area}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                    >
                      {researchCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="article_type" className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">
                      Article Type *
                    </label>
                    <select
                      id="article_type"
                      value={formData.article_type}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                    >
                      {articleTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="research_area" className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">
                      Specific Research Area *
                    </label>
                    <input 
                      required
                      id="research_area"
                      type="text"
                      placeholder="e.g. Bayesian Hierarchical Modeling"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.research_area}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="keywords" className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">
                      Keywords (Min 3, comma separated) *
                    </label>
                    <input 
                      required
                      id="keywords"
                      type="text"
                      placeholder="Environmental Statistics, Spatial Modeling, Markov Chains"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium"
                      value={formData.keywords}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="abstract" className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">
                    Structured Abstract (150 - 250 words) *
                  </label>
                  <textarea 
                    required
                    id="abstract"
                    rows="5"
                    placeholder="Provide a concise abstract summarizing research context, methodology, quantitative results, and environmental conclusions..."
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-sm italic leading-relaxed"
                    value={formData.abstract}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </motion.section>

            {/* 2. AUTHOR INFORMATION */}
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-100"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-bold text-xs">2</div>
                  <h2 className="text-2xl font-bold text-primary">Author Information & Affiliations</h2>
                </div>
                <button
                  type="button"
                  onClick={addAuthor}
                  className="flex items-center gap-1.5 text-xs font-bold text-secondary bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
                >
                  <Plus size={16} /> Add Co-Author
                </button>
              </div>

              <div className="space-y-6">
                {formData.authors.map((author, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-primary">Author #{index + 1}</span>
                        {author.is_corresponding && (
                          <span className="px-2.5 py-0.5 bg-primary text-white text-[9px] font-black uppercase tracking-wider rounded-full">
                            Corresponding Author
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!author.is_corresponding && (
                          <button
                            type="button"
                            onClick={() => setCorrespondingAuthor(index)}
                            className="text-[11px] font-bold text-primary hover:underline"
                          >
                            Set as Corresponding
                          </button>
                        )}
                        {formData.authors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAuthor(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Full Name *</label>
                        <input 
                          required
                          type="text"
                          placeholder="Dr. Full Name"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:border-primary"
                          value={author.full_name}
                          onChange={(e) => handleAuthorChange(index, 'full_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email *</label>
                        <input 
                          required
                          type="email"
                          placeholder="author@inst.edu"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:border-primary"
                          value={author.email}
                          onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Phone Number</label>
                        <input 
                          type="tel"
                          placeholder="+91 / +1 ..."
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:border-primary"
                          value={author.phone}
                          onChange={(e) => handleAuthorChange(index, 'phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Institution / University *</label>
                        <input 
                          required
                          type="text"
                          placeholder="University Name"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:border-primary"
                          value={author.institution}
                          onChange={(e) => handleAuthorChange(index, 'institution', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Department</label>
                        <input 
                          type="text"
                          placeholder="Department of Mathematics"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:border-primary"
                          value={author.department}
                          onChange={(e) => handleAuthorChange(index, 'department', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Country *</label>
                        <input 
                          required
                          type="text"
                          placeholder="India / USA / Australia"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:border-primary"
                          value={author.country}
                          onChange={(e) => handleAuthorChange(index, 'country', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600">
                        <input 
                          type="checkbox"
                          checked={author.is_female}
                          onChange={(e) => handleAuthorChange(index, 'is_female', e.target.checked)}
                          className="w-4 h-4 rounded text-secondary focus:ring-secondary"
                        />
                        <span>Female Authorship (Qualifies for JMES Global Female Scholarly Support Rate)</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 3. MANUSCRIPT FILE UPLOAD */}
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-bold text-xs">3</div>
                <h2 className="text-2xl font-bold text-primary">Manuscript & Supporting File Upload</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary/50 transition-colors">
                  <input 
                    type="file"
                    ref={fileInputRefs.manuscript}
                    onChange={(e) => handleFileChange(e, 'manuscript')}
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    id="manuscript-file-input"
                  />
                  <FileText className="mx-auto text-primary mb-3" size={32} />
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    Main Manuscript PDF or DOCX *
                  </p>
                  <p className="text-[11px] text-gray-400 mb-4">Complete research paper including figures, tables and references</p>
                  
                  {files.manuscript ? (
                    <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
                      <span className="truncate max-w-[200px]">{files.manuscript.name}</span>
                      <button type="button" onClick={() => removeFile('manuscript')} className="text-red-500 ml-2">&times;</button>
                    </div>
                  ) : (
                    <label 
                      htmlFor="manuscript-file-input"
                      className="cursor-pointer inline-block btn-primary text-xs py-2.5 px-6 font-bold"
                    >
                      Browse Manuscript File
                    </label>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-secondary/50 transition-colors">
                  <input 
                    type="file"
                    ref={fileInputRefs.supplementary}
                    onChange={(e) => handleFileChange(e, 'supplementary')}
                    accept=".pdf,.zip,.csv,.xlsx,.docx"
                    className="hidden"
                    id="supp-file-input"
                  />
                  <FileUp className="mx-auto text-secondary mb-3" size={32} />
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">
                    Supplementary Dataset / Cover Letter
                  </p>
                  <p className="text-[11px] text-gray-400 mb-4">Datasets, R/Python scripts, or high-resolution models (Optional)</p>
                  
                  {files.supplementary ? (
                    <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
                      <span className="truncate max-w-[200px]">{files.supplementary.name}</span>
                      <button type="button" onClick={() => removeFile('supplementary')} className="text-red-500 ml-2">&times;</button>
                    </div>
                  ) : (
                    <label 
                      htmlFor="supp-file-input"
                      className="cursor-pointer inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2.5 px-6 font-bold rounded-full transition-all"
                    >
                      Browse Supplementary
                    </label>
                  )}
                </div>
              </div>
            </motion.section>

            {/* 4. FEE WAIVER APPLICATION */}
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-bold text-xs">4</div>
                <h2 className="text-2xl font-bold text-primary">Article Processing Charge (APC) Fee Waiver</h2>
              </div>

              <div className="p-5 bg-amber-50/60 border border-amber-100 rounded-2xl mb-6">
                <div className="flex items-start gap-3">
                  <Info className="text-amber-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                      JMES Fee Waiver Policy (Up to 50%)
                    </h4>
                    <p className="text-xs text-amber-700 leading-relaxed italic">
                      JMES offers fee waivers of up to 50% to authors facing genuine financial constraints. Decisions are evaluated individually by the Editorial Directorate based on research merit and declared circumstances.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-2xl hover:bg-gray-100/70 transition-colors">
                  <input 
                    type="checkbox"
                    id="apply_fee_waiver"
                    checked={formData.apply_fee_waiver}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded text-secondary focus:ring-secondary"
                  />
                  <span className="text-sm font-bold text-primary">
                    Do you want to apply for an APC Fee Waiver?
                  </span>
                </label>

                {formData.apply_fee_waiver && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 space-y-4 border-t border-gray-100"
                  >
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Declaration of Financial Circumstances *
                      </label>
                      <textarea 
                        required={formData.apply_fee_waiver}
                        id="waiver_financial_circumstances"
                        rows="3"
                        placeholder="Please describe your institutional funding status, lack of external research grants, or specific developing nation constraints..."
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium focus:border-primary italic"
                        value={formData.waiver_financial_circumstances}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                          Requested Waiver Percentage (Max 50%)
                        </label>
                        <select
                          id="waiver_requested_percentage"
                          value={formData.waiver_requested_percentage}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold"
                        >
                          <option value="25">25% Waiver Discount</option>
                          <option value="35">35% Waiver Discount</option>
                          <option value="50">50% Maximum Waiver Discount</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                          Supporting Documentation (Optional)
                        </label>
                        <input 
                          type="file"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => handleFileChange(e, 'waiverDoc')}
                          className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 italic">Dean/HOD non-funding letter or salary certificate</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.section>

            {/* 5. ETHICAL & COPYRIGHT DECLARATIONS */}
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-bold text-xs">5</div>
                <h2 className="text-2xl font-bold text-primary">Declarations & Journal Agreement</h2>
              </div>

              <div className="space-y-3.5">
                {[
                  { id: 'original_work', label: 'Original Research Declaration: I certify that this manuscript is our original quantitative work and has not been copied.' },
                  { id: 'plagiarism_free', label: 'Plagiarism Compliance: I confirm similarity index is below acceptable academic standards (COPE guidelines).' },
                  { id: 'not_under_consideration', label: 'Exclusive Submission: This paper is not currently submitted to or under review by another journal.' },
                  { id: 'copyright_agreement', label: 'Copyright & Licensing: I agree to publish this manuscript under the JMES scholarly distribution license upon acceptance.' },
                  { id: 'journal_policy', label: 'Journal Policy Agreement: I understand that accepted papers undergo peer review and require verified APC settlement.' }
                ].map((dec) => (
                  <label key={dec.id} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input 
                      type="checkbox"
                      id={dec.id}
                      checked={formData.declarations[dec.id]}
                      onChange={handleDeclarationChange}
                      className="w-4 h-4 rounded text-secondary focus:ring-secondary mt-0.5"
                    />
                    <span className="text-xs font-medium text-gray-700 leading-relaxed">{dec.label}</span>
                  </label>
                ))}
              </div>
            </motion.section>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-secondary py-5 text-lg font-bold shadow-2xl flex items-center justify-center gap-3 disabled:opacity-70 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : <Send size={22} />}
                {loading ? 'Submitting to Editorial Board...' : 'Submit Manuscript to JMES'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SubmitPaper;
