
const mongoose = require('mongoose');

const fashionSchema = new mongoose.Schema({
    productCategory: String,
    productName: { type: String, required: true,},
    unitsSold: { type: Number, required: true, default: 0 },
    returns: Number,
    revenue: Number,
    customerRating: Number,
    stockLevel: Number,
    season: String,
    trendScore: Number
});

module.exports = mongoose.model('FashionShopData', fashionSchema);
