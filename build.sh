#!/bin/bash

# Exit on error
set -e

echo "🚀 Building Tabspire extension..."

# Clean previous build
rm -rf build
rm -f tabspire.zip

# Build the React app
pnpm build

# Create a new directory for the extension package
mkdir -p extension-package

# Copy manifest file
cp manifest.json extension-package/

# Copy icons directory
cp -r icons extension-package/

# Copy built files from React build
cp -r build/* extension-package/

# Create zip file
cd extension-package
zip -r ../tabspire.zip . -x "*.DS_Store"

# Clean up
cd ..
rm -rf extension-package

pnpm run build:production

echo "✅ Build complete! Extension packaged as tabspire.zip"
echo "📦 You can now upload tabspire.zip to the Chrome Web Store" 