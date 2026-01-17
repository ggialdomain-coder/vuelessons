/**
 * Location Selection Modal Component
 * Allows users to select delivery location from saved addresses, get current location, or use Google Maps
 */

const LocationSelectionModal = {
    template: `
        <div v-if="show" class="location-modal-overlay" @click.self="close">
            <div class="location-modal">
                <div class="location-modal-header">
                    <h2>Select Delivery Location</h2>
                    <button class="modal-close-btn" @click="close" title="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="location-modal-body">
                    <!-- Get Current Location -->
                    <div class="location-option">
                        <button @click="getCurrentLocation" class="location-btn" :disabled="gettingLocation">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>{{ gettingLocation ? 'Getting location...' : 'Use Current Location' }}</span>
                        </button>
                    </div>

                    <!-- Saved Addresses -->
                    <div v-if="savedAddresses.length > 0" class="saved-addresses-section">
                        <h3>Saved Addresses</h3>
                        <div class="addresses-list">
                            <div 
                                v-for="(address, index) in savedAddresses" 
                                :key="index"
                                class="address-item"
                                :class="{ 'selected': selectedAddressIndex === index }"
                                @click="selectAddress(address, index)"
                            >
                                <div class="address-item-header">
                                    <strong>{{ address.fullName || address.address }}</strong>
                                    <span v-if="address.isDefault" class="default-badge">Default</span>
                                </div>
                                <div class="address-item-details">
                                    <p>{{ formatAddress(address) }}</p>
                                    <p class="address-phone">{{ address.phone }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Google Maps Selection -->
                    <div class="location-option">
                        <button @click="openMapSelection" class="location-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>Select on Map</span>
                        </button>
                    </div>

                    <!-- Add New Address -->
                    <div class="location-option">
                        <button @click="addNewAddress" class="location-btn secondary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            <span>Add New Address</span>
                        </button>
                    </div>

                    <!-- Google Maps Container (hidden until needed) -->
                    <div v-if="showMap" class="map-container">
                        <div id="location-map" class="location-map"></div>
                        <div class="map-controls">
                            <button @click="confirmMapLocation" class="btn-primary" :disabled="!mapLocation">
                                Use This Location
                            </button>
                            <button @click="cancelMapSelection" class="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>

                    <!-- Error Message -->
                    <div v-if="error" class="location-error">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>{{ error }}</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        show: {
            type: Boolean,
            default: false
        },
        savedAddresses: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            selectedAddressIndex: null,
            gettingLocation: false,
            showMap: false,
            map: null,
            marker: null,
            mapLocation: null,
            error: ''
        };
    },
    watch: {
        show(newVal) {
            if (!newVal) {
                this.resetModal();
            }
        }
    },
    methods: {
        /**
         * Format address for display
         */
        formatAddress(address) {
            const parts = [];
            if (address.address) parts.push(address.address);
            if (address.city) parts.push(address.city);
            if (address.state) parts.push(address.state);
            if (address.zipCode) parts.push(address.zipCode);
            if (address.country) parts.push(address.country);
            return parts.join(', ') || 'Address not specified';
        },

        /**
         * Get current location using browser geolocation API
         */
        getCurrentLocation() {
            this.error = '';
            this.gettingLocation = true;

            if (!navigator.geolocation) {
                this.error = 'Geolocation is not supported by your browser';
                this.gettingLocation = false;
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Reverse geocode to get address
                    this.reverseGeocode(location);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.error = 'Unable to get your location. Please select from saved addresses or use the map.';
                    this.gettingLocation = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        },

        /**
         * Reverse geocode coordinates to address
         */
        async reverseGeocode(location) {
            try {
                // Using OpenStreetMap Nominatim API (free, no key required)
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`,
                    {
                        headers: {
                            'User-Agent': 'ShopVue Ecommerce App'
                        }
                    }
                );
                
                const data = await response.json();
                
                if (data && data.address) {
                    const address = {
                        address: data.address.road || data.address.house_number || '',
                        city: data.address.city || data.address.town || data.address.village || '',
                        state: data.address.state || data.address.region || '',
                        zipCode: data.address.postcode || '',
                        country: data.address.country || '',
                        lat: location.lat,
                        lng: location.lng
                    };
                    
                    this.selectLocation(address, 'current');
                } else {
                    this.error = 'Could not determine address from location';
                    this.gettingLocation = false;
                }
            } catch (error) {
                console.error('Reverse geocode error:', error);
                this.error = 'Could not get address from location. You can still use this location.';
                this.gettingLocation = false;
                
                // Still allow using the location even if reverse geocoding fails
                const address = {
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: '',
                    lat: location.lat,
                    lng: location.lng
                };
                this.selectLocation(address, 'current');
            }
        },

        /**
         * Select a saved address
         */
        selectAddress(address, index) {
            this.selectedAddressIndex = index;
            this.selectLocation(address, 'saved');
        },

        /**
         * Open Google Maps for location selection
         */
        openMapSelection() {
            this.showMap = true;
            this.error = '';
            
            // Initialize map after DOM update
            this.$nextTick(() => {
                this.initMap();
            });
        },

        /**
         * Initialize Google Maps
         */
        initMap() {
            // Check if Google Maps is loaded
            if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
                this.error = 'Google Maps is not loaded. Please check your API key.';
                return;
            }

            const mapElement = document.getElementById('location-map');
            if (!mapElement) return;

            // Default to Kuwait City if no location set
            const defaultLocation = { lat: 29.3759, lng: 47.9774 }; // Kuwait City
            
            this.map = new google.maps.Map(mapElement, {
                center: defaultLocation,
                zoom: 13,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true
            });

            // Add marker
            this.marker = new google.maps.Marker({
                map: this.map,
                position: defaultLocation,
                draggable: true,
                title: 'Drag to select location'
            });

            // Update location when marker is dragged
            this.marker.addListener('dragend', () => {
                const position = this.marker.getPosition();
                this.mapLocation = {
                    lat: position.lat(),
                    lng: position.lng()
                };
            });

            // Update location when map is clicked
            this.map.addListener('click', (event) => {
                const location = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                this.marker.setPosition(location);
                this.mapLocation = location;
            });

            // Try to get current location and center map
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        this.map.setCenter(location);
                        this.marker.setPosition(location);
                        this.mapLocation = location;
                    },
                    () => {
                        // If geolocation fails, use default location
                        this.mapLocation = defaultLocation;
                    }
                );
            } else {
                this.mapLocation = defaultLocation;
            }
        },

        /**
         * Confirm map location selection
         */
        async confirmMapLocation() {
            if (!this.mapLocation) {
                this.error = 'Please select a location on the map';
                return;
            }

            // Reverse geocode the selected location
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.mapLocation.lat}&lon=${this.mapLocation.lng}`,
                    {
                        headers: {
                            'User-Agent': 'ShopVue Ecommerce App'
                        }
                    }
                );
                
                const data = await response.json();
                
                const address = {
                    address: data.address?.road || data.address?.house_number || '',
                    city: data.address?.city || data.address?.town || data.address?.village || '',
                    state: data.address?.state || data.address?.region || '',
                    zipCode: data.address?.postcode || '',
                    country: data.address?.country || '',
                    lat: this.mapLocation.lat,
                    lng: this.mapLocation.lng
                };
                
                this.selectLocation(address, 'map');
            } catch (error) {
                console.error('Reverse geocode error:', error);
                // Still allow using the location
                const address = {
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: '',
                    lat: this.mapLocation.lat,
                    lng: this.mapLocation.lng
                };
                this.selectLocation(address, 'map');
            }
        },

        /**
         * Cancel map selection
         */
        cancelMapSelection() {
            this.showMap = false;
            this.mapLocation = null;
            if (this.map) {
                this.map = null;
            }
            if (this.marker) {
                this.marker = null;
            }
        },

        /**
         * Select location and emit event
         */
        selectLocation(address, source) {
            this.gettingLocation = false;
            this.$emit('location-selected', {
                address: address,
                source: source // 'current', 'saved', 'map'
            });
            this.close();
        },

        /**
         * Add new address
         */
        addNewAddress() {
            this.$emit('add-new-address');
            this.close();
        },

        /**
         * Close modal
         */
        close() {
            this.resetModal();
            this.$emit('close');
        },

        /**
         * Reset modal state
         */
        resetModal() {
            this.selectedAddressIndex = null;
            this.gettingLocation = false;
            this.showMap = false;
            this.mapLocation = null;
            this.error = '';
            if (this.map) {
                this.map = null;
            }
            if (this.marker) {
                this.marker = null;
            }
        }
    }
};












