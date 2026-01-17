/**
 * Search Page Vue App Instance
 * Product Search Application
 */

// Main Vue App
const { createApp } = Vue;

// Debug: Verify components are available
console.log('Header component available:', typeof Header !== 'undefined');
console.log('Footer component available:', typeof Footer !== 'undefined');
console.log('ProductCard component available:', typeof ProductCard !== 'undefined');
console.log('ProductModal component available:', typeof ProductModal !== 'undefined');
console.log('CartSidebar component available:', typeof CartSidebar !== 'undefined');
console.log('AccountSidebar component available:', typeof AccountSidebar !== 'undefined');

const app = createApp({
    data() {
        return {
            searchQuery: '',
            searchResults: [],
            allProducts: [],
            loading: false,
            error: null,
            cartItems: [],
            cartCount: 0,
            currentPage: 'search',
            logoImage: '',
            isLoggedIn: false,
            userEmail: '',
            userData: {},
            showModal: false,
            selectedProduct: null,
            showCartSidebar: false,
            showAccountSidebar: false
        };
    },
    components: {
        'header-component': Header,
        'footer-component': Footer,
        'product-card': ProductCard,
        'product-modal': ProductModal,
        'cart-sidebar': CartSidebar,
        'account-sidebar': AccountSidebar
    },
    computed: {
        resultsCount() {
            return this.searchResults.length;
        }
    },
    mounted() {
        // Get search query from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        if (query) {
            this.searchQuery = query.trim();
        }
        
        // Check auth status
        this.checkAuthStatus();
        
        // Load cart from localStorage
        this.loadCartFromStorage();
        
        // Perform search if query exists
        if (this.searchQuery) {
            this.performSearch();
        }
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
         * Load cart from localStorage
         */
        loadCartFromStorage() {
            const savedCart = localStorage.getItem('shopvue_cart');
            if (savedCart) {
                try {
                    this.cartItems = JSON.parse(savedCart);
                    this.cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
                } catch (e) {
                    console.error('Error loading cart:', e);
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
         * Perform search
         */
        async performSearch() {
            if (!this.searchQuery || !this.searchQuery.trim()) {
                this.searchResults = [];
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                // Load all products first
                if (this.allProducts.length === 0) {
                    this.allProducts = await apiService.getProducts();
                }

                // Perform search using API service
                this.searchResults = await apiService.searchProducts(this.searchQuery);
            } catch (error) {
                console.error('Search error:', error);
                this.error = 'Failed to search products. Please try again later.';
                this.searchResults = [];
            } finally {
                this.loading = false;
            }
        },

        /**
         * Handle product click - show modal
         * @param {Object} product - Product object
         */
        handleProductClick(product) {
            console.log('Product clicked:', product);
            this.selectedProduct = product;
            this.showModal = true;
        },

        /**
         * Close product modal
         */
        closeModal() {
            this.showModal = false;
            this.selectedProduct = null;
        },

        /**
         * Handle add to cart
         * @param {Object} product - Product object
         */
        handleAddToCart(product) {
            console.log('Add to cart:', product);
            
            // Check if product already in cart
            const existingItem = this.cartItems.find(item => item.id === product.id);
            
            if (existingItem) {
                // Increase quantity
                existingItem.quantity++;
            } else {
                // Add new item to cart
                this.cartItems.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            // Show cart sidebar
            this.showCartSidebar = true;
            
            // Close modal
            this.closeModal();
        },

        /**
         * Update item quantity
         * @param {Object} item - Cart item
         * @param {number} quantity - New quantity
         */
        updateQuantity(item, quantity) {
            const cartItem = this.cartItems.find(i => i.id === item.id);
            if (cartItem) {
                cartItem.quantity = quantity;
                this.saveCartToStorage();
            }
        },

        /**
         * Remove item from cart
         * @param {Object} item - Cart item to remove
         */
        removeCartItem(item) {
            this.cartItems = this.cartItems.filter(i => i.id !== item.id);
            this.saveCartToStorage();
        },

        /**
         * Close cart sidebar
         */
        closeCartSidebar() {
            this.showCartSidebar = false;
        },

        /**
         * Navigate to cart page
         */
        goToCartPage() {
            window.location.href = 'cart.html';
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
            } else if (page === 'account') {
                window.location.href = 'account.html';
            } else if (page === 'auth' || page === 'login') {
                window.location.href = 'auth.html';
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
            window.location.href = 'auth.html';
        },

        /**
         * Handle logout
         */
        handleLogout() {
            localStorage.removeItem('shopvue_user');
            localStorage.removeItem('shopvue_remember_me');
            this.isLoggedIn = false;
            this.userEmail = '';
            window.location.href = 'index.html';
        },

        /**
         * Handle change delivery address
         */
        handleChangeAddress() {
            console.log('Change delivery address');
            // TODO: Open address selection modal or navigate to address page
        }
    },
    watch: {
        cartItems: {
            handler(newItems) {
                this.cartCount = newItems.reduce((total, item) => total + item.quantity, 0);
                this.saveCartToStorage();
            },
            deep: true
        }
    }
});

// Mount the app
app.mount('#app');












