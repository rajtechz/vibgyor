import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackground from '../../components/common/CommonBackground';
import CustomButton from '../../components/common/CustomButton';
import ErrorModal from '../../components/common/ErrorModal';
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

// Dropdown Arrow Icon
const DropdownArrow = ({ width = 20, height = 20, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M5 7.5L10 12.5L15 7.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function PreferencesScreen({ navigation }) {
  const [hereFor, setHereFor] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('');
  const [secondaryLanguage, setSecondaryLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [catalogData, setCatalogData] = useState(null);
  const [showHereForModal, setShowHereForModal] = useState(false);
  const [showPrimaryLanguageModal, setShowPrimaryLanguageModal] = useState(false);
  const [showSecondaryLanguageModal, setShowSecondaryLanguageModal] = useState(false);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: 'Error'
  });

  // Get access token from Redux
  const authState = useSelector((state) => state.auth);

  // Fetch catalog data on component mount
  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        console.log('📋 DEBUG: Fetching catalog data...');
        const result = await authAPI.getCatalog(authState.accessToken);
        
        if (result.success) {
          console.log('✅ DEBUG: Catalog data retrieved:', result.data);
          setCatalogData(result.data?.data);
          
          // Set default values if available
          if (result.data?.data?.hereFor?.length > 0) {
            setHereFor(result.data.data.hereFor[0]);
          }
          if (result.data?.data?.languages?.length > 0) {
            setPrimaryLanguage(result.data.data.languages[0]);
            setSecondaryLanguage(result.data.data.languages[1] || result.data.data.languages[0]);
          }
        } else {
          console.log('❌ DEBUG: Failed to get catalog data');
          console.log('❌ DEBUG: Error:', result.error);
        }
      } catch (error) {
        console.error('💥 DEBUG: Exception getting catalog data:', error);
      }
    };

    // Only fetch if user is authenticated
    if (authState.isAuthenticated && authState.accessToken) {
      fetchCatalogData();
    }
  }, [authState.isAuthenticated, authState.accessToken]);

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
    console.log('🚀 ===== PREFERENCES UPDATE API TEST START =====');
    console.log('⚙️ DEBUG: handleContinue called');
    console.log('⚙️ DEBUG: Here For:', hereFor);
    console.log('⚙️ DEBUG: Primary Language:', primaryLanguage);
    console.log('⚙️ DEBUG: Secondary Language:', secondaryLanguage);
    console.log('⚙️ DEBUG: Auth State:', {
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

    // Validate required fields
    if (!hereFor || !primaryLanguage) {
      console.log('❌ DEBUG: Missing required fields');
      showError('Please select Here For and Primary Language', 'Missing Information');
      return;
    }

    try {
      setIsLoading(true);
      console.log('⚙️ DEBUG: Starting preferences profile update...');
      
      // Prepare profile data with selected preferences
      const profileData = {
        preferences: {
          hereFor: hereFor,
          primaryLanguage: primaryLanguage,
          secondaryLanguage: secondaryLanguage || ''
        },
        location: {
          city: '', // Will be filled in Location screen
          country: '', // Will be filled in Location screen
          lat: 0, // Will be filled in Location screen
          lng: 0 // Will be filled in Location screen
        }
      };
      
      console.log('⚙️ DEBUG: Preferences Profile Data:', JSON.stringify(profileData, null, 2));
      
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
        console.log('✅ DEBUG: Preferences profile updated successfully');
        
        // Navigate to UploadID screen after preferences
        console.log('📊 DEBUG: Navigating to UploadID screen');
        navigation.navigate('UploadID');
      } else {
        console.log('❌ DEBUG: Preferences profile update failed');
        console.log('❌ DEBUG: Error:', result.error);
        console.log('❌ DEBUG: Full Error Response:', JSON.stringify(result, null, 2));
        showError(result.error || 'Failed to update preferences', 'Profile Update Error');
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in handleContinue:', error);
      console.error('💥 DEBUG: Error type:', typeof error);
      console.error('💥 DEBUG: Error message:', error.message);
      console.error('💥 DEBUG: Error stack:', error.stack);
      showError(error.message || 'Failed to update preferences', 'Profile Update Error');
    } finally {
      setIsLoading(false);
      console.log('🚀 ===== PREFERENCES UPDATE API TEST END =====');
    }
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#1a0033" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Preferences</Text>

        {/* Description */}
        <Text style={styles.description}>
          Manage and set your preferences to find the best matches for you, keep enjoying!
        </Text>

        {/* Here For Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Here For</Text>
          <LinearGradient
            colors={['#C53E8D', '#8A52F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <TouchableOpacity 
              style={styles.dropdownContainer}
              onPress={() => setShowHereForModal(true)}
            >
              <Text style={styles.dropdownText}>{hereFor || 'Select Here For'}</Text>
              <DropdownArrow width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Your Language Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Your Language</Text>
          
          {/* Primary Language */}
          <LinearGradient
            colors={['#C53E8D', '#8A52F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <TouchableOpacity 
              style={styles.dropdownContainer}
              onPress={() => setShowPrimaryLanguageModal(true)}
            >
              <Text style={styles.dropdownText}>{primaryLanguage || 'Select Primary Language'}</Text>
              <DropdownArrow width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Secondary Language */}
          <View style={styles.secondaryLanguageContainer}>
          <LinearGradient
            colors={['#C53E8D', '#8A52F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <TouchableOpacity 
              style={styles.secondaryDropdownContainer}
              onPress={() => setShowSecondaryLanguageModal(true)}
            >
              <Text style={styles.secondaryDropdownText}>{secondaryLanguage || 'Select Secondary Language'}</Text>
              <DropdownArrow width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>
          </View>
        </View>

        {/* Continue Button */}
        <CustomButton
          title={isLoading ? "Updating..." : "Continue"}
          onPress={handleContinue}
          style={[styles.continueButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
        />
      </ScrollView>

      {/* Here For Modal */}
      <Modal
        visible={showHereForModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHereForModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Here For</Text>
            <ScrollView style={styles.modalScrollView}>
              {catalogData?.hereFor?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    setHereFor(option);
                    setShowHereForModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowHereForModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Primary Language Modal */}
      <Modal
        visible={showPrimaryLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPrimaryLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Primary Language</Text>
            <ScrollView style={styles.modalScrollView}>
              {catalogData?.languages?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    setPrimaryLanguage(option);
                    setShowPrimaryLanguageModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPrimaryLanguageModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Secondary Language Modal */}
      <Modal
        visible={showSecondaryLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSecondaryLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Secondary Language</Text>
            <ScrollView style={styles.modalScrollView}>
              {catalogData?.languages?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    setSecondaryLanguage(option);
                    setShowSecondaryLanguageModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSecondaryLanguageModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    fontFamily: 'Lexend-SemiBold',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF80',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
    fontFamily: 'Lexend-Regular',
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DA489E',
    marginBottom: 12,
  },
  gradientBorder: {
    borderRadius: 30,
    padding: 2,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#03000C',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    height: 48,
  },
  dropdownText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  secondaryDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#03000C',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    height: 48,
  },
  secondaryDropdownText: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  secondaryLanguageContainer: {
    marginTop: 12,
  },
  continueButton: {
    marginTop: 100,
    alignSelf: 'center',
    width: '80%',
    maxWidth: 300,
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a0033',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#8A52F3',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Lexend-SemiBold',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalOptionText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Lexend-Regular',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#8A52F3',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Lexend-SemiBold',
  },
});

export default PreferencesScreen;
