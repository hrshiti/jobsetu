import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true }, // e.g. Full-Time, Remote, Part-Time
  experience: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  applicantsCount: { type: Number, default: 0 }
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
