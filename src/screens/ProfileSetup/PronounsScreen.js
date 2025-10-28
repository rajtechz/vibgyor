// src/screens/ProfileSetup/PronounsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import CustomButton from '../../components/common/CustomButton';
import ErrorModal from '../../components/common/ErrorModal';
import CommonBackground from '../../components/common/CommonBackground';
import { authAPI } from '../../api/authAPI';
import { useSelector } from 'react-redux';

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

function PronounsScreen({ navigation }) {
  const [selectedPronouns, setSelectedPronouns] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pronounOptions, setPronounOptions] = useState([]);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: 'Error'
  });

  // Get access token from Redux
  const authState = useSelector((state) => state.auth);

  // Fetch pronouns options from catalog API on component mount
  useEffect(() => {
    const fetchPronounsOptions = async () => {
      try {
        console.log('👤 DEBUG: Fetching pronouns options from catalog...');
        const result = await authAPI.getCatalog(authState.accessToken);
        
        if (result.success && result.data?.data?.pronouns) {
          console.log('✅ DEBUG: Pronouns options retrieved:', result.data.data.pronouns);
          setPronounOptions(result.data.data.pronouns);
        } else {
          console.log('❌ DEBUG: Failed to get pronouns options, using fallback');
          // Fallback to hardcoded options if API fails
          setPronounOptions([
            'he/him',
            'she/her',
            'they/them',
            'ze/zir',
            'xe/xem',
            'Other'
          ]);
        }
      } catch (error) {
        console.error('💥 DEBUG: Exception getting pronouns options:', error);
        // Fallback to hardcoded options if API fails
        setPronounOptions([
          'he/him',
          'she/her',
          'they/them',
          'ze/zir',
          'xe/xem',
          'Other'
        ]);
      }
    };

    // Only fetch if user is authenticated
    if (authState.isAuthenticated && authState.accessToken) {
      fetchPronounsOptions();
    } else {
      // Fallback to hardcoded options if not authenticated
      setPronounOptions([
        'he/him',
        'she/her',
        'they/them',
        'ze/zir',
        'xe/xem',
        'Other'
      ]);
    }
  }, [authState.isAuthenticated, authState.accessToken]);

  const handlePronounSelect = (pronouns) => {
    setSelectedPronouns(pronouns);
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

  const handleContinue = async () => {
    console.log('🚀 ===== PRONOUNS UPDATE API TEST START =====');
    console.log('👤 DEBUG: handleContinue called');
    console.log('👤 DEBUG: Selected Pronouns:', selectedPronouns);
    console.log('👤 DEBUG: Auth State:', {
      isAuthenticated: authState.isAuthenticated,
      accessToken: authState.accessToken ? 'Present' : 'Missing',
      accessTokenLength: authState.accessToken?.length || 0
    });

    // Check if user is authenticated
    if (!authState.isAuthenticated || !authState.accessToken) {
      console.log('❌ DEBUG: User not authenticated or token missing');
      showError('Please login first to update profile', 'Authentication Required');
      return;
    }

    // If no pronouns selected, just navigate to next screen
    if (!selectedPronouns) {
      console.log('👤 DEBUG: No pronouns selected, navigating to next screen');
      navigation.navigate('Interests');
      return;
    }

    try {
      setIsLoading(true);
      console.log('👤 DEBUG: Starting pronouns profile update...');
      
      // Prepare profile data with selected pronouns
      const profileData = {
        pronouns: selectedPronouns,
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
      
      console.log('👤 DEBUG: Pronouns Profile Data:', JSON.stringify(profileData, null, 2));
      
      console.log('🌐 DEBUG: About to call authAPI.updateUserProfile');
      console.log('🌐 DEBUG: Parameters:', {
        profileData: profileData,
        token: authState.accessToken ? 'Present' : 'Missing'
      });
      
      // Call update profile API with token
      const result = await authAPI.updateUserProfile(profileData, authState.accessToken);
      
      console.log('📊 DEBUG: Update Profile API Response:', result);
      console.log('📊 DEBUG: Response Success:', result.success);
      console.log('📊 DEBUG: Response Data:', result.data);
      console.log('📊 DEBUG: Response Error:', result.error);
      
      if (result.success && result.data?.success) {
        console.log('✅ DEBUG: Pronouns profile updated successfully');
        
        // Check next step from response
        const nextStep = result.data?.data?.nextStep || result.data?.data?.profileCompletionStep;
        console.log('📊 DEBUG: Next step:', nextStep);
        
        // Navigate to appropriate next screen based on nextStep
        if (nextStep === 'interests') {
          navigation.navigate('Interests');
        } else if (nextStep === 'preferences') {
          navigation.navigate('Preferences');
        } else if (nextStep === 'location') {
          navigation.navigate('Location');
        } else {
          // Default to Interests screen if no specific next step
          console.log('📊 DEBUG: No specific next step, navigating to Interests');
          navigation.navigate('Interests');
        }
      } else {
        console.log('❌ DEBUG: Pronouns profile update failed');
        console.log('❌ DEBUG: Error:', result.error);
        console.log('❌ DEBUG: Full Error Response:', JSON.stringify(result, null, 2));
        showError(result.error || 'Failed to update pronouns', 'Profile Update Error');
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in handleContinue:', error);
      console.error('💥 DEBUG: Error type:', typeof error);
      console.error('💥 DEBUG: Error message:', error.message);
      console.error('💥 DEBUG: Error stack:', error.stack);
      showError(error.message || 'Failed to update pronouns', 'Profile Update Error');
    } finally {
      setIsLoading(false);
      console.log('🚀 ===== PRONOUNS UPDATE API TEST END =====');
    }
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

        <Text style={styles.title}>Your Pronouns</Text>
        <Text style={styles.subtitle}>Choose Your Pronouns For Better Results</Text>
        
        <View style={styles.optionsContainer}>
          {pronounOptions.map((pronouns, index) => {
            const isSelected = selectedPronouns === pronouns;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handlePronounSelect(pronouns)}
                style={styles.pronounOption}
                activeOpacity={1}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['#C53E8D', '#8A52F3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBorder}
                  >
                    <View style={styles.optionContainerInner}>
                      <Text style={styles.selectedOptionText}>{pronouns}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.optionContainer}>
                    <Text style={styles.optionText}>{pronouns}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title={isLoading ? "Updating..." : "Continue"}
            onPress={handleContinue}
            style={[styles.continueButton, isLoading && styles.disabledButton]}
            disabled={isLoading}
          />
        </View>
      </ScrollView>

      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        onClose={hideError}
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
    fontFamily: 'Lexend-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  pronounOption: {
    marginBottom: 12,
    borderRadius: 35,
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 2, // thickness of the gradient border
    borderRadius: 35,
  },
  optionContainerInner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
    backgroundColor: '#03000C', // inner background
    alignItems: 'center',
  },
  optionContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
    backgroundColor: '#1B1142',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#B783EB',
    textAlign: 'center',
  },
  selectedOptionText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  continueButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 35,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default PronounsScreen;
