@echo off
echo.
echo ============================================================
echo   Cyber Awareness System - Frontend Setup
echo ============================================================
echo.
echo [1/2] Installing npm dependencies...
npm install
if errorlevel 1 (
    echo ERROR: npm install failed. Is Node.js installed?
    pause
    exit /b 1
)
echo.
echo [2/2] Starting Vite development server...
echo.
echo ============================================================
echo   Frontend running at: http://localhost:5173
echo   Make sure the backend is also running on port 8000!
echo ============================================================
echo.
npm run dev
