
const mongoose = require('mongoose');
const csv = require('csvtojson');
const FashionShopData = require('./fashionSchema.js'); 
require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log(' Connected to MongoDB Atlas');
    } catch (err) {
        console.error(' MongoDB connection error:', err.message);
        process.exit(1);
    }
}

async function importCSV() {
    try {
        await connectDB();
        const jsonArray = await csv().fromFile('./data/fashion_Dataset.csv'); 
        
        const mappedArray = jsonArray.map(item => ({
            productCategory: item['Product Category'],
            productName: item['Product Name'],
            unitsSold: Number(item['Units Sold']),
            returns: Number(item['Returns']),
            revenue: Number(item['Revenue']),
            customerRating: Number(item['Customer Rating']),
            stockLevel: Number(item['Stock Level']),
            season: item['Season'],
            trendScore: Number(item['Trend Score'])
        }));

       await FashionShopData.insertMany(mappedArray, { ordered: false });
        console.log(' CSV data imported successfully!');
        process.exit();
    } catch (err) {
        console.error(' Error importing CSV:', err.message);
        process.exit(1);
    }
}

importCSV();
