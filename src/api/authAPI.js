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

  // Resend OTP
  resendOTP: async (phoneNumber) => {
    console.log('🔄 AuthAPI: resendOTP called');
    console.log('📱 Phone Number:', phoneNumber);
    console.log('🔗 Endpoint:', API_ENDPOINTS.RESEND_OTP);
    console.log('🌐 Full URL:', `https://vibgyornode.onrender.com${API_ENDPOINTS.RESEND_OTP}`);
    
    try {
      const requestData = {
        phoneNumber,
      };
      console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));
      
      const response = await apiClient.post(API_ENDPOINTS.RESEND_OTP, requestData);
      console.log('✅ AuthAPI: resendOTP success');
      console.log('📊 Response Data:', JSON.stringify(response, null, 2));
      
      return {
        success: true,
        data: response,
        message: 'OTP resent successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: resendOTP error');
      console.log('💥 Error Type:', typeof error);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to resend OTP',
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

  // Send Email OTP
  sendEmailOTP: async (email) => {
    console.log('📧 AuthAPI: sendEmailOTP called');
    console.log('📧 Email:', email);
    console.log('🔗 Endpoint:', API_ENDPOINTS.SEND_EMAIL_OTP);
    console.log('🌐 Full URL:', `https://vibgyornode.onrender.com${API_ENDPOINTS.SEND_EMAIL_OTP}`);

    try {
      const requestData = {
        email,
      };
      console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));

      const response = await apiClient.post(API_ENDPOINTS.SEND_EMAIL_OTP, requestData);
      console.log('✅ AuthAPI: sendEmailOTP success');
      console.log('📊 Response Data:', JSON.stringify(response, null, 2));

      return {
        success: true,
        data: response,
        message: 'Email OTP sent successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: sendEmailOTP error');
      console.log('💥 Error Type:', typeof error);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));

      return {
        success: false,
        error: error.message,
        message: 'Failed to send email OTP',
      };
    }
  },

  // Verify Email OTP
  verifyEmailOTP: async (email, otp) => {
    console.log('📧 AuthAPI: verifyEmailOTP called');
    console.log('📧 Email:', email);
    console.log('🔢 OTP:', otp);
    console.log('🔗 Endpoint:', API_ENDPOINTS.VERIFY_EMAIL_OTP);
    console.log('🌐 Full URL:', `https://vibgyornode.onrender.com${API_ENDPOINTS.VERIFY_EMAIL_OTP}`);

    try {
      const requestData = {
        email,
        otp,
      };
      console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));

      const response = await apiClient.post(API_ENDPOINTS.VERIFY_EMAIL_OTP, requestData);
      console.log('✅ AuthAPI: verifyEmailOTP success');
      console.log('📊 Response Data:', JSON.stringify(response, null, 2));

      return {
        success: true,
        data: response,
        message: 'Email OTP verified successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: verifyEmailOTP error');
      console.log('💥 Error Type:', typeof error);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));

      return {
        success: false,
        error: error.message,
        message: 'Failed to verify email OTP',
      };
    }
  },

  // Upload Profile Picture
  uploadProfilePicture: async (imageData, accessToken) => {
    console.log('📸 AuthAPI: uploadProfilePicture called');
    console.log('📸 Image Data:', imageData);
    console.log('🔑 Access Token:', accessToken);
    console.log('🔗 Endpoint:', API_ENDPOINTS.UPLOAD_PROFILE_PICTURE);
    console.log('🌐 Full URL:', `https://vibgyornode.onrender.com${API_ENDPOINTS.UPLOAD_PROFILE_PICTURE}`);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', {
        uri: imageData.uri,
        type: imageData.type || 'image/jpeg',
        name: imageData.fileName || 'profile_picture.jpg',
      });

      console.log('📤 FormData created:', formData);
      console.log('📤 FormData entries:');
      for (let [key, value] of formData._parts) {
        console.log(`📤 ${key}:`, value);
      }

      // Make API call with FormData
      const response = await fetch(`https://vibgyornode.onrender.com${API_ENDPOINTS.UPLOAD_PROFILE_PICTURE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // Don't set Content-Type manually for FormData - let React Native handle it
        },
        body: formData,
      });

      console.log('📊 Raw Response Status:', response.status);
      console.log('📊 Raw Response Headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response Error Text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('✅ AuthAPI: uploadProfilePicture success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

      return {
        success: true,
        data: responseData,
        message: 'Profile picture uploaded successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: uploadProfilePicture error');
      console.log('💥 Error Type:', typeof error);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));

      return {
        success: false,
        error: error.message,
        message: 'Failed to upload profile picture',
      };
    }
  },
};

export default authAPI;
