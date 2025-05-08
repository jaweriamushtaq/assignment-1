// Sample product data (in a real app, this would come from an API)
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        originalPrice: 129.99,
        image: "https://plus.unsplash.com/premium_photo-1679513691485-711d030f7e94?q=80&w=1413&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        rating: 4.5,
        badge: "Bestseller",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1655215920713-94440bf7213f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        rating: 4.2,
        badge: "New",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Compact Digital Camera",
        price: 349.99,
        originalPrice: 399.99,
        image: "https://cdn.pixabay.com/photo/2014/12/27/15/31/camera-581126_960_720.jpg",
        rating: 4.7,
        badge: "Sale",
        category: "Electronics"
    },
    {
        id: 4,
        name: "Noise Cancelling Headphones",
        price: 299.99,
        originalPrice: 349.99,
        image: "https://cdn.pixabay.com/photo/2020/05/30/09/36/boy-5238269_960_720.jpg",
        rating: 4.8,
        badge: "Limited",
        category: "Electronics"
    },
    {
        id: 5,
        name: "Ultra HD Smart TV",
        price: 899.99,
        originalPrice: 1099.99,
        image: "https://images.unsplash.com/photo-1737253293076-7b40c63fd8ca?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        rating: 4.9,
        badge: "Hot",
        category: "Electronics"
    },
    {
        id: 6,
        name: "Gaming Laptop",
        price: 1299.99,
        originalPrice: 1499.99,
        image: "https://plus.unsplash.com/premium_photo-1677870728119-52aef052d7ef?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        rating: 4.6,
        badge: "Special",
        category: "Electronics"
    }
];

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderFeaturedProducts();
    updateCartCount();
});

// Render featured products
function renderFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    
    // Get first 6 products (or all if less than 6)
    const featuredProducts = products.slice(0, 6);
    
    featuredProductsContainer.innerHTML = featuredProducts.map(product => `
        <div class="col-md-4 col-lg-4 col-6">
            <div class="product-card h-100">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${renderRating(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <div class="product-actions d-grid gap-2">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-secondary">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Render star rating
function renderRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart`);
}

// Update cart count in navbar
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'position-fixed bottom-0 end-0 p-3';
    notification.style.zIndex = '11';
    
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.role = 'alert';
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="toast-header bg-success text-white">
            <strong class="me-auto">Success</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body bg-white">
            ${message}
        </div>
    `;
    
    notification.appendChild(toast);
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}