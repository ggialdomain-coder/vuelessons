# Django Backend Setup Instructions

## Step-by-Step Setup Guide

### Step 1: Install Python

**Windows:**
1. Download Python from https://www.python.org/downloads/
2. Run the installer
3. **IMPORTANT:** Check "Add Python to PATH" during installation
4. Verify installation: Open Command Prompt and type `python --version`

**Mac:**
- Usually pre-installed. Check with: `python3 --version`
- If not installed: `brew install python3`

**Linux:**
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip
```

### Step 2: Navigate to Backend Folder

Open terminal/command prompt and navigate to the backend folder:

```bash
cd ecommerce/backend
```

### Step 3: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` at the beginning of your command prompt.

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install Django and all required packages.

### Step 5: Create Database

```bash
python manage.py migrate
```

This creates the database tables.

### Step 6: Create Admin User

```bash
python manage.py createsuperuser
```

Enter:
- Username: (choose a username)
- Email: (your email)
- Password: (choose a strong password)

### Step 7: Run the Server

```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### Step 8: Test the API

1. Open browser: http://localhost:8000/api/categories/
2. You should see JSON data (empty array if no data)

### Step 9: Access Admin Panel

1. Go to: http://localhost:8000/admin/
2. Login with your superuser credentials
3. Add categories and products

## Common Issues

### "python is not recognized"
- Python is not in PATH
- Reinstall Python and check "Add Python to PATH"
- Or use full path: `C:\Python3x\python.exe`

### "No module named 'django'"
- Virtual environment not activated
- Make sure you see `(venv)` in your prompt
- Run: `pip install -r requirements.txt` again

### "Port 8000 already in use"
- Another program is using port 8000
- Use different port: `python manage.py runserver 8001`

### "ModuleNotFoundError"
- Make sure you're in the `backend` folder
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

## Next Steps

1. Add products via admin panel
2. Update frontend `config.js` to use: `http://localhost:8000/api`
3. Test API endpoints

## API Testing

You can test API endpoints using:
- Browser (for GET requests)
- Postman (for all requests)
- curl (command line)

Example:
```bash
curl http://localhost:8000/api/categories/
```

