import { API_CONFIG } from './config';
import { store } from '../redux/store';
import { isTokenExpired, refreshTokenIfNeeded } from '../utils/authUtils';
import { refreshAccessToken } from '../redux/slices/authSlice';

// Get auth token from Redux store
const getAuthToken = async () => {
  try {
    const state = store.getState();
    const { accessToken, refreshToken } = state.auth;
    
    console.log('🔑 Client: Getting auth token from Redux');
    console.log('🔑 Client: Access Token:', accessToken ? 'Present' : 'Missing');
    console.log('🔑 Client: Refresh Token:', refreshToken ? 'Present' : 'Missing');
    
    // Check if access token is expired and refresh if needed
    if (accessToken && isTokenExpired(accessToken)) {
      console.log('⚠️ Client: Access token expired, refreshing...');
      
      if (refreshToken) {
        try {
          const result = await store.dispatch(refreshAccessToken(refreshToken));
          
          if (refreshAccessToken.fulfilled.match(result)) {
            const newToken = result.payload?.accessToken || store.getState().auth.accessToken;
            console.log('✅ Client: Token refreshed successfully');
            return newToken;
          } else {
            console.log('❌ Client: Token refresh failed');
            return null;
          }
        } catch (error) {
          console.error('💥 Client: Error refreshing token:', error);
          return null;
        }
      } else {
        console.log('❌ Client: No refresh token available');
        return null;
      }
    }
    
    return accessToken;
  } catch (error) {
    console.log('Error getting auth token:', error);
    return null;
  }
};

// Build full URL
const buildURL = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Build headers with auth token
const buildHeaders = async (customHeaders = {}) => {
  const token = await getAuthToken();
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

// Generic request method
const request = async (endpoint, options = {}, retryCount = 0) => {
  const url = buildURL(endpoint);
  const headers = await buildHeaders(options.headers);
  
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
    console.log('📤 Request Body:', config.body);
    console.log('📋 Request Headers:', config.headers);
    
    const response = await fetch(url, config);
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    // Clone response for potential retry (response body can only be read once)
    const responseClone = response.clone();
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (response.status === 401 && retryCount === 0) {
      console.log('⚠️ Client: Received 401, attempting token refresh...');
      
      const state = store.getState();
      const { refreshToken } = state.auth;
      
      if (refreshToken) {
        try {
          // Try to refresh the token
          const refreshResult = await store.dispatch(refreshAccessToken(refreshToken));
          
          if (refreshAccessToken.fulfilled.match(refreshResult)) {
            console.log('✅ Client: Token refreshed, retrying request...');
            
            // Retry the request with new token
            const newHeaders = await buildHeaders(options.headers);
            const retryConfig = {
              ...config,
              headers: newHeaders,
            };
            
            const retryResponse = await fetch(url, retryConfig);
            
            if (!retryResponse.ok) {
              const errorText = await retryResponse.text();
              let errorData;
              try {
                errorData = JSON.parse(errorText);
              } catch {
                errorData = { message: errorText };
              }
              throw new Error(errorData.message || `HTTP Error: ${retryResponse.status}`);
            }
            
            const retryResponseText = await retryResponse.text();
            let data;
            try {
              data = JSON.parse(retryResponseText);
            } catch (parseError) {
              throw new Error(`Invalid JSON response: ${retryResponseText}`);
            }
            
            console.log(`✅ API Response (after retry): ${config.method} ${url}`, data);
            return data;
          } else {
            console.log('❌ Client: Token refresh failed, cannot retry');
            throw new Error('Token refresh failed. Please login again.');
          }
        } catch (refreshError) {
          console.error('💥 Client: Error during token refresh:', refreshError);
          throw new Error('Token refresh failed. Please login again.');
        }
      } else {
        console.log('❌ Client: No refresh token available');
        throw new Error('Authentication failed. Please login again.');
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
