import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  planId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Amount in INR
  billingCycle: { type: String, default: 'monthly' }, // monthly / yearly
  description: { type: String },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
export default SubscriptionPlan;
