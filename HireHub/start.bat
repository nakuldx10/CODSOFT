@echo off
echo ========================================
echo   Starting HireHub - Full Stack App
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Dev Server...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting up!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5001
echo ========================================
echo.
echo Press any key to close this window...
pause > nul
