import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Mail, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const [appId, setAppId] = useState('');

  useEffect(() => {
    const id = searchParams.get('appId');
    if (id) {
      setAppId(id);
    } else {
      // Fetch the latest application id from localStorage
      try {
        const apps = JSON.parse(localStorage.getItem('submitted_applications') || '[]');
        if (apps.length > 0) {
          setAppId(apps[apps.length - 1].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 max-w-xl mx-auto">
      <SEO title="Thank You for Applying - JobSetu Portal" robots="noindex, nofollow" />

      {/* Success Animation Container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-850/50 shadow-md shadow-emerald-500/5 mb-8"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Check className="w-10 h-10" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
      >
        Application Submitted!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base leading-relaxed"
      >
        Thank you for submitting your job application. Our recruiting team has received your documents and will review them shortly.
      </motion.p>

      {/* Ticket ID Box */}
      {appId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
        >
          Application Reference ID: <span className="text-blue-600 dark:text-blue-400 font-mono select-all">{appId}</span>
        </motion.div>
      )}

      {/* Informative next steps */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm mt-8 w-full space-y-4 text-left"
      >
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">What happens next?</h3>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Email Confirmation</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                We sent a summary of your application and reference ID to your registered email address.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Profile Review (3-5 Days)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Hiring managers will match your qualifications against active roles. You will receive updates directly.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mt-8 w-full"
      >
        <Link
          to="/"
          className="flex-grow flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20 transition-all hover:scale-105 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/careers"
          className="flex-grow flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all hover:scale-105 text-sm"
        >
          <span>Browse Other Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
