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
    API_BASE_URL: 'http://localhost:8000/api'
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}

