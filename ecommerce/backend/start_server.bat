@echo off
REM Windows batch script to start Django server
echo Starting Django Server...
echo.

REM Activate virtual environment
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo Virtual environment not found. Creating...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
    echo Running migrations...
    python manage.py migrate
    echo.
)

echo Starting server at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python manage.py runserver












