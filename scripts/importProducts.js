// console.log("TEST:", "Rs. 799.00".match(/[\d,.]+/));

const path = require("path");
require("dotenv").config({
    path: path.resolve(process.cwd(), ".env.local"),
});

console.log("MONGO URI:", process.env.MONGODB_URI);

const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");

const Product = require("./models/Product");

const results = [];

// ---------------- DB CONNECT ----------------
async function dbConnect() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI missing");
    }

    if (mongoose.connection.readyState === 1) return;

    await mongoose.connect(MONGODB_URI);
}

// ---------------- CLEAN CSV KEYS ----------------
const clean = (obj) => {
    const fixed = {};
    for (let key in obj) {
        fixed[key.trim().replace(/^\uFEFF/, "")] = obj[key];
    }
    return fixed;
};

// ---------------- PRICE EXTRACTOR ----------------
const extractPrice = (value) => {
    if (!value) return 0;
    const match = String(value).match(/[\d,]+\.?\d*/);
    if (!match) return 0;
    const num = parseFloat(match[0].replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
};

// ---------------- MAIN IMPORT ----------------
async function importCSV() {
    await dbConnect();

    const filePath = path.join(__dirname, "../data/products.csv");

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
            const cleaned = clean(data);
            if (results.length === 0) {
                console.log("Keys:", Object.keys(cleaned)); // ← add this
                console.log("Sale Price value:", JSON.stringify(cleaned["Sale Price"]));
                console.log("Regular Price value:", JSON.stringify(cleaned["Regular Price"]));
            }
            results.push(cleaned);
        })
        .on("end", async () => {
            try {
                await Product.deleteMany();

                await Product.insertMany(
                    results.map((item) => {
                        const sale = item["Sale Price"];
                        const regular = item["Regular Price"];

                        console.log("sale:", JSON.stringify(sale));
                        console.log("extractPrice(sale):", extractPrice(sale));
                        console.log("extractPrice(regular):", extractPrice(regular));

                        const priceValue =
                            extractPrice(sale) > 0
                                ? extractPrice(sale)
                                : extractPrice(regular);

                        return {
                            name: item["Product Name"],
                            imageUrl: item["Image URL"],
                            regularPrice: regular,
                            salePrice: sale,
                            priceValue,
                        };
                    })
                );

                console.log("CSV imported successfully");
            } catch (err) {
                console.error("IMPORT ERROR:", err);
            }

            process.exit();
        });
}

importCSV();