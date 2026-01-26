const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Create a new order
router.post('/', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { items } = req.body; // items: [{ product_id, quantity }, ...]
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain at least one item' });
        }

        await connection.beginTransaction();

        // Calculate total price and verify stock
        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const [products] = await connection.query(
                'SELECT * FROM products WHERE id = ?',
                [item.product_id]
            );

            if (products.length === 0) {
                await connection.rollback();
                return res.status(404).json({ error: `Product ${item.product_id} not found` });
            }

            const product = products[0];

            if (product.stock < item.quantity) {
                await connection.rollback();
                return res.status(400).json({
                    error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                });
            }

            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;

            orderItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: product.price
            });

            // Update stock
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Create order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
            [userId, totalPrice, 'confirmed']
        );

        const orderId = orderResult.insertId;

        // Create order items
        for (const item of orderItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: 'Order created successfully',
            orderId,
            totalPrice
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Server error creating order' });
    } finally {
        connection.release();
    }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const [orders] = await db.query(
            `SELECT o.*, 
                    GROUP_CONCAT(
                        CONCAT(p.name, ' (x', oi.quantity, ')')
                        SEPARATOR ', '
                    ) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE o.user_id = ?
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [userId]
        );

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Server error fetching orders' });
    }
});

module.exports = router;
