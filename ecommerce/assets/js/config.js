/**
 * Application Configuration
 * Replace YOUR_API_KEY with your actual Google Maps API key
 * Get your API key from: https://console.cloud.google.com/google/maps-apis
 */

const APP_CONFIG = {
    // Google Maps API Key
    // Get your key from: https://console.cloud.google.com/google/maps-apis
    // Required APIs: Maps JavaScript API, Places API
    GOOGLE_MAPS_API_KEY: 'YOUR_API_KEY',
    
    // Django Backend API Base URL
    // Auto-detect: use /api on Netlify (proxied), localhost for local dev
    API_BASE_URL: (function() {
        const hostname = window.location.hostname;
        if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
            return '/api'; // Use Netlify proxy
        }
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8000/api'; // Local development
        }
        return '/api'; // Default to proxy
    })()
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}

