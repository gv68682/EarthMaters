const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    regularPrice: { type: String },
    salePrice: { type: String },
    priceValue: { type: Number, required: true, default: 0 },
});

// Prevent model overwrite in watch mode
module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);

