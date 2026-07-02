import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, GraduationCap, Briefcase, FileText, 
  ArrowRight, ArrowLeft, Upload, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { JOBS_LIST } from '../constants/jobs';
import { useToast } from '../components/Toast';
import { submitJobApplication } from '../services/api';
import SEO from '../components/SEO';

const STEPS = [
  { id: 1, name: 'Personal', icon: <User className="w-4 h-4" /> },
  { id: 2, name: 'Address', icon: <MapPin className="w-4 h-4" /> },
  { id: 3, name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 4, name: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
  { id: 5, name: 'Additional', icon: <FileText className="w-4 h-4" /> },
];

export default function Apply() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // File states for previewing/validating uploads
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [certsCount, setCertsCount] = useState(0);

  // Address matching flag
  const [sameAddress, setSameAddress] = useState(false);

  // Load Job details if jobId is passed in search query
  useEffect(() => {
    const jobId = searchParams.get('jobId');
    if (jobId) {
      const job = JOBS_LIST.find((j) => j.id === jobId);
      if (job) {
        setSelectedJob(job);
      }
    }
  }, [searchParams]);

  // Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      jobId: searchParams.get('jobId') || '',
      country: 'India',
      jobType: 'Full-Time',
      department: 'Engineering',
      gender: 'Male'
    }
  });

  // Watch for Address synchronization
  const currentAddressValue = watch('currentAddress');
  useEffect(() => {
    if (sameAddress) {
      setValue('permanentAddress', currentAddressValue || '');
    }
  }, [sameAddress, currentAddressValue, setValue]);

  // Handler for file uploads
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Photo size must be less than 2MB', 'error');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        addToast('Invalid image format. Please upload JPG, PNG or WEBP.', 'error');
        return;
      }
      setValue('profilePhoto', file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Resume size must be less than 5MB', 'error');
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        addToast('Invalid format. Please upload a PDF or Word Document.', 'error');
        return;
      }
      setValue('resume', file);
      setResumeFile(file);
      addToast('Resume uploaded successfully', 'success');
    }
  };

  const handleCertsChange = (e) => {
    const files = e.target.files;
    if (files.length > 5) {
      addToast('You can upload up to 5 certificate files.', 'error');
      return;
    }
    // Validation check on sizes
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        addToast(`File ${files[i].name} exceeds 5MB size limit.`, 'error');
        return;
      }
    }
    setValue('certificates', files);
    setCertsCount(files.length);
    addToast(`${files.length} Certificates uploaded successfully`, 'success');
  };

  // Check step validation before proceeding
  const handleNextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'gender', 'dob', 'email', 'phone', 'whatsapp'];
    } else if (step === 2) {
      fieldsToValidate = ['country', 'state', 'city', 'pinCode', 'currentAddress', 'permanentAddress'];
    } else if (step === 3) {
      fieldsToValidate = ['qualification', 'university', 'passingYear', 'percentage'];
      // Resume check
      if (!resumeFile) {
        addToast('Please upload your resume to proceed.', 'error');
        return;
      }
    } else if (step === 4) {
      fieldsToValidate = ['experience', 'expectedSalary', 'noticePeriod', 'skills'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      addToast('Please correct errors in the form before moving forward.', 'warning');
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit complete form
  const onSubmit = async (data) => {
    if (!data.declaration) {
      addToast('Please accept the declaration terms to submit application.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await submitJobApplication(data);
      addToast(response.data.message, 'success');
      // Redirect to thank you page with reference ID
      navigate(`/thank-you?appId=${response.data.applicationId}`);
    } catch (error) {
      addToast(error.message || 'Submission failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="Job Application Form - JobSetu Portal" 
        description="Fill and submit the multi-step job application form to apply for open engineering, design, and operations roles."
      />

      {/* Header Info */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Apply For A Position
        </h1>
        {selectedJob ? (
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Applying for <span className="font-bold text-blue-600 dark:text-blue-400">{selectedJob.title}</span> ({selectedJob.department})
          </p>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Please submit your professional credentials below.
          </p>
        )}
      </div>

      {/* Step Indicator Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress bar background line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-10"></div>
          
          {STEPS.map((s, idx) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isActive
                      ? 'bg-white dark:bg-slate-950 border-blue-600 text-blue-600 font-extrabold'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                }`}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-sm">
        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Step 1: Personal Information
              </h3>

              {/* Photo Upload section */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-24 h-24 rounded-full border-2 border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center flex-shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Photo</span>
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold cursor-pointer transition-colors">
                      Choose Photo
                      <input type="file" onChange={handlePhotoChange} className="hidden" accept="image/*" />
                    </label>
                  </div>
                  <span className="block text-[10px] text-slate-400">JPG, PNG or WEBP format. Max size 2MB.</span>
                </div>
              </div>

              {/* Input grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">First Name</label>
                  <input
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
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
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.lastName.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Gender</label>
                  <select
                    {...register('gender', { required: 'Gender selection is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    {...register('dob', { required: 'Date of birth is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                  />
                  {errors.dob && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.dob.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
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
                        message: 'Please enter a valid 10-digit number'
                      }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="9876543210"
                  />
                  {errors.phone && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">WhatsApp Number</label>
                  <input
                    type="tel"
                    {...register('whatsapp', { 
                      required: 'WhatsApp number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit number'
                      }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="Same as phone or WhatsApp"
                  />
                  {errors.whatsapp && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.whatsapp.message}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Step 2: Address Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Country</label>
                  <input
                    type="text"
                    {...register('country', { required: 'Country is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. India"
                  />
                  {errors.country && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.country.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">State</label>
                  <input
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. Karnataka"
                  />
                  {errors.state && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.state.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">City</label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. Bengaluru"
                  />
                  {errors.city && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.city.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Pin Code</label>
                  <input
                    type="text"
                    {...register('pinCode', { 
                      required: 'Pin code is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Please enter a valid 6-digit pin code'
                      }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. 560102"
                  />
                  {errors.pinCode && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.pinCode.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Current Address</label>
                <textarea
                  rows={2}
                  {...register('currentAddress', { required: 'Current address is required' })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100 resize-none"
                  placeholder="Street details, building number, locality..."
                />
                {errors.currentAddress && (
                  <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.currentAddress.message}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="sameAddress"
                  checked={sameAddress}
                  onChange={(e) => {
                    setSameAddress(e.target.checked);
                    if (e.target.checked) {
                      setValue('permanentAddress', getValues('currentAddress'));
                    }
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sameAddress" className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Permanent address is same as current address
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Permanent Address</label>
                <textarea
                  rows={2}
                  disabled={sameAddress}
                  {...register('permanentAddress', { required: 'Permanent address is required' })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100 resize-none disabled:opacity-60"
                  placeholder="Street details, building number, locality..."
                />
                {errors.permanentAddress && (
                  <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.permanentAddress.message}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Education & Resume */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Step 3: Education & Documents
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Highest Qualification</label>
                  <input
                    type="text"
                    {...register('qualification', { required: 'Qualification is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. B.Tech in Computer Science"
                  />
                  {errors.qualification && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.qualification.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">University / College</label>
                  <input
                    type="text"
                    {...register('university', { required: 'University name is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. VTU University"
                  />
                  {errors.university && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.university.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Passing Year</label>
                  <input
                    type="number"
                    {...register('passingYear', { 
                      required: 'Passing year is required',
                      min: { value: 1990, message: 'Invalid year' },
                      max: { value: 2030, message: 'Invalid year' }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. 2024"
                  />
                  {errors.passingYear && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.passingYear.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Score Percentage / CGPA</label>
                  <input
                    type="text"
                    {...register('percentage', { required: 'Percentage is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. 85% or 8.5 CGPA"
                  />
                  {errors.percentage && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.percentage.message}
                    </span>
                  )}
                </div>
              </div>

              {/* File upload sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                {/* Resume Upload */}
                <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-center flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border shadow-sm text-slate-500">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Upload Resume *</span>
                    <span className="block text-[10px] text-slate-400 mt-1">PDF or DOCX formats only. Max size 5MB.</span>
                  </div>
                  <label className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border text-slate-800 dark:text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                    {resumeFile ? 'Change Resume' : 'Browse File'}
                    <input type="file" onChange={handleResumeChange} className="hidden" accept=".pdf,.doc,.docx" />
                  </label>
                  {resumeFile && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-full">
                      ✓ {resumeFile.name} ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  )}
                </div>

                {/* Certificates Upload */}
                <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-center flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border shadow-sm text-slate-500">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Additional Certificates</span>
                    <span className="block text-[10px] text-slate-400 mt-1">PDF or images. Up to 5 files, 5MB each.</span>
                  </div>
                  <label className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border text-slate-800 dark:text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                    Upload Files
                    <input type="file" multiple onChange={handleCertsChange} className="hidden" accept=".pdf,image/*" />
                  </label>
                  {certsCount > 0 && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ {certsCount} Files Selected
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Professional Experience */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Step 4: Professional Experience
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Total Experience (Years)</label>
                  <input
                    type="text"
                    {...register('experience', { required: 'Experience detail is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. 2 Years or Fresher"
                  />
                  {errors.experience && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.experience.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Current Company (If any)</label>
                  <input
                    type="text"
                    {...register('currentCompany')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. ABC Technologies"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Current CTC (Salary / year)</label>
                  <input
                    type="text"
                    {...register('currentSalary')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. ₹6,00,000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Expected CTC (Salary / year)</label>
                  <input
                    type="text"
                    {...register('expectedSalary', { required: 'Expected salary is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. ₹9,00,000"
                  />
                  {errors.expectedSalary && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.expectedSalary.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Notice Period</label>
                  <input
                    type="text"
                    {...register('noticePeriod', { required: 'Notice period details are required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. Immediate or 30 Days"
                  />
                  {errors.noticePeriod && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.noticePeriod.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Key Skills</label>
                  <input
                    type="text"
                    {...register('skills', { required: 'Please specify some key skills' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. React, JavaScript, Node.js"
                  />
                  {errors.skills && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.skills.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    {...register('linkedin')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    {...register('github')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Additional Settings */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Step 5: Additional Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Preferred Location</label>
                  <input
                    type="text"
                    {...register('preferredLocation', { required: 'Preferred location is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. Remote or Bengaluru"
                  />
                  {errors.preferredLocation && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.preferredLocation.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Job Type Preference</label>
                  <select
                    {...register('jobType')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Preferred Department</label>
                  <select
                    {...register('department')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Languages Known</label>
                  <input
                    type="text"
                    {...register('languages', { required: 'Please specify languages known' })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
                    placeholder="e.g. English, Hindi"
                  />
                  {errors.languages && (
                    <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.languages.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 mt-6">
                <span className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Candidate Declaration</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  I hereby declare that all the information and certificates submitted during this application are correct, authentic and true. I understand that any false declarations will lead to immediate cancellation of my candidacy.
                </p>
                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="declaration"
                    {...register('declaration', { required: 'You must accept the terms to apply' })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <label htmlFor="declaration" className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    I agree and confirm the declaration *
                  </label>
                </div>
                {errors.declaration && (
                  <span className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.declaration.message}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons drawer */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 1 || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-505 hover:to-teal-505 text-white text-sm font-semibold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
