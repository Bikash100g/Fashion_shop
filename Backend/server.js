
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const connectDB = require('./db.js');
const FashionShopData = require('./fashionSchema.js');

const app = express();


const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN 
  || 'https://crispy-train-5g464g6544qqh7w5j-3000.app.github.dev'; // no trailing slash

app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false // set true only if you use cookies/sessions
}));




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



const PORT = process.env.PORT || 5000;      // <-- define PORT
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

