# Quick Start Guide - Django Backend

## For HTML Developers (Simple Version)

### What is Django?
Django is a Python framework that creates APIs (Application Programming Interfaces) that your frontend can talk to.

Think of it like this:
- **Frontend (HTML/JS)**: The storefront customers see
- **Backend (Django)**: The warehouse that stores products, users, orders, etc.

### 5-Minute Setup

1. **Open Terminal/Command Prompt**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type `Terminal`, press Enter

2. **Go to Backend Folder**
   ```bash
   cd ecommerce/backend
   ```

3. **Windows Users - Double-click `start_server.bat`**
   - Or run in terminal: `start_server.bat`

4. **Mac/Linux Users - Run:**
   ```bash
   chmod +x start_server.sh
   ./start_server.sh
   ```

5. **That's it!** Server runs at http://localhost:8000

### First Time Setup

If it's your first time, you'll need to:

1. **Create admin account:**
   ```bash
   python manage.py createsuperuser
   ```
   Enter username, email, and password when prompted.

2. **Add products:**
   - Go to http://localhost:8000/admin/
   - Login with your admin account
   - Click "Categories" → "Add Category"
   - Click "Products" → "Add Product"

### What You Get

✅ **API Endpoints** - URLs your frontend can call
✅ **Database** - Stores products, users, orders
✅ **Admin Panel** - Easy way to manage data
✅ **Authentication** - User login/register
✅ **CORS Enabled** - Frontend can connect

### File Structure (Simple Explanation)

```
backend/
├── manage.py          # Main control script
├── requirements.txt   # List of packages needed
├── shopvue/          # Main project settings
│   └── settings.py   # Configuration
└── api/              # Your API code
    ├── models.py     # Database structure
    ├── views.py      # API endpoints
    └── urls.py       # URL routing
```

### Common Commands

```bash
# Start server
python manage.py runserver

# Stop server
Press Ctrl+C

# Create admin user
python manage.py createsuperuser

# View database (SQLite)
# File is at: backend/db.sqlite3
```

### Connecting Frontend

1. Make sure Django server is running
2. Update `assets/js/config.js`:
   ```javascript
   API_BASE_URL: 'http://localhost:8000/api'
   ```
3. Update `assets/js/services/api.js` to use real API calls

### Troubleshooting

**"python not found"**
- Install Python from python.org
- Make sure to check "Add to PATH" during installation

**"No module named django"**
- Run: `pip install -r requirements.txt`
- Make sure virtual environment is activated (you see `(venv)`)

**"Port 8000 in use"**
- Use different port: `python manage.py runserver 8001`
- Update frontend config to use port 8001

**"CORS error in browser"**
- Already configured! Make sure server is running
- Check browser console for specific error

### Need Help?

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- Check `SETUP_INSTRUCTIONS.md` for detailed steps
- Check `FRONTEND_INTEGRATION.md` for connecting frontend

### What's Next?

1. ✅ Backend is ready
2. ⏭️ Add products via admin panel
3. ⏭️ Connect frontend to use real API
4. ⏭️ Test everything works
5. ⏭️ Deploy to production (later)












