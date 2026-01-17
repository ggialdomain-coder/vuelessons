/**
 * ProductCard Component
 * Displays a single product with image, name, price, and description
 */

const ProductCard = {
    template: `
        <div class="product-card" @click="handleClick">
            <div class="product-image">
                <img :src="product.image" :alt="product.name" @error="handleImageError">
                <div v-if="product.discount" class="product-badge">-{{ product.discount }}%</div>
            </div>
            <div class="product-content">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-price">
                    <span class="price-current">{{ formatPrice(product.price) }} KWD</span>
                    <span v-if="product.originalPrice" class="price-original">{{ formatPrice(product.originalPrice) }} KWD</span>
                </div>
            </div>
            <div class="product-overlay">
                <span class="view-text">View Details →</span>
            </div>
        </div>
    `,
    props: {
        product: {
            type: Object,
            required: true,
            validator(value) {
                return value.id && value.name && value.image && value.price;
            }
        }
    },
    methods: {
        handleClick() {
            this.$emit('product-click', this.product);
        },
        handleImageError(event) {
            // Fallback to placeholder if the provided image fails to load
            event.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(this.product.name)}`;
            event.target.alt = this.product.name;
        },
        formatPrice(price) {
            return parseFloat(price).toFixed(2);
        }
    }
};

