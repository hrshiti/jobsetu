import Application from '../models/Application.js';
import Job from '../models/Job.js';
import SubscriberTransaction from '../models/SubscriberTransaction.js';
import { getIsConnected } from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    if (getIsConnected()) {
      const totalApplications = await Application.countDocuments();
      const pendingApplications = await Application.countDocuments({ status: 'Pending' });
      const totalJobs = await Job.countDocuments();
      const activeJobs = await Job.countDocuments({ status: 'active' });
      
      const paidSubscribers = await SubscriberTransaction.find({ paymentStatus: 'paid' });
      const totalSubscribersCount = paidSubscribers.length;
      const totalRevenue = paidSubscribers.reduce((sum, item) => sum + (item.amount || 0), 0);

      const recentApplications = await Application.find().sort({ createdAt: -1 }).limit(5);

      return res.json({
        success: true,
        data: {
          totalApplications,
          pendingApplications,
          totalJobs,
          activeJobs,
          totalSubscribersCount,
          totalRevenue,
          recentApplications
        }
      });
    }

    // Memory fallback stats
    return res.json({
      success: true,
      data: {
        totalApplications: 2,
        pendingApplications: 1,
        totalJobs: 3,
        activeJobs: 3,
        totalSubscribersCount: 2,
        totalRevenue: 1498,
        recentApplications: []
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
