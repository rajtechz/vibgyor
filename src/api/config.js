import { Platform } from 'react-native';

// Network IP Configuration for Real Device Connections
// This IP is used for all API calls to connect from real devices
// Make sure your device and computer are on the same WiFi network

// Current Network IP (Wi-Fi adapter):
// IPv4 Address: 192.168.29.173
// Subnet Mask: 255.255.255.0
// Default Gateway: 192.168.29.1

const getBaseURL = () => {
  if (__DEV__) {
    // Development mode - Using network IP for real device connections
    // Backend must listen on 0.0.0.0:3000 (not just 127.0.0.1)
    // Device and computer must be on same WiFi network
    return 'http://192.168.29.173:3000';
  }
  // Production
  return 'https://vibgyornode.onrender.com';
};

// API Configuration
export const API_CONFIG = {
  // Base URL for all API calls - configured for real device connections
  BASE_URL: getBaseURL(),
  // Network IP for real devices (same as BASE_URL in dev mode)
  LOCAL_BASE_URL: 'http://192.168.29.173:3000',
  TIMEOUT: 15000, // Request timeout in milliseconds
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
  CREATE_USER_POST: '/user/posts', // User post creation endpoint
  GET_USER_POSTS: '/user/posts/me', // Get current user's posts
  LIKE_POST: '/social/posts/:id/like',
  COMMENT_POST: '/social/posts/:id/comment',
  
  // Dating endpoints
  GET_MATCHES: '/dating/matches',
  SWIPE_USER: '/dating/swipe',
  GET_PROFILE: '/dating/profile',
};
