@echo off
echo ========================================
echo Django Backend Setup and Start
echo ========================================
echo.

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo Error creating venv. Trying python3...
        python3 -m venv venv
    )
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo.
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error installing dependencies. Please check Python installation.
    pause
    exit /b 1
)

REM Run migrations
echo.
echo Creating database...
python manage.py migrate
if errorlevel 1 (
    echo Error running migrations.
    pause
    exit /b 1
)

REM Create admin user
echo.
echo Creating default admin user...
python manage.py create_default_admin
if errorlevel 1 (
    echo Warning: Could not create admin user. You may need to create it manually.
)

REM Create sample data
echo.
echo Creating sample data...
python manage.py create_sample_data
if errorlevel 1 (
    echo Warning: Could not create sample data.
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Admin Panel: http://localhost:8000/admin/
echo Username: admin
echo Password: admin123
echo.
echo API Base: http://localhost:8000/api/
echo.
echo Starting server...
echo Press Ctrl+C to stop
echo.
python manage.py runserver












