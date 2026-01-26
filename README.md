# E-Commerce Store Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)

## Setup Instructions

### 1. Database Setup

**Option A: Using MySQL Command Line**
```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source schema.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open the `schema.sql` file
4. Execute the script

### 2. Configure Environment Variables

Edit the `.env` file with your MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=supersecretkey123
```

### 3. Start the Server

```bash
npm start
```

The server will start at `http://localhost:5000`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## Features

✅ **User Authentication**
- Register new accounts
- Login with JWT token authentication
- Secure password hashing with bcrypt

✅ **Product Browsing**
- View all available products
- See product details, prices, and stock
- Real-time stock updates

✅ **Shopping Cart**
- Add/remove products
- Adjust quantities
- Persistent cart (localStorage)

✅ **Order Processing**
- Secure checkout with authentication
- Stock validation
- Transaction-based order creation

✅ **Premium UI/UX**
- Glassmorphism design
- Smooth animations
- Responsive layout
- Cyberpunk neon aesthetics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Orders
- `POST /api/orders` - Create new order (requires auth)
- `GET /api/orders/my-orders` - Get user's orders (requires auth)

### Health Check
- `GET /api/health` - Server health status

## Troubleshooting

**Database Connection Error:**
- Verify MySQL is running
- Check credentials in `.env`
- Ensure `ecommerce_db` database exists

**Port Already in Use:**
- Change `PORT` in `.env` to another port (e.g., 5001)

**Products Not Loading:**
- Verify schema.sql was executed
- Check browser console for errors
- Ensure server is running

## Default Test Products

The database comes pre-seeded with 5 premium tech products:
1. Cyberpunk Headphones - $199.99
2. Aura Keypad - $129.50
3. Void Mouse - $89.00
4. Nebula Lens - $499.00
5. Prism Desk Mat - $35.00
