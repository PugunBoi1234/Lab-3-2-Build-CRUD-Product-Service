const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Sample product data
let products = [
    { id: 1, productName: 'Milk Tea', category: 'Beverage' },
    { id: 2, productName: 'Cheese Cake', category: 'Dessert' },
];

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Get all products
app.get('/products', (req, res) => res.json(products));

// Get product by ID
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Create new product
app.post('/products', (req, res) => {
    const { productName, category } = req.body;

    if (!productName || !category) {
        return res.status(400).json({ message: 'Product name and category are required' });
    }

    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        productName,
        category
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Update product
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        const { productName, category } = req.body;

        if (!productName || !category) {
            return res.status(400).json({ message: 'Product name and category are required' });
        }

        products[productIndex] = { id: productId, productName, category };
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Delete product
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1);
        res.json(deletedProduct[0]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Start server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
