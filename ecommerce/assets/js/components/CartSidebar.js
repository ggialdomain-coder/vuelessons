/**
 * CartSidebar Component
 * Displays cart items in a sidebar with quantity, price, name, and subtotal
 */

const CartSidebar = {
    template: `
        <div v-if="show" class="cart-sidebar-overlay" @click.self="closeSidebar">
            <div class="cart-sidebar" @click.stop>
                <div class="cart-sidebar-header">
                    <h3>Shopping Cart</h3>
                    <button class="cart-close" @click="closeSidebar" aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="cart-sidebar-body">
                    <div v-if="cartItems.length === 0" class="cart-empty">
                        <p>Your cart is empty</p>
                    </div>
                    
                    <div v-else class="cart-items">
                        <div 
                            v-for="item in cartItems" 
                            :key="item.id" 
                            class="cart-item"
                        >
                            <div class="cart-item-image">
                                <img :src="item.image" :alt="item.name" @error="handleImageError">
                            </div>
                            <div class="cart-item-details">
                                <h4 class="cart-item-name">{{ item.name }}</h4>
                                <div class="cart-item-price">{{ formatPrice(item.price) }} KWD</div>
                                <div class="cart-item-quantity">
                                    <button @click="decreaseQuantity(item)" class="qty-btn">-</button>
                                    <span class="qty-value">{{ item.quantity }}</span>
                                    <button @click="increaseQuantity(item)" class="qty-btn">+</button>
                                </div>
                            </div>
                            <button @click="removeItem(item)" class="cart-item-remove" aria-label="Remove">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div v-if="cartItems.length > 0" class="cart-sidebar-footer">
                    <div class="cart-subtotal">
                        <div class="subtotal-row">
                            <span>Subtotal:</span>
                            <span class="subtotal-value">{{ formatPrice(subtotal) }} KWD</span>
                        </div>
                    </div>
                    <button @click="goToCart" class="btn-view-cart">View Cart</button>
                </div>
            </div>
        </div>
    `,
    props: {
        show: {
            type: Boolean,
            default: false
        },
        cartItems: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        subtotal() {
            return this.cartItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
        }
    },
    methods: {
        closeSidebar() {
            this.$emit('close');
        },
        increaseQuantity(item) {
            this.$emit('update-quantity', item, item.quantity + 1);
        },
        decreaseQuantity(item) {
            if (item.quantity > 1) {
                this.$emit('update-quantity', item, item.quantity - 1);
            } else {
                this.removeItem(item);
            }
        },
        removeItem(item) {
            this.$emit('remove-item', item);
        },
        goToCart() {
            this.$emit('go-to-cart');
        },
        formatPrice(price) {
            return parseFloat(price).toFixed(2);
        },
        handleImageError(event) {
            event.target.src = 'https://via.placeholder.com/100x100?text=Product';
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


