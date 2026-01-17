/**
 * Main Vue App Instance
 * Ecommerce Homepage Application
 */

// Import API service
// Note: In a build system, you would use: import apiService from './services/api.js';

// Main Vue App
const { createApp } = Vue;

// Debug: Verify components are available
console.log('Header component available:', typeof Header !== 'undefined');
console.log('Footer component available:', typeof Footer !== 'undefined');
console.log('CategoryCard component available:', typeof CategoryCard !== 'undefined');

const app = createApp({
    data() {
        return {
            categories: [],
            loading: false,
            error: null,
            cartCount: 0, // TODO: Get from state management or localStorage
            currentPage: 'home',
            logoImage: '', // Set to your logo image path, e.g., 'assets/images/logo.png'
            isLoggedIn: false,
            userEmail: '',
            userData: {},
            showAccountSidebar: false,
            deliveryAddress: 'Select location',
            savedAddresses: [],
            showLocationModal: false
        };
    },
    components: {
        'header-component': Header,
        'footer-component': Footer,
        'category-card': CategoryCard,
        'account-sidebar': AccountSidebar,
        'location-selection-modal': LocationSelectionModal
    },
    mounted() {
        this.loadCategories();
        this.checkAuthStatus();
        this.loadDeliveryAddress();
        this.loadSavedAddresses();
    },
    methods: {
        /**
         * Load categories from API
         */
        async loadCategories() {
            this.loading = true;
            this.error = null;
            
            try {
                // Use the API service to fetch categories
                this.categories = await apiService.getCategories();
            } catch (error) {
                console.error('Failed to load categories:', error);
                this.error = 'Failed to load categories. Please try again later.';
            } finally {
                this.loading = false;
            }
        },

        /**
         * Handle category click
         * @param {Object} category - Category object
         */
        handleCategoryClick(category) {
            console.log('Category clicked:', category);
            // Navigate to products page with category filter
            window.location.href = `products.html?category=${category.slug}`;
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
            if (page === 'products') {
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
            
            // If user is logged in and this is a new address, optionally save it
            if (this.isLoggedIn && source === 'current' || source === 'map') {
                // Could prompt user to save this address
                console.log('Location selected:', address);
            }
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
        }
    }
});

// Mount the app
app.mount('#app');

