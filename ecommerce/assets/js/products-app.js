/**
 * Products Page Vue App Instance
 * Ecommerce Products Listing Application
 */

// Main Vue App
const { createApp } = Vue;

// Debug: Verify components are available
console.log('Header component available:', typeof Header !== 'undefined');
console.log('Footer component available:', typeof Footer !== 'undefined');
console.log('ProductCard component available:', typeof ProductCard !== 'undefined');
console.log('ProductModal component available:', typeof ProductModal !== 'undefined');
console.log('CartSidebar component available:', typeof CartSidebar !== 'undefined');

const app = createApp({
    data() {
        return {
            products: [],
            allProducts: [], // Store all products for filtering
            loading: false,
            error: null,
            cartItems: [], // Array of cart items with quantity
            cartCount: 0,
            currentPage: 'products',
            logoImage: '', // Set to your logo image path, e.g., 'assets/images/logo.png'
            selectedCategory: null, // Category slug from URL
            categoryName: null, // Category name for display
            showModal: false,
            selectedProduct: null,
            showCartSidebar: false,
            isLoggedIn: false,
            userEmail: '',
            userData: {},
            showAccountSidebar: false,
            deliveryAddress: 'Select location',
            savedAddresses: [],
            showLocationModal: false,
            sortBy: 'default' // Sorting option: 'default', 'price-low', 'price-high', 'name-asc', 'name-desc', 'discount', 'newest'
        };
    },
    components: {
        'header-component': Header,
        'footer-component': Footer,
        'product-card': ProductCard,
        'product-modal': ProductModal,
        'cart-sidebar': CartSidebar,
        'account-sidebar': AccountSidebar,
        'location-selection-modal': LocationSelectionModal
    },
    mounted() {
        // Get category from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const categorySlug = urlParams.get('category');
        
        if (categorySlug) {
            this.selectedCategory = categorySlug;
            // Get category name from slug
            this.getCategoryName(categorySlug);
        }
        
        // Load cart from localStorage
        this.loadCartFromStorage();
        
        // Check auth status
        this.checkAuthStatus();
        
        // Load delivery address
        this.loadDeliveryAddress();
        this.loadSavedAddresses();
        
        this.loadProducts();
    },
    watch: {
        cartItems: {
            handler(newItems) {
                this.cartCount = newItems.reduce((total, item) => total + item.quantity, 0);
                this.saveCartToStorage();
            },
            deep: true
        }
    },
    methods: {
        /**
         * Get category name from slug
         * @param {string} slug - Category slug
         */
        getCategoryName(slug) {
            // Map slugs to names (in a real app, this would come from API)
            const categoryMap = {
                'electronics': 'Electronics',
                'clothing': 'Clothing',
                'home-garden': 'Home & Garden',
                'sports': 'Sports',
                'books': 'Books',
                'toys-games': 'Toys & Games',
                'beauty-health': 'Beauty & Health',
                'automotive': 'Automotive'
            };
            this.categoryName = categoryMap[slug] || slug;
        },

        /**
         * Load products from API
         */
        async loadProducts() {
            this.loading = true;
            this.error = null;
            
            try {
                // Load all products first
                this.allProducts = await apiService.getProducts();
                
                // Filter by category if one is selected
                if (this.selectedCategory) {
                    this.products = this.allProducts.filter(
                        product => product.category === this.selectedCategory
                    );
                } else {
                    this.products = this.allProducts;
                }
                
                // Apply sorting
                this.applySort();
            } catch (error) {
                console.error('Failed to load products:', error);
                this.error = 'Failed to load products. Please try again later.';
            } finally {
                this.loading = false;
            }
        },

        /**
         * Apply sorting to products
         */
        applySort() {
            if (!this.products || this.products.length === 0) {
                return;
            }

            // Create a copy of the products array to avoid mutating the original
            let sortedProducts = [...this.products];

            switch (this.sortBy) {
                case 'price-low':
                    sortedProducts.sort((a, b) => {
                        const priceA = parseFloat(a.price) || 0;
                        const priceB = parseFloat(b.price) || 0;
                        return priceA - priceB;
                    });
                    break;

                case 'price-high':
                    sortedProducts.sort((a, b) => {
                        const priceA = parseFloat(a.price) || 0;
                        const priceB = parseFloat(b.price) || 0;
                        return priceB - priceA;
                    });
                    break;

                case 'name-asc':
                    sortedProducts.sort((a, b) => {
                        const nameA = (a.name || '').toLowerCase();
                        const nameB = (b.name || '').toLowerCase();
                        return nameA.localeCompare(nameB);
                    });
                    break;

                case 'name-desc':
                    sortedProducts.sort((a, b) => {
                        const nameA = (a.name || '').toLowerCase();
                        const nameB = (b.name || '').toLowerCase();
                        return nameB.localeCompare(nameA);
                    });
                    break;

                case 'discount':
                    sortedProducts.sort((a, b) => {
                        const discountA = parseFloat(a.discount) || 0;
                        const discountB = parseFloat(b.discount) || 0;
                        return discountB - discountA; // Highest discount first
                    });
                    break;

                case 'newest':
                    // Sort by ID descending (assuming higher ID = newer)
                    sortedProducts.sort((a, b) => {
                        return (b.id || 0) - (a.id || 0);
                    });
                    break;

                case 'default':
                default:
                    // Keep original order (no sorting)
                    break;
            }

            this.products = sortedProducts;
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
                    // Reload addresses after auth check
                    this.loadSavedAddresses();
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
        },

        /**
         * Handle add to cart
         * @param {Object} product - Product object
         */
        async handleAddToCart(product) {
            console.log('Add to cart:', product);
            
            // Check if product already in cart
            const existingItem = this.cartItems.find(item => item.id === product.id);
            
            if (existingItem) {
                // Increase quantity
                existingItem.quantity++;
                
                // Sync to backend if logged in
                if (this.isLoggedIn) {
                    try {
                        // Find cart item ID from backend
                        const backendCart = await apiService.getCart();
                        const backendItem = backendCart.find(item => item.product.id === product.id);
                        if (backendItem) {
                            await apiService.updateCartItem(backendItem.id, existingItem.quantity);
                        } else {
                            await apiService.addToCart(product.id, existingItem.quantity);
                        }
                    } catch (error) {
                        console.error('Failed to sync cart to backend:', error);
                        // Continue with localStorage
                    }
                }
            } else {
                // Add new item to cart
                this.cartItems.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                
                // Sync to backend if logged in
                if (this.isLoggedIn) {
                    try {
                        await apiService.addToCart(product.id, 1);
                    } catch (error) {
                        console.error('Failed to sync cart to backend:', error);
                        // Continue with localStorage
                    }
                }
            }
            
            // Save to localStorage
            this.saveCartToStorage();
            
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
            }
        },

        /**
         * Remove item from cart
         * @param {Object} item - Cart item to remove
         */
        removeCartItem(item) {
            this.cartItems = this.cartItems.filter(i => i.id !== item.id);
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
         * Handle navigation
         * @param {string} page - Page name
         */
        handleNavigate(page) {
            console.log('Navigate to:', page);
            this.currentPage = page;
            // TODO: Implement routing when Vue Router is added
            // Example: this.$router.push(`/${page}`);
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
            console.log('User logged out');
            // Redirect to home page after logout
            window.location.href = 'index.html';
        },

        /**
         * Handle change delivery address
         */
        /**
         * Load delivery address from localStorage
         */
        loadDeliveryAddress() {
            const savedAddress = localStorage.getItem('shopvue_delivery_address');
            if (savedAddress) {
                try {
                    const address = JSON.parse(savedAddress);
                    this.deliveryAddress = this.formatDeliveryAddress(address);
                } catch (e) {
                    console.error('Error loading delivery address:', e);
                }
            }
        },

        /**
         * Load saved addresses for logged in user
         */
        loadSavedAddresses() {
            if (this.isLoggedIn && this.userData.email) {
                const savedAddresses = localStorage.getItem(`shopvue_addresses_${this.userData.email}`);
                if (savedAddresses) {
                    try {
                        this.savedAddresses = JSON.parse(savedAddresses);
                    } catch (e) {
                        console.error('Error loading saved addresses:', e);
                        this.savedAddresses = [];
                    }
                }
            }
        },

        /**
         * Format address for display in header
         */
        formatDeliveryAddress(address) {
            if (typeof address === 'string') {
                return address;
            }
            const parts = [];
            if (address.city) parts.push(address.city);
            if (address.state) parts.push(address.state);
            if (address.country) parts.push(address.country);
            if (parts.length === 0 && address.address) {
                return address.address.substring(0, 30) + (address.address.length > 30 ? '...' : '');
            }
            return parts.join(', ') || 'Select location';
        },

        /**
         * Handle change delivery address - open location modal
         */
        handleChangeAddress() {
            this.showLocationModal = true;
        },

        /**
         * Handle location selected from modal
         */
        handleLocationSelected(data) {
            const { address, source } = data;
            
            // Save to localStorage
            localStorage.setItem('shopvue_delivery_address', JSON.stringify(address));
            
            // Update display
            this.deliveryAddress = this.formatDeliveryAddress(address);
        },

        /**
         * Handle add new address from location modal
         */
        handleAddNewAddress() {
            window.location.href = 'address-form.html';
        },

        /**
         * Close location modal
         */
        closeLocationModal() {
            this.showLocationModal = false;
        },

        /**
         * Clear category filter and show all products
         */
        clearCategory() {
            window.location.href = 'products.html';
        }
    }
});

// Mount the app
app.mount('#app');

