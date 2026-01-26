CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Seed some products
INSERT INTO products (name, description, price, image_url, stock) VALUES
('Cyberpunk Headphones', 'Next-gen audio with neon lighting.', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 50),
('Aura Keypad', 'Mechanical keyboard with customizable aura sync.', 129.50, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80', 30),
('Void Mouse', 'Ultralight gaming mouse with 25k DPI sensor.', 89.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', 100),
('Nebula Lens', 'VR headset for immersive spatial computing.', 499.00, 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80', 15),
('Prism Desk Mat', 'Large desk mat with RGB edge lighting.', 35.00, 'https://images.unsplash.com/photo-1625842268584-8f3bf9ff16a1?w=800&q=80', 200);
