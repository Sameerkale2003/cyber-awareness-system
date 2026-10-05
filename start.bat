@echo off
echo.
echo ============================================================
echo   Cyber Awareness System - FULL PROJECT LAUNCHER
echo ============================================================
echo.
echo Starting Backend...
start "CyberAware Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "CyberAware Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================================
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   Admin:    http://localhost:8000/admin  (admin / Admin@123)
echo   API Docs: http://localhost:8000/api/docs/
echo ============================================================
echo.
pause
