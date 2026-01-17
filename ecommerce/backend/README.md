# Django Ecommerce Backend

Simple and scalable Django REST API backend for the ShopVue ecommerce frontend.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Quick Setup (5 minutes)

### Step 1: Install Python

If you don't have Python installed:
- Windows: Download from https://www.python.org/downloads/
- Mac: Usually pre-installed, or use Homebrew: `brew install python3`
- Linux: `sudo apt-get install python3 python3-pip`

### Step 2: Create Virtual Environment

Open terminal/command prompt in the `backend` folder and run:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Run Database Migrations

```bash
python manage.py migrate
```

### Step 5: Create Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### Step 6: Load Sample Data (Optional)

```bash
python manage.py loaddata sample_data.json
```

### Step 7: Run the Server

```bash
python manage.py runserver
```

The API will be available at: **http://localhost:8000**

## API Endpoints

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/search/?q=query` - Search products
- `GET /api/products/?category=slug` - Filter by category

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{slug}/products/` - Get products by category

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/{id}/` - Update cart item
- `DELETE /api/cart/remove/{id}/` - Remove from cart

### Orders
- `GET /api/orders/` - Get user's orders
- `POST /api/orders/create/` - Create new order

### Addresses
- `GET /api/addresses/` - Get user's addresses
- `POST /api/addresses/` - Add new address
- `PUT /api/addresses/{id}/` - Update address
- `DELETE /api/addresses/{id}/` - Delete address

## Admin Panel

Access the Django admin panel at: **http://localhost:8000/admin/**

Login with the superuser account you created.

## Connecting Frontend

Update `assets/js/config.js` in your frontend:

```javascript
API_BASE_URL: 'http://localhost:8000/api'
```

## Project Structure

```
backend/
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── shopvue/              # Main project folder
│   ├── settings.py       # Project settings
│   ├── urls.py          # Main URL configuration
│   └── wsgi.py          # WSGI configuration
├── api/                  # API app
│   ├── models.py        # Database models
│   ├── serializers.py   # API serializers
│   ├── views.py         # API views
│   └── urls.py          # API URLs
└── README.md            # This file
```

## Common Commands

```bash
# Run server
python manage.py runserver

# Create database migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access Django shell
python manage.py shell
```

## Troubleshooting

**Error: "No module named 'django'"**
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

**Error: "Port 8000 already in use"**
- Use a different port: `python manage.py runserver 8001`

**CORS errors in browser**
- Make sure `django-cors-headers` is installed
- Check `settings.py` has CORS configured

## Next Steps

1. Update frontend API calls to use real endpoints
2. Add product images via admin panel
3. Customize models as needed
4. Deploy to production (Heroku, AWS, etc.)

## Support

For Django documentation: https://docs.djangoproject.com/
For DRF documentation: https://www.django-rest-framework.org/












