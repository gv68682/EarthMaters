const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/earthmaters';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  regularPrice: { type: String },
  salePrice: { type: String },
  priceValue: { type: Number, required: true },
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function importData() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const csvFilePath = path.join(__dirname, '../web scraping2/scraped_data.csv');
  const csvFile = fs.readFileSync(csvFilePath, 'utf8');

  const parsed = Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
  });

  const products = parsed.data.map((row) => {
    // Extract price value (convert "Rs. 1,000" to 1000)
    let rawPrice = row['Sale Price'] !== 'N/A' && row['Sale Price'] ? row['Sale Price'] : row['Regular Price'];
    let priceValue = 0;
    if (rawPrice && rawPrice !== 'N/A') {
      const match = rawPrice.replace(/,/g, '').match(/[\d.]+/);
      if (match) priceValue = parseFloat(match[0]);
    }

    return {
      name: row['Product Name'],
      imageUrl: row['Image URL'],
      regularPrice: row['Regular Price'] !== 'N/A' ? row['Regular Price'] : '',
      salePrice: row['Sale Price'] !== 'N/A' ? row['Sale Price'] : '',
      priceValue: priceValue,
    };
  });

  // Clear existing products
  await Product.deleteMany({});
  console.log('Cleared existing products');

  await Product.insertMany(products);
  console.log(`Imported ${products.length} products`);

  mongoose.disconnect();
}

importData().catch(console.error);
