#!/usr/bin/env node

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Configuration
const EXTENSION_DIR = './build';
const PRIVATE_KEY_PATH = './.secure-keys/privatekey.pem';
const OUTPUT_CRX = 'build.crx'; // Chrome creates this filename by default

// Chrome executable paths for different platforms
const CHROME_PATHS = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
  ],
  linux: [
    'google-chrome',
    'google-chrome-stable',
    'chromium-browser',
    'chromium'
  ],
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ]
};

function findChromeExecutable() {
  const platform = process.platform;
  const paths = CHROME_PATHS[platform] || [];
  
  for (const chromePath of paths) {
    try {
      if (platform === 'win32') {
        // On Windows, check if file exists
        if (fs.existsSync(chromePath)) {
          return chromePath;
        }
      } else {
        // On Unix-like systems, check if executable
        execSync(`which "${chromePath}"`, { stdio: 'ignore' });
        return chromePath;
      }
    } catch (error) {
      // Continue to next path
    }
  }
  
  throw new Error(`Chrome executable not found. Please install Google Chrome or specify the path manually.`);
}

function checkPrerequisites() {
  // Check if extension directory exists
  if (!fs.existsSync(EXTENSION_DIR)) {
    throw new Error(`Extension directory '${EXTENSION_DIR}' not found. Run 'npm run build:extension' first.`);
  }
  
  // Check if private key exists
  if (!fs.existsSync(PRIVATE_KEY_PATH)) {
    throw new Error(`Private key '${PRIVATE_KEY_PATH}' not found. Please ensure your signing key is properly set up.`);
  }
  
  // Check if manifest.json exists in build directory
  const manifestPath = path.join(EXTENSION_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file not found in '${EXTENSION_DIR}'. Run 'npm run build:extension' first.`);
  }
}

function signExtension() {
  try {
    console.log('🔐 Checking prerequisites...');
    checkPrerequisites();
    
    console.log('🔍 Finding Chrome executable...');
    const chromePath = findChromeExecutable();
    console.log('✅ Found Chrome at:', chromePath);
    
    console.log('📦 Signing extension...');
    const command = `"${chromePath}" --pack-extension="${path.resolve(EXTENSION_DIR)}" --pack-extension-key="${path.resolve(PRIVATE_KEY_PATH)}"`;
    
    console.log('Executing:', command);
    execSync(command, { stdio: 'inherit' });
    
    // Check if CRX file was created
    if (fs.existsSync(OUTPUT_CRX)) {
      console.log(`✅ Extension signed successfully: ${OUTPUT_CRX}`);
      console.log(`📁 CRX file size: ${(fs.statSync(OUTPUT_CRX).size / 1024).toFixed(2)} KB`);
      
      // Rename to a more descriptive filename
      const version = require('../package.json').version;
      const newFilename = `tabspire-v${version}.crx`;
      fs.renameSync(OUTPUT_CRX, newFilename);
      console.log(`📝 Renamed to: ${newFilename}`);
    } else {
      throw new Error('CRX file was not created. Check Chrome output for errors.');
    }
    
  } catch (error) {
    console.error('❌ Error signing extension:', error.message);
    process.exit(1);
  }
}

// Run the signing process
if (require.main === module) {
  signExtension();
}

module.exports = { signExtension, findChromeExecutable, checkPrerequisites };
