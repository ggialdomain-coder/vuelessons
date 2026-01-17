# Frontend Integration Guide

## Connecting Frontend to Django Backend

### Step 1: Update API Configuration

Edit `ecommerce/assets/js/config.js`:

```javascript
const APP_CONFIG = {
    GOOGLE_MAPS_API_KEY: 'YOUR_API_KEY',
    
    // Change this to your Django backend URL
    API_BASE_URL: 'http://localhost:8000/api'
};
```

### Step 2: Update API Service

The frontend `api.js` file needs to be updated to use real API endpoints. Here's what needs to change:

#### Current (Mock):
```javascript
async getCategories() {
    return mockCategories;
}
```

#### Updated (Real API):
```javascript
async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
}
```

### Step 3: Handle Authentication

For authenticated requests, you need to include the JWT token:

```javascript
async getCart() {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/cart/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}
```

### Step 4: Update Login/Register

Update `auth-app.js` to use real API:

```javascript
async handleLoginSubmit() {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: this.loginForm.email, // or email
            password: this.loginForm.password
        })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('shopvue_user', JSON.stringify(data.user));
        window.location.href = 'account.html';
    } else {
        this.loginError = data.error || 'Login failed';
    }
}
```

## API Endpoints Reference

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/search/?q=query` - Search products
- `GET /api/products/?category=slug` - Filter by category
- `GET /api/products/?ordering=price` - Sort products

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{slug}/products/` - Get products by category

### Authentication
- `POST /api/auth/register/` - Register
  ```json
  {
    "username": "user123",
    "email": "user@example.com",
    "password": "password123",
    "password2": "password123"
  }
  ```
- `POST /api/auth/login/` - Login
  ```json
  {
    "username": "user123",
    "password": "password123"
  }
  ```
- `GET /api/auth/user/` - Get current user (requires auth)

### Cart
- `GET /api/cart/` - Get cart (requires auth)
- `POST /api/cart/` - Add to cart (requires auth)
  ```json
  {
    "product_id": 1,
    "quantity": 2
  }
  ```
- `PUT /api/cart/{id}/` - Update cart item (requires auth)
- `DELETE /api/cart/{id}/` - Remove from cart (requires auth)

### Orders
- `GET /api/orders/` - Get orders (requires auth)
- `POST /api/orders/create_order/` - Create order (requires auth)

### Addresses
- `GET /api/addresses/` - Get addresses (requires auth)
- `POST /api/addresses/` - Add address (requires auth)
- `PUT /api/addresses/{id}/` - Update address (requires auth)
- `DELETE /api/addresses/{id}/` - Delete address (requires auth)

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:8000`
- `http://127.0.0.1:8000`
- `http://localhost:5500` (VS Code Live Server)
- `file://` (local file access)

If you're using a different port, update `CORS_ALLOWED_ORIGINS` in `shopvue/settings.py`.

## Testing API Endpoints

### Using Browser
Just open the URL in browser:
- http://localhost:8000/api/categories/
- http://localhost:8000/api/products/

### Using curl
```bash
# Get categories
curl http://localhost:8000/api/categories/

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user123","password":"password123"}'

# Get cart (with token)
curl http://localhost:8000/api/cart/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import collection or create new request
2. Set URL: `http://localhost:8000/api/categories/`
3. For authenticated requests, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

Error responses look like:
```json
{
  "error": "Error message here"
}
```

## Next Steps

1. Update `api.js` to use real endpoints
2. Add authentication token handling
3. Test all endpoints
4. Handle errors gracefully in frontend
5. Add loading states












