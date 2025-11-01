import { API_CONFIG } from './config';
import { store } from '../redux/store';
import { isTokenExpired, refreshTokenIfNeeded } from '../utils/authUtils';
import { refreshAccessToken } from '../redux/slices/authSlice';

// SIMPLE INTERCEPTOR: Get auth token and auto-refresh if expired
const getAuthToken = async () => {
  try {
    const state = store.getState();
    let { accessToken, refreshToken } = state.auth;
    
    // If no access token, return null (user not logged in)
    if (!accessToken) {
      console.log('🔑 Client: No access token found');
      return null;
    }
    
    // INTERCEPTOR LOGIC: Check if token expired BEFORE every API call
    if (isTokenExpired(accessToken)) {
      console.log('⚠️ INTERCEPTOR: Access token expired, auto-refreshing...');
      
      // Check if refresh token is available
      if (!refreshToken || typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
        console.log('❌ INTERCEPTOR: No valid refresh token available');
        return null;
      }
      
      try {
        // Auto-refresh the token
        console.log('🔄 INTERCEPTOR: Calling refreshAccessToken API...');
        const result = await store.dispatch(refreshAccessToken(refreshToken.trim()));
        
        if (refreshAccessToken.fulfilled.match(result)) {
          // Get new token from Redux state (updated by reducer)
          const newState = store.getState();
          const newAccessToken = newState.auth.accessToken;
          
          if (newAccessToken) {
            console.log('✅ INTERCEPTOR: Token refreshed successfully, using new token');
            return newAccessToken;
          } else {
            console.log('⚠️ INTERCEPTOR: Token refresh succeeded but no new token in state');
            // Try to extract from response
            const responseData = result.payload?.data || result.payload;
            const extractedToken = responseData?.data?.accessToken || responseData?.accessToken || result.payload?.accessToken;
            if (extractedToken) {
              console.log('✅ INTERCEPTOR: Extracted token from response');
              return extractedToken;
            }
          }
        } else {
          console.log('❌ INTERCEPTOR: Token refresh failed');
          console.log('❌ INTERCEPTOR: Error:', result.error);
          return null;
        }
      } catch (error) {
        console.error('💥 INTERCEPTOR: Error during token refresh:', error);
        return null;
      }
    }
    
    // Token is still valid, return it
    console.log('✅ INTERCEPTOR: Access token is valid');
    return accessToken;
  } catch (error) {
    console.log('❌ INTERCEPTOR: Error getting auth token:', error);
    return null;
  }
};

// Build full URL
const buildURL = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Build headers with auth token
// skipTokenCheck: true means don't check token expiry (used for refresh token API itself)
const buildHeaders = async (customHeaders = {}, skipTokenCheck = false) => {
  let token;
  
  if (skipTokenCheck) {
    // For refresh token API, just get token without expiry check
    const state = store.getState();
    token = state.auth.accessToken;
    console.log('🔑 Client: Skipping token expiry check (refresh token API)');
  } else {
    // For all other APIs, check expiry and refresh if needed
    token = await getAuthToken();
  }
  
  return {
    ...API_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };
};

// Handle response
const handleResponse = async (response) => {
  console.log('🔍 handleResponse: Processing response');
  console.log('📡 Response Status:', response.status);
  console.log('📡 Response OK:', response.ok);
  
  if (!response.ok) {
    console.log('❌ Response not OK, getting error data');
    const errorText = await response.text();
    console.log('📄 Error Response Text:', errorText);
    
    let errorData;
    try {
      errorData = JSON.parse(errorText);
      console.log('📊 Parsed Error Data:', errorData);
    } catch (parseError) {
      console.log('❌ Error response is not JSON:', errorText);
      errorData = { message: errorText };
    }
    
    const errorMessage = errorData.message || `HTTP Error: ${response.status}`;
    console.log('💥 Throwing Error:', errorMessage);
    throw new Error(errorMessage);
  }
  
  console.log('✅ Response is OK, parsing JSON');
  return response.json();
};

// Generic request method with comprehensive interceptor
const request = async (endpoint, options = {}, retryCount = 0) => {
  // INTERCEPTOR: Check token expiry BEFORE making request
  // Skip this check for refresh token API itself to avoid infinite loop
  const isRefreshTokenAPI = endpoint.includes('update-access-token');
  
  let url = buildURL(endpoint);
  let headers;
  
  if (isRefreshTokenAPI) {
    // For refresh token API, skip token expiry check
    headers = await buildHeaders(options.headers, true);
  } else {
    // For all other APIs, check token expiry first (INTERCEPTOR LOGIC)
    headers = await buildHeaders(options.headers, false);
  }
  
  // Remove headers from options to avoid override
  const { headers: _, ...otherOptions } = options;
  
  const config = {
    method: options.method || 'GET',
    headers,
    timeout: API_CONFIG.TIMEOUT,
    ...otherOptions,
  };

  try {
    console.log(`🚀 API Request: ${config.method} ${url}`);
    console.log('📤 Request Body:', config.body ? (typeof config.body === 'string' ? config.body.substring(0, 200) : config.body) : 'No body');
    console.log('📋 Request Headers:', Object.keys(config.headers).reduce((acc, key) => {
      if (key === 'Authorization') {
        acc[key] = config.headers[key] ? `Bearer ${config.headers[key].substring(7, 27)}...` : 'Missing';
      } else {
        acc[key] = config.headers[key];
      }
      return acc;
    }, {}));
    
    const response = await fetch(url, config);
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    // Clone response for potential retry (response body can only be read once)
    const responseClone = response.clone();
    
    // INTERCEPTOR: Handle 401 Unauthorized - Check for "Access token expired" message
    if (response.status === 401 && retryCount === 0) {
      console.log('⚠️ INTERCEPTOR: Received 401, checking error message...');
      
      // Parse response body to check for specific error message
      const errorText = await responseClone.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.log('📊 INTERCEPTOR: Parsed error response:', JSON.stringify(errorData, null, 2));
      } catch (parseError) {
        errorData = { message: errorText };
      }
      
      // Check if error message is "Access token expired"
      const isTokenExpiredError = errorData?.message === 'Access token expired' || 
                                  errorData?.code === 'TokenExpiredError' ||
                                  errorData?.message?.toLowerCase().includes('token expired');
      
      if (isTokenExpiredError) {
        console.log('🔴 INTERCEPTOR: Access token expired detected!');
        console.log('🔴 INTERCEPTOR: Error details:', {
          message: errorData?.message,
          code: errorData?.code,
          status: errorData?.status
        });
        
        const state = store.getState();
        const { refreshToken } = state.auth;
        
        console.log('🔄 INTERCEPTOR: Refresh token available:', refreshToken ? 'Present' : 'Missing');
        console.log('🔄 INTERCEPTOR: Refresh token type:', typeof refreshToken);
        console.log('🔄 INTERCEPTOR: Refresh token length:', refreshToken?.length);
        
        if (refreshToken && typeof refreshToken === 'string' && refreshToken.trim().length > 0) {
          try {
            console.log('🔄 INTERCEPTOR: Calling refresh token API...');
            // Call refresh token API
            const refreshResult = await store.dispatch(refreshAccessToken(refreshToken.trim()));
            
            if (refreshAccessToken.fulfilled.match(refreshResult)) {
              // Extract new access token from response
              const responseData = refreshResult.payload?.data || refreshResult.payload;
              const newAccessToken = responseData?.data?.accessToken || 
                                    responseData?.accessToken || 
                                    refreshResult.payload?.accessToken ||
                                    store.getState().auth.accessToken;
              
              if (newAccessToken) {
                console.log('✅ INTERCEPTOR: New access token received!');
                console.log('🔑 INTERCEPTOR: New Access Token:', newAccessToken);
                console.log('🔑 INTERCEPTOR: New Access Token (first 50 chars):', newAccessToken.substring(0, 50) + '...');
                console.log('🔑 INTERCEPTOR: New Access Token (last 50 chars):', '...' + newAccessToken.substring(newAccessToken.length - 50));
                console.log('🔑 INTERCEPTOR: New Access Token Length:', newAccessToken.length);
              } else {
                console.log('⚠️ INTERCEPTOR: Token refresh succeeded but no access token in response');
              }
              
              console.log('🔄 INTERCEPTOR: Retrying original request with new token...');
              
              // Retry the request with new token
              const newHeaders = await buildHeaders(options.headers);
              const retryConfig = {
                ...config,
                headers: newHeaders,
              };
              
              const retryResponse = await fetch(url, retryConfig);
              
              if (!retryResponse.ok) {
                const retryErrorText = await retryResponse.text();
                let retryErrorData;
                try {
                  retryErrorData = JSON.parse(retryErrorText);
                } catch {
                  retryErrorData = { message: retryErrorText };
                }
                throw new Error(retryErrorData.message || `HTTP Error: ${retryResponse.status}`);
              }
              
              const retryResponseText = await retryResponse.text();
              let data;
              try {
                data = JSON.parse(retryResponseText);
              } catch (parseError) {
                throw new Error(`Invalid JSON response: ${retryResponseText}`);
              }
              
              console.log(`✅ INTERCEPTOR: Original request retried successfully: ${config.method} ${url}`);
              return data;
            } else {
              console.log('❌ INTERCEPTOR: Token refresh failed');
              console.log('❌ INTERCEPTOR: Refresh result error:', refreshResult.error);
              throw new Error('Token refresh failed. Please login again.');
            }
          } catch (refreshError) {
            console.error('💥 INTERCEPTOR: Error during token refresh:', refreshError);
            throw new Error('Token refresh failed. Please login again.');
          }
        } else {
          console.log('❌ INTERCEPTOR: No valid refresh token available');
          throw new Error('Authentication failed. Please login again.');
        }
      } else {
        // 401 but not token expired error, throw original error
        console.log('⚠️ INTERCEPTOR: 401 received but not token expired error');
        throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
      }
    }
    
    // Log response text before parsing
    const responseText = await response.text();
    console.log('📄 Raw Response Text:', responseText);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      const errorMessage = errorData.message || `HTTP Error: ${response.status}`;
      console.log('💥 Throwing Error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Parse JSON manually for better debugging
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed JSON Response:', data);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.log('📄 Raw Response (not JSON):', responseText);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    console.log(`✅ API Response: ${config.method} ${url}`, data);
    console.log('🔍 Full Response Data:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${config.method} ${url}`, error);
    console.error('💥 Error Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    throw error;
  }
};

// HTTP Methods
const get = async (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'GET' });
};

const post = async (endpoint, data, options = {}) => {
  return request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

const put = async (endpoint, data, options = {}) => {
  return request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

const del = async (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'DELETE' });
};

// Export functional API client
export const apiClient = {
  get,
  post,
  put,
  delete: del,
};

export default apiClient;
