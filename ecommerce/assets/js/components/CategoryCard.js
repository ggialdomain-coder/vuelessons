/**
 * CategoryCard Component
 * Displays a single category with image, name, and description
 */

const CategoryCard = {
    template: `
        <div class="category-card" @click="handleClick">
            <div class="category-image">
                <img :src="category.image" :alt="category.name" @error="handleImageError">
            </div>
            <div class="category-content">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-description">{{ category.description }}</p>
            </div>
            <div class="category-overlay">
                <span class="view-text">View Products →</span>
            </div>
        </div>
    `,
    props: {
        category: {
            type: Object,
            required: true,
            validator(value) {
                return value.id && value.name && value.image;
            }
        }
    },
    methods: {
        handleClick() {
            this.$emit('category-click', this.category);
        },
        handleImageError(event) {
            // Fallback to placeholder if the provided image fails to load
            event.target.src = 'https://via.placeholder.com/400x300/667eea/ffffff?text=' + encodeURIComponent(this.category.name);
        }
    }
};

