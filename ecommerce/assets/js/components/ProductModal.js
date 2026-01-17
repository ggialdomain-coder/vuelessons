/**
 * ProductModal Component
 * Displays product details in a popup modal
 */

const ProductModal = {
    template: `
        <div v-if="show" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <button class="modal-close" @click="closeModal" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <div v-if="product" class="modal-body">
                    <div class="modal-image">
                        <img :src="product.image" :alt="product.name" @error="handleImageError">
                        <div v-if="product.discount" class="product-badge">-{{ product.discount }}%</div>
                    </div>
                    
                    <div class="modal-details">
                        <h2 class="modal-title">{{ product.name }}</h2>
                        <p class="modal-description">{{ product.description }}</p>
                        
                        <div class="modal-price-section">
                            <div class="product-price">
                                <span class="price-current">{{ formatPrice(product.price) }} KWD</span>
                                <span v-if="product.originalPrice" class="price-original">{{ formatPrice(product.originalPrice) }} KWD</span>
                            </div>
                            <div v-if="product.discount" class="discount-info">
                                Save {{ formatPrice(product.originalPrice - product.price) }} KWD
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn-add-cart" @click="addToCart">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="m1 1 4 4 2 8h12l2-8H5"></path>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
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
        product: {
            type: Object,
            default: null
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        addToCart() {
            this.$emit('add-to-cart', this.product);
            // Optionally close modal after adding to cart
            // this.closeModal();
        },
        formatPrice(price) {
            return parseFloat(price).toFixed(2);
        },
        handleImageError(event) {
            // Fallback to placeholder if the provided image fails to load
            event.target.src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(this.product.name)}`;
            event.target.alt = this.product.name;
        }
    },
    watch: {
        show(newVal) {
            // Prevent body scroll when modal is open
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


