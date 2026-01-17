/**
 * Account Page Vue App Instance
 * User Account Management Application
 */

// Main Vue App
const { createApp } = Vue;

// Debug: Verify components are available
console.log('Header component available:', typeof Header !== 'undefined');
console.log('Footer component available:', typeof Footer !== 'undefined');

const app = createApp({
    data() {
        return {
            activeTab: 'details', // 'details', 'orders', 'addresses', 'settings'
            cartCount: 0,
            currentPage: 'account',
            logoImage: '',
            isLoggedIn: false,
            userEmail: '',
            userData: {},
            cartItemCount: 0,
            orderCount: 0,
            orders: [],
            addresses: [],
            settings: {
                emailNotifications: true,
                smsNotifications: false
            },
            showAccountSidebar: false,
            deliveryAddress: 'Select location',
            savedAddresses: [],
            showLocationModal: false
        };
    },
    components: {
        'header-component': Header,
        'footer-component': Footer,
        'account-sidebar': AccountSidebar,
        'location-selection-modal': LocationSelectionModal
    },
    computed: {
        userInitials() {
            if (!this.userData.fullName) return 'U';
            const names = this.userData.fullName.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return this.userData.fullName.substring(0, 2).toUpperCase();
        }
    },
    async mounted() {
        this.checkAuthStatus();
        this.loadCartCount();
        await this.loadUserData();
        await this.loadOrders();
        await this.loadAddresses();
        this.loadSettings();
        this.loadDeliveryAddress();
        this.loadSavedAddresses();
        
        // Check if there's a tab parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab && ['details', 'orders', 'addresses', 'settings'].includes(tab)) {
            this.activeTab = tab;
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
                    // Redirect to login if data is corrupted
                    window.location.href = 'auth.html';
                }
            } else {
                // Not logged in, redirect to login
                window.location.href = 'auth.html';
            }
        },

        /**
         * Load user data from backend and localStorage
         */
        async loadUserData() {
            const token = localStorage.getItem('shopvue_access_token');
            
            // Try to load from backend if user has token
            if (token) {
                try {
                    const backendUser = await apiService.getCurrentUser();
                    if (backendUser) {
                        this.userData = {
                            id: backendUser.id,
                            email: backendUser.email,
                            username: backendUser.username,
                            fullName: `${backendUser.first_name || ''} ${backendUser.last_name || ''}`.trim() || backendUser.username,
                            phone: backendUser.phone || ''
                        };
                        // Save to localStorage
                        localStorage.setItem('shopvue_user', JSON.stringify(this.userData));
                        return; // Successfully loaded from backend
                    }
                } catch (error) {
                    console.warn('Failed to load user data from backend:', error);
                    // Fall through to localStorage
                }
            }
            
            // Fallback to localStorage
            const userData = localStorage.getItem('shopvue_user');
            if (userData) {
                try {
                    this.userData = JSON.parse(userData);
                } catch (e) {
                    console.error('Error loading user data:', e);
                }
            }

            // Also try to get from users list for complete data
            const users = JSON.parse(localStorage.getItem('shopvue_users') || '[]');
            const fullUserData = users.find(u => u.email === this.userData.email);
            if (fullUserData) {
                this.userData = { ...this.userData, ...fullUserData };
            }
        },

        /**
         * Load cart count from localStorage
         */
        loadCartCount() {
            const savedCart = localStorage.getItem('shopvue_cart');
            if (savedCart) {
                try {
                    const cartItems = JSON.parse(savedCart);
                    this.cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
                    this.cartItemCount = cartItems.length;
                } catch (e) {
                    console.error('Error loading cart:', e);
                }
            }
        },

        /**
         * Load orders from backend and localStorage
         */
        async loadOrders() {
            const token = localStorage.getItem('shopvue_access_token');
            
            // Try to load from backend if user is logged in with token
            if (this.isLoggedIn && token) {
                try {
                    const backendOrders = await apiService.getOrders();
                    if (backendOrders && backendOrders.length > 0) {
                        // Transform backend orders to frontend format
                        this.orders = backendOrders.map(order => ({
                            id: order.id,
                            order_number: order.order_number,
                            userEmail: this.userData.email,
                            items: order.items || [],
                            deliveryAddress: order.delivery_address || {},
                            subtotal: parseFloat(order.subtotal),
                            tax: parseFloat(order.subtotal) * 0.05, // 5% tax
                            total: parseFloat(order.total),
                            status: order.status,
                            paymentMethod: order.payment_method,
                            timestamp: order.created_at
                        }));
                        this.orderCount = this.orders.length;
                        return; // Successfully loaded from backend
                    }
                } catch (error) {
                    console.warn('Failed to load orders from backend:', error);
                    // Fall through to localStorage
                }
            }
            
            // Fallback to localStorage
            const savedOrders = localStorage.getItem('shopvue_orders');
            if (savedOrders) {
                try {
                    const allOrders = JSON.parse(savedOrders);
                    // Filter orders for current user
                    this.orders = allOrders.filter(order => order.userEmail === this.userData.email);
                    this.orderCount = this.orders.length;
                } catch (e) {
                    console.error('Error loading orders:', e);
                    this.orders = [];
                }
            }
        },

        /**
         * Load addresses from backend and localStorage
         */
        async loadAddresses() {
            const token = localStorage.getItem('shopvue_access_token');
            
            // Try to load from backend if user is logged in with token
            if (this.isLoggedIn && token) {
                try {
                    const backendAddresses = await apiService.getAddresses();
                    if (backendAddresses && backendAddresses.length > 0) {
                        // Transform backend addresses to frontend format
                        this.addresses = backendAddresses.map(addr => ({
                            id: addr.id,
                            fullName: addr.full_name,
                            phone: addr.phone,
                            address: addr.address,
                            city: addr.city,
                            state: addr.state,
                            zipCode: addr.zip_code,
                            country: addr.country,
                            addressType: addr.address_type,
                            isDefault: addr.is_default,
                            lat: addr.lat ? parseFloat(addr.lat) : null,
                            lng: addr.lng ? parseFloat(addr.lng) : null
                        }));
                        return; // Successfully loaded from backend
                    }
                } catch (error) {
                    console.warn('Failed to load addresses from backend:', error);
                    // Fall through to localStorage
                }
            }
            
            // Fallback to localStorage
            const savedAddresses = localStorage.getItem(`shopvue_addresses_${this.userData.email}`);
            if (savedAddresses) {
                try {
                    this.addresses = JSON.parse(savedAddresses);
                } catch (e) {
                    console.error('Error loading addresses:', e);
                    this.addresses = [];
                }
            }

            // Also check if there's a saved delivery address
            const savedDeliveryAddress = localStorage.getItem('shopvue_delivery_address');
            if (savedDeliveryAddress && this.addresses.length === 0) {
                try {
                    const address = JSON.parse(savedDeliveryAddress);
                    this.addresses = [address];
                } catch (e) {
                    console.error('Error loading delivery address:', e);
                }
            }
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
         * Load saved addresses for location modal
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
         * Load settings from localStorage
         */
        loadSettings() {
            const savedSettings = localStorage.getItem(`shopvue_settings_${this.userData.email}`);
            if (savedSettings) {
                try {
                    this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
                } catch (e) {
                    console.error('Error loading settings:', e);
                }
            }
        },

        /**
         * Save settings to localStorage
         */
        saveSettings() {
            localStorage.setItem(`shopvue_settings_${this.userData.email}`, JSON.stringify(this.settings));
        },

        /**
         * Format date
         */
        formatDate(dateString) {
            if (!dateString) return 'Not available';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            } catch (e) {
                return 'Not available';
            }
        },

        /**
         * Format price
         */
        formatPrice(price) {
            return parseFloat(price).toFixed(2);
        },

        /**
         * View order details
         */
        viewOrder(order) {
            console.log('View order:', order);
            // TODO: Show order details modal or navigate to order detail page
            alert(`Order #${order.id}\nDate: ${this.formatDate(order.timestamp)}\nTotal: ${this.formatPrice(order.total)} KWD\nItems: ${order.items.length}`);
        },

        /**
         * Add new address
         */
        addNewAddress() {
            window.location.href = 'address-form.html';
        },

        /**
         * Edit address
         */
        editAddress(address, index) {
            window.location.href = `address-form.html?index=${index}`;
        },

        /**
         * Delete address
         */
        deleteAddress(index) {
            if (confirm('Are you sure you want to delete this address?')) {
                this.addresses.splice(index, 1);
                localStorage.setItem(`shopvue_addresses_${this.userData.email}`, JSON.stringify(this.addresses));
            }
        },

        /**
         * Change password
         */
        changePassword() {
            console.log('Change password');
            // TODO: Show change password modal
            alert('Change password functionality coming soon!');
        },

        /**
         * Delete account
         */
        deleteAccount() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
                    // Remove user data
                    const users = JSON.parse(localStorage.getItem('shopvue_users') || '[]');
                    const updatedUsers = users.filter(u => u.email !== this.userData.email);
                    localStorage.setItem('shopvue_users', JSON.stringify(updatedUsers));
                    
                    // Remove user session
                    localStorage.removeItem('shopvue_user');
                    localStorage.removeItem('shopvue_remember_me');
                    
                    // Remove user-specific data
                    localStorage.removeItem(`shopvue_addresses_${this.userData.email}`);
                    localStorage.removeItem(`shopvue_settings_${this.userData.email}`);
                    
                    // Redirect to home
                    alert('Your account has been deleted.');
                    window.location.href = 'index.html';
                }
            }
        },

        /**
         * Handle navigation
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
         */
        handleSearch(query) {
            console.log('Search:', query);
            if (query && query.trim()) {
                window.location.href = `search.html?q=${encodeURIComponent(query.trim())}`;
            }
        },

        /**
         * Handle social media click
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
            // If already on account page, just switch tabs
            if (window.location.pathname.includes('account.html')) {
                this.activeTab = tab;
                // Update URL without reload
                const newUrl = `${window.location.pathname}?tab=${tab}`;
                window.history.pushState({}, '', newUrl);
            } else {
                window.location.href = `account.html?tab=${tab}`;
            }
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
            
            // Reload addresses to reflect changes
            this.loadAddresses();
            this.loadSavedAddresses();
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
    },
    watch: {
        settings: {
            handler() {
                this.saveSettings();
            },
            deep: true
        }
    }
});

// Mount the app
app.mount('#app');

