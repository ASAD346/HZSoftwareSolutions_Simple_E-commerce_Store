# Premium E-Commerce Store - Deployment Guide (Supabase + Netlify)

## Tech Stack
- **Backend**: Node.js, Express (Serverless compatible)
- **Database**: PostgreSQL (Supabase)
- **Frontend**: Vanilla JS, Glassmorphism CSS
- **Deployment**: Netlify (Functions + Static Hosting)

## Setup Instructions for Live Deployment

### 1. Supabase (Database) Setup
1. Create a project on [Supabase.com](https://supabase.com).
2. Go to the **SQL Editor**.
3. Copy the contents of `schema_postgres.sql` from this repo and run it.
4. Go to **Settings -> Database** and copy your **URI** connection string.

### 2. Netlify (Hosting) Setup
1. Create a site on [Netlify](https://netlify.com) from your Git repository.
2. Go to **Site Settings -> Environment Variables**.
3. Add the following variables:
   - `DATABASE_URL`: Your Supabase connection URI.
   - `JWT_SECRET`: A long random string (e.g., `supersecretkey123`).
   - `PORT`: `5000` (optional, used for local testing).

## Local Development
1. Install dependencies: `npm install`
2. Create a `.env` file with `DATABASE_URL` and `JWT_SECRET`.
3. Run the server: `npm run dev`

## Features
✅ **PostgreSQL Powered**: High-performance, reliable relational data.
✅ **Serverless Ready**: Fully optimized for Netlify Functions.
✅ **Cyberpunk UI**: Ultra-premium glassmorphism design.
✅ **Secure**: JWT-based auth and bcrypt password hashing.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products

### Orders
- `POST /api/orders` - Create order (Auth required)
- `GET /api/orders/my-orders` - Order history (Auth required)
