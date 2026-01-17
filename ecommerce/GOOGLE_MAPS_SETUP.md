# Google Maps API Key Setup Guide

## Quick Setup

1. **Get Your Free API Key:**
   - Go to: https://console.cloud.google.com/google/maps-apis
   - Sign in with your Google account
   - Create a new project (or select existing)
   - Click "Get Started" or "Create API Key"

2. **Enable Required APIs:**
   - Go to "APIs & Services" > "Library"
   - Enable these APIs:
     - **Maps JavaScript API** (required for map display)
     - **Places API** (required for address autocomplete)

3. **Add Your API Key:**
   - Open `assets/js/config.js`
   - Replace `YOUR_API_KEY` with your actual API key:
   ```javascript
   GOOGLE_MAPS_API_KEY: 'AIzaSyYourActualKeyHere',
   ```

4. **Set API Restrictions (Recommended):**
   - Go to "APIs & Services" > "Credentials"
   - Click on your API key
   - Under "API restrictions", select "Restrict key"
   - Choose: "Maps JavaScript API" and "Places API"
   - Under "Application restrictions", you can restrict by HTTP referrer:
     - Add: `http://localhost/*` (for local testing)
     - Add: `http://yourdomain.com/*` (for production)

## Free Tier Limits

Google Maps offers a **$200 free credit per month**, which typically covers:
- 28,000 map loads
- 40,000 geocoding requests
- 17,000 places autocomplete requests

For most small to medium ecommerce sites, this is more than enough!

## Testing Without API Key

If you want to test the app without Google Maps:
- The location modal will still work for:
  - ✅ Current location (browser geolocation)
  - ✅ Saved addresses selection
  - ❌ Map selection (requires API key)
  - ❌ Address autocomplete (requires API key)

## Troubleshooting

**Error: "Google Maps JavaScript API error"**
- Check that your API key is correct in `config.js`
- Verify that "Maps JavaScript API" is enabled
- Check browser console for specific error messages

**Map not showing:**
- Make sure Places API is also enabled
- Check that your API key has proper restrictions set
- Verify the API key is loaded before the map initialization

**Autocomplete not working:**
- Ensure "Places API" is enabled in Google Cloud Console
- Check browser console for errors

## Security Note

⚠️ **Never commit your API key to public repositories!**
- Add `assets/js/config.js` to `.gitignore` if using version control
- Use environment variables in production
- Set up API key restrictions in Google Cloud Console












