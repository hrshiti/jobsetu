import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, Search, ChevronRight, SlidersHorizontal, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { JOBS_LIST, DEPARTMENTS, JOB_TYPES, LOCATIONS } from '../constants/jobs';

export default function Careers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedLoc, setSelectedLoc] = useState('All Locations');
  const [expandedJobId, setExpandedJobId] = useState(null);

  const filteredJobs = useMemo(() => {
    return JOBS_LIST.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === 'All Departments' || job.department === selectedDept;
      const matchesType = selectedType === 'All Types' || job.type === selectedType;
      const matchesLoc = selectedLoc === 'All Locations' || job.location === selectedLoc;
      
      return matchesSearch && matchesDept && matchesType && matchesLoc;
    });
  }, [searchTerm, selectedDept, selectedType, selectedLoc]);

  const toggleJobExpand = (id) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  return (
    <div className="py-8">
      <SEO 
        title="Careers - Join Our Team" 
        description="Browse open job roles at ApplyNova Portal. Apply for Senior Frontend Engineer, UI/UX Designer, Product Manager, and more."
      />

      {/* Header section */}
      <div className="text-center mb-16">
        <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-100/50 dark:border-blue-800/40 uppercase tracking-widest">
          Work with us
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mt-4 tracking-tight">
          Current Job Openings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-base max-w-xl mx-auto leading-relaxed">
          Discover a career with a premium team. Explore open roles across engineering, design, marketing, and operations.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Department filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Job Type filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location filter */}
          <div>
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs list */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            return (
              <motion.div
                key={job.id}
                layout
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div 
                  onClick={() => toggleJobExpand(job.id)}
                  className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      {job.department}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {job.type}
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 md:border-none pt-4 md:pt-0">
                    <span className="text-xs text-slate-400 font-semibold md:hidden">View Details</span>
                    <div className={`p-2 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-400 transition-transform duration-300 ${
                      isExpanded ? 'rotate-90 text-blue-600' : ''
                    }`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-8 md:px-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 bg-slate-50/50 dark:bg-slate-900/40">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Desc */}
                          <div className="lg:col-span-2 space-y-6">
                            <div>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Job Description</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {job.description}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Requirements</h4>
                              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                {job.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Quick details & Apply */}
                          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-6">
                            <div className="space-y-4">
                              <div>
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Experience Needed</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">{job.experience}</span>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Location Policy</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">{job.location === 'Remote' ? 'Work from Anywhere' : 'On-Site / Hybrid'}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => navigate(`/apply?jobId=${job.id}`)}
                              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all"
                            >
                              Apply for this job
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-sm">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">No jobs found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Try adjusting your filters or search term to see other roles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
