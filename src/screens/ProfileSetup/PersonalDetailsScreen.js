// src/screens/ProfileSetup/PersonalDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Platform, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../../components/common/CustomButton';
import ProfileImageUpload from '../../components/common/ProfileImageUpload';
import ErrorModal from '../../components/common/ErrorModal';
import CommonBackground from '../../components/common/CommonBackground';
import { BackIcon, CalendarIcon } from '../../components/icons/SvgIcons';
import { authAPI } from '../../api/authAPI';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setTokens } from '../../redux/slices/authSlice';

function PersonalDetailsScreen({ navigation }) {
  const route = useRoute();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    bio: '',
    profileImage: null
  });

  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: 'Error'
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get Redux state for debugging
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // Debug Redux state
  useEffect(() => {
    console.log('📧 DEBUG: PersonalDetailsScreen Redux State:', {
      accessToken: authState.accessToken ? 'Present' : 'Missing',
      refreshToken: authState.refreshToken ? 'Present' : 'Missing',
      isAuthenticated: authState.isAuthenticated,
      user: authState.user ? 'Present' : 'Missing'
    });
    
    if (authState.accessToken) {
      console.log('📧 DEBUG: AccessToken length:', authState.accessToken.length);
      console.log('📧 DEBUG: AccessToken preview:', authState.accessToken.substring(0, 20) + '...');
    } else {
      console.log('❌ DEBUG: No access token in Redux state');
      console.log('❌ DEBUG: Full auth state:', JSON.stringify(authState, null, 2));
    }
  }, [authState]);

  // Handle email verification success when returning from VerifyNumberScreen
  useFocusEffect(
    React.useCallback(() => {
      console.log('📧 DEBUG: PersonalDetailsScreen focused');
      console.log('📧 DEBUG: emailVerified state:', emailVerified);
      
      // Check if we're returning from email verification
      const { emailVerified: isVerified, verifiedEmail } = route.params || {};
      console.log('📧 DEBUG: Route params:', { isVerified, verifiedEmail });
      
      if (isVerified && verifiedEmail) {
        console.log('✅ DEBUG: Email verification successful, updating state');
        setEmailVerified(true);
        // Update email if it was verified
        if (verifiedEmail !== formData.email) {
          setFormData(prev => ({ ...prev, email: verifiedEmail }));
        }
      }
    }, [emailVerified, route.params, formData.email])
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showError = (message, title = 'Error') => {
    setErrorModal({
      visible: true,
      message,
      title
    });
  };

  const hideError = () => {
    setErrorModal({
      visible: false,
      message: '',
      title: 'Error'
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        dob: formatDate(selectedDate)
      }));
    }
  };

  const handleEmailVerification = async () => {
    console.log('📧 DEBUG: handleEmailVerification called');
    console.log('📧 DEBUG: Email:', formData.email);
    
    if (!formData.email) {
      console.log('❌ DEBUG: No email provided');
      showError('Please enter your email address first', 'Email Required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('❌ DEBUG: Invalid email format');
      showError('Please enter a valid email address', 'Invalid Email');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📧 DEBUG: Calling sendEmailOTP API...');
      
      // Call Email OTP API
      const result = await authAPI.sendEmailOTP(formData.email);
      
      console.log('📊 DEBUG: Email OTP API Response:', result);
      
      if (result.success) {
        console.log('✅ DEBUG: Email OTP sent successfully');
        console.log('✅ DEBUG: Full result:', JSON.stringify(result, null, 2));
        
        Alert.alert(
          'Verification Email Sent',
          'Please check your email and enter the OTP to verify your email address.',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('📧 DEBUG: Navigating to VerifyNumberScreen for email OTP');
                // Navigate to existing VerifyNumberScreen with email context
                navigation.navigate('VerifyNumber', { 
                  email: formData.email,
                  isEmailVerification: true 
                });
              }
            }
          ]
        );
      } else {
        console.log('❌ DEBUG: Email OTP API failed');
        console.log('❌ DEBUG: Error:', result.error);
        showError(result.error || 'Failed to send verification email', 'Email Error');
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in handleEmailVerification:', error);
      console.error('💥 DEBUG: Error type:', typeof error);
      console.error('💥 DEBUG: Error message:', error.message);
      showError(error.message || 'Failed to send verification email', 'Email Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerificationSuccess = () => {
    console.log('✅ DEBUG: Email verification successful');
    setEmailVerified(true);
  };




  const handleContinue = () => {
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showError('Please fill in all required fields', 'Missing Information');
      return;
    }

    if (!emailVerified) {
      showError('Please verify your email address before continuing', 'Email Verification Required');
      return;
    }

    navigation.navigate('Gender');
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
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // Navigate to Auth screen if no previous screen
              navigation.navigate('Auth');
            }
          }}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>

        <Text style={styles.title}>Profile Details  </Text>
        <Text style={styles.description}>Fill up the following details</Text>
        
        <View style={styles.profileImageContainer}>
          <ProfileImageUpload
            onImageSelected={(image) => handleInputChange('profileImage', image)}
            currentImage={formData.profileImage}
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
           
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(text) => handleInputChange('firstName', text)}
                  placeholder="First Name"
                  placeholderTextColor="white"
                />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.inputGroup}>
           
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(text) => handleInputChange('lastName', text)}
                  placeholder="Last Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.inputGroup}>
           
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <View style={styles.emailInputContainer}>
                  <TextInput
                    style={styles.emailInput}
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="E-mail"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={[styles.verifyButton, emailVerified && styles.verifyButtonVerified]}
                    onPress={handleEmailVerification}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={emailVerified ? ['#4CAF50', '#45A049'] : ['#C53E8D', '#8A52F3']}
                      style={styles.verifyButtonGradient}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                    >
                      <Text style={styles.verifyButtonText}>
                        {isLoading ? 'Sending...' : (emailVerified ? 'Verified' : 'Verify')}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.inputGroup}>
       
            <View style={styles.dobContainer}>
              <View style={styles.dobInputContainer}>
                <LinearGradient
                  colors={['#C53E8D', '#8A52F3']}
                  style={styles.dobGradientBorder}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <TouchableOpacity
                    style={styles.dobInputField}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dobPlaceholder}>
                      {formData.dob || 'DOB'}
                    </Text>
                    <CalendarIcon width={21} height={22} />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View style={styles.ageBadgeContainer}>
                <LinearGradient
                  colors={['#C53E8D', '#8A52F3']}
                  style={styles.ageBadgeGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <View style={styles.ageBadge}>
                    <Text style={styles.ageText}>
                      {formData.dob ? calculateAge(selectedDate) : '18'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
           
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <TextInput
                  style={styles.input}
                  value={formData.bio}
                  onChangeText={(text) => handleInputChange('bio', text)}
                  placeholder="Bio"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  multiline
                  numberOfLines={1}
                  textAlignVertical="center"
                />
              </LinearGradient>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {/* TEST BUTTON - Remove this after debugging */}
        
          
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>

      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        onClose={hideError}
      />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
    fontFamily: 'Lexend-Bold',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Lexend-Regular',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formContainer: {
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 0,
  },
  inputGradientBorder: {
    borderRadius: 30,
    padding: 2,
  },
  input: {
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 0,
    fontFamily: 'Lexend-Regular',
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    borderWidth: 0,
    fontFamily: 'Lexend-Regular',
    // paddingRight: 10,
  },
  verifyButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  verifyButtonVerified: {
    opacity: 0.8,
  },
  verifyButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  verifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Lexend-SemiBold',
  },
  dobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dobInputContainer: {
    flex: 1,
  },
  dobGradientBorder: {
    borderRadius: 30,
    padding: 2,
  },
  dobInputField: {
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dobPlaceholder: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    fontFamily: 'Lexend-Regular',
  },
  ageBadgeContainer: {
    width: 50,
    height: 50,
  },
  ageBadgeGradient: {
    borderRadius: 30,
    padding: 2,
    width: 50,
    height: 50,
  },
  ageBadge: {
    backgroundColor: '#1a0033',
    borderRadius: 28,
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    fontFamily: 'Lexend-SemiBold',
  },
  buttonContainer: {
    marginTop: 5,
  },
  continueButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 35,
  },
  testButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PersonalDetailsScreen;
