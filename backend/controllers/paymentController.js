import crypto from 'crypto';
import Razorpay from 'razorpay';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import SubscriberTransaction from '../models/SubscriberTransaction.js';
import { getIsConnected } from '../config/db.js';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';

let razorpayInstance = null;
if (razorpayKeyId && !razorpayKeyId.includes('placeholder')) {
  try {
    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret
    });
  } catch (err) {
    console.warn('Razorpay init notice:', err.message);
  }
}

// In-Memory fall// In-Memory fallback (empty arrays)
let memoryPlans = [];
let memorySubscribers = [];

export const getSubscriptionPlans = async (req, res) => {
  try {
    if (getIsConnected()) {
      const { all } = req.query;
      let filter = { isActive: true };
      if (all === 'true') filter = {}; // return all plans for admin management

      const plans = await SubscriptionPlan.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, data: plans });
    }
    return res.json({ success: true, data: memoryPlans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSubscriptionPlan = async (req, res) => {
  try {
    const { name, price, billingCycle, description, features, isActive } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Plan Name and Price are required' });
    }

    const planId = 'plan_' + Math.random().toString(36).substring(2, 9);
    const planData = {
      planId,
      name,
      price: Number(price),
      billingCycle: billingCycle || 'monthly',
      description: description || '',
      features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
      isActive: isActive !== undefined ? isActive : true
    };

    if (getIsConnected()) {
      const created = await SubscriptionPlan.create(planData);
      return res.status(201).json({ success: true, message: 'Subscription Plan created successfully', data: created });
    }

    const memoryCreated = { ...planData, _id: planId };
    memoryPlans.unshift(memoryCreated);
    return res.status(201).json({ success: true, message: 'Subscription Plan created successfully', data: memoryCreated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.features && typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map(f => f.trim());
    }

    if (getIsConnected()) {
      const updated = await SubscriptionPlan.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        // try searching by planId
        const updatedByPlanId = await SubscriptionPlan.findOneAndUpdate({ planId: id }, updateData, { new: true });
        if (!updatedByPlanId) return res.status(404).json({ success: false, message: 'Plan not found' });
        return res.json({ success: true, message: 'Subscription Plan updated', data: updatedByPlanId });
      }
      return res.json({ success: true, message: 'Subscription Plan updated', data: updated });
    }

    const idx = memoryPlans.findIndex(p => p._id === id || p.planId === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Plan not found' });

    memoryPlans[idx] = { ...memoryPlans[idx], ...updateData };
    return res.json({ success: true, message: 'Subscription Plan updated', data: memoryPlans[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const deleted = await SubscriptionPlan.findByIdAndDelete(id);
      if (!deleted) {
        await SubscriptionPlan.findOneAndDelete({ planId: id });
      }
      return res.json({ success: true, message: 'Subscription Plan deleted' });
    }

    const idx = memoryPlans.findIndex(p => p._id === id || p.planId === id);
    if (idx !== -1) memoryPlans.splice(idx, 1);
    return res.json({ success: true, message: 'Subscription Plan deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, planId, subscriberName, subscriberEmail, subscriberPhone } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId: planId || 'custom',
        subscriberName: subscriberName || 'Candidate',
        subscriberEmail: subscriberEmail || ''
      }
    };

    if (razorpayInstance) {
      const order = await razorpayInstance.orders.create(options);
      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: razorpayKeyId
      });
    }

    // Fallback simulation for dev/testing when test keys are placeholders
    const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 10)}`;
    const newTx = {
      _id: 'tx-' + Date.now(),
      subscriberName: subscriberName || 'Candidate User',
      subscriberEmail: subscriberEmail || 'candidate@example.com',
      subscriberPhone: subscriberPhone || '',
      planId: planId || 'plan_pro',
      planName: memoryPlans.find(p => p.planId === planId)?.name || 'Candidate Subscription',
      amount: Number(amount),
      currency: 'INR',
      razorpayOrderId: mockOrderId,
      paymentStatus: 'created',
      createdAt: new Date().toISOString()
    };
    memorySubscribers.unshift(newTx);

    return res.json({
      success: true,
      orderId: mockOrderId,
      amount: options.amount,
      currency: options.currency,
      key: razorpayKeyId,
      message: 'Razorpay order created'
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriberName,
      subscriberEmail,
      subscriberPhone,
      planId,
      amount
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Missing order_id or payment_id' });
    }

    let isValid = false;

    if (razorpayKeySecret && !razorpayKeySecret.includes('placeholder') && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
    } else {
      // Direct pass for dev environment test simulation
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Razorpay signature verification failed' });
    }

    const planObj = memoryPlans.find(p => p.planId === planId) || { name: 'Subscription Plan' };

    const transactionData = {
      subscriberName: subscriberName || 'Subscribed Candidate',
      subscriberEmail: subscriberEmail || 'subscriber@example.com',
      subscriberPhone: subscriberPhone || '',
      planId: planId || 'plan_pro',
      planName: planObj.name,
      amount: Number(amount || 999),
      currency: 'INR',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature || 'verified_dev',
      paymentStatus: 'paid',
      validUntil: new Date(Date.now() + 30 * 86400000) // 30 days
    };

    if (getIsConnected()) {
      await SubscriberTransaction.create(transactionData);
    } else {
      // Update memory transaction or add new
      const idx = memorySubscribers.findIndex(s => s.razorpayOrderId === razorpay_order_id);
      if (idx !== -1) {
        memorySubscribers[idx] = { ...memorySubscribers[idx], ...transactionData };
      } else {
        memorySubscribers.unshift({ ...transactionData, _id: 'tx-' + Date.now(), createdAt: new Date().toISOString() });
      }
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully! Subscriber added.',
      data: transactionData
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    if (getIsConnected()) {
      const subscribers = await SubscriberTransaction.find({ paymentStatus: 'paid' }).sort({ createdAt: -1 });
      const totalRevenue = subscribers.reduce((acc, curr) => acc + (curr.amount || 0), 0);

      return res.json({
        success: true,
        count: subscribers.length,
        totalRevenue,
        data: subscribers
      });
    }

    const paidMemory = memorySubscribers.filter(s => s.paymentStatus === 'paid');
    const totalRevenue = paidMemory.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return res.json({
      success: true,
      count: paidMemory.length,
      totalRevenue,
      data: paidMemory
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
