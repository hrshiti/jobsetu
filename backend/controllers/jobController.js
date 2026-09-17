import Job from '../models/Job.js';
import { getIsConnected } from '../config/db.js';

// In-Memory store fallback
let memoryJobs = [
  {
    _id: 'job-1',
    id: 'job-1',
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote, India',
    type: 'Full-Time',
    experience: '3-5 Years',
    salary: '₹12,000 - ₹18,000 / month',
    description: 'We are seeking an experienced Full Stack Developer skilled in React, Node.js, and Cloud Infrastructure.',
    requirements: ['React 19 & Vite', 'Node.js & Express', 'MongoDB / SQL', 'REST APIs & WebSockets'],
    responsibilities: ['Build scalable web features', 'Collaborate with UI/UX design team', 'Maintain code quality & automated tests'],
    status: 'active',
    startDate: '2026-09-01',
    expiryDate: '2026-10-31',
    applicantsCount: 4,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-2',
    id: 'job-2',
    title: 'UI/UX Product Designer',
    department: 'Design',
    location: 'Bangalore / Hybrid',
    type: 'Full-Time',
    experience: '2-4 Years',
    salary: '₹10,000 - ₹15,000 / month',
    description: 'Create world-class user experiences and visually captivating UI designs for modern candidate portals.',
    requirements: ['Figma & Design Systems', 'User Research & Wireframing', 'Prototyping & Micro-animations'],
    responsibilities: ['Design intuitive interfaces', 'Conduct candidate usability testing', 'Partner with frontend team'],
    status: 'active',
    startDate: '2026-09-05',
    expiryDate: '2026-10-15',
    applicantsCount: 2,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-3',
    id: 'job-3',
    title: 'Operations & HR Executive',
    department: 'Human Resources',
    location: 'Delhi NCR / On-Site',
    type: 'Full-Time',
    experience: '1-3 Years',
    salary: '₹8,000 - ₹12,000 / month',
    description: 'Manage candidate screening, application reviews, and recruitment workflow coordination.',
    requirements: ['Excellent communication', 'Application tracking tools', 'HR management basics'],
    responsibilities: ['Screen candidate applications', 'Schedule interviews', 'Maintain HR databases'],
    status: 'active',
    startDate: '2026-09-10',
    expiryDate: '2026-11-01',
    applicantsCount: 1,
    createdAt: new Date().toISOString()
  }
];

export const getJobs = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ];
      }
      const jobs = await Job.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: jobs.length, data: jobs });
    }

    // Memory fallback
    let filtered = [...memoryJobs];
    if (status) filtered = filtered.filter(j => j.status === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(j => j.title.toLowerCase().includes(s) || j.department.toLowerCase().includes(s));
    }
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
      return res.json({ success: true, data: job });
    }

    const job = memoryJobs.find(j => j._id === id || j.id === id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    return res.json({ success: true, data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, department, location, type, experience, salary, description, requirements, responsibilities, status, startDate, expiryDate } = req.body;

    if (!title || !department || !location || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all required job fields' });
    }

    const newJobData = {
      title,
      department,
      location,
      type: type || 'Full-Time',
      experience: experience || '0-2 Years',
      salary: salary || 'Negotiable',
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(s => s.trim()) : []),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split(',').map(s => s.trim()) : []),
      status: status || 'active',
      startDate: startDate || new Date().toISOString().split('T')[0],
      expiryDate: expiryDate || '',
      applicantsCount: 0
    };

    if (getIsConnected()) {
      const createdJob = await Job.create(newJobData);
      return res.status(201).json({ success: true, message: 'Job posted successfully', data: createdJob });
    }

    const memoryCreated = {
      ...newJobData,
      _id: 'job-' + Date.now(),
      id: 'job-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    memoryJobs.unshift(memoryCreated);

    return res.status(201).json({ success: true, message: 'Job posted successfully', data: memoryCreated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (getIsConnected()) {
      const updated = await Job.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Job not found' });
      return res.json({ success: true, message: 'Job updated successfully', data: updated });
    }

    const index = memoryJobs.findIndex(j => j._id === id || j.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Job not found' });

    memoryJobs[index] = { ...memoryJobs[index], ...updateData };
    return res.json({ success: true, message: 'Job updated successfully', data: memoryJobs[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const deleted = await Job.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Job not found' });
      return res.json({ success: true, message: 'Job deleted successfully' });
    }

    const index = memoryJobs.findIndex(j => j._id === id || j.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Job not found' });

    memoryJobs.splice(index, 1);
    return res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
