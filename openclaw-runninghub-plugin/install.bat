@echo off
echo 🚀 Installing OpenClaw RunningHub Plugin...

REM Check if node is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install Node.js (includes npm) first.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if installation was successful
if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

REM Create configuration file if it doesn't exist
if not exist "runninghub-config.json" (
    echo 📄 Creating configuration file...
    copy runninghub-config-template.json runninghub-config.json
    echo 📝 Please edit runninghub-config.json with your credentials.
)

echo.
echo 🎉 Installation completed!
echo 🔧 Remember to configure your RunningHub credentials in runninghub-config.json
echo 📖 Refer to README.md for detailed usage instructions
pause