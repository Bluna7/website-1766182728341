
// E-commerce JavaScript Functionality
let cart = [];
let cartTotal = 0;

// Product data
const products = [
  {
    "name": "Sample Product 1",
    "price": "29.99",
    "description": "High-quality product with great features",
    "image": "/placeholder.jpg"
  },
  {
    "name": "Sample Product 2",
    "price": "49.99",
    "description": "Premium product for discerning customers",
    "image": "/placeholder.jpg"
  },
  {
    "name": "Sample Product 3",
    "price": "19.99",
    "description": "Affordable option without compromising quality",
    "image": "/placeholder.jpg"
  }
];

// Add item to cart
function addToCart(productId, name, price) {
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: name,
      price: parseFloat(price),
      quantity: 1
    });
  }
  
  updateCartUI();
  showCartNotification(name + ' added to cart!');
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

// Update cart UI
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotalElement = document.getElementById('cart-total');
  
  // Calculate total
  cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart total
  cartTotalElement.textContent = cartTotal.toFixed(2);
  
  // Update cart items
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Qty: ${item.quantity}</p>
        </div>
        <div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <button onclick="removeFromCart(${item.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px;">Remove</button>
        </div>
      </div>
    `).join('');
  }
}

// Toggle cart sidebar
function toggleCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  cartSidebar.classList.toggle('open');
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartToggle = document.querySelector('.cart-toggle');
  
  if (!cartSidebar.contains(event.target) && !cartToggle.contains(event.target)) {
    cartSidebar.classList.remove('open');
  }
});

// Show cart notification
function showCartNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 6px;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.style.opacity = '1', 100);
  
  // Hide and remove notification
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 2000);
}

// PayPal Integration
function initiatePayPalCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Initialize PayPal button
  const paypalContainer = document.getElementById('paypal-button-container');
  paypalContainer.style.display = 'block';
  paypalContainer.innerHTML = '';
  
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: cartTotal.toFixed(2)
          },
          description: 'Purchase from My Professional Website'
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name);
        // Clear cart after successful payment
        cart = [];
        updateCartUI();
        toggleCart();
        paypalContainer.style.display = 'none';
      });
    },
    onError: function(err) {
      console.error('PayPal Checkout Error:', err);
      alert('Payment failed. Please try again.');
    }
  }).render('#paypal-button-container');
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartUI();
  
  // Load PayPal SDK
  const paypalScript = document.createElement('script');
  paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD';
  document.head.appendChild(paypalScript);
});
