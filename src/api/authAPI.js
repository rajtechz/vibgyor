import apiClient from './client';
import { API_ENDPOINTS, API_CONFIG } from './config';
import { Platform } from 'react-native';

// Get local server URL based on platform
const getLocalServerUrl = () => {
  // Using localhost for testing (server is running on localhost:3000)
  // iOS Simulator: localhost works
  // Android Emulator: 10.0.2.2 works
  // Physical device: Need network IP if server binds to 0.0.0.0
  
  if (Platform.OS === 'android') {
    // Android emulator special IP to access host machine
    return API_CONFIG.BASE_URL;
  } else {
    // iOS simulator - localhost works fine
    return API_CONFIG.BASE_URL;
  }
  
  // For network IP testing (if server is bound to 0.0.0.0):
  // return 'http://192.168.1.19:3000';
};

// Auth API Service
export const authAPI = {
  // Send OTP to phone number
  sendOTP: async (phoneNumber, countryCode = '+91') => {
   
    
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
    console.log('🌐 Full URL:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`);
    
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
    console.log('🌐 Full URL:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RESEND_OTP}`);
    
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
  sendEmailOTP: async (email, token) => {
    console.log('📧 AuthAPI: sendEmailOTP called');
    console.log('📧 Email:', email);
    console.log('🔑 Token:', token ? 'Present' : 'Missing');
    console.log('🔗 Endpoint:', API_ENDPOINTS.SEND_EMAIL_OTP);
    
    // For this endpoint only, always hit local backend
    const localUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SEND_EMAIL_OTP}`;
    console.log('🌐 Using LOCAL URL for sendEmailOTP:', localUrl);

    try {
      const requestData = {
        email,
      };
      console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));

      // Build headers with Authorization if token is provided
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📋 Request Headers:', headers);
      
      console.log('🌐 Attempting to fetch from:', localUrl);
      
      const response = await fetch(localUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
      });

      console.log('📡 Response received, status:', response.status);
      console.log('📡 Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response not OK:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      
      console.log('✅ AuthAPI: sendEmailOTP success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

      return {
        success: true,
        data: responseData,
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
  verifyEmailOTP: async (otp, token) => {
    console.log('📧 AuthAPI: verifyEmailOTP called');
    console.log('🔢 OTP:', otp);
    console.log('🔑 Token:', token ? 'Present' : 'Missing');
    console.log('🔗 Endpoint:', API_ENDPOINTS.VERIFY_EMAIL_OTP);
    
    // Use configured BASE_URL (set to local IP as requested)
    const localUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VERIFY_EMAIL_OTP}`;
    console.log('🌐 Using LOCAL URL:', localUrl);

    try {
      const requestData = {
        otp,
      };
      console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));

      // Build headers with Authorization if token is provided
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📋 Request Headers:', headers);
      
      console.log('🌐 Attempting to fetch from:', localUrl);
      
      const response = await fetch(localUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
      });

      console.log('📡 Response received, status:', response.status);
      console.log('📡 Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response not OK:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      
      console.log('✅ AuthAPI: verifyEmailOTP success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

      return {
        success: true,
        data: responseData,
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

  // Resend Email OTP
  resendEmailOTP: async (email, token) => {
    console.log('📧 AuthAPI: resendEmailOTP called');
    console.log('📧 Email:', email);
    console.log('🔑 Token:', token ? 'Present' : 'Missing');
    console.log('🔗 Endpoint:', API_ENDPOINTS.SEND_EMAIL_OTP);
    
    // Use configured BASE_URL (set to local IP as requested)
    const localUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SEND_EMAIL_OTP}`;
    console.log('🌐 Using LOCAL URL:', localUrl);

    try {
      const requestData = {
        email,
      };
      console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));

      // Build headers
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📋 Request Headers:', headers);
      
      console.log('🌐 Attempting to fetch from:', localUrl);
      
      const response = await fetch(localUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
      });

      console.log('📡 Response received, status:', response.status);
      console.log('📡 Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response not OK:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      
      console.log('✅ AuthAPI: resendEmailOTP success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

      return {
        success: true,
        data: responseData,
        message: 'Email OTP resent successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: resendEmailOTP error');
      console.log('💥 Error Message:', error.message);

      return {
        success: false,
        error: error.message,
        message: 'Failed to resend email OTP',
      };
    }
  },

  // Check Username Availability
  checkUsernameAvailable: async (username) => {
    console.log('👤 AuthAPI: checkUsernameAvailable called');
    console.log('👤 Username:', username);
    
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CHECK_USERNAME_AVAILABLE}?u=${username}`);
      console.log('✅ AuthAPI: checkUsernameAvailable success');
      console.log('📊 Response Data:', JSON.stringify(response, null, 2));
      
      return {
        success: true,
        data: response,
        message: 'Username check completed',
      };
    } catch (error) {
      console.log('❌ AuthAPI: checkUsernameAvailable error');
      console.log('💥 Error Message:', error.message);
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to check username availability',
      };
    }
  },

  // Get Username Suggestions
  getUsernameSuggestions: async (base) => {
    console.log('💡 AuthAPI: getUsernameSuggestions called');
    console.log('💡 Base:', base);
    
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_USERNAME_SUGGESTIONS}?base=${base}`);
      console.log('✅ AuthAPI: getUsernameSuggestions success');
      console.log('📊 Response Data:', JSON.stringify(response, null, 2));
      
      return {
        success: true,
        data: response,
        message: 'Username suggestions retrieved',
      };
    } catch (error) {
      console.log('❌ AuthAPI: getUsernameSuggestions error');
      console.log('💥 Error Message:', error.message);
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to get username suggestions',
      };
    }
  },

  // Get Profile Step
  getProfileStep: async (token) => {
    console.log('📊 AuthAPI: getProfileStep called');
    
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await apiClient.get(API_ENDPOINTS.GET_PROFILE_STEP, { headers });
      console.log('✅ AuthAPI: getProfileStep success');
      console.log('📊 Response Data:', JSON.stringify(response, null, 2));
      
      return {
        success: true,
        data: response,
        message: 'Profile step retrieved',
      };
    } catch (error) {
      console.log('❌ AuthAPI: getProfileStep error');
      console.log('💥 Error Message:', error.message);
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to get profile step',
      };
    }
  },

  // Update User Profile
  updateUserProfile: async (profileData, token) => {
    console.log('👤 AuthAPI: updateUserProfile called');
    console.log('👤 Profile Data:', JSON.stringify(profileData, null, 2));
    
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await apiClient.put(API_ENDPOINTS.UPDATE_USER_PROFILE, profileData, { headers });
      console.log('✅ AuthAPI: updateUserProfile success');
      console.log('📊 Response Data:', JSON.stringify(response, null, 2));
      
      return {
        success: true,
        data: response,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: updateUserProfile error');
      console.log('💥 Error Message:', error.message);
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to update profile',
      };
    }
  },

  // Upload Profile Picture
  uploadProfilePicture: async (imageData, accessToken) => {
    console.log('📸 AuthAPI: uploadProfilePicture called');
    console.log('📸 Image Data:', imageData);
    console.log('🔑 Access Token:', accessToken);
    console.log('🔗 Endpoint:', API_ENDPOINTS.UPLOAD_PROFILE_PICTURE);
    console.log('🌐 Full URL:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD_PROFILE_PICTURE}`);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', {
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
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD_PROFILE_PICTURE}`, {
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

    // Get Catalog Data
    getCatalog: async (token) => {
      console.log('📋 AuthAPI: getCatalog called');
      console.log('🔑 Token:', token ? 'Present' : 'Missing');

      if (!token) {
        console.log('❌ DEBUG: Missing token');
        return {
          success: false,
          error: 'Missing required token',
          message: 'Failed to get catalog data',
        };
      }

      try {
        console.log('🌐 Making request to:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_CATALOG}`);

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_CATALOG}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('📡 Response Status:', response.status);
        console.log('📡 Response OK:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.log('❌ Response Error Text:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('✅ AuthAPI: getCatalog success');
        console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

        return {
          success: true,
          data: responseData,
          message: 'Catalog data retrieved successfully',
        };
      } catch (error) {
        console.log('❌ AuthAPI: getCatalog error');
        console.log('💥 Error Type:', typeof error);
        console.log('💥 Error Message:', error.message);
        console.log('💥 Error Stack:', error.stack);
        console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));

        return {
          success: false,
          error: error.message,
          message: 'Failed to get catalog data',
        };
      }
    },

    // Upload ID Proof
    uploadIDProof: async (fileData, documentType, token) => {
    console.log('📄 AuthAPI: uploadIDProof called');
    console.log('📄 File Data:', fileData);
    console.log('📄 Document Type:', documentType);
    console.log('🔑 Token:', token ? 'Present' : 'Missing');

    if (!fileData || !documentType || !token) {
      console.log('❌ DEBUG: Missing required parameters');
      return {
        success: false,
        error: 'Missing required parameters (fileData, documentType, or token)',
        message: 'Failed to upload ID proof',
      };
    }

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      // Add file to FormData
      formData.append('file', {
        uri: fileData.uri,
        type: fileData.type || 'image/jpeg',
        name: fileData.fileName || 'id_proof.jpg',
      });
      
      // Add documentType to FormData
      formData.append('documentType', documentType);

      console.log('📤 FormData created');
      console.log('📤 File URI:', fileData.uri);
      console.log('📤 File Type:', fileData.type);
      console.log('📤 File Name:', fileData.fileName);
      console.log('📤 Document Type:', documentType);

      // Build headers with Authorization
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - let fetch set it automatically
      };

      console.log('📋 Request Headers:', headers);
      console.log('🌐 Making request to:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD_ID_PROOF}`);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD_ID_PROOF}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('📡 Response Status:', response.status);
      console.log('📡 Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response Error Text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('✅ AuthAPI: uploadIDProof success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

      return {
        success: true,
        data: responseData,
        message: 'ID proof uploaded successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: uploadIDProof error');
      console.log('💥 Error Type:', typeof error);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));

      return {
        success: false,
        error: error.message,
        message: 'Failed to upload ID proof',
      };
    }
  },

  // Refresh Access Token
  refreshAccessToken: async (refreshToken) => {
    console.log('🔄 AuthAPI: refreshAccessToken called');
    console.log('🔄 Refresh Token:', refreshToken ? 'Present' : 'Missing');

    if (!refreshToken) {
      console.log('❌ DEBUG: Missing refresh token');
      return {
        success: false,
        error: 'Missing refresh token',
        message: 'Failed to refresh access token',
      };
    }

    try {
      console.log('🌐 Making request to:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_ACCESS_TOKEN}`);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      console.log('📡 Response Status:', response.status);
      console.log('📡 Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response Error Text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('✅ AuthAPI: refreshAccessToken success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

      return {
        success: true,
        data: responseData,
        message: 'Access token refreshed successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: refreshAccessToken error');
      console.log('💥 Error Type:', typeof error);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));

      return {
        success: false,
        error: error.message,
        message: 'Failed to refresh access token',
      };
    }
  },

  // Get User Profile
  getUserProfile: async (token) => {
    console.log('👤 AuthAPI: getUserProfile called');
    console.log('🔑 Token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('❌ DEBUG: Missing token');
      return {
        success: false,
        error: 'Missing required token',
        message: 'Failed to get user profile',
      };
    }

    try {
      console.log('🌐 Making request to:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_USER_PROFILE}`);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_USER_PROFILE}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Response Status:', response.status);
      console.log('📡 Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response Error Text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('✅ AuthAPI: getUserProfile success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

      return {
        success: true,
        data: responseData,
        message: 'User profile retrieved successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: getUserProfile error');
      console.log('💥 Error Type:', typeof error);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      console.log('💥 Full Error Object:', JSON.stringify(error, null, 2));

      return {
        success: false,
        error: error.message,
        message: 'Failed to get user profile',
      };
    }
  },
};

export default authAPI;
