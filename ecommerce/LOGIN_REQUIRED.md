# Login Required for Backend Features

## ⚠️ Important Notice

**You must be logged in via Django API** for orders to be saved to the backend database and appear in Django admin.

## 🔐 How to Login

1. **Go to login page:** http://localhost:5500/ecommerce/auth.html

2. **Use Django credentials:**
   - **Username:** `admin` (or your registered username)
   - **Password:** Your Django password

3. **After login, check localStorage:**
   - Open browser console (F12)
   - Go to Application → Local Storage
   - Look for `shopvue_access_token` - should have a token value
   - Look for `shopvue_user` - should have user data

## ✅ What Works Without Login

- Browsing products
- Adding to cart (localStorage)
- Viewing cart
- Guest checkout (saves to localStorage only)

## ❌ What Requires Login

- **Orders saved to Django backend** (requires token)
- **Orders appearing in Django admin** (requires token)
- **Cart synced to backend** (requires token)
- **Addresses saved to backend** (requires token)

## 🔍 Check If You're Logged In

Open browser console (F12) and type:
```javascript
localStorage.getItem('shopvue_access_token')
```

- **If it returns a token string:** You're logged in ✅
- **If it returns `null`:** You're not logged in ❌

## 🛠️ If Login Doesn't Work

1. **Check backend is running:**
   - Go to: http://localhost:8000/api/
   - Should see API response

2. **Check Django admin user exists:**
   - Go to: http://localhost:8000/admin/
   - Login with Django admin credentials
   - Or create a new user via signup

3. **Try signup instead:**
   - Go to signup page
   - Create a new account
   - This will also store the token

4. **Clear browser cache:**
   - Ctrl + Shift + Delete
   - Clear cached images and files
   - Hard refresh: Ctrl + Shift + R

## 📝 Current Behavior

- **Without token:** Orders saved to localStorage only (won't appear in Django admin)
- **With token:** Orders saved to both localStorage AND Django backend (will appear in Django admin)

---

**Make sure you're logged in before placing orders if you want them in Django admin!** 🔐












