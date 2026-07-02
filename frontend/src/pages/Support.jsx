import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Clock, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import { submitSupportTicket } from '../services/api';
import SEO from '../components/SEO';

export default function Support() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await submitSupportTicket(data);
      addToast('Support ticket created successfully! We will get back to you shortly.', 'success');
      setTicketCreated(true);
      reset();
    } catch (err) {
      addToast(err.message || 'Failed to submit ticket.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <SEO 
        title="Support Center - JobSetu Portal" 
        description="Need help with your application? Create a support ticket or find contact details for JobSetu Portal customer support."
      />

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Support Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base max-w-xl mx-auto">
          Our team is here to help you. Submit a support ticket, check FAQs, or reach out through our official channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Support Channels</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Email Support</span>
                  <a href="mailto:support@jobsetu.com" className="text-sm font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    support@jobsetu.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">WhatsApp Helpline</span>
                  <a href="https://wa.me/918049123456" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    +91 80 4912 3456
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Operating Hours</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Mon - Sat (9:00 AM - 6:00 PM IST)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
            {ticketCreated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-100/50 dark:border-emerald-850/50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ticket Created Successfully!</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-sm mx-auto">
                  We have received your support ticket and assigned it to an agent. We will respond to your email within 24 hours.
                </p>
                <button
                  onClick={() => setTicketCreated(false)}
                  className="mt-6 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium text-sm transition-colors"
                >
                  Create another ticket
                </button>
              </motion.div>
            ) : (
              <>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Create Support Ticket</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                      <input
                        type="text"
                        {...register('name', { required: 'Full name is required' })}
                        className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.name.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Topic Category</label>
                    <select
                      {...register('category', { required: 'Please select a category' })}
                      className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    >
                      <option value="">Select Topic...</option>
                      <option value="application-status">Application Status</option>
                      <option value="document-upload">Document / File Upload Error</option>
                      <option value="incorrect-details">Incorrect Details Submitted</option>
                      <option value="general-inquiry">General Inquiry</option>
                    </select>
                    {errors.category && (
                      <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.category.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
                    <input
                      type="text"
                      {...register('subject', { required: 'Subject is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      placeholder="e.g. Issue uploading my resume PDF"
                    />
                    {errors.subject && (
                      <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.subject.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Detailed Message</label>
                    <textarea
                      rows={5}
                      {...register('message', { required: 'Message body is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                      placeholder="Please explain your issue in detail..."
                    />
                    {errors.message && (
                      <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.message.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Submit Ticket'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
