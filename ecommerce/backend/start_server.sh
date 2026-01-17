#!/bin/bash
# Linux/Mac script to start Django server

echo "Starting Django Server..."
echo ""

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Virtual environment not found. Creating..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing dependencies..."
    pip install -r requirements.txt
    echo ""
    echo "Running migrations..."
    python manage.py migrate
    echo ""
fi

echo "Starting server at http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""
python manage.py runserver












