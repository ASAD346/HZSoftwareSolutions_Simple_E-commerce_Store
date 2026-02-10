-- Postgres Schema for E-commerce

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT,
    price DECIMAL(10, 2)
);

-- Seed some products
INSERT INTO products (name, description, price, image_url, stock) VALUES
('Cyberpunk Headphones', 'Next-gen audio with neon lighting.', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 50),
('Aura Keypad', 'Mechanical keyboard with customizable aura sync.', 129.50, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80', 30),
('Void Mouse', 'Ultralight gaming mouse with 25k DPI sensor.', 89.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', 100),
('Nebula Lens', 'VR headset for immersive spatial computing.', 499.00, 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80', 15),
('Prism Desk Mat', 'Large desk mat with RGB edge lighting.', 35.00, 'https://images.unsplash.com/photo-1625842268584-8f3bf9ff16a1?w=800&q=80', 200);
