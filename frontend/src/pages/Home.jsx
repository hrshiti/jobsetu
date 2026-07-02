import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { 
  Zap, Shield, Clock, Send, Award, ArrowRight, CheckCircle, 
  Users, Building, Target, Trophy, Star 
} from 'lucide-react';
import SEO from '../components/SEO';

const STATS = [
  { value: 1200, label: 'Applications Submitted', prefix: '+' },
  { value: 650, label: 'Candidates Matched', prefix: '+' },
  { value: 120, label: 'Partner Companies', prefix: '+' },
  { value: 98, label: 'Review Success Rate', prefix: '%' }
];

const COMPANIES = [
  'Stripe', 'Razorpay', 'Vercel', 'Linear', 'Notion', 'Framer', 'Clerk'
];

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: 'Easy Application',
    desc: 'No account setup required. Apply for any listed role in a single unified multi-step session.'
  },
  {
    icon: <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    title: 'Secure Data Handling',
    desc: 'All resumes and personal credentials are encrypted. Your data is strictly shared with hiring companies.'
  },
  {
    icon: <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    title: 'Fast Review Cycle',
    desc: 'Applications are parsed and forwarded to hiring managers within 3 business days.'
  },
  {
    icon: <Send className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
    title: 'Instant Confirmations',
    desc: 'Get confirmation immediately on-screen, plus notifications via email and WhatsApp.'
  },
  {
    icon: <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    title: 'Verified Platform',
    desc: 'All job openings are validated by our compliance team to prevent spoofing or scams.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    role: 'Senior React Developer',
    text: 'Applying through JobSetu Portal was a breeze! I submitted my details in 5 minutes, got updates via WhatsApp, and landed my role at a top SaaS company.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Vikram Mehta',
    role: 'UI/UX Designer',
    text: 'The interface is stunningly clean. I love that I did not have to register or create another password to apply for my dream design gig.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Sarah Jenkins',
    role: 'Growth PM',
    text: 'Extremely professional and compliant. I highly recommend this portal to candidates looking for active tech roles.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

// Simple animated counter component
function Counter({ value, prefix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    // Cap step time to avoid lag
    const actualStep = Math.max(stepTime, 10);
    const stepValue = Math.ceil(range / (duration / actualStep));

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, actualStep);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{prefix}</span>;
}

export default function Home() {
  return (
    <div className="space-y-24 py-4 relative overflow-hidden">
      <SEO />

      {/* Decorative Grid SVG Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Soft Background Gradients */}
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="lg:col-span-7 space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100/50 dark:border-blue-800/40 text-xs font-semibold text-blue-600 dark:text-blue-400"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Always 100% Free For Applicants</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]"
          >
            Start Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Career Journey
            </span>{' '}
            Today
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-xl"
          >
            Apply for your dream job in minutes. No complex registration forms, no passwords to remember. Submit details securely, track progress directly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Link
              to="/apply"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all flex items-center gap-2 group text-sm"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:-translate-y-0.5 transition-all text-sm shadow-sm"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="lg:col-span-5 relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="w-full max-w-sm aspect-square bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-xl relative backdrop-blur-sm"
          >
            {/* Visual Glass Cards */}
            <div className="absolute -top-4 -left-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/50 shadow-lg flex items-center gap-3 backdrop-blur-md animate-float">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
                ✓
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block dark:text-white">Form Validated</span>
                <span className="text-[10px] text-slate-400 font-medium">Ready to submit</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/50 shadow-lg flex items-center gap-3 backdrop-blur-md animate-float-delayed">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-600 flex items-center justify-center">
                📄
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block dark:text-white">Resume.pdf</span>
                <span className="text-[10px] text-slate-400 font-medium">Uploaded Successfully</span>
              </div>
            </div>

            {/* Central visual shape */}
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white text-3xl font-black">
                JS
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">JobSetu Gateway</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Secure, fast, and compliant recruitment application pipeline.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="text-center py-6 border-y border-slate-100 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 -mx-6 px-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          Applications processed for roles at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 dark:opacity-40">
          {COMPANIES.map((company, idx) => (
            <span key={idx} className="font-black text-lg tracking-tight text-slate-600 dark:text-slate-300">
              {company}
            </span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Features Built For Candidates
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base max-w-lg mx-auto">
            Everything you need for a modern, rapid application experience in a compliant framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{feat.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base max-w-lg mx-auto">
            Get your application ready and delivered in 4 quick steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            { step: '01', title: 'Fill Details', desc: 'Input your contact, education, and address details.' },
            { step: '02', title: 'Submit Files', desc: 'Upload your latest resume and certificates securely.' },
            { step: '03', title: 'Technical Review', desc: 'Our team reviews credentials against job specs.' },
            { step: '04', title: 'Get Response', desc: 'Hiring manager updates you via Email and WhatsApp.' }
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
              <span className="text-3xl font-black bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {item.step}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl p-8 md:p-12 shadow-xl shadow-indigo-500/10">
        {STATS.map((stat, idx) => (
          <div key={idx} className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl font-black">
              {stat.prefix === '%' ? (
                <>
                  <Counter value={stat.value} />
                  <span>%</span>
                </>
              ) : (
                <>
                  <Counter value={stat.value} />
                  <span>{stat.prefix}</span>
                </>
              )}
            </h3>
            <p className="text-xs md:text-sm text-indigo-100 font-semibold uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What Candidates Say
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base max-w-lg mx-auto">
            Read positive experiences from candidates who matched with top startups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full border border-slate-200/50 dark:border-slate-800/50 object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{t.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-sm text-center space-y-6 relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Ready to kickstart your application?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Submit your credentials today. We review files immediately and connect you with matching active roles.
        </p>
        <div className="pt-2">
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
