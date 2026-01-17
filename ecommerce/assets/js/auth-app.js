/**
 * Authentication Page Vue App Instance
 * Login and Sign Up Application
 */

// Main Vue App
const { createApp } = Vue;

// Debug: Verify components are available
console.log('Header component available:', typeof Header !== 'undefined');
console.log('Footer component available:', typeof Footer !== 'undefined');

const app = createApp({
    data() {
        return {
            activeTab: 'login', // 'login' or 'signup'
            cartCount: 0,
            currentPage: 'auth',
            logoImage: '',
            isLoggedIn: false,
            userEmail: '',
            // Login Form
            loginForm: {
                email: '',
                password: '',
                rememberMe: false
            },
            loginErrors: {},
            loginError: '',
            loginSuccess: '',
            loginLoading: false,
            showLoginPassword: false,
            showForgotPassword: false,
            // Signup Form
            signupForm: {
                fullName: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                acceptTerms: false
            },
            signupErrors: {},
            signupError: '',
            signupSuccess: '',
            signupLoading: false,
            showSignupPassword: false,
            showSignupConfirmPassword: false
        };
    },
    components: {
        'header-component': Header,
        'footer-component': Footer
    },
    computed: {
        passwordStrength() {
            const password = this.signupForm.password;
            if (!password) return { class: '', text: '' };
            
            let strength = 0;
            let text = 'Weak';
            let class_name = 'weak';
            
            // Check length
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            
            // Check for lowercase
            if (/[a-z]/.test(password)) strength++;
            
            // Check for uppercase
            if (/[A-Z]/.test(password)) strength++;
            
            // Check for numbers
            if (/[0-9]/.test(password)) strength++;
            
            // Check for special characters
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            if (strength <= 2) {
                text = 'Weak';
                class_name = 'weak';
            } else if (strength <= 4) {
                text = 'Medium';
                class_name = 'medium';
            } else {
                text = 'Strong';
                class_name = 'strong';
            }
            
            return { class: class_name, text };
        }
    },
    mounted() {
        this.checkAuthStatus();
        this.loadCartCount();
    },
    methods: {
        /**
         * Check if user is already logged in
         */
        checkAuthStatus() {
            const userData = localStorage.getItem('shopvue_user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    this.isLoggedIn = true;
                    this.userEmail = user.email;
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
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
         * Validate login form
         */
        validateLoginForm() {
            this.loginErrors = {};
            let isValid = true;

            // Email validation
            if (!this.loginForm.email) {
                this.loginErrors.email = 'Email is required';
                isValid = false;
            } else if (!this.isValidEmail(this.loginForm.email)) {
                this.loginErrors.email = 'Please enter a valid email address';
                isValid = false;
            }

            // Password validation
            if (!this.loginForm.password) {
                this.loginErrors.password = 'Password is required';
                isValid = false;
            } else if (this.loginForm.password.length < 6) {
                this.loginErrors.password = 'Password must be at least 6 characters';
                isValid = false;
            }

            return isValid;
        },

        /**
         * Validate signup form
         */
        validateSignupForm() {
            this.signupErrors = {};
            let isValid = true;

            // Full Name validation
            if (!this.signupForm.fullName) {
                this.signupErrors.fullName = 'Full name is required';
                isValid = false;
            } else if (this.signupForm.fullName.length < 2) {
                this.signupErrors.fullName = 'Name must be at least 2 characters';
                isValid = false;
            }

            // Email validation
            if (!this.signupForm.email) {
                this.signupErrors.email = 'Email is required';
                isValid = false;
            } else if (!this.isValidEmail(this.signupForm.email)) {
                this.signupErrors.email = 'Please enter a valid email address';
                isValid = false;
            }

            // Phone validation (optional)
            if (this.signupForm.phone && !this.isValidPhone(this.signupForm.phone)) {
                this.signupErrors.phone = 'Please enter a valid phone number';
                isValid = false;
            }

            // Password validation
            if (!this.signupForm.password) {
                this.signupErrors.password = 'Password is required';
                isValid = false;
            } else if (this.signupForm.password.length < 8) {
                this.signupErrors.password = 'Password must be at least 8 characters';
                isValid = false;
            }

            // Confirm Password validation
            if (!this.signupForm.confirmPassword) {
                this.signupErrors.confirmPassword = 'Please confirm your password';
                isValid = false;
            } else if (this.signupForm.password !== this.signupForm.confirmPassword) {
                this.signupErrors.confirmPassword = 'Passwords do not match';
                isValid = false;
            }

            // Terms validation
            if (!this.signupForm.acceptTerms) {
                this.signupErrors.acceptTerms = 'You must accept the terms and conditions';
                isValid = false;
            }

            return isValid;
        },

        /**
         * Validate email format
         */
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        /**
         * Validate phone format
         */
        isValidPhone(phone) {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return phoneRegex.test(phone);
        },

        /**
         * Handle login form submission
         */
        async handleLoginSubmit() {
            this.loginError = '';
            this.loginSuccess = '';

            if (!this.validateLoginForm()) {
                return;
            }

            this.loginLoading = true;

            try {
                // Try Django API login first
                try {
                    const loginResponse = await apiService.login(
                        this.loginForm.email, 
                        this.loginForm.password
                    );
                    
                    // Store tokens
                    if (loginResponse.access) {
                        localStorage.setItem('shopvue_access_token', loginResponse.access);
                        if (loginResponse.refresh) {
                            localStorage.setItem('shopvue_refresh_token', loginResponse.refresh);
                        }
                    }
                    
                    // Get user profile
                    let userData = {};
                    try {
                        const userProfile = await apiService.getCurrentUser();
                        userData = {
                            id: userProfile.id,
                            email: userProfile.email,
                            username: userProfile.username,
                            fullName: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || userProfile.username,
                            phone: userProfile.phone || ''
                        };
                    } catch (profileError) {
                        console.warn('Could not fetch user profile:', profileError);
                        // Use email as fallback
                        userData = {
                            email: this.loginForm.email,
                            fullName: this.loginForm.email.split('@')[0],
                            phone: ''
                        };
                    }
                    
                    // Save user session
                    localStorage.setItem('shopvue_user', JSON.stringify(userData));
                    
                    if (this.loginForm.rememberMe) {
                        localStorage.setItem('shopvue_remember_me', 'true');
                    }

                    this.isLoggedIn = true;
                    this.userEmail = userData.email;
                    this.loginSuccess = 'Login successful! Redirecting...';

                    // Redirect after short delay
                    setTimeout(() => {
                        const returnUrl = new URLSearchParams(window.location.search).get('return') || 'account.html';
                        window.location.href = returnUrl;
                    }, 1500);
                    
                    return; // Success, exit function
                } catch (apiError) {
                    console.warn('Django API login failed, trying fallback:', apiError);
                    // Fall back to localStorage mock authentication for backward compatibility
                }
                
                // Fallback: Check if user exists in localStorage (mock authentication)
                const users = JSON.parse(localStorage.getItem('shopvue_users') || '[]');
                const user = users.find(u => 
                    u.email === this.loginForm.email && 
                    u.password === this.loginForm.password
                );

                if (user) {
                    // Login successful (mock)
                    const userData = {
                        id: user.id,
                        email: user.email,
                        fullName: user.fullName,
                        phone: user.phone
                    };

                    // Save user session
                    localStorage.setItem('shopvue_user', JSON.stringify(userData));
                    
                    if (this.loginForm.rememberMe) {
                        localStorage.setItem('shopvue_remember_me', 'true');
                    }

                    this.isLoggedIn = true;
                    this.userEmail = user.email;
                    this.loginSuccess = 'Login successful! Redirecting...';

                    // Redirect after short delay
                    setTimeout(() => {
                        const returnUrl = new URLSearchParams(window.location.search).get('return') || 'account.html';
                        window.location.href = returnUrl;
                    }, 1500);
                } else {
                    this.loginError = 'Invalid email or password';
                }
            } catch (error) {
                console.error('Login error:', error);
                this.loginError = error.message || 'An error occurred. Please try again.';
            } finally {
                this.loginLoading = false;
            }
        },

        /**
         * Handle signup form submission
         */
        async handleSignupSubmit() {
            this.signupError = '';
            this.signupSuccess = '';

            if (!this.validateSignupForm()) {
                return;
            }

            this.signupLoading = true;

            try {
                // Try Django API registration first
                try {
                    const registerResponse = await apiService.register({
                        email: this.signupForm.email,
                        password: this.signupForm.password,
                        fullName: this.signupForm.fullName,
                        phone: this.signupForm.phone
                    });
                    
                    // Store tokens
                    if (registerResponse.token) {
                        localStorage.setItem('shopvue_access_token', registerResponse.token);
                        if (registerResponse.refresh) {
                            localStorage.setItem('shopvue_refresh_token', registerResponse.refresh);
                        }
                    }
                    
                    // Get user data from response
                    const userData = {
                        id: registerResponse.user?.id || Date.now().toString(),
                        email: registerResponse.user?.email || this.signupForm.email,
                        username: registerResponse.user?.username || this.signupForm.email,
                        fullName: `${registerResponse.user?.first_name || ''} ${registerResponse.user?.last_name || ''}`.trim() || this.signupForm.fullName,
                        phone: this.signupForm.phone || ''
                    };
                    
                    // Save user session
                    localStorage.setItem('shopvue_user', JSON.stringify(userData));

                    this.isLoggedIn = true;
                    this.userEmail = userData.email;
                    this.signupSuccess = 'Account created successfully! Redirecting...';

                    // Redirect after short delay
                    setTimeout(() => {
                        window.location.href = 'account.html';
                    }, 1500);
                    
                    return; // Success, exit function
                } catch (apiError) {
                    console.warn('Django API registration failed, trying fallback:', apiError);
                    // Fall back to localStorage mock authentication for backward compatibility
                    const errorMsg = apiError.message || 'Registration failed';
                    if (errorMsg.includes('already exists') || errorMsg.includes('username') || errorMsg.includes('email')) {
                        this.signupError = 'An account with this email already exists';
                        this.signupLoading = false;
                        return;
                    }
                }
                
                // Fallback: Check if user already exists in localStorage (mock authentication)
                const users = JSON.parse(localStorage.getItem('shopvue_users') || '[]');
                const existingUser = users.find(u => u.email === this.signupForm.email);

                if (existingUser) {
                    this.signupError = 'An account with this email already exists';
                    this.signupLoading = false;
                    return;
                }

                // Create new user (mock)
                const newUser = {
                    id: Date.now().toString(),
                    fullName: this.signupForm.fullName,
                    email: this.signupForm.email,
                    phone: this.signupForm.phone || '',
                    password: this.signupForm.password, // In real app, this should be hashed
                    createdAt: new Date().toISOString()
                };

                // Save user
                users.push(newUser);
                localStorage.setItem('shopvue_users', JSON.stringify(users));

                // Auto-login after signup
                const userData = {
                    id: newUser.id,
                    email: newUser.email,
                    fullName: newUser.fullName,
                    phone: newUser.phone
                };
                localStorage.setItem('shopvue_user', JSON.stringify(userData));

                this.isLoggedIn = true;
                this.userEmail = newUser.email;
                this.signupSuccess = 'Account created successfully! Redirecting...';

                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1500);
            } catch (error) {
                console.error('Signup error:', error);
                this.signupError = error.message || 'An error occurred. Please try again.';
            } finally {
                this.signupLoading = false;
            }
        },

        /**
         * Handle social login
         */
        handleSocialLogin(provider) {
            console.log(`Social login with ${provider}`);
            // TODO: Implement social login (OAuth)
            alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`);
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
         * Handle login (from header)
         */
        handleLogin() {
            // Already on login page
            if (this.activeTab !== 'login') {
                this.activeTab = 'login';
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
            // Redirect to home
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

