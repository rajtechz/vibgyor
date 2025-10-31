# Fix Network Connection Issue

## Problem
App is getting "Network request failed" even though backend is running on `192.168.29.173:3000`

## Root Cause
The app needs to be **rebuilt** because we changed `gradle.properties` to enable cleartext traffic.

## Solution Steps

### Step 1: Stop Metro Bundler (if running)
Press `Ctrl+C` in Metro bundler terminal

### Step 2: Rebuild the App

**Option A: Quick Rebuild (Recommended)**
```bash
npx react-native run-android
```

**Option B: Clean Rebuild (if Option A doesn't work)**
```bash
# Clean previous build
cd android
./gradlew clean
cd ..

# Rebuild and run
npx react-native run-android
```

### Step 3: Verify After Rebuild

After rebuild, check console logs:
- ✅ Should see: `🚀 API Request: POST http://192.168.29.173:3000/user/auth/send-otp`
- ✅ Should see: `✅ App.js: Server connection successful!`

### Step 4: If Still Getting Error

Check these:

1. **Same WiFi Network?**
   - Phone and computer must be on the same WiFi network
   - Check phone's WiFi settings

2. **Backend Server Running?**
   - Backend should be running on port 3000
   - Check backend terminal for "Server listening on port 3000"

3. **Firewall?**
   - Windows Firewall rule has been added for port 3000
   - If still blocked, temporarily disable firewall to test

4. **IP Address Changed?**
   - Run `ipconfig` and check your current IP
   - Update `src/api/config.js` if IP changed from `192.168.29.173`

## Current Configuration
- Base URL: `http://192.168.29.173:3000`
- Cleartext Traffic: Enabled (`usesCleartextTraffic=true`)
- Backend: Listening on `0.0.0.0:3000` ✅
- Firewall: Port 3000 allowed ✅

