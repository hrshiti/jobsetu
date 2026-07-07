import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';

const FAQS = [
  {
    q: 'How long does it take to review my application?',
    a: 'We review all applications within 3 to 5 business days. You will receive an email and WhatsApp status update immediately once a decision is made.'
  },
  {
    q: 'Do you charge any processing or application fees?',
    a: 'Absolutely not! ApplyNova Portal is 100% free for all candidates. We will never ask you for any fee, registration charges, or card details. If someone asks for money representing ApplyNova Portal, it is a scam.'
  },
  {
    q: 'What formats are supported for resume and certificates?',
    a: 'We accept PDF, DOC, and DOCX formats. The maximum file size limit is 5MB per document to ensure smooth parsing and review.'
  },
  {
    q: 'Can I apply for multiple positions at the same time?',
    a: 'Yes, you can apply for multiple roles if your profile matches the qualifications. However, we recommend customizing your resume to fit each specific position.'
  },
  {
    q: 'How is my private data secured?',
    a: 'We implement industry-grade encryption standards to secure your personal documents. Resumes and photos are kept in encrypted folders, and access is strictly restricted to authorized recruiters.'
  },
  {
    q: 'How can I update or delete my submitted application?',
    a: 'If you want to modify your details or delete your application records, simply submit a request using our Support Page or email us directly at jjmisarajeev@gmail.com.'
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <SEO 
        title="Frequently Asked Questions - ApplyNova Portal" 
        description="Got questions about applying, fees, security, or roles? Find answers to frequently asked questions on ApplyNova Portal."
      />

      <div className="text-center mb-12">
        <div className="inline-flex p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-850/50 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">
          Find answers to common inquiries about our application process and platform.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between p-6 text-left font-semibold text-slate-900 dark:text-slate-100 gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                  }`} 
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-1 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
