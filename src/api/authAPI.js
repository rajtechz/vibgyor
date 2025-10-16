import apiClient from './client';
import { API_ENDPOINTS } from './config';

// Auth API Service
export const authAPI = {
  // Send OTP to phone number
  sendOTP: async (phoneNumber, countryCode = '+91') => {
    console.log('🔐 AuthAPI: sendOTP called');
    console.log('📱 Phone Number:', phoneNumber);
    console.log('🌍 Country Code:', countryCode);
    console.log('🔗 Endpoint:', API_ENDPOINTS.SEND_OTP);
    console.log('🌐 Full URL:', `https://vibgyornode.onrender.com${API_ENDPOINTS.SEND_OTP}`);
    
    try {
      const requestData = {
        phoneNumber,
        countryCode,
      };
      console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));
      
      const response = await apiClient.post(API_ENDPOINTS.SEND_OTP, requestData);
      console.log('✅ AuthAPI: sendOTP success');
      console.log('📊 Response Data:', JSON.stringify(response, null, 2));
      
      return {
        success: true,
        data: response,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: sendOTP error');
      console.log('💥 Error Type:', typeof error);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to send OTP',
      };
    }
  },

  // Verify OTP
  verifyOTP: async (phoneNumber, otp, countryCode = '+91') => {
    console.log('🔐 AuthAPI: verifyOTP called');
    console.log('📱 Phone Number:', phoneNumber);
    console.log('🔢 OTP:', otp);
    console.log('🌍 Country Code:', countryCode);
    console.log('🔗 Endpoint:', API_ENDPOINTS.VERIFY_OTP);
    console.log('🌐 Full URL:', `https://vibgyornode.onrender.com${API_ENDPOINTS.VERIFY_OTP}`);
    
    try {
      const requestData = {
        phoneNumber,
        otp,
        countryCode,
      };
      console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));
      
      const response = await apiClient.post(API_ENDPOINTS.VERIFY_OTP, requestData);
      console.log('✅ AuthAPI: verifyOTP success');
      console.log('📊 Response Data:', JSON.stringify(response, null, 2));
      
      return {
        success: true,
        data: response,
        message: 'OTP verified successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: verifyOTP error');
      console.log('💥 Error Type:', typeof error);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));
      
      return {
        success: false,
        error: error.message,
        message: 'Invalid OTP',
      };
    }
  },

  // Login user
  login: async (phoneNumber, countryCode = '+91') => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        phoneNumber,
        countryCode,
      });
      return {
        success: true,
        data: response,
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Login failed',
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
      return {
        success: true,
        data: response,
        message: 'Logout successful',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Logout failed',
      };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN);
      return {
        success: true,
        data: response,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Token refresh failed',
      };
    }
  },
};

export default authAPI;
