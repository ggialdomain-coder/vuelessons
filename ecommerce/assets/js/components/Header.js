/**
 * Header Component
 * Reusable header with logo, delivery address, navigation, search, cart, and login
 */

// Debug: Verify Header component is loading
console.log('Header component loaded');

const Header = {
    template: `
        <header class="header">
            <div class="header-container">
                <!-- Delivery Address -->
                <div class="delivery-address" @click="changeDeliveryAddress">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div class="delivery-text">
                        <span class="delivery-label">Deliver to</span>
                        <span class="delivery-location">{{ deliveryAddress }}</span>
                    </div>
                </div>

                <!-- Logo -->
                <div class="logo">
                    <a href="/" @click.prevent="goHome">
                        <img v-if="logoImage" :src="logoImage" :alt="logoText" class="logo-image">
                        <h1 v-else>{{ logoText }}</h1>
                    </a>
                </div>

                <!-- Navigation -->
                <nav class="nav" v-if="!mobileMenuOpen">
                    <ul class="nav-list">
                        <li><a href="#" @click.prevent="navigate('home')" :class="{ active: currentPage === 'home' }">Home</a></li>
                        <li><a href="#" @click.prevent="navigate('products')" :class="{ active: currentPage === 'products' }">Products</a></li>
                        <li><a href="#" @click.prevent="navigate('categories')" :class="{ active: currentPage === 'categories' }">Categories</a></li>
                        <li><a href="#" @click.prevent="navigate('about')" :class="{ active: currentPage === 'about' }">About</a></li>
                        <li><a href="#" @click.prevent="navigate('contact')" :class="{ active: currentPage === 'contact' }">Contact</a></li>
                    </ul>
                </nav>

                <!-- Search Bar -->
                <div class="search-container">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search products..."
                        v-model="searchQuery"
                        @keyup.enter="handleSearch"
                    >
                    <button class="search-btn" @click="handleSearch">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                </div>

                <!-- Action Icons -->
                <div class="header-actions">
                    <!-- Cart Icon -->
                    <button class="icon-btn cart-btn" @click="goToCart" title="Shopping Cart">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="m1 1 4 4 2 8h12l2-8H5"></path>
                        </svg>
                        <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
                    </button>

                    <!-- Login/Account Button -->
                    <button class="login-btn" @click="handleLogin" :title="isLoggedIn ? 'My Account' : 'Login'">
                        <svg v-if="!isLoggedIn" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>{{ isLoggedIn ? 'Account' : 'Login' }}</span>
                    </button>
                </div>

                <!-- Mobile Menu Toggle -->
                <button class="mobile-menu-toggle" @click="toggleMobileMenu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu -->
            <div v-if="mobileMenuOpen" class="mobile-menu">
                    <nav class="mobile-nav">
                        <a href="#" @click.prevent="navigate('home')">Home</a>
                        <a href="#" @click.prevent="navigate('products')">Products</a>
                        <a href="#" @click.prevent="navigate('categories')">Categories</a>
                        <a href="#" @click.prevent="navigate('about')">About</a>
                        <a href="#" @click.prevent="navigate('contact')">Contact</a>
                    </nav>
            </div>
        </header>
    `,
    props: {
        cartCount: {
            type: Number,
            default: 0
        },
        currentPage: {
            type: String,
            default: 'home'
        },
        logoImage: {
            type: String,
            default: '' // Path to logo image, if empty uses text logo
        },
        isLoggedIn: {
            type: Boolean,
            default: false
        },
        userEmail: {
            type: String,
            default: ''
        },
        deliveryAddress: {
            type: String,
            default: 'Select location'
        }
    },
    data() {
        return {
            logoText: 'ShopVue',
            searchQuery: '',
            mobileMenuOpen: false
        };
    },
    methods: {
        navigate(page) {
            this.$emit('navigate', page);
            this.mobileMenuOpen = false;
        },
        goHome() {
            this.navigate('home');
        },
        handleSearch() {
            if (this.searchQuery.trim()) {
                this.$emit('search', this.searchQuery);
            }
        },
        goToCart() {
            this.$emit('navigate', 'cart');
        },
        handleLogin() {
            if (this.isLoggedIn) {
                // Open account sidebar
                this.$emit('open-account');
            } else {
                // Login
                this.$emit('login');
            }
        },
        changeDeliveryAddress() {
            this.$emit('change-address');
            // TODO: Open address selection modal or navigate to address page
        },
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        }
    }
};

