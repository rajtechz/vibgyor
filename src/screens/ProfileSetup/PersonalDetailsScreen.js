// src/screens/ProfileSetup/PersonalDetailsScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { setTokens, setVerifiedEmail, setProfileCompletion } from '../../redux/slices/authSlice';
import { store } from '../../redux/store';

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
  
  // Username validation states
  const [usernameStatus, setUsernameStatus] = useState(null); // 'available', 'unavailable', 'checking', null
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Get Redux state for debugging
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Refs (declare after redux hooks to keep stable order)
  const scrollViewRef = useRef(null);
  const saveDraftTimerRef = useRef(null);
  
  // Debug Redux state
  useEffect(() => {
    console.log('📧 DEBUG: PersonalDetailsScreen Redux State:', {
      accessToken: authState.accessToken ? 'Present' : 'Missing',
      refreshToken: authState.refreshToken ? 'Present' : 'Missing',
      isAuthenticated: authState.isAuthenticated,
      user: authState.user ? 'Present' : 'Missing',
      verifiedEmail: authState.verifiedEmail,
      emailVerified: authState.emailVerified
    });
    
    if (authState.accessToken) {
      console.log('📧 DEBUG: AccessToken length:', authState.accessToken.length);
      console.log('📧 DEBUG: AccessToken preview:', authState.accessToken.substring(0, 20) + '...');
    } else {
      console.log('❌ DEBUG: No access token in Redux state');
      console.log('❌ DEBUG: Full auth state:', JSON.stringify(authState, null, 2));
    }
  }, [authState]);

  // Load verified email from Redux
  useEffect(() => {
    if (authState.verifiedEmail && authState.emailVerified) {
      console.log('📧 DEBUG: Loaded verified email from Redux:', authState.verifiedEmail);
      setEmailVerified(true);
      setFormData(prev => ({ ...prev, email: authState.verifiedEmail }));
    }
  }, [authState.verifiedEmail, authState.emailVerified]);

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draftJson = await AsyncStorage.getItem('personalDetailsDraft');
        if (draftJson) {
          const draft = JSON.parse(draftJson);
          // Only apply fields that exist in draft
          setFormData((prev) => ({
            ...prev,
            ...draft,
          }));
        }
      } catch (e) {
        // ignore
      }
    };
    loadDraft();
  }, []);

  // Persist draft on changes (debounced)
  useEffect(() => {
    if (saveDraftTimerRef.current) {
      clearTimeout(saveDraftTimerRef.current);
    }
    saveDraftTimerRef.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem('personalDetailsDraft', JSON.stringify(formData));
      } catch (_) {}
    }, 300);
    return () => {
      if (saveDraftTimerRef.current) {
        clearTimeout(saveDraftTimerRef.current);
      }
    };
  }, [formData]);

  // Get current profile step on component mount
  useEffect(() => {
    const getCurrentStep = async () => {
      try {
        // Check Redux state first - if profile is already marked as completed, navigate immediately
        const reduxState = store.getState();
        if (reduxState.auth.isProfileCompleted) {
          console.log('✅ PersonalDetails: Profile already completed (from Redux), navigating to Main');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
          return;
        }
        
        console.log('📊 DEBUG: Fetching current profile step...');
        const result = await authAPI.getProfileStep(authState.accessToken);
        
        if (result.success) {
          console.log('✅ DEBUG: Profile step retrieved:', result.data);
          
          // Extract step information from API response
          const profileData = result.data?.data || {};
          const currentStep = profileData.currentStep || profileData.profileCompletionStep;
          const isCompleted = profileData.isCurrentStepCompleted || profileData.isProfileCompleted || currentStep === 'completed';
          const nextStep = profileData.nextStep;
          
          console.log('📊 DEBUG: Current step:', currentStep);
          console.log('📊 DEBUG: Is completed:', isCompleted);
          console.log('📊 DEBUG: Next step:', nextStep);
          
          // Update Redux with latest status
          if (isCompleted) {
            dispatch(setProfileCompletion({
              isCompleted: true,
              step: 'completed'
            }));
            
            // Update AsyncStorage
            const { setProfileSetupStatus } = await import('../../utils/authUtils');
            await setProfileSetupStatus(true);
          }
          
          // Check if profile is completed
          if (currentStep === 'completed' || isCompleted) {
            console.log('✅ DEBUG: Profile is completed, navigating to home screen');
            // Update Redux state
            const { setProfileCompletion } = await import('../../redux/slices/authSlice');
            store.dispatch(setProfileCompletion({
              isCompleted: true,
              step: 'completed'
            }));
            // Profile is completed, navigate to home screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
            return;
          }
          
          // If basic_info step is already completed, we might want to pre-fill data
          if (currentStep === 'basic_info' && isCompleted) {
            console.log('📊 DEBUG: Basic info step already completed, pre-filling data');
            // TODO: Pre-fill form data from existing profile
          } else if (currentStep !== 'basic_info' && currentStep !== 'personal_details') {
            console.log('📊 DEBUG: User is on a different step, navigating accordingly');
            // Navigate to the appropriate step
            if (currentStep === 'gender') {
              navigation.navigate('Gender');
            } else if (currentStep === 'interests') {
              navigation.navigate('Interests');
            } else if (currentStep === 'preferences') {
              navigation.navigate('Preferences');
            } else if (currentStep === 'location') {
              navigation.navigate('Location');
            }
          }
        } else {
          console.log('❌ DEBUG: Failed to get profile step');
          console.log('❌ DEBUG: Error:', result.error);
        }
      } catch (error) {
        console.error('💥 DEBUG: Exception getting profile step:', error);
      }
    };

    // Only get step if user is authenticated
    if (authState.isAuthenticated && authState.accessToken) {
      getCurrentStep();
    } else {
      // If not authenticated, redirect to Auth
      console.log('❌ DEBUG: User not authenticated, redirecting to Auth');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  }, [authState.isAuthenticated, authState.accessToken, authState.isProfileCompleted, navigation, dispatch]);

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
        
        // Store verified email in Redux
        console.log('💾 Redux: Storing verified email:', verifiedEmail);
        dispatch(setVerifiedEmail(verifiedEmail));
        
        // Update email if it was verified
        if (verifiedEmail !== formData.email) {
          setFormData(prev => ({ ...prev, email: verifiedEmail }));
        }
      }
    }, [emailVerified, route.params, formData.email, dispatch])
  );

  // Check username availability
  const checkUsernameAvailability = async (username) => {
    console.log('👤 DEBUG: Checking username availability:', username);
    setIsCheckingUsername(true);
    setUsernameStatus('checking');
    
    try {
      const result = await authAPI.checkUsernameAvailable(username);
      console.log('📊 DEBUG: Username check result:', result);
      
      if (result.success) {
        // API shape: { success, status, message, data: { available: boolean, ... } }
        const isAvailable = !!result.data?.data?.available;

        if (isAvailable) {
          console.log('✅ DEBUG: Username is available');
          setUsernameStatus('available');
          setShowSuggestions(false);
        } else {
          console.log('❌ DEBUG: Username is not available');
          setUsernameStatus('unavailable');
          // Get suggestions
          await getUsernameSuggestions(username);
        }
      } else {
        console.log('❌ DEBUG: Username check failed');
        setUsernameStatus(null);
        showError(result.error || 'Failed to check username availability');
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in checkUsernameAvailability:', error);
      setUsernameStatus(null);
      showError(error.message || 'Failed to check username availability');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Debounced username availability check
  useEffect(() => {
    let debounceTimer;
    
    if (formData.lastName && formData.lastName.length >= 3) {
      debounceTimer = setTimeout(async () => {
        await checkUsernameAvailability(formData.lastName);
      }, 500); // 500ms debounce
    } else {
      setUsernameStatus(null);
      setUsernameSuggestions([]);
      setShowSuggestions(false);
    }
    
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.lastName]);

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

  const scrollToEndOnFocus = () => {
    // Small delay lets the keyboard animate in before scrolling
    setTimeout(() => {
      if (scrollViewRef.current?.scrollToEnd) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      } else if (scrollViewRef.current?.scrollTo) {
        scrollViewRef.current.scrollTo({ y: 10000, animated: true });
      }
    }, 100);
  };

  const handleEmailVerification = async () => {
    console.log('📧 DEBUG: handleEmailVerification called');
    console.log('📧 DEBUG: Email:', formData.email);
    console.log('📧 DEBUG: Full authState:', JSON.stringify(authState, null, 2));
    
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

    // Check if user is authenticated
    if (!authState.isAuthenticated || !authState.accessToken) {
      console.log('❌ DEBUG: User not authenticated or token missing');
      console.log('📊 DEBUG: isAuthenticated:', authState.isAuthenticated);
      console.log('📊 DEBUG: accessToken:', authState.accessToken);
      showError('Please login first to verify email', 'Authentication Required');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📧 DEBUG: Calling sendEmailOTP API...');
      
      // Get access token from Redux
      const accessToken = authState.accessToken;
      console.log('🔑 DEBUG: Access Token:', accessToken ? 'Present' : 'Missing');
      console.log('🔑 DEBUG: Access Token Value:', accessToken);
      
      // Call Email OTP API with token
      const result = await authAPI.sendEmailOTP(formData.email, accessToken);
      
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

  // Get username suggestions
  const getUsernameSuggestions = async (base) => {
    console.log('💡 DEBUG: Getting username suggestions for:', base);
    
    try {
      const result = await authAPI.getUsernameSuggestions(base);
      console.log('📊 DEBUG: Username suggestions result:', result);
      
      const suggestions = result.data?.data?.suggestions || [];
      if (result.success && suggestions.length > 0) {
        setUsernameSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setUsernameSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in getUsernameSuggestions:', error);
      setUsernameSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    console.log('✅ DEBUG: Selected suggestion:', suggestion);
    setFormData(prev => ({ ...prev, lastName: suggestion }));
    setShowSuggestions(false);
    setUsernameStatus('available');
  };

  const handleContinue = async () => {
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showError('Please fill in all required fields', 'Missing Information');
      return;
    }

    // Validate username availability
    if (usernameStatus === 'unavailable') {
      showError('Please choose an available username', 'Username Unavailable');
      return;
    }

    if (usernameStatus === 'checking') {
      showError('Please wait while we check your username', 'Checking Username');
      return;
    }

    if (!emailVerified) {
      showError('Please verify your email address before continuing', 'Email Verification Required');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📊 DEBUG: Preparing to update profile...');
      
      // Prepare complete profile data as per API specification
      const profileData = {
        fullName: formData.firstName,
        username: formData.lastName,
        email: formData.email,
        dob: formData.dob,
        bio: formData.bio || '',
        // Additional fields will be added in subsequent steps
        gender: '', // Will be filled in Gender screen
        pronouns: '', // Will be filled in Gender screen
        likes: [], // Will be filled in Interests screen
        interests: [], // Will be filled in Interests screen
        preferences: {
          hereFor: '', // Will be filled in Preferences screen
          primaryLanguage: '', // Will be filled in Preferences screen
          secondaryLanguage: '' // Will be filled in Preferences screen
        },
        location: {
          city: '', // Will be filled in Location screen
          country: '', // Will be filled in Location screen
          lat: 0, // Will be filled in Location screen
          lng: 0 // Will be filled in Location screen
        }
      };
      
      console.log('📊 DEBUG: Complete Profile Data:', JSON.stringify(profileData, null, 2));
      
      // Call update profile API with token
      const result = await authAPI.updateUserProfile(profileData, authState.accessToken);
      
      console.log('📊 DEBUG: Update Profile API Response:', result);
      
      if (result.success && result.data?.success) {
        console.log('✅ DEBUG: Profile updated successfully');
        
        // Check next step from response
        const nextStep = result.data?.data?.nextStep || result.data?.data?.profileCompletionStep;
        console.log('📊 DEBUG: Next step:', nextStep);
        
        // Check if profile is completed
        if (nextStep === 'completed' || result.data?.data?.isProfileCompleted) {
          console.log('✅ DEBUG: Profile is completed, storing completion status');
          
          // Store profile completion in Redux
          dispatch(setProfileCompletion({
            isCompleted: true,
            step: 'completed'
          }));
          
          // Store profile completion in AsyncStorage
          const { setProfileSetupStatus } = await import('../../utils/authUtils');
          await setProfileSetupStatus(true);
          
          // Navigate to home screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
          // Clear draft and form after successful completion
          try {
            await AsyncStorage.removeItem('personalDetailsDraft');
          } catch (_) {}
          setFormData({ firstName: '', lastName: '', email: '', dob: '', bio: '', profileImage: null });
          setEmailVerified(false);
        } else {
          // Navigate to appropriate next screen based on nextStep
          if (nextStep === 'gender') {
            navigation.navigate('Gender');
          } else if (nextStep === 'interests') {
            navigation.navigate('Interests');
          } else if (nextStep === 'preferences') {
            navigation.navigate('Preferences');
          } else if (nextStep === 'location') {
            navigation.navigate('Location');
          } else {
            // Default to Gender screen if no specific next step
            console.log('📊 DEBUG: No specific next step, navigating to Gender');
            navigation.navigate('Gender');
          }
          // Clear draft and current form for next user flow
          try {
            await AsyncStorage.removeItem('personalDetailsDraft');
          } catch (_) {}
          setFormData({ firstName: '', lastName: '', email: '', dob: '', bio: '', profileImage: null });
          setEmailVerified(false);
        }
      } else {
        console.log('❌ DEBUG: Profile update failed');
        const errorMessage = result.data?.message || result.error || 'Failed to update profile';
        showError(errorMessage, 'Profile Update Error');
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in handleContinue:', error);
      showError(error.message || 'Failed to update profile', 'Profile Update Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            // Clear draft and form on back
            (async () => {
              try { await AsyncStorage.removeItem('personalDetailsDraft'); } catch (_) {}
              setFormData({ firstName: '', lastName: '', email: '', dob: '', bio: '', profileImage: null });
              setEmailVerified(false);
              setUsernameStatus(null);
              setUsernameSuggestions([]);
              setShowSuggestions(false);
            })();
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate('Auth');
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
                  placeholder="Full Name"
                  placeholderTextColor="white"
                  onFocus={scrollToEndOnFocus}
                />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={usernameStatus === 'unavailable' ? ['#FF6B6B', '#FF5252'] : ['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <View style={styles.usernameInputContainer}>
                  <TextInput
                    style={styles.usernameInput}
                    value={formData.lastName}
                    onChangeText={(text) => {
                      handleInputChange('lastName', text);
                      setUsernameStatus(null);
                    }}
                    placeholder="User Name"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    autoCapitalize="none"
                    onFocus={scrollToEndOnFocus}
                  />
                  {isCheckingUsername && (
                    <Text style={styles.usernameStatusText}>Checking...</Text>
                  )}
                  {usernameStatus === 'available' && (
                    <Text style={styles.usernameAvailableText}>✓ Available</Text>
                  )}
                  {usernameStatus === 'unavailable' && (
                    <Text style={styles.usernameUnavailableText}>✗ Taken</Text>
                  )}
                </View>
              </LinearGradient>
            </View>
            
            {/* Username Suggestions Tooltip */}
            {showSuggestions && usernameSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer} pointerEvents="box-none">
                <ScrollView style={styles.suggestionsScroll} nestedScrollEnabled>
                  <Text style={styles.suggestionsTitle}>Suggested usernames:</Text>
                  {usernameSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionSelect(suggestion)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
           
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <View style={[styles.emailInputContainer, emailVerified && styles.emailInputContainerVerified]}>
                  <TextInput
                    style={[styles.emailInput, emailVerified && styles.emailInputVerified]}
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="E-mail"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!emailVerified}
                    onFocus={scrollToEndOnFocus}
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
                  onFocus={scrollToEndOnFocus}
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
      </KeyboardAvoidingView>

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
    position: 'relative',
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
  emailInputVerified: {
    opacity: 0.7,
  },
  emailInputContainerVerified: {
    backgroundColor: 'rgba(26, 0, 51, 0.5)',
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
  // Username styles
  usernameInputContainer: {
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  usernameInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    borderWidth: 0,
    fontFamily: 'Lexend-Regular',
    paddingRight: 10,
  },
  usernameStatusText: {
    fontSize: 12,
    color: '#FFA500',
    fontFamily: 'Lexend-SemiBold',
  },
  usernameAvailableText: {
    fontSize: 12,
    color: '#4CAF50',
    fontFamily: 'Lexend-SemiBold',
  },
  usernameUnavailableText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontFamily: 'Lexend-SemiBold',
  },
  // Suggestions styles
  suggestionsContainer: {
    position: 'absolute',
    top: 70, // positioned just below the username input
    left: 0,
    right: 0,
    backgroundColor: 'rgba(12, 1, 22, 0.99)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    zIndex: 999,
    elevation: 8,
  },
  suggestionsScroll: {
    height: 150,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontFamily: 'Lexend-SemiBold',
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    backgroundColor: 'rgba(197, 62, 141, 0.2)',
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Lexend-Regular',
  },
});
export default PersonalDetailsScreen;
