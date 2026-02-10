const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running and healthy!' });
});

// Import Routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is breathing at http://localhost:${PORT}`);
    });
}

module.exports = app;
