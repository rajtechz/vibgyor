# React Native Debugging Setup

## 🚀 **Method 1: React Native Debugger (Recommended)**

### **Install React Native Debugger:**
```bash
# Download from: https://github.com/jhen0409/react-native-debugger/releases
# Or install via Homebrew (macOS):
brew install --cask react-native-debugger
```

### **Setup:**
1. **Start React Native Debugger** before starting your app
2. **Open your app** in simulator/device
3. **Press Cmd+D** (iOS) or **Cmd+M** (Android) to open developer menu
4. **Select "Debug"** - this will open React Native Debugger
5. **Enable "Debug JS Remotely"** in the debugger

## 🔧 **Method 2: Chrome DevTools**

### **Setup:**
1. **Start your app** in simulator/device
2. **Press Cmd+D** (iOS) or **Cmd+M** (Android)
3. **Select "Debug"** - this will open Chrome
4. **Open Chrome DevTools** (F12)
5. **Go to Console tab** to see logs

## 📱 **Method 3: Flipper (Advanced)**

### **Install Flipper:**
```bash
# Download from: https://fbflipper.com/
# Or install via Homebrew (macOS):
brew install --cask flipper
```

### **Setup:**
1. **Install Flipper** on your computer
2. **Start Flipper** before starting your app
3. **Start your app** - Flipper will auto-detect it
4. **Use Flipper's Network Inspector** to see API calls

## 🎯 **Debugging Your API:**

### **Console Logs to Look For:**
```
🚀 API Request: POST https://vibgyornode.onrender.com/user/auth/send-otp
📤 Request Body: {"phoneNumber":"9876543210","countryCode":"+91"}
📋 Request Headers: {"Content-Type":"application/json","Accept":"application/json"}
📡 Response Status: 200 OK
📥 Response Headers: {"content-type":"application/json"}
📄 Raw Response Text: {"success":true,"message":"OTP sent"}
✅ Parsed JSON Response: {"success":true,"message":"OTP sent"}
```

### **Debugger Breakpoints:**
- **Line 57**: Before API request
- **Line 82**: After successful response
- **Line 94**: On error

## 🔍 **Troubleshooting:**

### **If Debugger Doesn't Work:**
1. **Restart Metro bundler**: `npx react-native start --reset-cache`
2. **Restart your app**
3. **Check if debugger is enabled** in developer menu

### **If Console Logs Don't Show:**
1. **Enable "Debug JS Remotely"**
2. **Check Chrome DevTools Console**
3. **Use React Native Debugger** for better debugging

## 📊 **API Response Debugging:**

### **What to Check:**
1. **Request URL** - Should be `https://vibgyornode.onrender.com/user/auth/send-otp`
2. **Request Body** - Should contain phoneNumber and countryCode
3. **Response Status** - Should be 200 for success
4. **Response Data** - Should contain success/error message

### **Common Issues:**
- **404 Error**: Wrong endpoint URL
- **500 Error**: Server error
- **Network Error**: Server not running
- **CORS Error**: Server CORS settings
- **Timeout**: Network connection issues

## 🎉 **Success Indicators:**
- ✅ **Request sent successfully**
- ✅ **Response status 200**
- ✅ **Valid JSON response**
- ✅ **Success message in response**
