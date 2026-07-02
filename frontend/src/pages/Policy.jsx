import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Scale, XCircle, ShieldAlert, Truck, Cookie, Info, Calendar } from 'lucide-react';
import SEO from '../components/SEO';
import { POLICIES } from '../constants/policies';

export default function Policy({ type }) {
  const policy = POLICIES[type];

  if (!policy) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Policy Not Found</h1>
        <p className="text-slate-500">The requested policy page does not exist.</p>
      </div>
    );
  }

  // Choose icon based on policy type
  const getIcon = () => {
    switch (type) {
      case 'privacy':
        return <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />;
      case 'terms':
        return <FileText className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />;
      case 'refund':
        return <Scale className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />;
      case 'cancellation':
        return <XCircle className="w-12 h-12 text-rose-600 dark:text-rose-400" />;
      case 'shipping':
        return <Truck className="w-12 h-12 text-amber-600 dark:text-amber-400" />;
      case 'cookie':
        return <Cookie className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />;
      case 'disclaimer':
        return <Info className="w-12 h-12 text-slate-600 dark:text-slate-400" />;
      default:
        return <FileText className="w-12 h-12 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title={`${policy.title} - JobSetu Portal`} 
        description={`Read the official ${policy.title} of JobSetu Portal. Updated on ${policy.lastUpdated}.`}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-sm"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {policy.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {policy.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="mt-8 space-y-8">
          {policy.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {section.heading}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Razorpay compliance highlight */}
        <div className="mt-12 p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold block mb-1">Compliance & Safety Note</span>
            This document outlines our official operational guidelines. We ensure maximum transparency and data security for all applicants submitting their details on our portal.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
