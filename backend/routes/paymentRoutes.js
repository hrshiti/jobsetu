import express from 'express';
import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getSubscribers
} from '../controllers/paymentController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Candidate public subscription & payment routes
router.get('/plans', getSubscriptionPlans);
router.post('/create-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);

// Admin protected subscription plan CRUD routes
router.post('/plans', protectAdmin, createSubscriptionPlan);
router.put('/plans/:id', protectAdmin, updateSubscriptionPlan);
router.delete('/plans/:id', protectAdmin, deleteSubscriptionPlan);

// Admin protected subscriber history route
router.get('/subscribers', protectAdmin, getSubscribers);

export default router;
