import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/authAPI';

// Async thunks for API calls
const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ phoneNumber, countryCode = '+91' }, { rejectWithValue }) => {
    console.log('🔄 Redux: sendOTP thunk called');
    console.log('📱 Redux Phone:', phoneNumber);
    console.log('🌍 Redux Country:', countryCode);
    
    try {
      const response = await authAPI.sendOTP(phoneNumber, countryCode);
      console.log('📊 Redux: API Response received:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('✅ Redux: sendOTP success, returning data');
        return response.data;
      } else {
        console.log('❌ Redux: sendOTP failed, rejecting with error:', response.error);
        return rejectWithValue(response.error);
      }
    } catch (error) {
      console.log('💥 Redux: sendOTP exception caught:', error);
      console.log('💥 Redux: Error message:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ phoneNumber, otp, countryCode = '+91' }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOTP(phoneNumber, otp, countryCode);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const login = createAsyncThunk(
  'auth/login',
  async ({ phoneNumber, countryCode = '+91' }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(phoneNumber, countryCode);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.logout();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // User data
  user: null,
  isAuthenticated: false,
  
  // Auth tokens
  accessToken: null,
  refreshToken: null,
  
  // Loading states
  isLoading: false,
  isSendingOTP: false,
  isVerifyingOTP: false,
  isLoggingIn: false,
  isLoggingOut: false,
  
  // Error states
  error: null,
  otpError: null,
  loginError: null,
  
  // Phone number for OTP flow
  phoneNumber: null,
  countryCode: '+91',
  
  // OTP verification
  otpSent: false,
  otpVerified: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.otpError = null;
      state.loginError = null;
    },
    
    // Set phone number
    setPhoneNumber: (state, action) => {
      console.log('📱 Redux: setPhoneNumber action called');
      console.log('📱 Redux: Payload:', action.payload);
      state.phoneNumber = action.payload.phoneNumber;
      state.countryCode = action.payload.countryCode || '+91';
    },
    
    // Clear phone number
    clearPhoneNumber: (state) => {
      state.phoneNumber = null;
      state.countryCode = '+91';
    },
    
    // Reset OTP state
    resetOTPState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.otpError = null;
    },
    
    // Set tokens and user data
    setTokens: (state, action) => {
      console.log('💾 Redux: setTokens action called');
      console.log('🔑 Redux: Access Token:', action.payload.accessToken);
      console.log('🔄 Redux: Refresh Token:', action.payload.refreshToken);
      console.log('👤 Redux: User Data:', action.payload.user);
      
      // DEBUG: Check payload before saving
      console.log('🔍 DEBUG: setTokens payload validation...');
      console.log('🔍 DEBUG: accessToken type:', typeof action.payload.accessToken);
      console.log('🔍 DEBUG: refreshToken type:', typeof action.payload.refreshToken);
      console.log('🔍 DEBUG: user type:', typeof action.payload.user);
      console.log('🔍 DEBUG: accessToken length:', action.payload.accessToken?.length);
      console.log('🔍 DEBUG: refreshToken length:', action.payload.refreshToken?.length);
      
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      
      // DEBUG: Verify state after saving
      console.log('🔍 DEBUG: Redux state after saving...');
      console.log('🔍 DEBUG: state.accessToken:', state.accessToken);
      console.log('🔍 DEBUG: state.refreshToken:', state.refreshToken);
      console.log('🔍 DEBUG: state.isAuthenticated:', state.isAuthenticated);
      console.log('🔍 DEBUG: state.user:', state.user);
      
      console.log('✅ Redux: Tokens and user data saved successfully');
    },
    
    // Clear auth state
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.phoneNumber = null;
      state.countryCode = '+91';
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;
      state.otpError = null;
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isSendingOTP = true;
        state.otpError = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.isSendingOTP = false;
        state.otpSent = true;
        state.otpError = null;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isSendingOTP = false;
        state.otpError = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isVerifyingOTP = true;
        state.otpError = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isVerifyingOTP = false;
        state.otpVerified = true;
        state.otpError = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isVerifyingOTP = false;
        state.otpError = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.loginError = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.loginError = action.payload;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.otpSent = false;
        state.otpVerified = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoggingOut = false;
        state.error = action.payload;
      });
  },
});

// Export actions
console.log('📦 authSlice.js: authSlice.actions before export:', authSlice.actions);
console.log('📦 authSlice.js: setPhoneNumber in actions:', authSlice.actions.setPhoneNumber);
console.log('📦 authSlice.js: setPhoneNumber type:', typeof authSlice.actions.setPhoneNumber);

export const {
  clearErrors,
  setPhoneNumber,
  clearPhoneNumber,
  resetOTPState,
  setTokens,
  clearAuth,
} = authSlice.actions;

// Export async thunks
export {
  sendOTP,
  verifyOTP,
  login,
  logout,
};

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectPhoneNumber = (state) => state.auth.phoneNumber;
export const selectOTPState = (state) => ({
  otpSent: state.auth.otpSent,
  otpVerified: state.auth.otpVerified,
  isSendingOTP: state.auth.isSendingOTP,
  isVerifyingOTP: state.auth.isVerifyingOTP,
});

// Export reducer
export default authSlice.reducer;
