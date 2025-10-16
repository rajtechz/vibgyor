// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://vibgyornode.onrender.com',
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
  SEND_EMAIL_OTP: '/user/auth/send-email-otp',
  VERIFY_EMAIL_OTP: '/user/auth/verify-email-otp',
  LOGIN: '/user/auth/login',
  LOGOUT: '/user/auth/logout',
  REFRESH_TOKEN: '/user/auth/refresh-token',
  
  // User endpoints
  GET_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  UPLOAD_AVATAR: '/user/avatar',
  UPLOAD_PROFILE_PICTURE: '/user/upload/profile-picture',
  
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
