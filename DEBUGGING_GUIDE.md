# React Native Debugging Guide - Console Logs Not Showing

## 🚨 **Problem: Console logs not appearing in React Native DevTools**

### **Step 1: Check Debug JS Remotely**
1. **Open your app** in simulator/device
2. **Press Cmd+D** (iOS) or **Cmd+M** (Android)
3. **Select "Debug"** or **"Debug JS Remotely"**
4. **Check if "Stop Debugging JS Remotely"** appears (means it's active)

### **Step 2: Clear Console Filters**
1. **In React Native DevTools**, look for:
   - **"55 hidden"** text in top right
   - **"Default levels"** dropdown
   - **"token"** input field
2. **Clear all filters:**
   - Click **"Default levels"** → Select all (Verbose, Info, Warnings, Errors, Debug)
   - Clear **"token"** input field
   - Click **"55 hidden"** to show hidden messages

### **Step 3: Restart Metro Bundler**
```bash
# Stop current Metro (Ctrl+C)
# Then restart with cache reset:
npx react-native start --reset-cache
```

### **Step 4: Test Basic Console Logs**
1. **Add this to App.js** (already added):
```javascript
console.log('🚀 App.js: Starting app initialization');
console.warn('⚠️ App.js: This is a warning test');
console.error('❌ App.js: This is an error test');
```

### **Step 5: Check Multiple Debugging Tools**
1. **Close all other debugging tools** (Chrome DevTools, React Native Debugger)
2. **Use only React Native DevTools**
3. **Make sure only one debugger is connected**

### **Step 6: Verify App is Running**
1. **Check if app is actually running** in simulator/device
2. **Navigate to LoginScreen** to trigger console logs
3. **Enter phone number** and click Submit

## 🔧 **Troubleshooting Steps:**

### **If Still No Logs:**

#### **Method 1: Use React Native Debugger**
```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Start it before starting your app
# Then start your app normally
```

#### **Method 2: Use Chrome DevTools**
1. **Press Cmd+D** → **"Debug"**
2. **Chrome will open automatically**
3. **Press F12** to open DevTools
4. **Go to Console tab**

#### **Method 3: Use Flipper**
```bash
# Install Flipper
brew install --cask flipper

# Start Flipper before starting your app
# Flipper will auto-detect your app
```

## 📱 **Expected Console Output:**

When you open the app, you should see:
```
🚀 App.js: Starting app initialization
📦 App.js: Store object: [Redux Store Object]
📦 App.js: Store type: object
📦 App.js: Store keys: ["dispatch", "getState", "subscribe"]
⚠️ App.js: This is a warning test
❌ App.js: This is an error test
ℹ️ App.js: This is an info test
🎯 App.js: App component rendering
```

When you click Submit on LoginScreen:
```
🎯 LoginScreen: handleSubmit called
📱 Phone Number: 9876543210
🌍 Country Code: +91
✅ LoginScreen: Validation passed, proceeding with API call
💾 LoginScreen: Storing phone number in Redux
📱 LoginScreen: Phone action: {type: "auth/setPhoneNumber", payload: {...}}
📤 LoginScreen: Dispatching sendOTP action
📤 LoginScreen: sendOTP function: [Function]
📤 LoginScreen: sendOTP type: function
🔄 Redux: sendOTP thunk called
📱 Redux Phone: 9876543210
🌍 Redux Country: +91
```

## 🎯 **Quick Fix Commands:**

```bash
# 1. Stop Metro
Ctrl+C

# 2. Clear all caches
npx react-native start --reset-cache

# 3. If still not working, try:
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

## 🔍 **Check These Settings:**

1. **React Native DevTools Console:**
   - No filters active
   - All log levels enabled
   - "55 hidden" should be 0

2. **App Settings:**
   - Debug JS Remotely: ON
   - Only one debugger connected
   - App is running and stable

3. **Metro Bundler:**
   - Running without errors
   - Cache cleared
   - No port conflicts
