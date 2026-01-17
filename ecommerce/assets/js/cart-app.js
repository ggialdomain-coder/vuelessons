/**
 * Cart Page Vue App Instance
 * Shopping Cart Application
 */

// Main Vue App
const { createApp } = Vue;

// Debug: Verify components are available
console.log('Header component available:', typeof Header !== 'undefined');
console.log('Footer component available:', typeof Footer !== 'undefined');

const app = createApp({
    data() {
        return {
            cartItems: [],
            loading: false,
            cartCount: 0,
            currentPage: 'cart',
            logoImage: '', // Set to your logo image path, e.g., 'assets/images/logo.png'
            isLoggedIn: false,
            userEmail: '',
            userData: {},
            showAccountSidebar: false
        };
    },
    components: {
        'header-component': Header,
        'footer-component': Footer,
        'account-sidebar': AccountSidebar
    },
    computed: {
        subtotal() {
            return this.cartItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
        },
        tax() {
            // Calculate 10% tax
            return this.subtotal * 0.1;
        },
        total() {
            return this.subtotal + this.tax;
        }
    },
    mounted() {
        this.loadCartFromStorage();
        this.checkAuthStatus();
    },
    methods: {
        /**
         * Check authentication status
         */
        checkAuthStatus() {
            const userData = localStorage.getItem('shopvue_user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    this.isLoggedIn = true;
                    this.userEmail = user.email;
                    this.userData = user;
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
        },

        /**
         * Open account sidebar
         */
        openAccountSidebar() {
            this.showAccountSidebar = true;
        },

        /**
         * Close account sidebar
         */
        closeAccountSidebar() {
            this.showAccountSidebar = false;
        },

        /**
         * Handle navigate to account page
         */
        handleNavigateAccount(tab) {
            window.location.href = `account.html?tab=${tab}`;
        },

        /**
         * Load cart from localStorage
         */
        loadCartFromStorage() {
            const savedCart = localStorage.getItem('shopvue_cart');
            if (savedCart) {
                try {
                    this.cartItems = JSON.parse(savedCart);
                    this.cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
                } catch (e) {
                    console.error('Error loading cart from storage:', e);
                    this.cartItems = [];
                }
            }
        },

        /**
         * Save cart to localStorage
         */
        saveCartToStorage() {
            localStorage.setItem('shopvue_cart', JSON.stringify(this.cartItems));
            this.cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
        },

        /**
         * Update item quantity
         * @param {Object} item - Cart item
         * @param {number} quantity - New quantity
         */
        updateQuantity(item, quantity) {
            const cartItem = this.cartItems.find(i => i.id === item.id);
            if (cartItem) {
                if (quantity <= 0) {
                    this.removeItem(item);
                } else {
                    cartItem.quantity = quantity;
                    this.saveCartToStorage();
                }
            }
        },

        /**
         * Remove item from cart
         * @param {Object} item - Cart item to remove
         */
        removeItem(item) {
            this.cartItems = this.cartItems.filter(i => i.id !== item.id);
            this.saveCartToStorage();
        },

        /**
         * Clear entire cart
         */
        clearCart() {
            if (confirm('Are you sure you want to clear your cart?')) {
                this.cartItems = [];
                this.saveCartToStorage();
            }
        },

        /**
         * Format price
         * @param {number} price - Price to format
         */
        formatPrice(price) {
            return parseFloat(price).toFixed(2);
        },

        /**
         * Handle image error
         */
        handleImageError(event) {
            event.target.src = 'https://via.placeholder.com/100x100?text=Product';
        },

        /**
         * Handle navigation
         * @param {string} page - Page name
         */
        handleNavigate(page) {
            console.log('Navigate to:', page);
            this.currentPage = page;
            if (page === 'home') {
                window.location.href = 'index.html';
            } else if (page === 'products') {
                window.location.href = 'products.html';
            } else if (page === 'cart') {
                window.location.href = 'cart.html';
            }
        },

        /**
         * Handle search
         * @param {string} query - Search query
         */
        handleSearch(query) {
            console.log('Search:', query);
            if (query && query.trim()) {
                window.location.href = `search.html?q=${encodeURIComponent(query.trim())}`;
            }
        },

        /**
         * Handle social media click
         * @param {string} platform - Social media platform
         */
        handleSocialClick(platform) {
            console.log('Social click:', platform);
            // TODO: Open social media links
        },

        /**
         * Handle login
         */
        handleLogin() {
            console.log('Navigate to login page');
            window.location.href = 'auth.html?return=cart.html';
        },

        /**
         * Handle logout
         */
        handleLogout() {
            localStorage.removeItem('shopvue_user');
            localStorage.removeItem('shopvue_remember_me');
            this.isLoggedIn = false;
            this.userEmail = '';
            console.log('User logged out');
            // Redirect to home page after logout
            window.location.href = 'index.html';
        },

        /**
         * Handle change delivery address
         */
        handleChangeAddress() {
            console.log('Change delivery address');
            // TODO: Open address selection modal or navigate to address page
        },

        /**
         * Proceed to checkout
         */
        proceedToCheckout() {
            if (this.cartItems.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        }
    }
});

// Mount the app
app.mount('#app');

