// API Base URL
const API_URL = 'http://localhost:5000/api';

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let token = localStorage.getItem('token') || null;
let user = JSON.parse(localStorage.getItem('user')) || null;
let products = [];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const productModal = document.getElementById('product-modal');
const cartModal = document.getElementById('cart-modal');
const authModal = document.getElementById('auth-modal');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartUI();
    updateAuthUI();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Cart
    document.getElementById('cart-btn').addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });
    document.getElementById('close-cart').addEventListener('click', closeCartModal);
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

    // Auth
    document.getElementById('auth-btn').addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal();
    });
    document.getElementById('close-auth').addEventListener('click', closeAuthModal);
    document.getElementById('toggle-auth').addEventListener('click', toggleAuthForms);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // Close modals on outside click
    [productModal, cartModal, authModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Load Products from API
async function loadProducts() {
    try {
        console.log('Fetching products from:', `${API_URL}/products`);
        const response = await fetch(`${API_URL}/products`);
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Products loaded:', data);
        products = data;
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted);">Failed to load products. Please try again later.<br><small>Error: ${error.message}</small></p>`;
    }
}

// Display Products
function displayProducts(productsArray) {
    productsContainer.innerHTML = productsArray.map((product, index) => `
        <div class="glass-card product-card" style="animation: fadeInUp 0.5s ease ${index * 0.1}s both;">
            <img src="${product.image_url}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="flex" style="justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <span class="product-price">$${parseFloat(product.price).toFixed(2)}</span>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
                <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">
                    ${product.stock} in stock
                </p>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    const existingItem = cart.find(item => item.product_id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Maximum stock reached!', 'warning');
            return;
        }
    } else {
        cart.push({
            product_id: productId,
            name: product.name,
            price: parseFloat(product.price),
            quantity: 1,
            image_url: product.image_url
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification(`${product.name} added to cart!`, 'success');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    openCartModal(); // Refresh cart display
}

// Update Cart Quantity
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.product_id === productId);
    const product = products.find(p => p.id === productId);

    if (!item || !product) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else if (item.quantity > product.stock) {
        item.quantity = product.stock;
        showNotification('Maximum stock reached!', 'warning');
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        openCartModal(); // Refresh cart display
    }
}

// Update Cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Open Cart Modal
function openCartModal() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = 'Total: $0.00';
    } else {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="glass-card" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                <img src="${item.image_url}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.5rem;">
                <div style="flex: 1;">
                    <h4>${item.name}</h4>
                    <p style="color: var(--primary); font-weight: 600;">$${item.price.toFixed(2)}</p>
                </div>
                <div class="flex gap-2" style="align-items: center;">
                    <button class="btn btn-outline" style="padding: 0.5rem 1rem;" onclick="updateCartQuantity(${item.product_id}, -1)">-</button>
                    <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                    <button class="btn btn-outline" style="padding: 0.5rem 1rem;" onclick="updateCartQuantity(${item.product_id}, 1)">+</button>
                    <button class="btn btn-secondary" style="padding: 0.5rem 1rem;" onclick="removeFromCart(${item.product_id})">🗑️</button>
                </div>
            </div>
        `).join('');

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    cartModal.classList.add('active');
}

// Close Cart Modal
function closeCartModal() {
    cartModal.classList.remove('active');
}

// Handle Checkout
async function handleCheckout() {
    if (!token) {
        closeCartModal();
        openAuthModal();
        showNotification('Please login to checkout', 'warning');
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    try {
        const orderItems = cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }));

        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items: orderItems })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification(`Order #${data.orderId} created successfully! Total: $${data.totalPrice.toFixed(2)}`, 'success');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            closeCartModal();
            loadProducts(); // Refresh products to update stock
        } else {
            showNotification(data.error || 'Checkout failed', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('An error occurred during checkout', 'error');
    }
}

// Auth Functions
function openAuthModal() {
    authModal.classList.add('active');
}

function closeAuthModal() {
    authModal.classList.remove('active');
}

function toggleAuthForms(e) {
    e.preventDefault();
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTitle = document.getElementById('auth-title');
    const toggleLink = document.getElementById('toggle-auth');

    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        authTitle.textContent = 'Login';
        toggleLink.textContent = "Don't have an account? Register";
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        authTitle.textContent = 'Register';
        toggleLink.textContent = 'Already have an account? Login';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            user = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            updateAuthUI();
            closeAuthModal();
            showNotification(`Welcome back, ${user.username}!`, 'success');
            document.getElementById('login-form').reset();
        } else {
            showNotification(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('An error occurred during login', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            user = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            updateAuthUI();
            closeAuthModal();
            showNotification(`Welcome, ${user.username}!`, 'success');
            document.getElementById('register-form').reset();
        } else {
            showNotification(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('An error occurred during registration', 'error');
    }
}

function logout() {
    token = null;
    user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
}

function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    if (user) {
        authBtn.textContent = `👤 ${user.username}`;
        authBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm('Do you want to logout?')) {
                logout();
            }
        };
    } else {
        authBtn.textContent = 'Login';
        authBtn.onclick = (e) => {
            e.preventDefault();
            openAuthModal();
        };
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--gradient-3)' : type === 'error' ? 'var(--gradient-2)' : 'var(--gradient-1)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 300px;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
