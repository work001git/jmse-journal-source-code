import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { githubDB } from '../lib/githubStorage';
import { calculateAPC } from '../utils/apcCalculator';
import { 
  FileText, CheckCircle2, Clock, AlertCircle, 
  ArrowLeft, Download, Mail, Calendar, Info,
  ChevronRight, ExternalLink, ShieldCheck, QrCode,
  Upload, Send, Phone, User, Check, AlertTriangle, Loader2
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const SubmissionDetails = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // APC UPI Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    utr: '',
    screenshot: null,
    date: new Date().toISOString().split('T')[0]
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const screenshotInputRef = useRef(null);

  // Revision Re-upload State
  const [revisedFile, setRevisedFile] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisionLoading, setRevisionLoading] = useState(false);
  const revisionFileRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Submission
    const { data: subData } = await supabase
      .from('manuscripts')
      .select('*')
      .eq('submission_id', id)
      .single();

    // Fetch Settings
    const { data: setts } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (subData) {
      setSubmission(subData);
    }
    if (setts) {
      setSettings(setts);
    }
    setLoading(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.utr || paymentForm.utr.length < 8) {
      toast.error('Please enter a valid Bank / UPI Transaction Reference (UTR) Number');
      return;
    }
    if (!paymentForm.screenshot) {
      toast.error('Please upload transaction screenshot proof');
      return;
    }

    setPaymentLoading(true);
    try {
      // 1. Upload screenshot
      const ext = paymentForm.screenshot.name.split('.').pop();
      const filename = `screenshot_${Date.now()}.${ext}`;
      const filePath = `payments/${id}/${filename}`;

      const { data: uploadRes, error: uploadErr } = await supabase.storage
        .from('manuscripts')
        .upload(filePath, paymentForm.screenshot);

      const screenshotUrl = uploadRes?.publicUrl || '';

      // 2. Compute APC amounts
      const isFemale = submission.authors ? submission.authors.some(a => a.is_female) : false;
      const waiverApproved = submission.fee_waiver_approved_percent || 0;
      const calc = calculateAPC({
        country: submission.country,
        isFemaleAuthor: isFemale,
        waiverPercent: waiverApproved,
        settings
      });

      // 3. Insert Payment Record
      await supabase.from('payments').insert([{
        paper_id: submission.id,
        submission_id: id,
        user_id: submission.user_id,
        author_name: submission.corresponding_author,
        author_email: submission.corresponding_email,
        original_amount: calc.originalAmount,
        waiver_amount: calc.discountAmount,
        final_payable: calc.finalPayable,
        currency: calc.currency,
        utr_number: paymentForm.utr,
        screenshot_url: screenshotUrl,
        status: 'PAYMENT VERIFICATION',
        created_at: new Date().toISOString()
      }]);

      // 4. Update Manuscript status
      await supabase
        .from('manuscripts')
        .update({
          status: 'PAYMENT VERIFICATION',
          apc_status: 'PAYMENT VERIFICATION',
          payment_utr: paymentForm.utr,
          payment_proof_url: screenshotUrl,
          payment_submitted_at: new Date().toISOString()
        })
        .eq('submission_id', id);

      toast.success('Payment proof submitted! Editorial staff will verify your bank transaction.');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit payment details');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRevisionUpload = async (e) => {
    e.preventDefault();
    if (!revisedFile) {
      toast.error('Please select the revised manuscript file.');
      return;
    }

    setRevisionLoading(true);
    try {
      const ext = revisedFile.name.split('.').pop();
      const filePath = `${id}/revisions/revised_${Date.now()}.${ext}`;
      
      const { data: uploadRes } = await supabase.storage
        .from('manuscripts')
        .upload(filePath, revisedFile);

      const revisedUrl = uploadRes?.publicUrl || '';
      const existingHistory = submission.revision_history || [];

      const newHistoryItem = {
        round: existingHistory.length + 1,
        submitted_at: new Date().toISOString(),
        file_url: revisedUrl,
        author_notes: revisionNotes
      };

      await supabase
        .from('manuscripts')
        .update({
          manuscript_file: revisedUrl,
          status: 'UNDER REVIEW',
          revision_history: [...existingHistory, newHistoryItem]
        })
        .eq('submission_id', id);

      toast.success('Revised manuscript submitted under Paper ID ' + id + '! Status set to UNDER REVIEW.');
      setRevisedFile(null);
      setRevisionNotes('');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Error submitting revision');
    } finally {
      setRevisionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Manuscript Details...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background text-center px-4">
        <h1 className="text-2xl font-bold text-primary">Submission Not Found</h1>
        <p className="text-xs text-gray-400 mt-2">No record found for Paper ID: {id}</p>
        <Link to="/my-submissions" className="btn-primary mt-6 inline-block text-xs py-3 px-6">
          Back to My Submissions
        </Link>
      </div>
    );
  }

  // Calculate APC for this submission
  const isFemale = submission.authors ? submission.authors.some(a => a.is_female) : false;
  const waiverApproved = submission.fee_waiver_approved_percent || 0;
  const apcCalc = calculateAPC({
    country: submission.country,
    isFemaleAuthor: isFemale,
    waiverPercent: waiverApproved,
    settings
  });

  const upiDetails = settings?.upi_details || {
    upi_id: 'jmesjournal@upi',
    account_name: 'Journal of Mathematics and Environmental Statistics',
    qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=jmesjournal@upi%26pn=JMES%20Journal%26cu=INR'
  };

  const steps = [
    { label: 'Submitted', desc: 'Received & Logged' },
    { label: 'Under Review', desc: 'Editorial Peer Review' },
    { label: 'Decision', desc: submission.status === 'REJECTED' ? 'Rejected' : 'Accepted' },
    { label: 'APC Payment', desc: submission.apc_status || 'Pending' },
    { label: 'Published', desc: submission.status === 'PUBLISHED' ? 'Live in Issue' : 'Final Prep' }
  ];

  const getStepIndex = (status) => {
    if (status === 'Submitted') return 0;
    if (status === 'UNDER REVIEW' || status === 'Editorial Review') return 1;
    if (status === 'REVISION REQUESTED') return 1;
    if (status === 'ACCEPTED') return 2;
    if (status === 'PAYMENT VERIFICATION') return 3;
    if (status === 'PAYMENT VERIFIED' || status === 'READY FOR PUBLICATION') return 3;
    if (status === 'PUBLISHED') return 4;
    return 1;
  };

  const activeStep = getStepIndex(submission.status);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <Toaster position="top-right" />
      <div className="section-container">
        
        {/* Navigation Bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/my-submissions" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to My Submissions
          </Link>
          <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-xl border border-gray-100 shadow-sm text-primary">
            Paper ID: {submission.submission_id}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title & Status Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-premium border border-gray-100 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="px-3.5 py-1 bg-primary/10 text-primary font-mono text-xs font-black rounded-xl">
                  {submission.submission_id}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  submission.status === 'PUBLISHED' ? 'bg-green-600 text-white' :
                  submission.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                  submission.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                  submission.status === 'REVISION REQUESTED' ? 'bg-purple-100 text-purple-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {submission.status}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-primary leading-tight">
                {submission.paper_title || submission.title}
              </h1>

              {/* Publication Workflow Stepper */}
              <div className="pt-6 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Editorial Lifecycle Progression</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {steps.map((st, i) => {
                    const isDone = i <= activeStep;
                    const isCurrent = i === activeStep;
                    return (
                      <div key={i} className={`p-3 rounded-2xl border text-center transition-all ${
                        isCurrent ? 'bg-primary text-white border-primary shadow-sm' :
                        isDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-gray-50 text-gray-400 border-gray-100'
                      }`}>
                        <p className="text-[10px] font-black uppercase tracking-wider">{st.label}</p>
                        <p className="text-[9px] mt-0.5 opacity-80 truncate">{st.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Abstract */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-xs text-gray-600 leading-relaxed italic">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest not-italic mb-2">Structured Abstract</p>
                {submission.abstract}
              </div>

              {/* Rejection Notification if Rejected */}
              {submission.status === 'REJECTED' && (
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-red-800">
                    <AlertCircle size={18} /> Manuscript Decision: Rejected
                  </div>
                  <p className="italic">{submission.rejection_reason || 'Manuscript does not meet the necessary methodological rigor or journal scope requirements.'}</p>
                  <p className="text-[11px] text-gray-500 pt-2 border-t border-red-100">
                    As per JMES policy, no Article Processing Charges (APC) are due for rejected papers.
                  </p>
                </div>
              )}
            </motion.div>

            {/* REVISION REQUESTED SECTION */}
            {submission.status === 'REVISION REQUESTED' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-premium border-2 border-purple-200 space-y-6"
              >
                <div className="flex items-center gap-3 text-purple-700">
                  <FileText size={24} />
                  <h3 className="text-xl font-bold">Action Required: Upload Revised Manuscript</h3>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl text-xs text-purple-800 space-y-1">
                  <p className="font-bold">Reviewer Instructions:</p>
                  <p className="italic">{submission.revision_comments}</p>
                </div>

                <form onSubmit={handleRevisionUpload} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                      Upload Revised Manuscript Document (.pdf / .docx) *
                    </label>
                    <input 
                      type="file"
                      ref={revisionFileRef}
                      accept=".pdf,.docx"
                      onChange={(e) => setRevisedFile(e.target.files[0])}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                      Author Response to Review Comments
                    </label>
                    <textarea 
                      rows="3"
                      placeholder="Summarize the changes made in accordance with reviewer recommendations..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      value={revisionNotes}
                      onChange={(e) => setRevisionNotes(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={revisionLoading}
                    className="w-full btn-secondary py-3 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    {revisionLoading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                    Submit Revised Manuscript (Maintains ID: {submission.submission_id})
                  </button>
                </form>
              </motion.div>
            )}

            {/* UPI PAYMENT SECTION (Only when ACCEPTED, PAYMENT PENDING, or PAYMENT VERIFICATION) */}
            {(submission.status === 'ACCEPTED' || submission.status === 'PAYMENT PENDING' || submission.status === 'PAYMENT VERIFICATION' || submission.status === 'PAYMENT VERIFIED') && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-premium border border-gray-100 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                      <QrCode size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary">Article Processing Charge (APC) Settlement</h3>
                      <p className="text-xs text-gray-400">Manual UPI QR Settlement & Verification</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    submission.apc_status === 'PAYMENT VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                    submission.apc_status === 'PAYMENT VERIFICATION' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {submission.apc_status || 'PAYMENT PENDING'}
                  </span>
                </div>

                {/* Pricing Breakdown Card */}
                <div className="grid sm:grid-cols-3 gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Applicable Base Rate</span>
                    <p className="text-lg font-bold text-gray-700 mt-1">{apcCalc.currency} {apcCalc.originalAmount}</p>
                    <p className="text-[10px] text-gray-400">{apcCalc.categoryLabel}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Approved Fee Waiver</span>
                    <p className="text-lg font-bold text-secondary mt-1">-{apcCalc.waiverPercent}%</p>
                    <p className="text-[10px] text-emerald-600">Save {apcCalc.currency} {apcCalc.discountAmount}</p>
                  </div>
                  <div className="bg-primary text-white p-3 rounded-xl shadow-md">
                    <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest block">Final Payable Amount</span>
                    <p className="text-2xl font-black mt-0.5">{apcCalc.currency} {apcCalc.finalPayable}</p>
                  </div>
                </div>

                {/* If Payment Already Verified */}
                {submission.apc_status === 'PAYMENT VERIFIED' ? (
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
                    <h4 className="text-base font-bold text-emerald-800">Payment Successfully Verified!</h4>
                    <p className="text-xs text-emerald-700">
                      Bank Transaction reference: <strong>{submission.payment_utr}</strong> has been confirmed by the Chief Editorial Directorate. Your paper is being assigned to an upcoming volume.
                    </p>
                  </div>
                ) : submission.apc_status === 'PAYMENT VERIFICATION' ? (
                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
                    <Clock size={36} className="mx-auto text-amber-600" />
                    <h4 className="text-base font-bold text-amber-800">Payment Verification Under Review</h4>
                    <p className="text-xs text-amber-700">
                      Your UTR <strong>{submission.payment_utr}</strong> and transaction proof are being verified against official bank receipts. You will receive an automated notification once confirmed.
                    </p>
                  </div>
                ) : (
                  /* Payment Submission Form */
                  <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
                    {/* QR Code Card */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center space-y-3">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">Scan to Pay via Any UPI App</p>
                      <div className="bg-white p-3 rounded-2xl inline-block shadow-sm border border-gray-100">
                        <img 
                          src={upiDetails.qr_code_url} 
                          alt="JMES UPI QR" 
                          className="w-48 h-48 mx-auto object-contain rounded-xl"
                        />
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-gray-700 font-mono select-all">{upiDetails.upi_id}</p>
                        <p className="text-[11px] text-gray-500">{upiDetails.account_name}</p>
                      </div>
                    </div>

                    {/* UTR and Proof Form */}
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                          12-Digit UTR / Transaction Reference Number *
                        </label>
                        <input 
                          required
                          type="text"
                          placeholder="e.g. 412389472190"
                          className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:border-secondary"
                          value={paymentForm.utr}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, utr: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                          Attach Transaction Screenshot *
                        </label>
                        <input 
                          required
                          type="file"
                          accept="image/*,.pdf"
                          ref={screenshotInputRef}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, screenshot: e.target.files[0] }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 italic">Showing payment confirmation, UTR, and timestamp.</p>
                      </div>

                      <button
                        type="submit"
                        disabled={paymentLoading}
                        className="w-full btn-secondary py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                      >
                        {paymentLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                        Submit Payment for Admin Verification
                      </button>
                    </form>
                  </div>
                )}

              </motion.div>
            )}

          </div>

          {/* Sidebar Metadata */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-premium border border-gray-100 space-y-5">
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-gray-100 pb-3">
                Manuscript Metadata
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Paper ID</span>
                  <p className="font-mono font-bold text-primary mt-0.5">{submission.submission_id}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Corresponding Author</span>
                  <p className="font-bold text-gray-700 mt-0.5">{submission.corresponding_author}</p>
                  <p className="text-[11px] text-gray-400">{submission.corresponding_email}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Institution & Country</span>
                  <p className="font-bold text-gray-700 mt-0.5">{submission.institution || 'N/A'}</p>
                  <p className="text-[11px] text-gray-400">{submission.country || 'N/A'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Research Category</span>
                  <p className="font-bold text-primary mt-0.5">{submission.subject_area || 'Environmental Statistics'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Keywords</span>
                  <p className="text-gray-600 mt-0.5">{submission.keywords}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Initial Submission Date</span>
                  <p className="text-gray-700 mt-0.5">{new Date(submission.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <a
                  href={submission.manuscript_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download size={14} /> Download Submitted File
                </a>
              </div>
            </div>

            {/* Editorial Support Helpbox */}
            <div className="bg-[#0A2647] rounded-3xl p-6 text-white space-y-3">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest block">Editorial Assistance</span>
              <h4 className="text-sm font-bold">Have Questions About Your Submission?</h4>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                Contact the editorial helpdesk regarding peer-review status or fee waiver decisions.
              </p>
              <Link to="/contact" className="text-xs font-bold text-secondary hover:underline inline-block">
                Contact Editorial Office &rarr;
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SubmissionDetails;
