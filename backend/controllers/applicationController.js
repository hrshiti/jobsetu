import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { getIsConnected } from '../config/db.js';

// Memory store fallback
let memoryApplications = [];

export const submitApplication = async (req, res) => {
  try {
    const body = req.body || {};
    const files = req.files || {};

    // Safely parse photo path
    let profilePhotoPath = '';
    if (files.profilePhoto && files.profilePhoto.length > 0) {
      profilePhotoPath = `/uploads/${files.profilePhoto[0].filename}`;
    } else if (typeof body.profilePhoto === 'string') {
      profilePhotoPath = body.profilePhoto;
    } else if (typeof body.profilePhotoUrl === 'string') {
      profilePhotoPath = body.profilePhotoUrl;
    } else if (body.profilePhoto && typeof body.profilePhoto === 'object') {
      profilePhotoPath = body.profilePhoto.name || '';
    }

    // Safely parse resume path
    let resumePath = '';
    if (files.resume && files.resume.length > 0) {
      resumePath = `/uploads/${files.resume[0].filename}`;
    } else if (typeof body.resume === 'string') {
      resumePath = body.resume;
    } else if (typeof body.resumeUrl === 'string') {
      resumePath = body.resumeUrl;
    } else if (body.resume && typeof body.resume === 'object') {
      resumePath = body.resume.name || '';
    }

    // Safely parse certificate paths
    let certificatePaths = [];
    if (files.certificates && files.certificates.length > 0) {
      certificatePaths = files.certificates.map(f => `/uploads/${f.filename}`);
    } else if (Array.isArray(body.certificates)) {
      certificatePaths = body.certificates.map(c => typeof c === 'string' ? c : (c.name || ''));
    }

    const cleanJobId = (body.jobId && body.jobId !== 'undefined' && body.jobId !== 'null') ? String(body.jobId) : 'general';

    const applicationData = {
      jobId: cleanJobId,
      jobTitle: String(body.jobTitle || 'General Application'),
      firstName: String(body.firstName || ''),
      lastName: String(body.lastName || ''),
      gender: String(body.gender || 'Not specified'),
      dob: String(body.dob || ''),
      email: String(body.email || ''),
      phone: String(body.phone || ''),
      whatsapp: String(body.whatsapp || body.phone || ''),

      country: String(body.country || 'India'),
      state: String(body.state || ''),
      city: String(body.city || ''),
      pincode: String(body.pincode || ''),
      currentAddress: String(body.currentAddress || ''),
      permanentAddress: String(body.permanentAddress || body.currentAddress || ''),

      qualification: String(body.qualification || ''),
      university: String(body.university || ''),
      passingYear: String(body.passingYear || ''),
      percentage: String(body.percentage || ''),

      currentCompany: String(body.currentCompany || ''),
      currentSalary: String(body.currentSalary || ''),
      expectedSalary: String(body.expectedSalary || ''),
      noticePeriod: String(body.noticePeriod || ''),
      skills: String(body.skills || ''),
      linkedin: String(body.linkedin || ''),
      github: String(body.github || ''),
      portfolio: String(body.portfolio || ''),

      preferredLocation: String(body.preferredLocation || ''),
      jobType: String(body.jobType || ''),
      department: String(body.department || ''),
      languages: String(body.languages || ''),

      profilePhoto: profilePhotoPath,
      resume: resumePath,
      certificates: certificatePaths,

      status: 'Pending'
    };

    if (!applicationData.firstName || !applicationData.email || !applicationData.phone) {
      return res.status(400).json({ success: false, message: 'First Name, Email and Phone are required' });
    }

    if (getIsConnected()) {
      const createdApp = await Application.create(applicationData);
      
      // Increment job applicant count if valid jobId
      if (cleanJobId !== 'general') {
        try {
          await Job.findByIdAndUpdate(cleanJobId, { $inc: { applicantsCount: 1 } });
        } catch (e) {
          // ignore non-bson id errors
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Job application submitted successfully!',
        data: {
          applicationId: createdApp._id,
          submittedAt: createdApp.createdAt
        }
      });
    }

    // Memory store fallback
    const memoryApp = {
      ...applicationData,
      _id: 'app-' + Date.now(),
      id: 'app-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    memoryApplications.unshift(memoryApp);

    return res.status(201).json({
      success: true,
      message: 'Job application submitted successfully!',
      data: {
        applicationId: memoryApp._id,
        submittedAt: memoryApp.createdAt
      }
    });
  } catch (error) {
    console.error('Submit application error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { jobId, status, search } = req.query;

    if (getIsConnected()) {
      let filter = {};
      if (jobId && jobId !== 'undefined') filter.jobId = jobId;
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { jobTitle: { $regex: search, $options: 'i' } }
        ];
      }

      const applications = await Application.find(filter).sort({ createdAt: -1 });
      const totalCount = applications.length;

      return res.json({
        success: true,
        count: totalCount,
        data: applications
      });
    }

    // Memory fallback
    let filtered = [...memoryApplications];
    if (jobId) filtered = filtered.filter(a => a.jobId === jobId);
    if (status) filtered = filtered.filter(a => a.status === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.firstName.toLowerCase().includes(s) ||
        a.lastName.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s) ||
        a.phone.toLowerCase().includes(s) ||
        a.jobTitle.toLowerCase().includes(s)
      );
    }

    return res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const app = await Application.findById(id);
      if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
      return res.json({ success: true, data: app });
    }

    const app = memoryApplications.find(a => a._id === id || a.id === id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    return res.json({ success: true, data: app });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

    if (getIsConnected()) {
      const updated = await Application.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Application not found' });
      return res.json({ success: true, message: 'Application status updated', data: updated });
    }

    const index = memoryApplications.findIndex(a => a._id === id || a.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Application not found' });

    memoryApplications[index].status = status;
    return res.json({ success: true, message: 'Application status updated', data: memoryApplications[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const deleted = await Application.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Application not found' });
      return res.json({ success: true, message: 'Application deleted successfully' });
    }

    const index = memoryApplications.findIndex(a => a._id === id || a.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Application not found' });

    memoryApplications.splice(index, 1);
    return res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
