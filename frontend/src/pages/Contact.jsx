import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '../components/Toast';
import { submitContactForm } from '../services/api';
import SEO from '../components/SEO';

export default function Contact() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await submitContactForm(data);
      addToast('Message sent successfully! We will contact you soon.', 'success');
      reset();
    } catch (err) {
      addToast(err.message || 'Failed to send message.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <SEO 
        title="Contact Us - ApplyNova Portal" 
        description="Get in touch with ApplyNova Portal. Send a message, find our office address on the map, or call/email us directly."
      />

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base max-w-lg mx-auto">
          Have questions about job openings or need help with your application? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Grid */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Contact Information</h3>
            
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Email Us</span>
                  <a href="mailto:jjmisarajeev@gmail.com" className="text-sm font-medium text-slate-905 dark:text-white hover:underline">
                    jjmisarajeev@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Call Us</span>
                  <span className="text-sm font-medium text-slate-905 dark:text-white">
                    9630409952
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Office Address</span>
                  <span className="text-sm font-medium text-slate-905 dark:text-white">
                    rajeev, Barod, Post Office - SalayTehsil - Aron, District - GunaMadhya Pradesh - 473101
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Working Hours</span>
                  <span className="text-sm font-medium text-slate-905 dark:text-white">
                    Mon - Sat (9:00 AM - 6:00 PM IST)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Iframe */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm h-64">
            <iframe 
              title="Office Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.751147572704!2d77.61907661528652!3d12.923485719430337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae144e0e28ff0b%3A0x6b63ca0c598379!2sHSR%20Layout%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1625219985923!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Send Us a Message</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">First Name</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="John"
                />
                {errors.firstName && (
                  <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.firstName.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Last Name</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="e.g. 9876543210"
                />
                {errors.phone && (
                  <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Message</label>
              <textarea
                rows={5}
                {...register('message', { required: 'Message is required' })}
                className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                placeholder="How can we help you?"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
