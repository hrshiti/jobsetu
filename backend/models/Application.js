import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  jobTitle: { type: String, default: 'General Application' },
  
  // Personal Details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },

  // Address
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  currentAddress: { type: String, required: true },
  permanentAddress: { type: String },

  // Education
  qualification: { type: String, required: true },
  university: { type: String, required: true },
  passingYear: { type: String, required: true },
  percentage: { type: String, required: true },

  // Professional Experience
  currentCompany: { type: String },
  currentSalary: { type: String },
  expectedSalary: { type: String },
  noticePeriod: { type: String },
  skills: { type: String },
  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },

  // Additional Details
  preferredLocation: { type: String },
  jobType: { type: String },
  department: { type: String },
  languages: { type: String },

  // Documents
  profilePhoto: { type: String },
  resume: { type: String },
  certificates: [{ type: String }],

  status: { type: String, enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;
