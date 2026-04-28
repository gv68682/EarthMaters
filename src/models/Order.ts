import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // guest checkout will have no user
  email: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  stripeSessionId: { type: String },
  status: { type: String, default: 'completed' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
