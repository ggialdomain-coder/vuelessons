/**
 * Footer Component
 * Reusable footer with company info, links, and social media
 */

const Footer = {
    template: `
        <footer class="footer">
            <div class="footer-container">
                <!-- Company Info -->
                <div class="footer-section">
                    <h3>{{ companyName }}</h3>
                    <p>{{ companyDescription }}</p>
                    <div class="contact-info">
                        <p><strong>Email:</strong> {{ contactEmail }}</p>
                        <p><strong>Phone:</strong> {{ contactPhone }}</p>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="#" @click.prevent="navigate('home')">Home</a></li>
                        <li><a href="#" @click.prevent="navigate('categories')">Categories</a></li>
                        <li><a href="#" @click.prevent="navigate('about')">About Us</a></li>
                        <li><a href="#" @click.prevent="navigate('contact')">Contact</a></li>
                    </ul>
                </div>

                <!-- Customer Service -->
                <div class="footer-section">
                    <h4>Customer Service</h4>
                    <ul class="footer-links">
                        <li><a href="#" @click.prevent="navigate('faq')">FAQ</a></li>
                        <li><a href="#" @click.prevent="navigate('shipping')">Shipping Info</a></li>
                        <li><a href="#" @click.prevent="navigate('returns')">Returns</a></li>
                        <li><a href="#" @click.prevent="navigate('privacy')">Privacy Policy</a></li>
                    </ul>
                </div>

                <!-- Social Media -->
                <div class="footer-section">
                    <h4>Follow Us</h4>
                    <div class="social-links">
                        <a href="#" class="social-link" @click.prevent="openSocial('facebook')" title="Facebook">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" @click.prevent="openSocial('twitter')" title="Twitter">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" @click.prevent="openSocial('instagram')" title="Instagram">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" @click.prevent="openSocial('linkedin')" title="LinkedIn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                <rect x="2" y="9" width="4" height="12"/>
                                <circle cx="4" cy="4" r="2"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Copyright -->
            <div class="footer-bottom">
                <p>&copy; {{ currentYear }} {{ companyName }}. All rights reserved.</p>
            </div>
        </footer>
    `,
    data() {
        return {
            companyName: 'ShopVue',
            companyDescription: 'Your one-stop shop for all your needs. Quality products, great prices, excellent service.',
            contactEmail: 'info@shopvue.com',
            contactPhone: '+1 (555) 123-4567'
        };
    },
    computed: {
        currentYear() {
            return new Date().getFullYear();
        }
    },
    methods: {
        navigate(page) {
            this.$emit('navigate', page);
        },
        openSocial(platform) {
            // TODO: Add actual social media URLs
            console.log(`Opening ${platform}`);
            this.$emit('social-click', platform);
        }
    }
};














