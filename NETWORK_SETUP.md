# Network Connection Setup Guide

## Problem
"Network request failed" error when connecting to backend API from React Native app.

## Solution Options

### Option 1: ADB Reverse (RECOMMENDED for Android Physical Devices) ✅

This is the easiest and most reliable solution:

1. **Connect your Android device via USB** and enable USB debugging
2. **Verify device is connected:**
   ```bash
   adb devices
   ```
   You should see your device listed

3. **Set up port forwarding:**
   ```bash
   adb reverse tcp:3000 tcp:3000
   ```
   This forwards port 3000 from your device to your computer's localhost:3000

4. **Start your backend server** (if not running):
   ```bash
   # Navigate to your backend directory and run
   npm start
   # or
   node server.js
   ```

5. **Verify the config** - The app is now configured to use `http://localhost:3000`

6. **Reload the React Native app** - The connection should now work!

**Note:** You need to run `adb reverse tcp:3000 tcp:3000` every time you reconnect your device or restart ADB.

---

### Option 2: Network IP (Alternative if ADB doesn't work)

If ADB reverse doesn't work, you can use your network IP:

1. **Make sure your backend server is listening on 0.0.0.0:3000** (not just 127.0.0.1)
   ```javascript
   // In your backend server file (e.g., server.js or app.js)
   app.listen(3000, '0.0.0.0', () => {
     console.log('Server running on http://0.0.0.0:3000');
   });
   ```

2. **Find your computer's IP address:**
   ```bash
   ipconfig
   ```
   Look for your Wi-Fi adapter's IPv4 address (e.g., 192.168.29.173)

3. **Update `src/api/config.js`:**
   ```javascript
   if (Platform.OS === 'android') {
     return 'http://192.168.29.173:3000'; // Use your actual IP
   }
   ```

4. **Make sure your phone and computer are on the same WiFi network**

5. **Check Windows Firewall** - Allow Node.js through firewall if needed

---

### Option 3: Android Emulator

If using Android Emulator (not physical device):

1. **Update `src/api/config.js`:**
   ```javascript
   if (Platform.OS === 'android') {
     return 'http://10.0.2.2:3000'; // Special IP for Android emulator
   }
   ```

---

## Quick Fix Steps (ADB Reverse Method)

1. Connect Android device via USB
2. Enable USB Debugging on device
3. Run: `adb reverse tcp:3000 tcp:3000`
4. Start backend server
5. Reload React Native app

---

## Troubleshooting

### "adb: command not found"
- Make sure Android SDK platform-tools is in your PATH
- Or use full path: `C:\Users\Sonu_PP045\AppData\Local\Android\Sdk\platform-tools\adb.exe`

### "no devices/emulators found"
- Enable USB Debugging on your Android device
- Check USB cable connection
- Run: `adb kill-server && adb start-server`

### "Connection refused" or "Network request failed"
- Make sure backend server is running: `netstat -ano | findstr :3000`
- Try restarting ADB: `adb kill-server && adb start-server`
- Re-run ADB reverse: `adb reverse tcp:3000 tcp:3000`

### Backend server not starting
- Check if port 3000 is already in use
- Make sure backend dependencies are installed
- Check backend logs for errors

---

## Current Configuration

The app is currently configured to use `http://localhost:3000` which works with ADB reverse.

To switch to network IP, change line 25 in `src/api/config.js`:
```javascript
// From:
return 'http://localhost:3000';

// To:
return 'http://192.168.29.173:3000';
```

