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
  // return 'http://192.168.29.173:3000';
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
      
      const response = await fetch(localUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
      });

      console.log('📡 Response received, status:', response.status);
      
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
      console.log('💥 Error Message:', error.message);

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
      console.log('💥 Error Message:', error.message);

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

      // Build headers with Authorization if token is provided
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📋 Request Headers:', headers);
      
      const response = await fetch(localUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
      });

      console.log('📡 Response received, status:', response.status);
      
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
    console.log('🔑 Access Token:', accessToken ? 'Present' : 'Missing');
    console.log('🔗 Endpoint:', API_ENDPOINTS.UPLOAD_PROFILE_PICTURE);
    
    const uploadUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD_PROFILE_PICTURE}`;
    console.log('🌐 Full URL:', uploadUrl);

    if (!accessToken) {
      console.log('❌ AuthAPI: Missing access token for profile picture upload');
      return {
        success: false,
        error: 'Missing access token',
        message: 'Failed to upload profile picture',
      };
    }

    try {
      // Create FormData for file upload (React Native format)
      const formData = new FormData();
      
      // Prepare file object for FormData
      const fileExtension = imageData.fileName?.split('.').pop() || 'jpg';
      const mimeType = imageData.type || `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`;
      const fileName = imageData.fileName || `profile_picture_${Date.now()}.${fileExtension}`;
      
      formData.append('file', {
        uri: imageData.uri,
        type: mimeType,
        name: fileName,
      });

      console.log('📤 FormData created');
      console.log('📤 File URI:', imageData.uri);
      console.log('📤 File Type:', mimeType);
      console.log('📤 File Name:', fileName);
      console.log('📤 FormData entries:');
      if (formData._parts) {
        for (let [key, value] of formData._parts) {
          console.log(`📤 ${key}:`, typeof value === 'object' ? JSON.stringify(value, null, 2) : value);
        }
      }

      // Make API call with FormData
      console.log('🚀 Making fetch request to:', uploadUrl);
      console.log('🚀 Method: POST');
      console.log('🚀 Headers:', {
        'Authorization': `Bearer ${accessToken.substring(0, 20)}...`,
      });
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      console.log('📊 Raw Response Status:', response.status);
      console.log('📊 Raw Response Status Text:', response.statusText);

      // Handle non-OK responses
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
          console.log('❌ Response Error Text:', errorText);
          
          // Try to parse as JSON
          let errorData;
          try {
            errorData = JSON.parse(errorText);
            console.log('❌ Parsed Error Data:', errorData);
            throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${errorText}`);
          } catch (parseError) {
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
        } catch (textError) {
          throw new Error(`HTTP ${response.status}: Failed to read error response`);
        }
      }

      // Parse successful response
      let responseData;
      try {
        const responseText = await response.text();
        console.log('📄 Raw Response Text:', responseText);
        
        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response from server');
        }
        
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

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
      console.log('💥 Error Name:', error.name);
      console.log('💥 Error Message:', error.message);
      console.log('💥 Error Stack:', error.stack);
      
      // Check if it's a network error
      if (error.message === 'Network request failed' || error.message.includes('Network')) {
        console.log('🌐 Network Error Detected - Backend server may not be running');
        console.log('🌐 Check if backend is running on:', API_CONFIG.BASE_URL);
        return {
          success: false,
          error: 'Cannot connect to server. Please ensure the backend server is running.',
          message: 'Network connection failed',
        };
      }

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
      
      try {
        // Use apiClient which handles token refresh automatically
        const responseData = await apiClient.get(API_ENDPOINTS.GET_CATALOG);
        
        console.log('✅ AuthAPI: getCatalog success');
        console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

        return {
          success: true,
          data: responseData,
          message: 'Catalog data retrieved successfully',
        };
      } catch (error) {
        console.log('❌ AuthAPI: getCatalog error');
        console.log('💥 Error Message:', error.message);

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

    if (!fileData || !documentType) {
      console.log('❌ DEBUG: Missing required parameters');
      return {
        success: false,
        error: 'Missing required parameters (fileData or documentType)',
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

      // Use apiClient which handles token refresh automatically
      // apiClient will detect FormData and handle Content-Type properly
      const responseData = await apiClient.post(API_ENDPOINTS.UPLOAD_ID_PROOF, formData);

      console.log('✅ AuthAPI: uploadIDProof success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

      return {
        success: true,
        data: responseData,
        message: 'ID proof uploaded successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: uploadIDProof error');
      console.log('💥 Error Message:', error.message);

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
    console.log('🔄 Refresh Token Type:', typeof refreshToken);
    console.log('🔄 Refresh Token Length:', refreshToken?.length);
    console.log('🔄 Refresh Token Value (first 20 chars):', refreshToken?.substring(0, 20));

    if (!refreshToken) {
      console.log('❌ AuthAPI: Missing refresh token');
      return {
        success: false,
        error: 'Missing refresh token',
        message: 'Failed to refresh access token',
      };
    }

    // Validate refresh token is a string and not empty
    if (typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
      console.log('❌ AuthAPI: Invalid refresh token format');
      return {
        success: false,
        error: 'Invalid refresh token format',
        message: 'Failed to refresh access token',
      };
    }

    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_ACCESS_TOKEN}`;
      
      // Ensure refreshToken is properly trimmed and formatted
      const cleanRefreshToken = refreshToken.trim();
      
      // Create request body exactly as Postman format
      const requestBody = {
        refreshToken: cleanRefreshToken
      };
      
      // Stringify with no extra spaces (exact Postman format)
      const requestBodyString = JSON.stringify(requestBody);
      
      // Verify the stringified body can be parsed back
      try {
        const verifyBody = JSON.parse(requestBodyString);
        console.log('✅ Request body verification - can parse back:', verifyBody);
        console.log('✅ Refresh token in parsed body:', verifyBody.refreshToken ? 'Present' : 'Missing');
        console.log('✅ Refresh token value matches:', verifyBody.refreshToken === cleanRefreshToken);
      } catch (verifyError) {
        console.log('❌ Request body verification failed:', verifyError);
      }
      
      console.log('🌐 Making request to:', url);
      console.log('📤 Request Method: POST');
      console.log('📤 Request Body Object:', requestBody);
      console.log('📤 Request Body String:', requestBodyString);
      console.log('📤 Request Body String Length:', requestBodyString.length);
      console.log('📤 Refresh Token (full):', cleanRefreshToken);
      console.log('📤 Refresh Token Length:', cleanRefreshToken.length);

      // Build headers explicitly - NO Authorization header needed for refresh token API
      // CRITICAL: Content-Type must be 'application/json' for server to parse body correctly
      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        // Explicitly DO NOT include Authorization header - refresh token API doesn't need it
      };
      
      console.log('📋 IMPORTANT: No Authorization header for refresh token API');
      
      console.log('📋 Request Headers:', JSON.stringify(headers, null, 2));
      console.log('📋 Request Body Type:', typeof requestBodyString);
      console.log('📋 Request Body is String:', typeof requestBodyString === 'string');
      console.log('📋 Request Body Encoding:', requestBodyString);

      // CRITICAL: Ensure body is a properly formatted string
      // React Native fetch might need explicit encoding
      const finalBody = typeof requestBodyString === 'string' 
        ? requestBodyString 
        : JSON.stringify(requestBody);

      // Make the fetch request with explicit body string
      console.log('🚀 Sending fetch request...');
      console.log('🚀 Request config:', {
        method: 'POST',
        url: url,
        headers: headers,
        bodyType: typeof finalBody,
        bodyLength: finalBody.length,
        bodyPreview: finalBody.substring(0, 100),
        bodyFull: finalBody, // Log full body for debugging
      });
      
      // Create fetch request with explicit configuration
      const fetchOptions = {
        method: 'POST',
        headers: headers,
        body: finalBody,
      };
      
      console.log('🚀 Final fetch options:', {
        method: fetchOptions.method,
        headers: fetchOptions.headers,
        bodyLength: fetchOptions.body.length,
        bodyValue: fetchOptions.body,
      });
      
      const response = await fetch(url, fetchOptions);

      console.log('📡 Response Status:', response.status);
      console.log('📡 Response Status Text:', response.statusText);
      console.log('📡 Response OK:', response.ok);
      console.log('📋 Response Headers:', JSON.stringify([...response.headers.entries()]));

      if (!response.ok) {
        // Clone response before reading to avoid consuming the stream
        const responseClone = response.clone();
        const errorText = await responseClone.text();
        console.log('❌ Response Error Text:', errorText);
        
        // Try to parse error response for better debugging
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          console.log('❌ Parsed Error Data:', JSON.stringify(errorData, null, 2));
          
          // If server says "No refresh token", log the request details for debugging
          if (errorData.message && errorData.message.includes('No refresh token')) {
            console.log('⚠️ Server says "No refresh token" but we sent it');
            console.log('⚠️ Request URL:', url);
            console.log('⚠️ Request Method: POST');
            console.log('⚠️ Request Headers:', JSON.stringify(headers, null, 2));
            console.log('⚠️ Request Body (sent):', requestBodyString);
            console.log('⚠️ Request Body (parsed back):', JSON.parse(requestBodyString));
            console.log('⚠️ Refresh Token Value (full):', cleanRefreshToken);
            console.log('⚠️ Refresh Token Length:', cleanRefreshToken.length);
          }
        } catch (parseError) {
          console.log('❌ Error response is not JSON');
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Parse response - could be JSON body or cookies
      const responseData = await response.json();
      console.log('✅ AuthAPI: refreshAccessToken success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));
      
      // Check for accessToken in response (could be in data.data.accessToken or data.accessToken)
      const extractedAccessToken = responseData?.data?.data?.accessToken || 
                                   responseData?.data?.accessToken || 
                                   responseData?.accessToken;
      const extractedRefreshToken = responseData?.data?.data?.refreshToken || 
                                    responseData?.data?.refreshToken || 
                                    responseData?.refreshToken;
      
      console.log('🔑 Extracted Access Token:', extractedAccessToken ? 'Present' : 'Missing');
      console.log('🔄 Extracted Refresh Token:', extractedRefreshToken ? 'Present' : 'Missing');
      
      // Also check for jwt cookie in response headers
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        console.log('🍪 Set-Cookie Header:', setCookieHeader);
        // Extract jwt from cookie if present
        const jwtMatch = setCookieHeader.match(/jwt=([^;]+)/);
        if (jwtMatch && jwtMatch[1]) {
          console.log('🍪 JWT found in cookie:', jwtMatch[1].substring(0, 30) + '...');
          // Use jwt from cookie as accessToken if not in body
          if (!extractedAccessToken && jwtMatch[1]) {
            responseData.data = responseData.data || {};
            responseData.data.accessToken = jwtMatch[1];
            console.log('✅ Using JWT from cookie as accessToken');
          }
        }
      }

      return {
        success: true,
        data: responseData,
        message: 'Access token refreshed successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: refreshAccessToken error');
      

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
    
    try {
      // Use apiClient which handles token refresh automatically
      const responseData = await apiClient.get(API_ENDPOINTS.GET_USER_PROFILE);
      
      console.log('✅ AuthAPI: getUserProfile success');
      console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

      return {
        success: true,
        data: responseData,
        message: 'User profile retrieved successfully',
      };
    } catch (error) {
      console.log('❌ AuthAPI: getUserProfile error');
      console.log('💥 Error Message:', error.message);

      return {
        success: false,
        error: error.message,
        message: 'Failed to get user profile',
      };
    }
  },
};

export default authAPI;
