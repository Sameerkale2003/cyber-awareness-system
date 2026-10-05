@echo off
echo.
echo ============================================================
echo   Cyber Awareness System - Backend Setup
echo ============================================================
echo.

echo [1/6] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment. Is Python installed?
    pause
    exit /b 1
)

echo [2/6] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/6] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

echo [4/6] Running database migrations...
python manage.py makemigrations accounts
python manage.py makemigrations learning
python manage.py makemigrations quizzes
python manage.py makemigrations progress
python manage.py migrate
if errorlevel 1 (
    echo ERROR: Migration failed.
    pause
    exit /b 1
)

echo [5/6] Populating database with initial content...
python manage.py populate_data

echo [6/6] Starting Django development server...
echo.
echo ============================================================
echo   Backend running at: http://localhost:8000
echo   Admin panel:        http://localhost:8000/admin
echo   API docs:           http://localhost:8000/api/docs/
echo   Login:              admin / Admin@123
echo ============================================================
echo.
python manage.py runserver
