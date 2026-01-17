/**
 * AccountSidebar Component
 * Displays account menu options in a sidebar overlay
 */

const AccountSidebar = {
    template: `
        <div v-if="show" class="account-sidebar-overlay" @click.self="closeSidebar">
            <div class="account-sidebar" @click.stop>
                <div class="account-sidebar-header">
                    <div class="account-profile-header">
                        <div class="profile-avatar-small">
                            <span>{{ userInitials }}</span>
                        </div>
                        <div class="profile-info-small">
                            <h3>{{ userName }}</h3>
                            <p>{{ userEmail }}</p>
                        </div>
                    </div>
                    <button class="account-close" @click="closeSidebar" aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="account-sidebar-body">
                    <nav class="account-sidebar-nav">
                        <a 
                            href="#" 
                            @click.prevent="navigateToAccount('details')" 
                            class="nav-item"
                            :class="{ active: activeTab === 'details' }"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Account Details</span>
                        </a>
                        
                        <a 
                            href="#" 
                            @click.prevent="navigateToAccount('orders')" 
                            class="nav-item"
                            :class="{ active: activeTab === 'orders' }"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                            </svg>
                            <span>My Orders</span>
                        </a>
                        
                        <a 
                            href="#" 
                            @click.prevent="navigateToAccount('addresses')" 
                            class="nav-item"
                            :class="{ active: activeTab === 'addresses' }"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>Addresses</span>
                        </a>
                        
                        <a 
                            href="#" 
                            @click.prevent="navigateToAccount('settings')" 
                            class="nav-item"
                            :class="{ active: activeTab === 'settings' }"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.364 6.364l-4.243-4.243m-4.242 0L5.636 18.364m12.728-12.728l-4.243 4.243m-4.242 0L5.636 5.636"></path>
                            </svg>
                            <span>Settings</span>
                        </a>
                    </nav>
                </div>
                
                <div class="account-sidebar-footer">
                    <button @click="handleLogout" class="btn-logout">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    `,
    props: {
        show: {
            type: Boolean,
            default: false
        },
        userData: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        userInitials() {
            if (!this.userData.fullName) return 'U';
            const names = this.userData.fullName.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return this.userData.fullName.substring(0, 2).toUpperCase();
        },
        userName() {
            return this.userData.fullName || 'User';
        },
        userEmail() {
            return this.userData.email || '';
        },
        activeTab() {
            // Get current page from URL to determine active tab
            const path = window.location.pathname;
            if (path.includes('account.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get('tab') || 'details';
            }
            return 'details';
        }
    },
    methods: {
        closeSidebar() {
            this.$emit('close');
        },
        navigateToAccount(tab) {
            this.$emit('navigate-account', tab);
            this.closeSidebar();
        },
        handleLogout() {
            this.$emit('logout');
            this.closeSidebar();
        }
    },
    watch: {
        show(newVal) {
            // Prevent body scroll when sidebar is open
            if (newVal) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    },
    beforeUnmount() {
        // Restore body scroll when component is destroyed
        document.body.style.overflow = '';
    }
};












