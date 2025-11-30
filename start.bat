@echo off
REM BVOX Finance - Quick Start Script for Windows

echo.
echo ╔════════════════════════════════════════════╗
echo ║     BVOX Finance Quick Start               ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✓ Node.js detected
node --version
echo.

REM Set PORT if not already set
if "%PORT%"=="" (
    set PORT=3000
)

echo Starting BVOX Finance development server on port %PORT%...
echo Open your browser at: http://localhost:%PORT%
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
node server.js

pause
