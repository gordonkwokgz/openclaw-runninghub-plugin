#!/bin/bash

# OpenClaw RunningHub Plugin Installation Script

echo "🚀 Installing OpenClaw RunningHub Plugin..."

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies."
    exit 1
fi

# Create configuration file if it doesn't exist
if [ ! -f "runninghub-config.json" ]; then
    echo "📄 Creating configuration file..."
    cp runninghub-config-template.json runninghub-config.json
    echo "📝 Please edit runninghub-config.json with your credentials."
fi

echo "🎉 Installation completed!"
echo "🔧 Remember to configure your RunningHub credentials in runninghub-config.json"
echo "📖 Refer to README.md for detailed usage instructions"