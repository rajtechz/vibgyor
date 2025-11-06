// src/screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Redux imports removed for direct API integration
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackground from '../../components/common/CommonBackground';
import CustomButton from '../../components/common/CustomButton';
import SuccessModal from '../../components/common/SuccessModal';
import ErrorModal from '../../components/common/ErrorModal';
import { authAPI } from '../../api/authAPI';
import { useDispatch } from 'react-redux';
import { setPhoneNumber as setPhoneNumberRedux } from '../../redux/slices/authSlice';

function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Professional API call using authAPI service
  const sendOTPAPI = async (phoneNumber, countryCode) => {
    try {
      console.log('🚀 LoginScreen: Calling authAPI.sendOTP');
      console.log('📱 Phone:', phoneNumber);
      console.log('🌍 Country:', countryCode);
      
      const response = await authAPI.sendOTP(phoneNumber, countryCode);
      
      console.log('📊 LoginScreen: API Response:', response);
      
      if (response.success) {
        console.log('✅ LoginScreen: OTP Sent Successfully');
        return response;
      } else {
        console.log('❌ LoginScreen: API Error:', response.error);
        throw new Error(response.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('💥 LoginScreen: API Error:', error);
      throw error;
    }
  };

  const handlePhoneChange = (text) => {
    // Remove any non-numeric characters
    const cleanedText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(cleanedText);
  };

  const validatePhoneNumber = (phone) => {
    // Indian phone number validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    console.log('🎯 LoginScreen: handleSubmit called');
    console.log('📱 Phone Number:', phoneNumber);
    console.log('🌍 Country Code:', countryCode);
    
    // Clear previous errors
    setError(null);

    // Validate phone number
    if (!phoneNumber.trim()) {
      console.log('❌ LoginScreen: Phone number is empty');
      setErrorMessage('Please enter your phone number');
      setShowErrorModal(true);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      console.log('❌ LoginScreen: Invalid phone number format');
      setErrorMessage('Please enter a valid 10-digit phone number');
      setShowErrorModal(true);
      return;
    }

    console.log('✅ LoginScreen: Validation passed, proceeding with API call');

    try {
      setIsLoading(true);
      
      // Save phone number to Redux BEFORE API call
      console.log('💾 LoginScreen: Saving phone number to Redux');
      console.log('🔍 LoginScreen: setPhoneNumberRedux function:', setPhoneNumberRedux);
      console.log('🔍 LoginScreen: setPhoneNumberRedux type:', typeof setPhoneNumberRedux);
      dispatch(setPhoneNumberRedux({ phoneNumber, countryCode }));
      
      // Call API directly
      const result = await sendOTPAPI(phoneNumber, countryCode);
      
      if (result.success) {
        console.log('✅ OTP Sent Successfully:', result);
        const message = `Verification code has been sent to ${result.data.maskedPhone || 'your phone number'}.`;
        setSuccessMessage(message);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('💥 LoginScreen: Error in handleSubmit:', error);
      setError(error.message);
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Please enter your valid phone number. We will send you a 6-digit code to verify.</Text>

          <View style={styles.inputGroup}>
            <LinearGradient
              colors={['#C53E8D', '#8A52F3']}
              style={styles.inputGradientBorder}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <View style={styles.inputContainer}>
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.countryCode}>+91</Text>
                  <Svg width="10" height="6" viewBox="0 0 10 6" style={styles.chevron}>
                    <Path
                      d="M9 1L5 5L1 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <View style={styles.inputDivider} />
                <TextInput
                  style={styles.phoneInput}
                  placeholder="331 623 8413"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  autoFocus={false}
                  selectionColor="white"
                />
              </View>
            </LinearGradient>
          </View>

          <CustomButton
            title={isLoading ? "Sending..." : "Submit"}
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={isLoading}
          />

        </View>
      </SafeAreaView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="OTP Sent"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
        onButtonPress={() => {
          setShowSuccessModal(false);
          navigation.navigate('VerifyNumber');
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
  safeArea: {
    flex: 1,

  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    fontFamily: 'Lexend-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Lexend-Regular',
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  inputGradientBorder: {
    borderRadius: 30,
    padding: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 48,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  countryCode: {
    color: 'white',
    fontSize: 16,
    marginRight: 5,
    fontFamily: 'Lexend-Regular',
  },
  chevron: {
    marginLeft: 5,
  },
  inputDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
    width: '70%',
    alignSelf: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3F1444',
  },
  orCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3F1444',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    zIndex: 1,
  },
  orText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  socialText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  socialButton: {
    width: 63,
    height: 63,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 63,
    height: 63,
  },
});

export default LoginScreen;
