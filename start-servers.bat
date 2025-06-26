@echo off
echo Starting Video Scene Classification Project...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend && python app.py"

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd Frontend/my-project && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul 