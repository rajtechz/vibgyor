import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import CustomButton from '../../components/common/CustomButton';
import CommonBackground from '../../components/common/CommonBackground';
import SuccessModal from '../../components/common/SuccessModal';
import ErrorModal from '../../components/common/ErrorModal';
import { verifyOTP, clearErrors, setTokens } from '../../redux/slices/authSlice';
import { authAPI } from '../../api/authAPI';

// Back Icon Component
const BackIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.375 5.25L8.625 12L15.375 18.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Clock Icon Component
const ClockIcon = ({ width = 16, height = 16 }) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 1.33333C4.32 1.33333 1.33333 4.32 1.33333 8C1.33333 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33333 8 1.33333ZM8 13.3333C5.05333 13.3333 2.66667 10.9467 2.66667 8C2.66667 5.05333 5.05333 2.66667 8 2.66667C10.9467 2.66667 13.3333 5.05333 13.3333 8C13.3333 10.9467 10.9467 13.3333 8 13.3333ZM8.66667 4.66667H7.33333V8.66667L10.6667 10.6667L11.3333 9.66667L8.66667 8V4.66667Z"
      fill="url(#clockGradient)"
    />
    <Defs>
      <SvgLinearGradient id="clockGradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

// App Icon Component - Using complete icon as-is
const AppIcon = ({ width = 80, height = 80 }) => (
  <Svg width={width} height={height} viewBox="0 0 52 52" fill="none">
    <Rect width="52" height="52" rx="14" fill="url(#paint0_linear_63_1936)"/>
    <Path 
      d="M34.7191 15.4933L27.3858 12.7466C26.6258 12.4666 25.3858 12.4666 24.6258 12.7466L17.2924 15.4933C15.8791 16.0266 14.7324 17.68 14.7324 19.1866V29.9866C14.7324 31.0666 15.4391 32.4933 16.3058 33.1333L23.6391 38.6133C24.9324 39.5866 27.0524 39.5866 28.3458 38.6133L35.6791 33.1333C36.5458 32.48 37.2524 31.0666 37.2524 29.9866V19.1866C37.2658 17.68 36.1191 16.0266 34.7191 15.4933ZM30.6391 22.96L24.9058 28.6933C24.7058 28.8933 24.4524 28.9866 24.1991 28.9866C23.9458 28.9866 23.6924 28.8933 23.4924 28.6933L21.3591 26.5333C20.9724 26.1466 20.9724 25.5066 21.3591 25.12C21.7458 24.7333 22.3858 24.7333 22.7724 25.12L24.2124 26.56L29.2391 21.5333C29.6258 21.1466 30.2658 21.1466 30.6524 21.5333C31.0391 21.92 31.0391 22.5733 30.6391 22.96Z" 
      fill="#0D0D0D"
    />
    <Defs>
      <SvgLinearGradient id="paint0_linear_63_1936" x1="-11.5" y1="-3.90844e-06" x2="12.8629" y2="75.1132" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

// OTP Input Component with proper gradient border - Memoized for performance
const OTPInput = memo(({ value, onChangeText, onKeyPress, inputRef, isFilled, index }) => (
  <View style={styles.otpInputContainer}>
    <LinearGradient
      colors={['#8A2BE2', '#C53E8D']}
      style={styles.otpGradientBorder}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
    >
      <View style={styles.otpInputInner}>
        <TextInput
          ref={inputRef}
          style={[
            styles.otpInput,
            isFilled && styles.otpInputFilled
          ]}
          value={value}
          onChangeText={onChangeText}
          onKeyPress={onKeyPress}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
          returnKeyType="next"
        />
      </View>
    </LinearGradient>
  </View>
), (prevProps, nextProps) => {
  // Only re-render if value or isFilled changes
  return prevProps.value === nextProps.value && 
         prevProps.isFilled === nextProps.isFilled;
});

function VerifyNumberScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successAction, setSuccessAction] = useState(null);
  const inputRefs = useRef([]);

  // Get route params for email verification
  const { email, isEmailVerification } = route.params || {};
  
  console.log('🔍 DEBUG: VerifyNumberScreen route params:', { email, isEmailVerification });

  // Redux selectors
  const authState = useSelector((state) => state.auth);
  const otpState = authState; // Use authState directly to avoid selector warning
  const phoneNumber = authState.phoneNumber;
  const isAuthenticated = authState.isAuthenticated;
  console.log('🔍 DEBUG: Current Redux Auth State:', {
    accessToken: authState.accessToken,
    refreshToken: authState.refreshToken,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user
  });

  // DEBUG: Monitor Redux state changes
  useEffect(() => {
    console.log('🔍 DEBUG: Redux Auth State Changed:', {
      accessToken: authState.accessToken,
      refreshToken: authState.refreshToken,
      isAuthenticated: authState.isAuthenticated,
      user: authState.user
    });
    
    if (authState.accessToken && authState.refreshToken) {
      console.log('✅ DEBUG: Tokens are now stored in Redux!');
      console.log('✅ DEBUG: Access Token Length:', authState.accessToken.length);
      console.log('✅ DEBUG: Refresh Token Length:', authState.refreshToken.length);
    }
  }, [authState.accessToken, authState.refreshToken, authState.isAuthenticated, authState.user]);

  // Handle successful OTP verification
  useEffect(() => {
    if (otpState.otpVerified && !otpState.isVerifyingOTP) {
      // Navigate to next screen after OTP verification
      navigation.navigate('VerifySuccess');
    }
  }, [otpState.otpVerified, otpState.isVerifyingOTP, navigation]);

  // Handle OTP verification error
  useEffect(() => {
    if (otpState.otpError && !otpState.isVerifyingOTP) {
      setErrorMessage(otpState.otpError);
      setShowErrorModal(true);
      dispatch(clearErrors());
    }
  }, [otpState.otpError, otpState.isVerifyingOTP, dispatch]);

  

  // Optimized OTP change handler with useCallback
  const handleOtpChange = useCallback((text, index) => {
    // Only allow numeric characters and single digit
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length > 1) return;

    setOtp(prevOtp => {
      const newOtp = [...prevOtp];
      const previousValue = prevOtp[index];
      newOtp[index] = numericText;
      
      // Move to next input when a digit is entered (instant)
      if (numericText && !previousValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      // Move to previous input when clearing (instant)
      else if (!numericText && previousValue && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      
      return newOtp;
    });
  }, []);

  // Optimized key press handler with useCallback
  const handleKeyPress = useCallback(({ nativeEvent: { key } }, index) => {
    // Handle backspace for smooth navigation
    if (key === 'Backspace') {
      setOtp(prevOtp => {
        // If current input has value, clear it and keep focus
        if (prevOtp[index]) {
          const newOtp = [...prevOtp];
          newOtp[index] = '';
          return newOtp;
        } 
        // If current input is empty and not first input, move to previous and clear it
        else if (index > 0) {
          const newOtp = [...prevOtp];
          newOtp[index - 1] = '';
          // Move focus to previous input (instant)
          inputRefs.current[index - 1]?.focus();
          return newOtp;
        }
        return prevOtp;
      });
    }
  }, []);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Professional API call for OTP verification
  const verifyOTPAPI = async (phoneNumber, otp, countryCode) => {
    try {
      console.log('🚀 VerifyNumberScreen: Calling authAPI.verifyOTP');
      console.log('📱 Phone:', phoneNumber);
      console.log('🔢 OTP:', otp);
      console.log('🌍 Country:', countryCode);
      
      const response = await authAPI.verifyOTP(phoneNumber, otp, countryCode);
      
      console.log('📊 VerifyNumberScreen: API Response:', response);
      
      if (response.success) {
        console.log('✅ VerifyNumberScreen: OTP Verified Successfully');
        return response;
      } else {
        console.log('❌ VerifyNumberScreen: API Error:', response.error);
        throw new Error(response.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('💥 VerifyNumberScreen: API Error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setError(null);

    // Validate OTP
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP');
      setShowErrorModal(true);
      return;
    }

    try {
      setIsLoading(true);
      
      if (isEmailVerification) {
        // Handle Email OTP Verification
        console.log('📧 DEBUG: Email OTP verification process');
        console.log('📧 DEBUG: Email:', email);
        console.log('🔢 DEBUG: OTP:', otpString);
        
        // Get access token from Redux
        const accessToken = authState.accessToken;
        console.log('🔑 DEBUG: Access Token:', accessToken ? 'Present' : 'Missing');
        
        const result = await authAPI.verifyEmailOTP(otpString, accessToken);
        
        console.log('📊 DEBUG: Email OTP API Response:', result);
        
        // Check if API call was successful and if the actual API returned success
        if (result.success && result.data && result.data.success !== false) {
          console.log('✅ DEBUG: Email OTP verified successfully');
          console.log('✅ DEBUG: Full result:', JSON.stringify(result, null, 2));
          
          setSuccessMessage('Email verified successfully!');
          setSuccessAction(() => () => {
            console.log('📧 DEBUG: Navigating back to PersonalDetailsScreen with verified email');
            // Pass verification success back to PersonalDetailsScreen
            navigation.navigate('PersonalDetails', { 
              emailVerified: true,
              verifiedEmail: email 
            });
          });
          setShowSuccessModal(true);
        } else {
          // Check if result.data has an error
          const errorMsg = result.data?.message || result.error || 'Failed to verify email OTP. Please try again.';
          console.log('❌ DEBUG: Email OTP verification failed');
          console.log('❌ DEBUG: Error:', errorMsg);
          console.log('❌ DEBUG: Full result.data:', JSON.stringify(result.data, null, 2));
          setErrorMessage(errorMsg);
          setShowErrorModal(true);
        }
      } else {
        // Handle Phone OTP Verification (existing logic)
        console.log('📱 DEBUG: Phone OTP verification process');
        console.log('🔍 VerifyNumberScreen: phoneNumber from Redux:', phoneNumber);
        console.log('🔍 VerifyNumberScreen: phoneNumber type:', typeof phoneNumber);
        console.log('🔍 VerifyNumberScreen: phoneNumber === null:', phoneNumber === null);
        console.log('🔍 VerifyNumberScreen: phoneNumber === undefined:', phoneNumber === undefined);

        if (!phoneNumber) {
          setErrorMessage('Phone number not found. Please go back and try again.');
          setShowErrorModal(true);
          return;
        }
        
        // Use phone number directly from Redux state
        const phoneNum = phoneNumber.phoneNumber || phoneNumber;
        const countryCode = phoneNumber.countryCode || '+91';
        
        console.log('📱 VerifyNumberScreen: Using phone number:', phoneNum);
        console.log('🌍 VerifyNumberScreen: Using country code:', countryCode);
        
        // Call API directly
        const result = await verifyOTPAPI(phoneNum, otpString, countryCode);
        
        if (result.success) {
          console.log('✅ OTP Verified Successfully:', result);
          
          // DEBUG: Check the actual structure of the API response
          console.log('🔍 DEBUG: Full API Response:', JSON.stringify(result, null, 2));
          console.log('🔍 DEBUG: result.data structure:', result.data);
          console.log('🔍 DEBUG: result.data type:', typeof result.data);
          console.log('🔍 DEBUG: result.data keys:', result.data ? Object.keys(result.data) : 'data is null/undefined');
          
          // Check if result.data exists and has the expected structure
          if (!result.data) {
            console.log('❌ DEBUG: result.data is null or undefined');
            setErrorMessage('Invalid API response structure');
            setShowErrorModal(true);
            return;
          }
          
          // Extract tokens from the correct structure
          // The API response is direct: { accessToken, refreshToken, user }
          const responseData = result.data;
          console.log('🔍 DEBUG: responseData structure:', responseData);
          console.log('🔍 DEBUG: responseData keys:', Object.keys(responseData || {}));
          
          // Extract tokens directly from responseData (API returns: { accessToken, refreshToken, user })
          let accessToken, refreshToken, user;
          
          // Check if tokens are directly in responseData
          if (responseData && typeof responseData === 'object') {
            if (responseData.accessToken) {
              // Direct structure: { accessToken, refreshToken, user }
              accessToken = responseData.accessToken;
              refreshToken = responseData.refreshToken;
              user = responseData.user;
              console.log('🔍 DEBUG: Using direct structure - tokens found');
            } else if (responseData.data) {
              // Nested structure: { data: { accessToken, refreshToken, user } }
              if (responseData.data.accessToken) {
                accessToken = responseData.data.accessToken;
                refreshToken = responseData.data.refreshToken;
                user = responseData.data.user;
                console.log('🔍 DEBUG: Using nested structure - tokens found in data');
              }
            }
            
            // If still no tokens, search recursively
            if (!accessToken && !refreshToken) {
              console.log('🔍 DEBUG: Searching for tokens recursively...');
              const searchForTokens = (obj, depth = 0) => {
                if (depth > 3) return null;
                if (!obj || typeof obj !== 'object') return null;
                
                if (obj.accessToken && obj.refreshToken) {
                  return {
                    accessToken: obj.accessToken,
                    refreshToken: obj.refreshToken,
                    user: obj.user
                  };
                }
                
                for (const key in obj) {
                  if (typeof obj[key] === 'object' && obj[key] !== null) {
                    const found = searchForTokens(obj[key], depth + 1);
                    if (found) return found;
                  }
                }
                return null;
              };
              
              const foundTokens = searchForTokens(responseData);
              if (foundTokens) {
                accessToken = foundTokens.accessToken;
                refreshToken = foundTokens.refreshToken;
                user = foundTokens.user;
                console.log('🔍 DEBUG: Found tokens recursively');
              }
            }
          }
          
          console.log('🔑 Access Token:', accessToken);
          console.log('🔄 Refresh Token:', refreshToken);
          console.log('👤 User Data:', user);
          
          // DEBUG: Check if tokens exist in API response
          console.log('🔍 DEBUG: Checking API response tokens...');
          console.log('🔍 DEBUG: accessToken exists:', !!accessToken);
          console.log('🔍 DEBUG: refreshToken exists:', !!refreshToken);
          console.log('🔍 DEBUG: user exists:', !!user);
          
          // DEBUG: Log actual token values
          console.log('🔍 DEBUG: Access Token Value:', accessToken);
          console.log('🔍 DEBUG: Refresh Token Value:', refreshToken);
          console.log('🔍 DEBUG: User Object:', JSON.stringify(user, null, 2));
          
          // Validate tokens before saving
          if (!accessToken || !refreshToken) {
            console.log('❌ DEBUG: Missing tokens in API response');
            console.log('❌ DEBUG: accessToken:', accessToken);
            console.log('❌ DEBUG: refreshToken:', refreshToken);
            console.log('❌ DEBUG: Full responseData for debugging:', JSON.stringify(responseData, null, 2));
            setErrorMessage('Invalid tokens received from server. Please check console logs for details.');
            setShowErrorModal(true);
            return;
          }
          
          // Save tokens and user data to Redux
          console.log('💾 Redux: Dispatching setTokens...');
          console.log('💾 Redux: Payload being sent to Redux:', {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user
          });
          
          dispatch(setTokens({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user
          }));
          
          console.log('💾 Redux: setTokens dispatched successfully');
          
          // DEBUG: Verify Redux state after dispatch
          console.log('🔍 DEBUG: Verifying Redux state after dispatch...');
          console.log('🔍 DEBUG: isAuthenticated should be true now');
          
          setSuccessMessage('OTP verified successfully!');
          setSuccessAction(() => () => navigation.navigate('VerifySuccess'));
          setShowSuccessModal(true);
        }
      }
    } catch (error) {
      console.error('💥 VerifyNumberScreen: Error in handleSubmit:', error);
      setError(error.message);
      setErrorMessage(error.message || 'Failed to verify OTP. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Professional API call for resending OTP
  const resendOTPAPI = async (phoneNumber) => {
    console.log('🔄 DEBUG: resendOTPAPI function called');
    console.log('📱 DEBUG: Phone number parameter:', phoneNumber);
    console.log('📱 DEBUG: Phone number type:', typeof phoneNumber);
    console.log('📱 DEBUG: Phone number length:', phoneNumber?.length);
    
    try {
      console.log('🚀 DEBUG: Calling authAPI.resendOTP...');
      console.log('🔗 DEBUG: API endpoint: /user/auth/resend-otp');
      console.log('🌐 DEBUG: Full URL: https://vibgyornode.onrender.com/user/auth/resend-otp');
      
      const response = await authAPI.resendOTP(phoneNumber);
      
      console.log('📊 DEBUG: Raw API response received');
      console.log('📊 DEBUG: Response type:', typeof response);
      console.log('📊 DEBUG: Response keys:', Object.keys(response || {}));
      console.log('📊 DEBUG: Full response:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('✅ DEBUG: API call successful');
        console.log('✅ DEBUG: response.success:', response.success);
        console.log('✅ DEBUG: response.data:', response.data);
        console.log('✅ DEBUG: response.message:', response.message);
        return response;
      } else {
        console.log('❌ DEBUG: API call failed');
        console.log('❌ DEBUG: response.success:', response.success);
        console.log('❌ DEBUG: response.error:', response.error);
        console.log('❌ DEBUG: response.message:', response.message);
        throw new Error(response.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in resendOTPAPI');
      console.error('💥 DEBUG: Error type:', typeof error);
      console.error('💥 DEBUG: Error name:', error.name);
      console.error('💥 DEBUG: Error message:', error.message);
      console.error('💥 DEBUG: Error stack:', error.stack);
      console.error('💥 DEBUG: Full error object:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const handleResendOtp = async () => {
    console.log('🔄 DEBUG: handleResendOtp called');
    console.log('🔄 DEBUG: isTimerActive:', isTimerActive);
    
    if (isTimerActive) {
      console.log('⏰ DEBUG: Timer is active, cannot resend OTP');
      return;
    }
    
    // Clear previous errors
    dispatch(clearErrors());

    if (isEmailVerification) {
      // Handle Email OTP Resend
      console.log('📧 DEBUG: Email OTP resend process');
      console.log('📧 DEBUG: Email:', email);
      
      if (!email) {
        console.log('❌ DEBUG: Email not found');
        setErrorMessage('Email not found. Please go back and try again.');
        setShowErrorModal(true);
        return;
      }

      try {
        // Get access token from Redux
        const accessToken = authState.accessToken;
        console.log('🔑 DEBUG: Access Token:', accessToken ? 'Present' : 'Missing');
        
        console.log('🚀 DEBUG: Calling resendEmailOTP...');
        const result = await authAPI.resendEmailOTP(email, accessToken);
        
        console.log('📊 DEBUG: resendEmailOTP result:', result);
        
        if (result.success) {
          console.log('✅ DEBUG: Email OTP Resent Successfully!');
          
          // Reset OTP inputs and start timer
          setOtp(['', '', '', '', '', '']);
          setTimer(30);
          setIsTimerActive(true);
          
          // Focus on first input
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 100);
          
          setSuccessMessage('Email OTP has been resent successfully!');
          setShowSuccessModal(true);
        } else {
          console.log('❌ DEBUG: Resend Email OTP failed');
          setErrorMessage(result.error || 'Failed to resend email OTP');
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error('💥 DEBUG: Exception in handleResendOtp for email:', error);
        setErrorMessage(error.message || 'Failed to resend email OTP. Please try again.');
        setShowErrorModal(true);
      }
    } else {
      // Handle Phone OTP Resend (existing logic)
      console.log('🔍 DEBUG: phoneNumber from Redux:', phoneNumber);
      console.log('🔍 DEBUG: phoneNumber type:', typeof phoneNumber);
      console.log('🔍 DEBUG: phoneNumber === null:', phoneNumber === null);
      console.log('🔍 DEBUG: phoneNumber === undefined:', phoneNumber === undefined);

      if (!phoneNumber) {
        console.log('❌ DEBUG: Phone number not found in Redux');
        setErrorMessage('Phone number not found. Please go back and try again.');
        setShowErrorModal(true);
        return;
      }

      try {
        // Get phone number from Redux
        const phoneNum = phoneNumber.phoneNumber || phoneNumber;
        
        console.log('🔄 DEBUG: Starting resend OTP process...');
        console.log('📱 DEBUG: Phone number to use:', phoneNum);
        console.log('📱 DEBUG: Phone number type:', typeof phoneNum);
        console.log('📱 DEBUG: Phone number length:', phoneNum?.length);
        
        // Call resend OTP API directly
        console.log('🚀 DEBUG: Calling resendOTPAPI...');
        const result = await resendOTPAPI(phoneNum);
        
        console.log('📊 DEBUG: resendOTPAPI result:', result);
        console.log('📊 DEBUG: result.success:', result.success);
        console.log('📊 DEBUG: result.data:', result.data);
        console.log('📊 DEBUG: result.message:', result.message);
        
        if (result.success) {
          console.log('✅ DEBUG: OTP Resent Successfully!');
          console.log('✅ DEBUG: Full result object:', JSON.stringify(result, null, 2));
          
          // Reset OTP inputs and start timer
          console.log('🔄 DEBUG: Resetting OTP inputs...');
          setOtp(['', '', '', '', '', '']);
          setTimer(30);
        setIsTimerActive(true);
          
          console.log('⏰ DEBUG: Timer started for 30 seconds');
          console.log('🎯 DEBUG: Setting focus on first input...');
          
          // Focus on first input
          setTimeout(() => {
            console.log('🎯 DEBUG: Focusing on first input...');
            inputRefs.current[0]?.focus();
          }, 100);
          
          console.log('✅ DEBUG: Showing success modal...');
          setSuccessMessage('OTP has been resent successfully!');
          setShowSuccessModal(true);
        } else {
          console.log('❌ DEBUG: Resend OTP failed');
          console.log('❌ DEBUG: Error message:', result.error);
          setErrorMessage(result.error || 'Failed to resend OTP');
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error('💥 DEBUG: Exception in handleResendOtp:', error);
        console.error('💥 DEBUG: Error type:', typeof error);
        console.error('💥 DEBUG: Error message:', error.message);
        console.error('💥 DEBUG: Error stack:', error.stack);
        console.error('💥 DEBUG: Full error object:', JSON.stringify(error, null, 2));
        
        setErrorMessage(error.message || 'Failed to resend OTP. Please try again.');
        setShowErrorModal(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>
        
        {/* App Icon */}
        <View style={styles.appIconContainer}>
          <AppIcon width={50} height={50} />
        </View>
        
        <Text style={styles.title}>
          {isEmailVerification ? 'Verify Email OTP' : 'Verify Phone OTP'}
        </Text>
        <Text style={styles.subtitle}>
          {isEmailVerification 
            ? `Please enter the 6-digit OTP sent to ${email}` 
            : 'Please enter the 6-digit OTP sent to your phone'
          }
        </Text>
        
        <View style={styles.otpContainer}> 
          {otp.map((digit, index) => (
            <OTPInput
              key={index}
              index={index}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              inputRef={(ref) => {
                if (ref) {
                  inputRefs.current[index] = ref;
                }
              }}
              isFilled={!!digit}
            />
          ))}
        </View>
        
        {/* TEST BUTTON - Remove this after debugging */}
 
        
        <CustomButton
          title={isLoading ? "Verifying..." : "Submit"}
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={isLoading}
        />
        
        <TouchableOpacity 
          style={styles.resendButton}
          onPress={handleResendOtp}
          disabled={isTimerActive}
        >
          <View style={styles.resendContainer}>
            <MaskedView
              maskElement={
                <Text style={[styles.resendText, { backgroundColor: 'transparent' }]}>
                  Resend OTP
                </Text>
              }
            >
              <LinearGradient
                colors={['#DD3562', '#8354FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 30, width: 140 }}
              >
                <Text style={[styles.resendText, { opacity: 0 }]}>
                  Resend OTP 
                </Text>
              </LinearGradient>
            </MaskedView>
            
            {isTimerActive && (
              <View style={styles.timerContainer}>
                <MaskedView
                  maskElement={
                    <ClockIcon width={16} height={16} />
                  }
                >
                  <LinearGradient
                    colors={['#DD3562', '#8354FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 16, width: 16 }}
                  >
                    <View style={{ height: 16, width: 16 }} />
                  </LinearGradient>
                </MaskedView>
                <MaskedView
                  maskElement={
                    <Text style={[styles.timerText, { backgroundColor: 'transparent' }]}>
                      {formatTime(timer)}
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={['#DD3562', '#8354FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 20, width: 50 }}
                  >
                    <Text style={[styles.timerText, { opacity: 0 }]}>
                      {formatTime(timer)}
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Success"
        message={successMessage}
        onClose={() => {
          setShowSuccessModal(false);
          setSuccessAction(null);
        }}
        onButtonPress={() => {
          setShowSuccessModal(false);
          if (successAction) {
            successAction();
            setSuccessAction(null);
          }
        }}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        title="Error"
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  appIconContainer: {
    bottom:15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    bottom:5,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    // marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
    maxWidth: 280,
    flexWrap: 'wrap',
    fontFamily: 'Lexend-Regular',
    fontWeight: '400',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
    paddingHorizontal: 10,
  },
  otpInputContainer: {
    position: 'relative',
  },
  otpGradientBorder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    padding: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInputInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#01010D',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // This prevents any visual artifacts
  },
  otpInput: {
    width: 42,
    height: 42,
    borderRadius: 21,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
    borderWidth: 0, // Ensure no border
    outline: 'none', // For web compatibility
  },
  otpInputFilled: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  submitButton: {
    width: 212,
    marginBottom: 25,
  },
  testButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  resendButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  resendContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 22, 
    fontWeight: '600',
    textAlign: 'center',
    color: '#DD3562', 
    letterSpacing: 0.5,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
    color: '#DD3562', 
  },
  timerText: {
 bottom:2,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#DD3562',
    letterSpacing: 0.5,
  },
});

export default VerifyNumberScreen;