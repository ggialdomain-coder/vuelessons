# Automated Backend Deployment Script
Write-Host "Starting automated backend deployment setup..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "ecommerce\backend\manage.py")) {
    Write-Host "Error: Run this from the project root (vuelessons folder)" -ForegroundColor Red
    exit 1
}

# Step 1: Ensure git is initialized and committed
Write-Host "Step 1: Checking Git repository..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    Write-Host "   Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - ready for deployment"
    git branch -M main
    Write-Host "   Git initialized" -ForegroundColor Green
} else {
    Write-Host "   Git already initialized" -ForegroundColor Green
    $status = git status --short
    if ($status) {
        Write-Host "   Adding uncommitted changes..." -ForegroundColor Yellow
        git add .
        git commit -m "Update for deployment"
        Write-Host "   Changes committed" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Step 2: GitHub Setup (YOU NEED TO DO THIS):" -ForegroundColor Cyan
Write-Host "   1. Go to: https://github.com/new" -ForegroundColor White
Write-Host "   2. Repository name: vuelessons" -ForegroundColor White
Write-Host "   3. Make it PUBLIC" -ForegroundColor White
Write-Host "   4. DO NOT add README, .gitignore, or license" -ForegroundColor White
Write-Host "   5. Click Create repository" -ForegroundColor White
Write-Host ""
Write-Host "   Then run (replace YOUR_USERNAME):" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/vuelessons.git" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""

Write-Host "Step 3: Render Deployment (AFTER GitHub):" -ForegroundColor Cyan
Write-Host "   1. Go to: https://render.com" -ForegroundColor White
Write-Host "   2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "   3. Click New + then Web Service" -ForegroundColor White
Write-Host "   4. Connect your vuelessons repository" -ForegroundColor White
Write-Host "   5. Configure:" -ForegroundColor White
Write-Host "      Name: shopvue-api" -ForegroundColor Yellow
Write-Host "      Root Directory: ecommerce/backend" -ForegroundColor Yellow
Write-Host "      Build: pip install -r requirements.txt && python manage.py collectstatic --noinput" -ForegroundColor Yellow
Write-Host "      Start: python manage.py migrate && (python manage.py create_sample_data || true) && (python manage.py create_default_admin || true) && gunicorn shopvue.wsgi:application" -ForegroundColor Yellow
Write-Host "   6. Environment Variables:" -ForegroundColor White
Write-Host "      SECRET_KEY: (click Generate)" -ForegroundColor Yellow
Write-Host "      DEBUG: false" -ForegroundColor Yellow
Write-Host "      ALLOWED_HOSTS: .onrender.com,.netlify.app,localhost,127.0.0.1" -ForegroundColor Yellow
Write-Host "   7. Click Create Web Service" -ForegroundColor White
Write-Host "   8. Wait 5-10 minutes" -ForegroundColor White
Write-Host ""

Write-Host "Setup complete! Follow the steps above." -ForegroundColor Green
Write-Host ""
Write-Host "TIP: Frontend is already deployed at:" -ForegroundColor Cyan
Write-Host "   https://vuelessons-learn.netlify.app/ecommerce/" -ForegroundColor White
Write-Host "   It will work once Render backend is live!" -ForegroundColor Cyan
Write-Host ""
