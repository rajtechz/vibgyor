// src/utils/authUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clear all authentication and profile setup data
 * Useful for testing or logout functionality
 */
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['isVerified', 'isProfileSetup']);
    console.log('Authentication data cleared successfully');
  } catch (error) {
    console.error('Error clearing authentication data:', error);
  }
};

/**
 * Check if user is authenticated and profile setup is complete
 */
export const checkAuthStatus = async () => {
  try {
    const verified = await AsyncStorage.getItem('isVerified');
    const profileSetupDone = await AsyncStorage.getItem('isProfileSetup');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    console.log('🔍 AuthUtils: Checking auth status...');
    console.log('🔍 AuthUtils: isVerified:', verified);
    console.log('🔍 AuthUtils: isProfileSetup:', profileSetupDone);
    console.log('🔍 AuthUtils: accessToken:', accessToken ? 'Present' : 'Missing');
    console.log('🔍 AuthUtils: refreshToken:', refreshToken ? 'Present' : 'Missing');
    
    return {
      isVerified: verified === 'true',
      isProfileSetupDone: profileSetupDone === 'true',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return {
      isVerified: false,
      isProfileSetupDone: false,
      accessToken: null,
      refreshToken: null,
    };
  }
};

/**
 * Set verification status
 */
export const setVerificationStatus = async (isVerified = true) => {
  try {
    await AsyncStorage.setItem('isVerified', isVerified.toString());
  } catch (error) {
    console.error('Error setting verification status:', error);
  }
};

/**
 * Set profile setup completion status
 */
export const setProfileSetupStatus = async (isComplete = true) => {
  try {
    await AsyncStorage.setItem('isProfileSetup', isComplete.toString());
  } catch (error) {
    console.error('Error setting profile setup status:', error);
  }
};

/**
 * Set authentication tokens
 */
export const setAuthTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
    ]);
    console.log('✅ AuthUtils: Tokens stored successfully');
  } catch (error) {
    console.error('Error setting auth tokens:', error);
  }
};

/**
 * Clear authentication tokens
 */
export const clearAuthTokens = async () => {
  try {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    console.log('✅ AuthUtils: Tokens cleared successfully');
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
  }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode JWT token (without verification)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const decoded = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired (with 5 minute buffer)
    return decoded.exp < (currentTime + 300);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if we can't decode
  }
};

/**
 * Refresh access token if expired
 */
export const refreshTokenIfNeeded = async (store) => {
  const state = store.getState();
  const { accessToken, refreshToken, isRefreshingToken } = state.auth;
  
  console.log('🔄 AuthUtils: Checking if token refresh is needed...');
  console.log('🔄 AuthUtils: Access Token:', accessToken ? 'Present' : 'Missing');
  console.log('🔄 AuthUtils: Refresh Token:', refreshToken ? 'Present' : 'Missing');
  console.log('🔄 AuthUtils: Is Refreshing:', isRefreshingToken);
  
  // If already refreshing, wait for it to complete
  if (isRefreshingToken) {
    console.log('🔄 AuthUtils: Token refresh already in progress, waiting...');
    return new Promise((resolve) => {
      const unsubscribe = store.subscribe(() => {
        const currentState = store.getState();
        if (!currentState.auth.isRefreshingToken) {
          unsubscribe();
          resolve(currentState.auth.accessToken);
        }
      });
    });
  }
  
  // Check if access token is expired
  if (isTokenExpired(accessToken)) {
    console.log('⚠️ AuthUtils: Access token is expired, refreshing...');
    
    if (!refreshToken) {
      console.log('❌ AuthUtils: No refresh token available');
      return null;
    }
    
    try {
      // Dispatch refresh token action
      const { refreshAccessToken } = await import('../redux/slices/authSlice');
      const result = await store.dispatch(refreshAccessToken(refreshToken));
      
      if (refreshAccessToken.fulfilled.match(result)) {
        console.log('✅ AuthUtils: Token refreshed successfully');
        return result.payload.accessToken || store.getState().auth.accessToken;
      } else {
        console.log('❌ AuthUtils: Token refresh failed');
        return null;
      }
    } catch (error) {
      console.error('💥 AuthUtils: Error refreshing token:', error);
      return null;
    }
  }
  
  console.log('✅ AuthUtils: Access token is still valid');
  return accessToken;
};
