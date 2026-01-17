/**
 * Address Form Page Vue App Instance
 * Add/Edit Address Application
 */

// Main Vue App
const { createApp } = Vue;

// Debug: Verify components are available
console.log('Header component available:', typeof Header !== 'undefined');
console.log('Footer component available:', typeof Footer !== 'undefined');
console.log('AccountSidebar component available:', typeof AccountSidebar !== 'undefined');

const app = createApp({
    data() {
        return {
            isEditMode: false,
            addressIndex: null,
            cartCount: 0,
            currentPage: 'address-form',
            logoImage: '',
            isLoggedIn: false,
            userEmail: '',
            userData: {},
            showAccountSidebar: false,
            addressForm: {
                fullName: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'Kuwait',
                addressType: 'home',
                isDefault: false
            },
            formErrors: {},
            formError: '',
            formSuccess: '',
            isSubmitting: false,
            addresses: [],
            showMap: false,
            map: null,
            marker: null,
            autocomplete: null,
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
    mounted() {
        this.checkAuthStatus();
        this.loadCartCount();
        this.loadAddresses();
        this.loadDeliveryAddress();
        this.loadSavedAddresses();
        this.checkEditMode();
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
                    // Reload addresses after auth check
                    this.loadSavedAddresses();
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    window.location.href = 'auth.html';
                }
            } else {
                // Not logged in, but allow viewing form (will show message)
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
                } catch (e) {
                    console.error('Error loading cart:', e);
                }
            }
        },

        /**
         * Load addresses from localStorage
         */
        loadAddresses() {
            if (!this.userData.email) return;
            
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
         * Check if we're in edit mode
         */
        checkEditMode() {
            const urlParams = new URLSearchParams(window.location.search);
            const index = urlParams.get('index');
            
            if (index !== null && this.addresses.length > 0) {
                const addressIndex = parseInt(index);
                if (addressIndex >= 0 && addressIndex < this.addresses.length) {
                    this.isEditMode = true;
                    this.addressIndex = addressIndex;
                    // Load address data into form
                    this.addressForm = { ...this.addresses[addressIndex] };
                    // If address has lat/lng, show map with that location
                    if (this.addressForm.lat && this.addressForm.lng) {
                        this.$nextTick(() => {
                            this.showMap = true;
                            this.$nextTick(() => {
                                this.initMap();
                            });
                        });
                    }
                }
            }
        },

        /**
         * Toggle map visibility
         */
        toggleMap() {
            this.showMap = !this.showMap;
            if (this.showMap) {
                this.$nextTick(() => {
                    this.initMap();
                });
            }
        },

        /**
         * Initialize Google Maps
         */
        initMap() {
            if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
                console.warn('Google Maps is not loaded');
                return;
            }

            const mapElement = document.getElementById('address-map');
            if (!mapElement) return;

            // Default location (Kuwait City)
            const defaultLocation = { lat: 29.3759, lng: 47.9774 };
            let initialLocation = defaultLocation;

            // If editing and address has coordinates, use them
            if (this.addressForm.lat && this.addressForm.lng) {
                initialLocation = {
                    lat: parseFloat(this.addressForm.lat),
                    lng: parseFloat(this.addressForm.lng)
                };
            }

            // Initialize map
            this.map = new google.maps.Map(mapElement, {
                center: initialLocation,
                zoom: 15,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true
            });

            // Add marker
            this.marker = new google.maps.Marker({
                map: this.map,
                position: initialLocation,
                draggable: true,
                title: 'Drag to select location'
            });

            // Update form when marker is dragged
            this.marker.addListener('dragend', () => {
                this.updateAddressFromMarker();
            });

            // Update form when map is clicked
            this.map.addListener('click', (event) => {
                const location = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                this.marker.setPosition(location);
                this.updateAddressFromMarker();
            });

            // Initialize autocomplete for address input
            this.initAutocomplete();
        },

        /**
         * Initialize Google Places Autocomplete
         */
        initAutocomplete() {
            if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
                return;
            }

            const addressInput = document.getElementById('address');
            if (!addressInput) return;

            this.autocomplete = new google.maps.places.Autocomplete(addressInput, {
                types: ['address'],
                componentRestrictions: { country: ['kw', 'us', 'sa', 'ae'] } // Kuwait, US, Saudi, UAE
            });

            this.autocomplete.addListener('place_changed', () => {
                const place = this.autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                // Update map and marker
                this.map.setCenter(place.geometry.location);
                this.marker.setPosition(place.geometry.location);

                // Update form fields from place
                this.updateFormFromPlace(place);
            });
        },

        /**
         * Update form fields from Google Place
         */
        updateFormFromPlace(place) {
            // Update address
            if (place.formatted_address) {
                this.addressForm.address = place.formatted_address;
            }

            // Update city, state, zip, country from address components
            place.address_components.forEach(component => {
                const types = component.types;

                if (types.includes('locality')) {
                    this.addressForm.city = component.long_name;
                } else if (types.includes('administrative_area_level_1')) {
                    this.addressForm.state = component.short_name;
                } else if (types.includes('postal_code')) {
                    this.addressForm.zipCode = component.long_name;
                } else if (types.includes('country')) {
                    this.addressForm.country = component.long_name;
                }
            });

            // Update coordinates
            if (place.geometry && place.geometry.location) {
                this.addressForm.lat = place.geometry.location.lat();
                this.addressForm.lng = place.geometry.location.lng();
            }
        },

        /**
         * Update address from marker position
         */
        async updateAddressFromMarker() {
            const position = this.marker.getPosition();
            this.addressForm.lat = position.lat();
            this.addressForm.lng = position.lng();

            // Reverse geocode to get address
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat()}&lon=${position.lng()}`,
                    {
                        headers: {
                            'User-Agent': 'ShopVue Ecommerce App'
                        }
                    }
                );
                
                const data = await response.json();
                
                if (data && data.address) {
                    if (data.address.road || data.address.house_number) {
                        this.addressForm.address = `${data.address.house_number || ''} ${data.address.road || ''}`.trim();
                    }
                    if (data.address.city || data.address.town || data.address.village) {
                        this.addressForm.city = data.address.city || data.address.town || data.address.village;
                    }
                    if (data.address.state || data.address.region) {
                        this.addressForm.state = data.address.state || data.address.region;
                    }
                    if (data.address.postcode) {
                        this.addressForm.zipCode = data.address.postcode;
                    }
                    if (data.address.country) {
                        this.addressForm.country = data.address.country;
                    }
                }
            } catch (error) {
                console.error('Reverse geocode error:', error);
            }
        },

        /**
         * Use current location
         */
        useCurrentLocation() {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    if (this.map && this.marker) {
                        this.map.setCenter(location);
                        this.marker.setPosition(location);
                        this.updateAddressFromMarker();
                    }
                },
                (error) => {
                    alert('Unable to get your location. Please select on the map.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000
                }
            );
        },

        /**
         * Validate form
         */
        validateForm() {
            this.formErrors = {};
            let isValid = true;

            // Full Name validation
            if (!this.addressForm.fullName || this.addressForm.fullName.trim().length < 2) {
                this.formErrors.fullName = 'Full name must be at least 2 characters';
                isValid = false;
            }

            // Phone validation
            if (!this.addressForm.phone) {
                this.formErrors.phone = 'Phone number is required';
                isValid = false;
            } else if (!this.isValidPhone(this.addressForm.phone)) {
                this.formErrors.phone = 'Please enter a valid phone number';
                isValid = false;
            }

            // Address validation
            if (!this.addressForm.address || this.addressForm.address.trim().length < 5) {
                this.formErrors.address = 'Street address must be at least 5 characters';
                isValid = false;
            }

            // City validation
            if (!this.addressForm.city || this.addressForm.city.trim().length < 2) {
                this.formErrors.city = 'City is required';
                isValid = false;
            }

            // State validation
            if (!this.addressForm.state || this.addressForm.state.trim().length < 2) {
                this.formErrors.state = 'State/Province is required';
                isValid = false;
            }

            // ZIP validation
            if (!this.addressForm.zipCode || this.addressForm.zipCode.trim().length < 3) {
                this.formErrors.zipCode = 'ZIP/Postal code is required';
                isValid = false;
            }

            // Country validation
            if (!this.addressForm.country || this.addressForm.country.trim().length < 2) {
                this.formErrors.country = 'Country is required';
                isValid = false;
            }

            return isValid;
        },

        /**
         * Validate phone format
         */
        isValidPhone(phone) {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return phoneRegex.test(phone);
        },

        /**
         * Handle form submission
         */
        async handleSubmit() {
            this.formError = '';
            this.formSuccess = '';

            if (!this.validateForm()) {
                this.formError = 'Please fix the errors in the form';
                return;
            }

            this.isSubmitting = true;

            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                const addressData = {
                    fullName: this.addressForm.fullName.trim(),
                    phone: this.addressForm.phone.trim(),
                    address: this.addressForm.address.trim(),
                    city: this.addressForm.city.trim(),
                    state: this.addressForm.state.trim(),
                    zipCode: this.addressForm.zipCode.trim(),
                    country: this.addressForm.country.trim(),
                    addressType: this.addressForm.addressType,
                    isDefault: this.addressForm.isDefault
                };

                if (this.isEditMode) {
                    // Update existing address
                    this.addresses[this.addressIndex] = addressData;
                    this.formSuccess = 'Address updated successfully!';
                } else {
                    // Add new address
                    this.addresses.push(addressData);
                    this.formSuccess = 'Address added successfully!';
                }

                // If this is set as default, unset others
                if (addressData.isDefault) {
                    this.addresses.forEach((addr, index) => {
                        if (index !== (this.isEditMode ? this.addressIndex : this.addresses.length - 1)) {
                            addr.isDefault = false;
                        }
                    });
                }

                // Save to localStorage
                localStorage.setItem(`shopvue_addresses_${this.userData.email}`, JSON.stringify(this.addresses));

                // If this is the default address, also save to delivery address
                if (addressData.isDefault) {
                    localStorage.setItem('shopvue_delivery_address', JSON.stringify(addressData));
                }

                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'account.html?tab=addresses';
                }, 1500);
            } catch (error) {
                console.error('Error saving address:', error);
                this.formError = 'An error occurred. Please try again.';
            } finally {
                this.isSubmitting = false;
            }
        },

        /**
         * Handle cancel
         */
        handleCancel() {
            window.location.href = 'account.html?tab=addresses';
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
            // Already on address form page, just close modal
            this.showLocationModal = false;
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

