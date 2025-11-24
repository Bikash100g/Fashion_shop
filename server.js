
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db.js');
const FashionShopData = require('./fashionSchema.js');

const app = express();
app.use(bodyParser.json());
connectDB();


app.get('/', (req, res) => {
    res.send(' API is running! Use Postman or query endpoints.');
});


app.post('/add-product', async (req, res) => {
    try {
        const newProduct = new FashionShopData(req.body);
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', data: newProduct });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.post('/update-product/:name', async (req, res) => {
    try {
        const updatedProduct = await FashionShopData.findOneAndUpdate(
            { productName: req.params.name },
            req.body,
            { new: true }
        );
        res.json({ message: 'Product updated', data: updatedProduct });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.post('/delete-product/:name', async (req, res) => {
    try {
        await FashionShopData.findOneAndDelete({ productName: req.params.name });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/season-summary/:season', async (req, res) => {
    try {
        const data = await FashionShopData.aggregate([
            { $match: { season: req.params.season } },
            {
                $group: {
                    _id: '$season',
                    totalUnitsSold: { $sum: '$unitsSold' },
                    totalReturns: { $sum: '$returns' },
                    totalRevenue: { $sum: '$revenue' }
                }
            }
        ]);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/top-products', async (req, res) => {
    const { season, minUnitsSold } = req.query;
    try {
        const products = await FashionShopData.find({
            season: season,
            unitsSold: { $gt: Number(minUnitsSold) }
        }).limit(10);
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/products-by-rating', async (req, res) => {
    const { season, minRating } = req.query;
    try {
        const products = await FashionShopData.aggregate([
            { $match: { season: season } },
            {
                $group: {
                    _id: '$season',
                    avgRating: { $avg: '$customerRating' },
                    products: { $push: '$$ROOT' }
                }
            },
            { $match: { avgRating: { $gte: Number(minRating) } } }
        ]);
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.listen(5000, () => console.log('Server running on port 5000'));
