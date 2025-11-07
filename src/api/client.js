import { API_CONFIG } from './config';
import { store } from '../redux/store';
import { isTokenExpired } from '../utils/authUtils';
import { refreshAccessToken } from '../redux/slices/authSlice';

// Request queue for handling concurrent requests during token refresh
// If multiple requests get 401, they all wait for the same refresh promise
let refreshTokenPromise = null;

/**
 * Refresh access token with queuing mechanism
 * Prevents multiple simultaneous refresh calls
 */
const refreshToken = async () => {
  // If already refreshing, return the existing promise
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  const state = store.getState();
  const { refreshToken } = state.auth;

  if (!refreshToken || typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
    throw new Error('No refresh token available');
  }

  // Create refresh promise
  refreshTokenPromise = (async () => {
    try {
      console.log('🔄 Client: Refreshing access token...');
      const result = await store.dispatch(refreshAccessToken(refreshToken.trim()));

      if (refreshAccessToken.fulfilled.match(result)) {
        const newState = store.getState();
        const newAccessToken = newState.auth.accessToken;

        if (!newAccessToken) {
          // Try to extract from response
          const responseData = result.payload?.data || result.payload;
          const extractedToken =
            responseData?.data?.accessToken ||
            responseData?.accessToken ||
            result.payload?.accessToken;

          if (extractedToken) {
            console.log('✅ Client: Token refreshed successfully');
            return extractedToken;
          }
        } else {
          console.log('✅ Client: Token refreshed successfully');
          return newAccessToken;
        }
      }

      // Refresh failed
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('❌ Client: Token refresh error:', error);
      throw error;
    } finally {
      // Clear the promise so next refresh can happen
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
};

/**
 * Get auth token and auto-refresh if expired
 */
const getAuthToken = async () => {
  try {
    const state = store.getState();
    let { accessToken } = state.auth;

    // If no access token, return null (user not logged in)
    if (!accessToken) {
      return null;
    }

    // Check if token expired BEFORE every API call
    if (isTokenExpired(accessToken)) {
      console.log('⚠️ Client: Access token expired, refreshing...');
      try {
        const newToken = await refreshToken();
        return newToken;
      } catch (error) {
        console.error('❌ Client: Failed to refresh token:', error);
        return null;
      }
    }

    // Token is still valid
    return accessToken;
  } catch (error) {
    console.error('❌ Client: Error getting auth token:', error);
    return null;
  }
};

// Build full URL
const buildURL = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Build headers with auth token
 * @param {Object} customHeaders - Custom headers to add
 * @param {boolean} skipTokenCheck - Skip token expiry check (for refresh token API)
 * @returns {Promise<Object>} Headers object
 */
const buildHeaders = async (customHeaders = {}, skipTokenCheck = false) => {
  let token;

  if (skipTokenCheck) {
    // For refresh token API, don't add Authorization header
    return {
      ...API_CONFIG.HEADERS,
      ...customHeaders,
    };
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


// Generic request method with comprehensive interceptor
const request = async (endpoint, options = {}, retryCount = 0) => {
  // INTERCEPTOR: Check token expiry BEFORE making request
  // Skip this check for refresh token API itself to avoid infinite loop
  const isRefreshTokenAPI = endpoint.includes('update-access-token');
  
  let url = buildURL(endpoint);
  let headers;
  
  if (isRefreshTokenAPI) {
    // For refresh token API, do NOT add Authorization header
    // Refresh token API doesn't need access token - only refreshToken in body
    console.log('🔄 INTERCEPTOR: Refresh token API - skipping Authorization header');
    headers = {
      ...API_CONFIG.HEADERS,
      ...options.headers,
      // Explicitly remove Authorization if it exists
    };
    delete headers.Authorization; // Ensure no Authorization header
    console.log('🔄 INTERCEPTOR: Headers for refresh token API (no auth):', Object.keys(headers));
  } else {
    // For all other APIs, check token expiry first (INTERCEPTOR LOGIC)
    headers = await buildHeaders(options.headers, false);
  }
  
  // Remove headers from options to avoid override
  const { headers: _, ...otherOptions } = options;
  
  // If body is FormData, remove Content-Type header (let fetch set it with boundary)
  const isFormData = otherOptions.body instanceof FormData;
  if (isFormData) {
    delete headers['Content-Type'];
  }
  
  const config = {
    method: options.method || 'GET',
    headers,
    // Note: React Native fetch doesn't support timeout option
    // Timeout handling should be done via AbortController if needed
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
    
    // Handle 401 Unauthorized - Try to refresh token and retry
    if (response.status === 401 && retryCount === 0 && !isRefreshTokenAPI) {
      const state = store.getState();
      const { refreshToken: refreshTokenValue } = state.auth;

      // Check if we have a refresh token
      if (refreshTokenValue && typeof refreshTokenValue === 'string' && refreshTokenValue.trim().length > 0) {
        try {
          // If refresh is already in progress, wait for it
          if (refreshTokenPromise) {
            console.log('⏳ Client: Waiting for token refresh to complete...');
            const newToken = await refreshTokenPromise;

            // Retry original request with new token
            return request(endpoint, { ...options }, retryCount + 1);
          } else {
            // Trigger refresh
            console.log('🔄 Client: Received 401, refreshing token...');
            const newToken = await refreshToken();

            if (newToken) {
              // Retry original request with new token
              return request(endpoint, { ...options }, retryCount + 1);
            }
          }
        } catch (refreshError) {
          console.error('❌ Client: Token refresh failed:', refreshError);
          // Clear tokens and throw error (should trigger logout)
          const { clearAuth } = await import('../redux/slices/authSlice');
          store.dispatch(clearAuth());
          throw new Error('Token refresh failed. Please login again.');
        }
      }

      // No refresh token available - user needs to login
      const errorText = await responseClone.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Unauthorized' };
      }
      throw new Error(errorData.message || 'Authentication failed. Please login again.');
    }
    
    // Parse response
    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText || `HTTP Error: ${response.status}` };
      }
      
      // Log detailed error information
      console.error(`❌ API Error Response (${response.status}):`, errorData);
      console.error('❌ Full Error Response Text:', responseText);
      
      // Create error with more details
      const errorMessage = errorData.message || errorData.error || `HTTP Error: ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Parse successful response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ API Error: ${config.method} ${url}`, error);
    console.error('💥 Error Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Enhanced network error diagnostics
    if (error.message === 'Network request failed' || error.message.includes('Network')) {
      console.error('🌐 NETWORK CONNECTION DIAGNOSTICS:');
      console.error('🌐 Request URL:', url);
      console.error('🌐 Base URL:', API_CONFIG.BASE_URL);
      console.error('🌐 This error typically means:');
      console.error('   1. Backend server is not running');
      console.error('   2. Device cannot reach the server IP address');
      console.error('   3. Backend is not listening on 0.0.0.0:3000');
      console.error('   4. Device and computer are on different networks');
      console.error('   5. Firewall is blocking the connection');
      console.error('🌐 TROUBLESHOOTING STEPS:');
      console.error('   - Check if backend is running: netstat -ano | findstr :3000');
      console.error('   - Verify IP address: ipconfig');
      console.error('   - Check backend logs for errors');
      console.error('   - Ensure backend listens on 0.0.0.0:3000, not 127.0.0.1:3000');
    }
    
    throw error;
  }
};

// HTTP Methods
const get = async (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'GET' });
};

const post = async (endpoint, data, options = {}) => {
  // If data is FormData, don't stringify it - pass it directly
  // Otherwise, JSON stringify it
  const body = data instanceof FormData ? data : JSON.stringify(data);
  
  return request(endpoint, {
    ...options,
    method: 'POST',
    body,
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
