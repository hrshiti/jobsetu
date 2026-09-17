import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Eye,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ShieldAlert,
  ChevronRight,
  User,
  MapPin,
  GraduationCap,
  Download,
  Building,
  DollarSign,
  Package
} from 'lucide-react';
import SEO from '../components/SEO';
import {
  loginAdmin,
  logoutAdmin,
  fetchAdminStats,
  fetchAllApplications,
  fetchApplicationDetails,
  updateAppStatus,
  deleteApplicationRecord,
  fetchJobs,
  createNewJob,
  updateExistingJob,
  deleteJobPost,
  fetchSubscribers,
  fetchSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
} from '../services/api';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, jobs, applications, subscribers, plans

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Data states
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalSubscribersCount: 0,
    totalRevenue: 0
  });

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Job Form State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote, India',
    type: 'Full-Time',
    experience: '1-3 Years',
    salary: '₹10,000 - ₹15,000 / month',
    startDate: '',
    expiryDate: '',
    description: '',
    requirements: '',
    responsibilities: '',
    status: 'active'
  });

  // Subscription Plan Form State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly',
    description: '',
    features: '',
    isActive: true
  });

  // Application Detail Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('');

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes, appsRes, subsRes, plansRes] = await Promise.all([
        fetchAdminStats().catch(() => null),
        fetchJobs().catch(() => null),
        fetchAllApplications().catch(() => null),
        fetchSubscribers().catch(() => null),
        fetchSubscriptionPlans().catch(() => null)
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (jobsRes?.data) setJobs(jobsRes.data);
      if (appsRes?.data) setApplications(appsRes.data);
      if (subsRes?.data) setSubscribers(subsRes.data);
      if (plansRes?.data) setPlans(plansRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    try {
      const res = await loginAdmin({ email: loginEmail, password: loginPassword });
      if (res.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setLoginError(res.message || 'Login failed');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid admin email or password');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  // Job CRUD Handlers
  const handleOpenCreateJob = () => {
    setEditingJob(null);
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setJobForm({
      title: '',
      department: 'Engineering',
      location: 'Remote, India',
      type: 'Full-Time',
      experience: '1-3 Years',
      salary: '₹10,000 - ₹15,000 / month',
      startDate: todayStr,
      expiryDate: defaultExpiry,
      description: '',
      requirements: '',
      responsibilities: '',
      status: 'active'
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      department: job.department || 'Engineering',
      location: job.location || '',
      type: job.type || 'Full-Time',
      experience: job.experience || '',
      salary: job.salary || '',
      startDate: job.startDate ? job.startDate.split('T')[0] : '',
      expiryDate: job.expiryDate ? job.expiryDate.split('T')[0] : '',
      description: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : (job.responsibilities || ''),
      status: job.status || 'active'
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...jobForm,
        requirements: jobForm.requirements.split('\n').filter(r => r.trim() !== ''),
        responsibilities: jobForm.responsibilities.split('\n').filter(r => r.trim() !== '')
      };

      if (editingJob) {
        await updateExistingJob(editingJob._id || editingJob.id, payload);
      } else {
        await createNewJob(payload);
      }
      setIsJobModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save job post');
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job post?')) {
      try {
        await deleteJobPost(id);
        loadAllData();
      } catch (err) {
        alert('Failed to delete job post');
      }
    }
  };

  // Subscription Plan Handlers
  const handleOpenCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      price: '',
      billingCycle: 'monthly',
      description: '',
      features: '',
      isActive: true
    });
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || '',
      price: plan.price || '',
      billingCycle: plan.billingCycle || 'monthly',
      description: plan.description || '',
      features: Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || ''),
      isActive: plan.isActive !== undefined ? plan.isActive : true
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...planForm,
        price: Number(planForm.price),
        features: planForm.features.split('\n').filter(f => f.trim() !== '')
      };

      if (editingPlan) {
        await updateSubscriptionPlan(editingPlan._id || editingPlan.planId, payload);
      } else {
        await createSubscriptionPlan(payload);
      }
      setIsPlanModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save subscription plan');
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      try {
        await deleteSubscriptionPlan(id);
        loadAllData();
      } catch (err) {
        alert('Failed to delete subscription plan');
      }
    }
  };

  const handleTogglePlanActive = async (plan) => {
    try {
      await updateSubscriptionPlan(plan._id || plan.planId, { isActive: !plan.isActive });
      loadAllData();
    } catch (err) {
      alert('Failed to toggle plan status');
    }
  };

  // Application Handlers
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateAppStatus(appId, newStatus);
      if (selectedApp) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      loadAllData();
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  const handleDeleteApp = async (appId) => {
    if (window.confirm('Are you sure you want to delete this candidate application form?')) {
      try {
        await deleteApplicationRecord(appId);
        if (selectedApp?._id === appId || selectedApp?.id === appId) {
          setSelectedApp(null);
        }
        loadAllData();
      } catch (err) {
        alert('Failed to delete application');
      }
    }
  };

  // Filtered Applications List
  const filteredApps = applications.filter(app => {
    const matchesSearch = !appSearch || 
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.phone.includes(appSearch) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(appSearch.toLowerCase()));

    const matchesStatus = !appStatusFilter || app.status === appStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Login view if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <SEO title="Admin Portal Login" description="Admin Dashboard Login for JobSetu Management" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-600/20">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Dashboard Login</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter credentials to manage jobs, subscription plans, candidate submissions, and subscribers.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isSubmittingLogin ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-6 min-h-[85vh]">
      <SEO title="Admin Dashboard - JobSetu" description="Manage job postings, subscription plans, candidate submissions, and Razorpay payments." />

      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/40">
            Admin Management
          </span>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white mt-1">Admin Portal Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Refresh Data
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 text-xs font-semibold hover:bg-rose-100 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800/60">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
          { id: 'applications', label: `Form Submissions (${applications.length})`, icon: FileText },
          { id: 'jobs', label: `Job Posts (${jobs.length})`, icon: Briefcase },
          { id: 'subscribers', label: `Subscriptions & Subscribers (${plans.length})`, icon: CreditCard }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 dark:bg-slate-900">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-600/20">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Form Submissions</p>
              <h3 className="text-3xl font-black text-slate-950 dark:text-white mt-1">{applications.length}</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">Candidates Applied</p>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:bg-slate-900">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-3 shadow-md shadow-purple-600/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Job Posts</p>
              <h3 className="text-3xl font-black text-slate-950 dark:text-white mt-1">{jobs.filter(j => j.status === 'active').length}</h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">Of {jobs.length} Total Jobs</p>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 dark:bg-slate-900">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/20">
                <Package className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Subscription Plans</p>
              <h3 className="text-3xl font-black text-slate-950 dark:text-white mt-1">{plans.filter(p => p.isActive).length}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Created by Admin</p>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 dark:bg-slate-900">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center mb-3 shadow-md shadow-amber-600/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subscription Revenue</p>
              <h3 className="text-3xl font-black text-slate-950 dark:text-white mt-1">
                ₹{subscribers.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">Razorpay Received</p>
            </div>
          </div>

          {/* Recent Form Applications Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Recent Candidate Form Submissions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kitno ne form fill kiya details preview</p>
              </div>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All ({applications.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Applied Role</th>
                    <th className="py-3 px-4">Email / Phone</th>
                    <th className="py-3 px-4">Qualification</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app._id || app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {app.firstName} {app.lastName}
                      </td>
                      <td className="py-3.5 px-4">{app.jobTitle || 'General'}</td>
                      <td className="py-3.5 px-4">
                        <div>{app.email}</div>
                        <div className="text-[11px] text-slate-400">{app.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">{app.qualification}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                          app.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => { setSelectedApp(app); setActiveTab('applications'); }}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 font-medium hover:bg-blue-100 transition-all flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Form
                        </button>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No candidate applications submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FORM SUBMISSIONS VIEW */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6">
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Candidate Form Submissions ({applications.length})</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inspect full form details submitted by candidates across all job posts.</p>
            </div>

            {/* Search & Status Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate name, email, phone..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Submissions List Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Applied Job</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Education / Exp</th>
                    <th className="py-3.5 px-4">Submitted Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredApps.map((app) => (
                    <tr key={app._id || app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        <div>{app.firstName} {app.lastName}</div>
                        <div className="text-[11px] font-normal text-slate-400">{app.gender}, {app.dob || 'DOB N/A'}</div>
                      </td>
                      <td className="py-4 px-4 font-medium">{app.jobTitle || 'General Application'}</td>
                      <td className="py-4 px-4">
                        <div>{app.email}</div>
                        <div className="text-[11px] text-slate-400">{app.phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div>{app.qualification} ({app.passingYear})</div>
                        <div className="text-[11px] text-slate-400">{app.currentCompany ? `Exp: ${app.currentCompany}` : 'Fresh candidate'}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={app.status || 'Pending'}
                          onChange={(e) => handleUpdateStatus(app._id || app.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 transition-all"
                            title="View Full Form Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteApp(app._id || app.id)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100 transition-all"
                            title="Delete Form Submission"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400">
                        No candidate application submissions match your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JOB POSTS CRUD MANAGEMENT */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6">
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Job Posts Management</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Create new job postings, update details, or toggle active status.</p>
            </div>
            <button
              onClick={handleOpenCreateJob}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Post New Job
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <div key={job._id || job.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800/40">
                      {job.department}
                    </span>
                    <h3 className="text-lg font-black text-slate-950 dark:text-white mt-1">{job.title}</h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    job.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {job.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{job.description}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl">
                  <div>📍 Location: <strong className="text-slate-700 dark:text-slate-300">{job.location}</strong></div>
                  <div>⏳ Type: <strong className="text-slate-700 dark:text-slate-300">{job.type}</strong></div>
                  <div>💼 Exp: <strong className="text-slate-700 dark:text-slate-300">{job.experience}</strong></div>
                  <div>💰 Salary: <strong className="text-slate-700 dark:text-slate-300">{job.salary}</strong></div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Applicants: {job.applicantsCount || 0} candidates
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditJob(job)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id || job.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100 transition-all text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUBSCRIPTION PLANS & SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-8">
          {/* SUBSCRIPTION PLANS MANAGEMENT SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6">
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">Subscription Plans Manager</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create & manage plans offered to candidates for Razorpay payment.</p>
              </div>
              <button
                onClick={handleOpenCreatePlan}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                Create New Subscription Plan
              </button>
            </div>

            {/* Plans List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <div key={plan._id || plan.planId} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/40">
                          {plan.billingCycle || 'monthly'}
                        </span>
                        <h3 className="text-lg font-black text-slate-950 dark:text-white mt-1">{plan.name}</h3>
                      </div>

                      <button
                        onClick={() => handleTogglePlanActive(plan)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          plan.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {plan.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div className="text-3xl font-black text-slate-950 dark:text-white mb-2">
                      ₹{plan.price} <span className="text-xs font-normal text-slate-400">/ month</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">{plan.description}</p>

                    <div className="space-y-1.5 mb-6 text-xs text-slate-700 dark:text-slate-300">
                      {Array.isArray(plan.features) && plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenEditPlan(plan)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id || plan.planId)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100 transition-all text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBSCRIBERS TABLE SECTION */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Subscribers & Razorpay Receipts</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">View candidates who subscribed and paid via Razorpay.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Subscriber Name</th>
                      <th className="py-3.5 px-4">Email / Phone</th>
                      <th className="py-3.5 px-4">Plan Name</th>
                      <th className="py-3.5 px-4">Amount Paid</th>
                      <th className="py-3.5 px-4">Razorpay Order ID</th>
                      <th className="py-3.5 px-4">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {subscribers.map((sub) => (
                      <tr key={sub._id || sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                          {sub.subscriberName}
                        </td>
                        <td className="py-4 px-4">
                          <div>{sub.subscriberEmail}</div>
                          <div className="text-[11px] text-slate-400">{sub.subscriberPhone}</div>
                        </td>
                        <td className="py-4 px-4 font-medium text-indigo-600 dark:text-indigo-400">{sub.planName}</td>
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">₹{sub.amount} INR</td>
                        <td className="py-4 px-4 font-mono text-[11px] text-slate-500">{sub.razorpayOrderId}</td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            {sub.paymentStatus || 'paid'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {subscribers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400">
                          No paid subscriber records found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION PLAN MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
              </h3>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Placement Pass"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (in INR ₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="999"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Billing Cycle</label>
                  <select
                    value={planForm.billingCycle}
                    onChange={(e) => setPlanForm({ ...planForm, billingCycle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Plan Description</label>
                <textarea
                  rows="2"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  placeholder="Short summary of what candidate gets with this plan"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Features (1 per line)</label>
                <textarea
                  rows="3"
                  value={planForm.features}
                  onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  placeholder="Highlight Application to HRs&#10;Dedicated Placement Assistance"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={planForm.isActive}
                  onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Plan is Active & Available for Candidates
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* JOB CREATION / EDIT MODAL */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                {editingJob ? 'Edit Job Post' : 'Create New Job Listing'}
              </h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience Needed</label>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Salary Package</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Start Date and Expiry Date Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Starting Date</label>
                  <input
                    type="date"
                    value={jobForm.startDate}
                    onChange={(e) => setJobForm({ ...jobForm, startDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Application Expiry Date</label>
                  <input
                    type="date"
                    value={jobForm.expiryDate}
                    onChange={(e) => setJobForm({ ...jobForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Description *</label>
                <textarea
                  rows="3"
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Requirements (1 per line)</label>
                <textarea
                  rows="3"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  placeholder="React 19&#10;Node.js & MongoDB"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
                >
                  {editingJob ? 'Update Job' : 'Publish Job'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* FULL CANDIDATE APPLICATION FORM DETAILS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                  Submitted Candidate Application
                </span>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white mt-1">
                  {selectedApp.firstName} {selectedApp.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
              {/* Personal Information */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" /> Personal Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div><span className="text-slate-400">Gender:</span> <strong>{selectedApp.gender}</strong></div>
                  <div><span className="text-slate-400">DOB:</span> <strong>{selectedApp.dob || 'N/A'}</strong></div>
                  <div><span className="text-slate-400">Email:</span> <strong className="text-blue-600">{selectedApp.email}</strong></div>
                  <div><span className="text-slate-400">Phone:</span> <strong>{selectedApp.phone}</strong></div>
                  <div><span className="text-slate-400">WhatsApp:</span> <strong>{selectedApp.whatsapp || selectedApp.phone}</strong></div>
                </div>
              </div>

              {/* Address Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Address Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
                  <div><span className="text-slate-400">City:</span> <strong>{selectedApp.city}</strong></div>
                  <div><span className="text-slate-400">State:</span> <strong>{selectedApp.state}</strong></div>
                  <div><span className="text-slate-400">Pincode:</span> <strong>{selectedApp.pincode}</strong></div>
                </div>
                <div className="mt-2"><span className="text-slate-400">Current Address:</span> <strong>{selectedApp.currentAddress}</strong></div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" /> Education
                  </h4>
                  <div className="space-y-1.5">
                    <div><span className="text-slate-400">Qualification:</span> <strong>{selectedApp.qualification}</strong></div>
                    <div><span className="text-slate-400">University:</span> <strong>{selectedApp.university}</strong></div>
                    <div><span className="text-slate-400">Passing Year:</span> <strong>{selectedApp.passingYear}</strong></div>
                    <div><span className="text-slate-400">Percentage/CGPA:</span> <strong>{selectedApp.percentage}</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" /> Experience
                  </h4>
                  <div className="space-y-1.5">
                    <div><span className="text-slate-400">Current Company:</span> <strong>{selectedApp.currentCompany || 'N/A'}</strong></div>
                    <div><span className="text-slate-400">Current Salary:</span> <strong>{selectedApp.currentSalary || 'N/A'}</strong></div>
                    <div><span className="text-slate-400">Expected Salary:</span> <strong>{selectedApp.expectedSalary || 'N/A'}</strong></div>
                    <div><span className="text-slate-400">Skills:</span> <strong>{selectedApp.skills || 'N/A'}</strong></div>
                  </div>
                </div>
              </div>

              {/* Document References */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-3">Uploaded Attachments & Links</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedApp.resume && (
                    <a
                      href={selectedApp.resume.startsWith('http') ? selectedApp.resume : `http://localhost:5000${selectedApp.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Candidate Resume
                    </a>
                  )}
                  {selectedApp.linkedin && (
                    <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold">
                      LinkedIn Profile
                    </a>
                  )}
                  {selectedApp.github && (
                    <a href={selectedApp.github} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold">
                      GitHub Profile
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500">Update Status:</span>
                  {['Pending', 'Shortlisted', 'Rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedApp._id || selectedApp.id, st)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        selectedApp.status === st
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  Close Modal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
