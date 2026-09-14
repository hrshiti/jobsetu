import mongoose from 'mongoose';

const subscriberTransactionSchema = new mongoose.Schema({
  subscriberName: { type: String, required: true },
  subscriberEmail: { type: String, required: true },
  subscriberPhone: { type: String },
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true }, // In INR
  currency: { type: String, default: 'INR' },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paymentStatus: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  validUntil: { type: Date }
}, { timestamps: true });

const SubscriberTransaction = mongoose.models.SubscriberTransaction || mongoose.model('SubscriberTransaction', subscriberTransactionSchema);
export default SubscriberTransaction;
