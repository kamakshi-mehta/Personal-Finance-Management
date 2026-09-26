@echo off
echo ===================================================
echo Starting MongoDB Database Service...
echo ===================================================
echo.
net start MongoDB
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to start MongoDB service.
    echo Make sure to Right-Click this file and choose "Run as administrator"!
    echo.
) else (
    echo.
    echo [SUCCESS] MongoDB is now running! 
    echo Refresh your browser at http://localhost:3000 to view your data.
    echo.
)
pause
