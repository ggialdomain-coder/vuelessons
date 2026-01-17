/**
 * Checkout Page Vue App Instance
 * Checkout Application with Payment, Delivery, and Voucher
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
            cartCount: 0,
            currentPage: 'checkout',
            logoImage: '',
            isLoggedIn: false,
            userEmail: '',
            userData: {},
            showAccountSidebar: false,
            // Delivery Address
            deliveryAddress: {
                fullName: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zipCode: ''
            },
            // Delivery Options
            deliveryOptions: [
                {
                    value: 'standard',
                    label: 'Standard Delivery',
                    description: 'Regular delivery service',
                    date: 'Estimated: 3-5 business days',
                    price: 0
                },
                {
                    value: 'express',
                    label: 'Express Delivery',
                    description: 'Fast delivery service',
                    date: 'Estimated: 1-2 business days',
                    price: 9.99
                },
                {
                    value: 'overnight',
                    label: 'Overnight Delivery',
                    description: 'Next day delivery',
                    date: 'Estimated: Next business day',
                    price: 19.99
                }
            ],
            selectedDelivery: 'standard',
            selectedDeliveryPrice: 0,
            // Payment Methods
            paymentMethods: [
                {
                    value: 'credit-card',
                    label: 'Credit/Debit Card',
                    icon: [
                        'M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z',
                        'M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'
                    ]
                },
                {
                    value: 'paypal',
                    label: 'PayPal',
                    icon: null
                },
                {
                    value: 'cash-on-delivery',
                    label: 'Cash on Delivery',
                    icon: null
                },
                {
                    value: 'bank-transfer',
                    label: 'Bank Transfer',
                    icon: null
                }
            ],
            selectedPayment: 'credit-card',
            // Payment Details
            paymentDetails: {
                cardNumber: '',
                expiryDate: '',
                cvv: '',
                cardName: ''
            },
            // Voucher
            voucherCode: '',
            voucherError: '',
            voucherApplied: false,
            voucherDiscount: 0,
            // Valid voucher codes (in real app, this would come from API)
            validVouchers: {
                'SAVE10': { discount: 10, type: 'percent' },
                'SAVE20': { discount: 20, type: 'percent' },
                'FLAT50': { discount: 50, type: 'fixed' },
                'WELCOME15': { discount: 15, type: 'percent' }
            }
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
            // Calculate 10% tax on subtotal (after voucher discount)
            const taxableAmount = this.subtotal - this.voucherDiscount;
            return taxableAmount * 0.1;
        },
        total() {
            return this.subtotal + this.selectedDeliveryPrice - this.voucherDiscount + this.tax;
        },
        isFormValid() {
            // Check if all required fields are filled
            const addressValid = 
                this.deliveryAddress.fullName &&
                this.deliveryAddress.phone &&
                this.deliveryAddress.address &&
                this.deliveryAddress.city &&
                this.deliveryAddress.state &&
                this.deliveryAddress.zipCode;
            
            let paymentValid = true;
            if (this.selectedPayment === 'credit-card') {
                paymentValid = 
                    this.paymentDetails.cardNumber &&
                    this.paymentDetails.expiryDate &&
                    this.paymentDetails.cvv &&
                    this.paymentDetails.cardName;
            }
            
            return addressValid && paymentValid && this.cartItems.length > 0;
        }
    },
    async mounted() {
        await this.checkAuthStatus();
        await this.loadCartFromStorage();
        this.loadSavedAddress();
    },
    methods: {
        /**
         * Check authentication status
         */
        async checkAuthStatus() {
            const userData = localStorage.getItem('shopvue_user');
            const token = localStorage.getItem('shopvue_access_token');
            
            if (userData && token) {
                try {
                    const user = JSON.parse(userData);
                    this.isLoggedIn = true;
                    this.userEmail = user.email;
                    this.userData = user;
                    
                    // Verify token is still valid by trying to get user profile
                    try {
                        const currentUser = await apiService.getCurrentUser();
                        // Token is valid, update user data
                        this.userData = { ...this.userData, ...currentUser };
                    } catch (tokenError) {
                        console.warn('Token may be invalid:', tokenError);
                        // Token might be expired, but keep user logged in for now
                    }
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    this.isLoggedIn = false;
                }
            } else if (userData && !token) {
                // User data exists but no token - might be mock login
                try {
                    const user = JSON.parse(userData);
                    this.isLoggedIn = true;
                    this.userEmail = user.email;
                    this.userData = user;
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    this.isLoggedIn = false;
                }
            } else {
                this.isLoggedIn = false;
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
         * Load cart from localStorage and sync to backend if logged in
         */
        async loadCartFromStorage() {
            const savedCart = localStorage.getItem('shopvue_cart');
            if (savedCart) {
                try {
                    this.cartItems = JSON.parse(savedCart);
                    this.cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
                    
                    // Sync cart to backend if user is logged in AND has valid token
                    const token = localStorage.getItem('shopvue_access_token');
                    if (this.isLoggedIn && token && this.cartItems.length > 0) {
                        try {
                            // Get current backend cart
                            const backendCart = await apiService.getCart();
                            
                            // Sync each item to backend
                            for (const item of this.cartItems) {
                                const backendItem = backendCart.find(bItem => bItem.product.id === item.id);
                                if (backendItem) {
                                    // Update quantity if different
                                    if (backendItem.quantity !== item.quantity) {
                                        await apiService.updateCartItem(backendItem.id, item.quantity);
                                    }
                                } else {
                                    // Add new item to backend
                                    await apiService.addToCart(item.id, item.quantity);
                                }
                            }
                            
                            // Remove items from backend that are not in localStorage
                            for (const backendItem of backendCart) {
                                const localItem = this.cartItems.find(item => item.id === backendItem.product.id);
                                if (!localItem) {
                                    await apiService.removeFromCart(backendItem.id);
                                }
                            }
                        } catch (error) {
                            console.warn('Failed to sync cart to backend (user may not be logged in via Django):', error.message);
                            // Continue with localStorage cart - this is OK for guest users
                        }
                    }
                } catch (e) {
                    console.error('Error loading cart from storage:', e);
                    this.cartItems = [];
                }
            }
            
            // Also try to load from backend if logged in and localStorage is empty
            const token = localStorage.getItem('shopvue_access_token');
            if (this.isLoggedIn && token && (!this.cartItems || this.cartItems.length === 0)) {
                try {
                    const backendCart = await apiService.getCart();
                    if (backendCart && backendCart.length > 0) {
                        this.cartItems = backendCart.map(item => ({
                            id: item.product.id,
                            name: item.product.name,
                            price: item.product.price,
                            image: item.product.image,
                            quantity: item.quantity
                        }));
                        this.cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
                        // Save to localStorage
                        localStorage.setItem('shopvue_cart', JSON.stringify(this.cartItems));
                    }
                } catch (error) {
                    console.warn('Failed to load cart from backend:', error.message);
                }
            }
            
            // Redirect to cart if empty
            if (this.cartItems.length === 0) {
                // Don't redirect immediately, let user see the empty state
            }
        },

        /**
         * Load saved delivery address from localStorage
         */
        loadSavedAddress() {
            const savedAddress = localStorage.getItem('shopvue_delivery_address');
            if (savedAddress) {
                try {
                    this.deliveryAddress = { ...this.deliveryAddress, ...JSON.parse(savedAddress) };
                } catch (e) {
                    console.error('Error loading saved address:', e);
                }
            }
        },

        /**
         * Save delivery address to localStorage
         */
        saveAddress() {
            localStorage.setItem('shopvue_delivery_address', JSON.stringify(this.deliveryAddress));
        },

        /**
         * Update delivery timeline and price
         */
        updateDeliveryTimeline() {
            const option = this.deliveryOptions.find(opt => opt.value === this.selectedDelivery);
            this.selectedDeliveryPrice = option ? option.price : 0;
        },

        /**
         * Format card number with spaces
         */
        formatCardNumber(event) {
            let value = event.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length <= 19) {
                this.paymentDetails.cardNumber = formattedValue;
            }
        },

        /**
         * Format expiry date as MM/YY
         */
        formatExpiryDate(event) {
            let value = event.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.paymentDetails.expiryDate = value;
        },

        /**
         * Apply voucher code
         */
        applyVoucher() {
            this.voucherError = '';
            
            if (!this.voucherCode) {
                this.voucherError = 'Please enter a voucher code';
                return;
            }

            const code = this.voucherCode.toUpperCase().trim();
            const voucher = this.validVouchers[code];

            if (!voucher) {
                this.voucherError = 'Invalid voucher code';
                return;
            }

            // Calculate discount
            if (voucher.type === 'percent') {
                this.voucherDiscount = (this.subtotal * voucher.discount) / 100;
            } else if (voucher.type === 'fixed') {
                this.voucherDiscount = Math.min(voucher.discount, this.subtotal);
            }

            this.voucherApplied = true;
            this.voucherError = '';
        },

        /**
         * Remove voucher
         */
        removeVoucher() {
            this.voucherCode = '';
            this.voucherApplied = false;
            this.voucherDiscount = 0;
            this.voucherError = '';
        },

        /**
         * Place order
         */
        async placeOrder() {
            if (!this.isFormValid) {
                alert('Please fill in all required fields');
                return;
            }

            // Save address for future use
            this.saveAddress();

            try {
                let deliveryAddressId = null;
                
                // Check if user has valid token
                const token = localStorage.getItem('shopvue_access_token');
                
                // If user is logged in AND has valid token, sync cart to backend first
                if (this.isLoggedIn && token) {
                    try {
                        // Sync all cart items to backend
                        let backendCart = [];
                        try {
                            backendCart = await apiService.getCart();
                            console.log('Backend cart loaded:', backendCart);
                        } catch (getCartError) {
                            console.warn('Could not get backend cart, will create new items:', getCartError);
                            // Continue - will add all items as new
                            backendCart = [];
                        }
                        
                        // Add/update items in backend
                        for (const item of this.cartItems) {
                            try {
                                const backendItem = backendCart.find(bItem => {
                                    const productId = bItem.product?.id || bItem.product;
                                    return productId === item.id;
                                });
                                
                                if (backendItem) {
                                    // Update quantity if different
                                    if (backendItem.quantity !== item.quantity) {
                                        await apiService.updateCartItem(backendItem.id, item.quantity);
                                        console.log(`Updated cart item ${item.id} to quantity ${item.quantity}`);
                                    }
                                } else {
                                    // Add new item to backend
                                    console.log(`Adding product ${item.id} (${item.name}) to backend cart with quantity ${item.quantity}`);
                                    await apiService.addToCart(item.id, item.quantity);
                                    console.log(`Added cart item ${item.id} with quantity ${item.quantity}`);
                                }
                            } catch (itemError) {
                                console.error(`Error syncing cart item ${item.id}:`, itemError);
                                // If it's a 404 or product not found, skip this item
                                if (itemError.message && itemError.message.includes('404')) {
                                    console.warn(`Product ${item.id} not found in backend, skipping`);
                                    continue;
                                }
                                // For other errors, throw to stop the process
                                throw itemError;
                            }
                        }
                        
                        // Remove items from backend that are not in localStorage
                        for (const backendItem of backendCart) {
                            try {
                                const productId = backendItem.product?.id || backendItem.product;
                                const localItem = this.cartItems.find(item => item.id === productId);
                                if (!localItem) {
                                    await apiService.removeFromCart(backendItem.id);
                                    console.log(`Removed cart item ${backendItem.id} from backend`);
                                }
                            } catch (removeError) {
                                console.error(`Error removing cart item ${backendItem.id}:`, removeError);
                                // Continue with next item - don't fail the whole process
                            }
                        }
                        
                        console.log('Cart synced to backend successfully');
                    } catch (cartError) {
                        console.error('Failed to sync cart to backend:', cartError);
                        console.error('Cart items:', this.cartItems);
                        console.error('Error details:', cartError.message);
                        if (cartError.stack) {
                            console.error('Stack:', cartError.stack);
                        }
                        // Don't block order - allow guest checkout
                        console.warn('Cart sync failed, but continuing with localStorage-only order (guest checkout)');
                        // Don't return - allow order to proceed
                    }
                    
                    // Try to save/use address from backend
                    try {
                        const addresses = await apiService.getAddresses();
                        let address = addresses.find(addr => 
                            addr.address === this.deliveryAddress.address &&
                            addr.city === this.deliveryAddress.city &&
                            addr.zip_code === this.deliveryAddress.zipCode
                        );
                        
                        if (!address) {
                            // Create new address
                            address = await apiService.createAddress({
                                full_name: this.deliveryAddress.fullName,
                                phone: this.deliveryAddress.phone,
                                address: this.deliveryAddress.address,
                                city: this.deliveryAddress.city,
                                state: this.deliveryAddress.state,
                                zip_code: this.deliveryAddress.zipCode,
                                country: this.deliveryAddress.country || 'Kuwait',
                                address_type: 'home',
                                is_default: false,
                                lat: this.deliveryAddress.lat || null,
                                lng: this.deliveryAddress.lng || null
                            });
                        }
                        deliveryAddressId = address.id;
                    } catch (addrError) {
                        console.warn('Could not save address to backend:', addrError);
                        // Continue without address ID
                    }
                }

                // Prepare order data for Django API
                const orderData = {
                    delivery_address_id: deliveryAddressId,
                    shipping_cost: this.selectedDeliveryPrice,
                    discount: this.voucherDiscount,
                    payment_method: this.selectedPayment,
                    notes: this.voucherApplied ? `Voucher: ${this.voucherCode}` : ''
                };

                console.log('Placing order to backend:', orderData);

                // Send order to Django backend (only if user has valid token)
                let backendOrder = null;
                if (this.isLoggedIn && token) {
                    try {
                        backendOrder = await apiService.createOrder(orderData);
                        console.log('Order created in backend:', backendOrder);
                    } catch (apiError) {
                        console.error('Backend API error:', apiError);
                        // Don't block order - allow localStorage-only order
                        console.warn('Order will be saved to localStorage only (not in Django backend)');
                        // Continue with localStorage order
                    }
                } else {
                    console.log('User not logged in via Django API - order will be saved to localStorage only');
                }

                // Also save to localStorage as backup and for guest users
                const orderId = backendOrder?.order_number || 'ORD-' + Date.now().toString(36).toUpperCase();
                const order = {
                    id: orderId,
                    order_number: backendOrder?.order_number || orderId,
                    userEmail: this.userData.email || this.deliveryAddress.email || 'guest',
                    items: this.cartItems,
                    deliveryAddress: this.deliveryAddress,
                    deliveryOption: this.selectedDelivery,
                    deliveryPrice: this.selectedDeliveryPrice,
                    paymentMethod: this.selectedPayment,
                    voucherCode: this.voucherApplied ? this.voucherCode : null,
                    voucherDiscount: this.voucherDiscount,
                    subtotal: this.subtotal,
                    tax: this.tax,
                    total: this.total,
                    status: backendOrder?.status || 'pending',
                    timestamp: new Date().toISOString()
                };
                
                // Get existing orders and add new one
                const existingOrders = JSON.parse(localStorage.getItem('shopvue_orders') || '[]');
                existingOrders.push(order);
                localStorage.setItem('shopvue_orders', JSON.stringify(existingOrders));
                
                // Clear cart from localStorage
                localStorage.removeItem('shopvue_cart');
                
                // If logged in, also clear cart from backend
                if (this.isLoggedIn) {
                    try {
                        // Cart is automatically cleared when order is created via API
                        // But we'll also clear localStorage cart
                        this.cartItems = [];
                        this.cartCount = 0;
                    } catch (e) {
                        console.warn('Could not clear backend cart:', e);
                    }
                }
                
                // Show success message
                const successMsg = backendOrder 
                    ? `Order placed successfully! Order ID: ${backendOrder.order_number}`
                    : `Order placed successfully! Order ID: ${orderId}`;
                alert(successMsg);
                
                // Redirect to account page if logged in, otherwise home
                if (this.isLoggedIn) {
                    window.location.href = 'account.html?tab=orders';
                } else {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Error placing order:', error);
                alert('Failed to place order. Please try again.');
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
            window.location.href = 'auth.html?return=checkout.html';
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
        }
    }
});

// Mount the app
app.mount('#app');

