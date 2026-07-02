import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, Milestone, Calendar, Award } from 'lucide-react';
import SEO from '../components/SEO';

const VALUES = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: 'Trust & Transparency',
    desc: 'We operate with extreme honesty and clear processes so applicants know exactly where they stand in their review cycle.'
  },
  {
    icon: <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    title: 'Focus on Excellence',
    desc: 'We connect candidates with only verified, premium startups and companies that care about top-tier talent.'
  },
  {
    icon: <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    title: 'Frictionless Experience',
    desc: 'No endless login loops. We allow candidates to submit complete professional credentials directly with ease.'
  }
];

const TIMELINE = [
  { year: '2023', title: 'Founding Year', desc: 'JobSetu Portal launched to address complex, slow job applications.' },
  { year: '2024', title: 'V2 Launch & Scalability', desc: 'Enhanced file processing, dynamic applications indexation, and support workflows.' },
  { year: '2025', title: 'Trusted by 100+ Brands', desc: 'Partnered with fast-growing brands across India and USA for automated parsing.' },
  { year: '2026', title: 'Razorpay Compliance Integration', desc: 'Established full compliance policies for Razorpay merchant verification and secure applications.' }
];

export default function About() {
  return (
    <div className="py-8 space-y-16">
      <SEO 
        title="About Us - Our Story & Values" 
        description="Learn about the mission, vision, and core values of JobSetu Portal. Read our timeline from launch to Razorpay compliance verification."
      />

      {/* Hero Section */}
      <div className="text-center">
        <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-100/50 dark:border-blue-800/40 uppercase tracking-widest">
          Who we are
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mt-4 tracking-tight">
          Simplifying Careers
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-base max-w-xl mx-auto leading-relaxed">
          We built JobSetu Portal to bridge the gap between brilliant candidates and verified growth-stage startups.
        </p>
      </div>

      {/* Story & Core */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Our Story</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Applying to jobs shouldn't feel like a chore. For years, candidates faced endless login forms, redundant fields, and silent rejections. We created JobSetu Portal to simplify this process: only one unified application flow with comprehensive fields and direct verification support.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Now, JobSetu Portal processes thousands of submissions weekly. We provide clean, structured metadata files to partner recruiters, allowing them to review, sort, and respond in record time.
          </p>
        </div>

        {/* Mission / Vision Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-blue-50/40 dark:bg-slate-950 border border-blue-100/50 dark:border-blue-900/30 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Our Mission</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                To create a seamless, transparent, and completely free application route that respects candidates' time and secures their credentials.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-100/50 dark:border-indigo-900/30 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Our Vision</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                To build the world's most trusted recruitment submission pipeline that requires zero account creation, verifying candidates securely and instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-slate-900 dark:text-white">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center">
                {val.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{val.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-slate-900 dark:text-white">Our Journey</h2>
        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-32 space-y-8 py-4">
          {TIMELINE.map((item, idx) => (
            <div key={idx} className="relative pl-8 md:pl-16">
              {/* Year label left (visible on desktop) */}
              <div className="hidden md:block absolute right-full mr-16 top-0.5 font-black text-xl text-blue-600 dark:text-blue-400">
                {item.year}
              </div>
              
              {/* Milestone Indicator */}
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-50 dark:border-slate-950"></div>
              
              <div className="space-y-1">
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm md:hidden block mb-1">
                  {item.year}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
