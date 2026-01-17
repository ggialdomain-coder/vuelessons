/**
 * API Service Layer
 * Integrated with Django REST Framework backend
 * Falls back to mock data if API is unavailable
 */

// Use /api on Netlify (proxied to Render backend); localhost for local dev
const API_BASE_URL = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.API_BASE_URL)
  ? APP_CONFIG.API_BASE_URL
  : (window.location.hostname === 'vuelessons-learn.netlify.app' ? '/api' : 'http://localhost:8000/api');

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('shopvue_access_token') || localStorage.getItem('auth_token');
}

// Helper function to get auth headers
function getAuthHeaders() {
    const token = getAuthToken();
    if (!token) {
        console.warn('No authentication token found. User may not be logged in.');
    }
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Helper function to transform Django response to frontend format
function transformProduct(product) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image || 'https://via.placeholder.com/400x300?text=No+Image',
        price: parseFloat(product.price),
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        discount: product.discount || 0,
        rating: parseFloat(product.rating) || 0,
        reviews: product.reviews_count || 0,
        category: product.category?.slug || product.category,
        slug: product.slug
    };
}

function transformCategory(category) {
    return {
        id: category.id,
        name: category.name,
        description: category.description || '',
        image: category.image || 'https://via.placeholder.com/400x300?text=No+Image',
        slug: category.slug
    };
}

const apiService = {
    /**
     * Fetch categories from API
     * @returns {Promise<Array>} Array of category objects
     */
    async getCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            return data.results ? data.results.map(transformCategory) : data.map(transformCategory);
        } catch (error) {
            console.warn('API Error, using fallback data:', error);
            // Fallback to mock data
            return this.getMockCategories();
        }
    },

    /**
     * Fetch all products from API
     * @returns {Promise<Array>} Array of product objects
     */
    async getProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products/`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            const products = data.results ? data.results : data;
            return products.map(transformProduct);
        } catch (error) {
            console.warn('API Error, using fallback data:', error);
            return this.getMockProducts();
        }
    },

    /**
     * Fetch products by category
     * @param {string} categorySlug - Category slug
     * @returns {Promise<Array>} Array of product objects
     */
    async getProductsByCategory(categorySlug) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/?category=${categorySlug}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            const products = data.results ? data.results : data;
            return products.map(transformProduct);
        } catch (error) {
            console.warn('API Error, using fallback data:', error);
            const allProducts = await this.getMockProducts();
            return allProducts.filter(product => product.category === categorySlug);
        }
    },

    /**
     * Search products by query
     * @param {string} query - Search query string
     * @returns {Promise<Array>} Array of matching product objects
     */
    async searchProducts(query) {
        if (!query || !query.trim()) {
            return [];
        }

        try {
            const response = await fetch(`${API_BASE_URL}/products/search/?q=${encodeURIComponent(query.trim())}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            return data.map(transformProduct);
        } catch (error) {
            console.warn('API Error, using fallback search:', error);
            // Fallback to client-side search
            const searchTerm = query.toLowerCase().trim();
            const allProducts = await this.getMockProducts();
            return allProducts.filter(product => {
                const nameMatch = product.name.toLowerCase().includes(searchTerm);
                const descMatch = product.description.toLowerCase().includes(searchTerm);
                const categoryMatch = product.category?.toLowerCase().includes(searchTerm);
                return nameMatch || descMatch || categoryMatch;
            });
        }
    },

    /**
     * User Registration
     */
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userData.email,
                    email: userData.email,
                    password: userData.password,
                    password2: userData.password,
                    first_name: userData.fullName?.split(' ')[0] || '',
                    last_name: userData.fullName?.split(' ').slice(1).join(' ') || ''
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || data.detail || 'Registration failed');
            }
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    /**
     * User Login
     */
    async login(username, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || data.detail || 'Login failed');
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Get current user
     */
    async getCurrentUser() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/user/`, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to get user');
            return await response.json();
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    },

    /**
     * Get user addresses
     */
    async getAddresses() {
        try {
            const response = await fetch(`${API_BASE_URL}/addresses/`, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to get addresses');
            const data = await response.json();
            return data.results ? data.results : data;
        } catch (error) {
            console.error('Get addresses error:', error);
            return [];
        }
    },

    /**
     * Create address
     */
    async createAddress(addressData) {
        try {
            const response = await fetch(`${API_BASE_URL}/addresses/`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create address');
            }
            return data;
        } catch (error) {
            console.error('Create address error:', error);
            throw error;
        }
    },

    /**
     * Update address
     */
    async updateAddress(addressId, addressData) {
        try {
            const response = await fetch(`${API_BASE_URL}/addresses/${addressId}/`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update address');
            }
            return data;
        } catch (error) {
            console.error('Update address error:', error);
            throw error;
        }
    },

    /**
     * Delete address
     */
    async deleteAddress(addressId) {
        try {
            const response = await fetch(`${API_BASE_URL}/addresses/${addressId}/`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return response.ok;
        } catch (error) {
            console.error('Delete address error:', error);
            throw error;
        }
    },

    /**
     * Get cart items
     */
    async getCart() {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/`, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.detail || errorData.error || `HTTP ${response.status}`;
                console.error('Get cart API error:', errorData);
                throw new Error(errorMsg);
            }
            const data = await response.json();
            const items = data.results ? data.results : (Array.isArray(data) ? data : []);
            return items.map(item => ({
                id: item.id,
                product: transformProduct(item.product),
                quantity: item.quantity,
                totalPrice: parseFloat(item.total_price || 0)
            }));
        } catch (error) {
            console.error('Get cart error:', error);
            throw error; // Don't return empty array, throw so caller can handle
        }
    },

    /**
     * Add to cart
     */
    async addToCart(productId, quantity = 1) {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });
            const data = await response.json();
            if (!response.ok) {
                const errorMsg = data.error || data.detail || data.message || JSON.stringify(data);
                console.error('Add to cart API error:', data);
                throw new Error(errorMsg);
            }
            return data;
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        }
    },

    /**
     * Update cart item
     */
    async updateCartItem(cartItemId, quantity) {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}/`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update cart');
            }
            return data;
        } catch (error) {
            console.error('Update cart error:', error);
            throw error;
        }
    },

    /**
     * Remove from cart
     */
    async removeFromCart(cartItemId) {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}/`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return response.ok;
        } catch (error) {
            console.error('Remove from cart error:', error);
            throw error;
        }
    },

    /**
     * Create order
     */
    async createOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/create_order/`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create order');
            }
            return data;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    },

    /**
     * Get user orders
     */
    async getOrders() {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/`, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to get orders');
            const data = await response.json();
            return data.results ? data.results : data;
        } catch (error) {
            console.error('Get orders error:', error);
            return [];
        }
    },

    // Mock data fallbacks
    getMockCategories() {
        return [
            { id: 1, name: 'Electronics', description: 'Latest gadgets and electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', slug: 'electronics' },
            { id: 2, name: 'Clothing', description: 'Fashion and apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop', slug: 'clothing' },
            { id: 3, name: 'Home & Garden', description: 'Home improvement and garden supplies', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', slug: 'home-garden' },
            { id: 4, name: 'Sports', description: 'Sports equipment and gear', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', slug: 'sports' },
            { id: 5, name: 'Books', description: 'Books and reading materials', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop', slug: 'books' },
            { id: 6, name: 'Toys & Games', description: 'Toys and games for all ages', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', slug: 'toys-games' },
            { id: 7, name: 'Beauty & Health', description: 'Beauty products and health essentials', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=300&fit=crop', slug: 'beauty-health' },
            { id: 8, name: 'Automotive', description: 'Car parts and accessories', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop', slug: 'automotive' }
        ];
    },

    getMockProducts() {
        return [
            { id: 1, name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', price: 199.99, originalPrice: 249.99, discount: 20, rating: 4.5, reviews: 128, category: 'electronics', slug: 'wireless-headphones' },
            { id: 2, name: 'Smart Watch Pro', description: 'Advanced fitness tracking and health monitoring smartwatch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', price: 299.99, originalPrice: null, discount: 0, rating: 4.8, reviews: 256, category: 'electronics', slug: 'smart-watch-pro' },
            { id: 3, name: 'Cotton T-Shirt', description: 'Comfortable 100% cotton t-shirt in various colors', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', price: 24.99, originalPrice: 29.99, discount: 17, rating: 4.3, reviews: 89, category: 'clothing', slug: 'cotton-t-shirt' },
            { id: 4, name: 'Running Shoes', description: 'Lightweight running shoes with cushioned sole', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', price: 89.99, originalPrice: 119.99, discount: 25, rating: 4.7, reviews: 234, category: 'sports', slug: 'running-shoes' },
            { id: 5, name: 'Garden Tool Set', description: 'Complete 10-piece stainless steel garden tool set', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', price: 79.99, originalPrice: 99.99, discount: 20, rating: 4.4, reviews: 67, category: 'home-garden', slug: 'garden-tool-set' },
            { id: 6, name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand for ergonomic workspace', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop', price: 39.99, originalPrice: null, discount: 0, rating: 4.4, reviews: 94, category: 'electronics', slug: 'laptop-stand' }
        ];
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiService;
}
