import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} from '../controllers/applicationController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

const cpUpload = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'certificates', maxCount: 5 }
]);

// Public candidate form submission
router.post('/', cpUpload, submitApplication);

// Admin protected endpoints
router.get('/', protectAdmin, getApplications);
router.get('/:id', protectAdmin, getApplicationById);
router.put('/:id/status', protectAdmin, updateApplicationStatus);
router.delete('/:id', protectAdmin, deleteApplication);

export default router;
