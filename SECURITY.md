# 🔐 Tabspire Extension Security Guide

## Overview

This document outlines the security measures implemented for Tabspire Chrome extension, including the Verified CRX Uploads feature that ensures only authorized updates can be published.

## 🔑 Signing Keys

### Key Files
- **Private Key**: `.secure-keys/privatekey.pem` - **NEVER SHARE OR COMMIT**
- **Public Key**: `publickey.pem` - Safe to share, uploaded to Chrome Web Store

### Key Security
- **Private key permissions**: 600 (owner read/write only)
- **Storage**: `.secure-keys/` directory (excluded from git)
- **Backup**: Store securely in multiple locations

## 🚨 Critical Security Rules

### ❌ NEVER DO:
- Commit private key to git repository
- Share private key with anyone
- Store private key in Google Account
- Upload private key to public repositories
- Use private key on public/shared computers

### ✅ ALWAYS DO:
- Keep private key in secure location
- Use strong passwords for key storage
- Backup private key securely
- Rotate keys if compromised
- Monitor for unauthorized usage

## 🔐 Setting Up Verified CRX Uploads

### 1. Generate Keys (Already Done)
```bash
# Keys have been generated and stored in .secure-keys/
# Private key: .secure-keys/privatekey.pem
# Public key: publickey.pem
```

### 2. Chrome Web Store Setup
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Select your Tabspire extension
3. Go to **Package** tab
4. Find **Verified CRX Uploads** section
5. Click **Opt In**
6. Upload your `publickey.pem` file

### 3. Test Signing Process
```bash
# Build and sign the extension
npm run build:signed

# This will create tabspire.crx (signed extension)
```

## 🛠️ Build Commands

### Development Build
```bash
npm run build:extension
# Creates unsigned extension in build/ directory
```

### Production Build (Signed)
```bash
npm run build:production
# Creates signed .crx file and production zip
```

### Signing Only
```bash
npm run sign:extension
# Signs existing build/ directory
```

## 🔄 Update Process

### 1. Make Code Changes
### 2. Update Version Number
```bash
npm run bump
# Automatically increments version in package.json and manifest.json
```

### 3. Build and Sign
```bash
npm run build:production
# Creates signed extension ready for Chrome Web Store
```

### 4. Upload to Chrome Web Store
- Upload the `tabspire.crx` file
- Update listing information if needed
- Submit for review

## 🚨 Emergency Procedures

### Key Compromise
If private key is compromised:
1. **IMMEDIATELY** contact Chrome Web Store support
2. Generate new key pair
3. Update Chrome Web Store with new public key
4. Re-sign all future updates

### Lost Private Key
If private key is lost:
1. Contact Chrome Web Store support
2. Recovery process takes up to 1 week
3. Generate new key pair after recovery
4. Update Chrome Web Store

### Account Compromise
If developer account is compromised:
1. Change Google Account password immediately
2. Enable 2FA if not already enabled
3. Review all recent activity
4. Contact Chrome Web Store support

## 📋 Security Checklist

- [ ] Private key stored securely
- [ ] Private key backed up in multiple locations
- [ ] Private key excluded from git
- [ ] Public key uploaded to Chrome Web Store
- [ ] Verified CRX Uploads enabled
- [ ] Team members aware of security procedures
- [ ] Regular security reviews scheduled

## 🔍 Monitoring

### What to Monitor
- Unauthorized extension updates
- Unusual Chrome Web Store activity
- Failed signing attempts
- Extension installation patterns

### Warning Signs
- Extension updates without your knowledge
- Changes to Chrome Web Store listing
- Unusual user feedback
- Performance issues in extension

## 📞 Support Contacts

- **Chrome Web Store Support**: [Developer Support](https://support.google.com/chrome_webstore/)
- **Security Issues**: Report through Chrome Web Store dashboard
- **Emergency**: Use Chrome Web Store support channels

## 📚 Additional Resources

- [Chrome Extension Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Verified CRX Uploads Documentation](https://developer.chrome.com/docs/webstore/update#protect-package-updates)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program_policies/)

---

**Remember**: Security is everyone's responsibility. When in doubt, ask before acting.

