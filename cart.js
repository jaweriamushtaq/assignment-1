// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderCartItems();
    updateCartSummary();
});

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        // Keep the empty cart message
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="img-fluid rounded me-3" width="80" alt="${item.name}">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">SKU: ${item.id}</small>
                    </div>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="input-group quantity-selector" style="max-width: 120px;">
                    <button class="btn btn-outline-secondary decrease" type="button" data-id="${item.id}">-</button>
                    <input type="number" class="form-control text-center quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="btn btn-outline-secondary increase" type="button" data-id="${item.id}">+</button>
                </div>
            </td>
            <td>
                <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const newQuantity = parseInt(this.value) || 1;
            setCartItemQuantity(productId, newQuantity);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    // Update item count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('item-count').textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    renderCartItems();
    updateCartSummary();
    updateCartCount();
}

// Set cart item quantity
function setCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    item.quantity = quantity;
    saveCart();
    renderCartItems();
    updateCartSummary();
    updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartSummary();
    updateCartCount();
    
    // Show empty cart message if no items left
    if (cart.length === 0) {
        document.getElementById('cart-items').innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-5">
                    <div class="py-4">
                        <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                        <h5>Your cart is empty</h5>
                        <p class="text-muted">Browse our products and add items to your cart</p>
                        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
    const tax = subtotal * 0.1; // 10% tax
    const discount = 0; // Could be calculated from coupons
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
    document.getElementById('total').textContent = `$${(subtotal + shipping + tax - discount).toFixed(2)}`;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}