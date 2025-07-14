@echo off
echo Starting ReWear Development Servers
echo ===================================

echo.
echo Starting backend server on port 5000...
start "ReWear Backend" cmd /k "npm run server"

echo.
echo Starting frontend server on port 3000...
start "ReWear Frontend" cmd /k "cd client && npm start"

echo.
echo Servers are starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul 