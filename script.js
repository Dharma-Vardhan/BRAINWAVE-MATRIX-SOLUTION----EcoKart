// DOM Elements
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCart = document.querySelector('.close-cart');
const continueShopping = document.querySelector('.continue-shopping');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.total');
const cartSubtotal = document.querySelector('.subtotal');
const toast = document.querySelector('.toast');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const searchBox = document.querySelector('.search-box input');

// Product Data
const products = [
    {
        id: 1,
        title: "Bamboo Toothbrush",
        price: 5.99,
        oldPrice: 7.99,
        image: "assets/images/bamboo-toothbrush.jpg",
        category: "bamboo",
        badge: "Bestseller"
    },
    {
        id: 2,
        title: "Reusable Shopping Bag",
        price: 12.99,
        image: "assets/images/reusable-bag.jpg",
        category: "reusable"
    },
    {
        id: 3,
        title: "Organic Cotton Towels",
        price: 24.99,
        oldPrice: 29.99,
        image: "assets/images/organic-towels.jpg",
        category: "organic",
        badge: "Sale"
    },
    {
        id: 4,
        title: "Bamboo Cutlery Set",
        price: 15.99,
        image: "assets/images/bamboo-cutlery.jpg",
        category: "bamboo"
    },
    {
        id: 5,
        title: "Stainless Steel Straws",
        price: 8.99,
        image: "assets/images/reusable-straws.jpg",
        category: "reusable"
    },
    {
        id: 6,
        title: "Organic Soap Bars",
        price: 4.99,
        oldPrice: 6.99,
        image: "assets/images/organic-soap.jpg",
        category: "organic",
        badge: "Sale"
    },
    {
        id: 7,
        title: "Bamboo Hairbrush",
        price: 14.99,
        image: "assets/images/bamboo-hairbrush.jpg",
        category: "bamboo"
    },
    {
        id: 8,
        title: "Reusable Water Bottle",
        price: 18.99,
        image: "assets/images/reusable-bottle.jpg",
        category: "reusable"
    }
];

// Cart Array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display Products
function displayProducts(filter = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : filter === 'sale'
        ? products.filter(product => product.oldPrice)
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to new buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Filter Products
filterBtns.forEach(button => {
    button.addEventListener('click', () => {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayProducts(button.dataset.filter);
    });
});

// Add to Cart
function addToCart(e) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find(item => item.id === id);
    
    // Check if product already in cart
    const inCart = cart.find(item => item.id === id);
    
    if (inCart) {
        // Increase quantity
        cart = cart.map(item => 
            item.id === id ? {...item, qty: item.qty + 1} : item
        );
    } else {
        // Add new item
        cart.push({...product, qty: 1});
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCart();
    
    // Show toast
    showToast(`${product.title} added to cart`);
}

// Update Cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    cartCount.textContent = totalItems;
    
    // Update cart sidebar
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartSubtotal.textContent = '$0.00';
        cartTotal.textContent = '$0.00';
    } else {
        let subtotal = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <button class="cart-item-remove" data-id="${item.id}">Remove</button>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="cart-item-qty">${item.qty}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
            
            subtotal += item.price * item.qty;
        });
        
        // Update totals
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
    }
}

// Remove from Cart
function removeFromCart(e) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showToast('Item removed from cart');
}

// Decrease Quantity
function decreaseQuantity(e) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.map(item => 
        item.id === id ? {...item, qty: item.qty - 1} : item
    ).filter(item => item.qty > 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Increase Quantity
function increaseQuantity(e) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.map(item => 
        item.id === id ? {...item, qty: item.qty + 1} : item
    );
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Show Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Toggle Cart
function toggleCart() {
    cartOverlay.classList.toggle('active');
    cartSidebar.classList.toggle('active');
}

// Mobile Menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close cart when clicking outside
cartOverlay.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
continueShopping.addEventListener('click', toggleCart);

// Open cart when clicking cart icon
cartIcon.addEventListener('click', toggleCart);

// Search functionality
searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );
    displayFilteredProducts(filteredProducts);
});

function displayFilteredProducts(filteredProducts) {
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-results">No products found</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to new buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Initialize
displayProducts();
updateCart();

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        document.querySelector('.header').classList.add('scrolled');
    } else {
        document.querySelector('.header').classList.remove('scrolled');
    }
});
