import { Platform } from 'react-native';

// Detect if running on Android Emulator
// Android Emulator uses special IP: 10.0.2.2 to access host machine's localhost
// Physical devices and iOS simulator can use actual network IP

// For Android Emulator: use 10.0.2.2
// For Physical Device: use your actual IP (192.168.29.173)
// For iOS Simulator: use localhost or actual IP

const getBaseURL = () => {
  if (__DEV__) {
    // Development mode
    
    // RECOMMENDED: Use ADB Reverse for Android Physical Devices
    // This is the most reliable solution - run this command:
    // adb reverse tcp:3000 tcp:3000
    // Then use 'http://localhost:3000' or 'http://127.0.0.1:3000'
    
    // For Android:
    if (Platform.OS === 'android') {
      // Option 1: ADB Reverse (RECOMMENDED - Most Reliable)
      // Run: adb reverse tcp:3000 tcp:3000 (connect device via USB first)
      // Use 127.0.0.1 instead of localhost for better compatibility
      return 'http://127.0.0.1:3000';
      
      // Alternative: Use localhost (sometimes works better)
      // return 'http://localhost:3000';
      
      // Option 2: Network IP (if ADB reverse doesn't work)
      // Requires: Backend must listen on 0.0.0.0:3000 (not just 127.0.0.1)
      // Device and computer must be on same WiFi network
      // return 'http://192.168.29.173:3000';
      
      // Option 3: Android Emulator
      // Use this if running on Android Emulator (not physical device)
      // return 'http://10.0.2.2:3000';
    } else {
      // For iOS:
      // Physical Device: use network IP
      // Simulator: use localhost
      return 'http://localhost:3000'; // For iOS Simulator
      // return 'http://192.168.29.173:3000'; // For iOS Physical Device
    }
  }
  // Production
  return 'https://vibgyornode.onrender.com';
};

// API Configuration
export const API_CONFIG = {
  // Dynamic BASE_URL based on platform
  BASE_URL: getBaseURL(),
  // Keep local IP for reference
  LOCAL_BASE_URL: 'http://192.168.29.173:3000',
  // Emulator URL for Android
  ANDROID_EMULATOR_URL: 'http://10.0.2.2:3000',
  TIMEOUT: 15000, // Increased timeout for network requests
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  SEND_OTP: '/user/auth/send-otp',
  VERIFY_OTP: '/user/auth/verify-otp',
  RESEND_OTP: '/user/auth/resend-otp',
  SEND_EMAIL_OTP: '/user/auth/email/send-otp',
  VERIFY_EMAIL_OTP: '/user/auth/email/verify-otp',
  LOGIN: '/user/auth/login',
  LOGOUT: '/user/auth/logout',
  REFRESH_TOKEN: '/user/auth/refresh-token',
  UPDATE_ACCESS_TOKEN: '/user/auth/update-access-token',
  
  // User endpoints
  GET_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  UPLOAD_AVATAR: '/user/avatar',
  UPLOAD_PROFILE_PICTURE: '/user/upload/profile-picture',
  
  // Username endpoints
  CHECK_USERNAME_AVAILABLE: '/user/username/available',
  GET_USERNAME_SUGGESTIONS: '/user/username/suggest',
  
          // Profile endpoints
          UPDATE_USER_PROFILE: '/user/auth/profile',
          GET_USER_PROFILE: '/user/auth/profile',
          GET_PROFILE_STEP: '/user/auth/profile/step',
          UPLOAD_ID_PROOF: '/user/upload/id-proof',
          GET_CATALOG: '/user/catalog',
  
  // Social endpoints
  GET_POSTS: '/social/posts',
  CREATE_POST: '/social/posts',
  LIKE_POST: '/social/posts/:id/like',
  COMMENT_POST: '/social/posts/:id/comment',
  
  // Dating endpoints
  GET_MATCHES: '/dating/matches',
  SWIPE_USER: '/dating/swipe',
  GET_PROFILE: '/dating/profile',
};
