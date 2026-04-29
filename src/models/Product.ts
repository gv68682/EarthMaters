import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  regularPrice: { type: String },
  salePrice: { type: String },
  priceValue: { type: Number, required: true, default: 0 }, // Parsed numeric value for cart/stripe
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
