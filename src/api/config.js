// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.29.119:3000',
  LOCAL_BASE_URL: 'http://192.168.29.119:3000',
  TIMEOUT: 10000,
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
