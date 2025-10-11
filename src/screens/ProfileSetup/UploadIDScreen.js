// src/screens/ProfileSetup/UploadIDScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform, PermissionsAndroid, Linking } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import CustomButton from '../../components/common/CustomButton';
import CommonBackground from '../../components/common/CommonBackground';
import ErrorModal from '../../components/common/ErrorModal';
import UploadModal from '../../components/common/UploadModal';
import PermissionModal from '../../components/common/PermissionModal';
import { fonts } from '../../styles/typography';

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

// Upload Document Icon Component (using the provided SVG)
const UploadDocIcon = ({ width = 60, height = 92 }) => (
  <Svg width={width} height={height} viewBox="0 0 60 92" fill="none">
    <Path d="M59.9999 23.1V62.6769C60.003 63.1103 59.9198 63.54 59.7551 63.9415C59.5905 64.3431 59.3475 64.7086 59.0401 65.0171C58.7328 65.3257 58.367 65.5713 57.9638 65.74C57.5605 65.9086 57.1277 65.997 56.6899 66H3.31C2.43271 66 1.5913 65.6552 0.970653 65.0414C0.350004 64.4276 0.000883472 63.5949 0 62.7264V3.2736C0 1.5015 1.49 0 3.32666 0H36.6666V19.8C36.6666 20.6752 37.0178 21.5146 37.6429 22.1335C38.268 22.7523 39.1159 23.1 39.9999 23.1H59.9999ZM59.9999 16.5H43.3333V0.00990007L59.9999 16.5ZM16.6666 16.5V23.1H26.6666V16.5H16.6666ZM16.6666 29.7V36.3H43.3333V29.7H16.6666ZM16.6666 42.9V49.5H43.3333V42.9H16.6666Z" fill="#4C407B"/>
    <Circle cx="30" cy="73" r="17.5" fill="#03000C" stroke="#4C407B" strokeWidth="3"/>
    <Path d="M31.3357 70.1102V80H29.6643V70.1102L25.1817 74.4685L24 73.3196L30.5 67L37 73.3196L35.8183 74.4685L31.3357 70.1102Z" fill="white"/>
  </Svg>
);

// Dropdown Arrow Icon
const DropdownArrow = ({ width = 16, height = 16, color = '#8A2BE2' }) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <Path
      d="M4 6L8 10L12 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function UploadIDScreen({ navigation }) {
  const [selectedIDType, setSelectedIDType] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: 'Error'
  });
  const [uploadModal, setUploadModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState({
    visible: false,
    title: 'Camera Permission Required',
    message: 'Camera permission is required to take photos. Please enable it in settings.'
  });

  const idTypes = [
    'Driver\'s License',
    'Passport',
    'National ID',
    'State ID',
    'Military ID'
  ];

  const handleIDTypeSelect = (type) => {
    setSelectedIDType(type);
    setShowDropdown(false);
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

  const handleFileUpload = () => {
    setUploadModal(true);
  };

  const openAppSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        // Try multiple methods to open settings
        const canOpen = await Linking.canOpenURL('app-settings:');
        if (canOpen) {
          await Linking.openURL('app-settings:');
        } else {
          // Fallback to general settings
          await Linking.openSettings();
        }
      } else {
        await Linking.openURL('app-settings:');
      }
    } catch (error) {
      console.warn('Cannot open settings:', error);
      // Show manual instructions
      setPermissionModal({
        visible: true,
        title: 'Open Settings Manually',
        message: 'Please go to Settings > Apps > AwesomeProject > Permissions and enable Camera permission.'
      });
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // First check if permission is already granted
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (hasPermission) {
          return true;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        console.log('Permission result:', granted);
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          // Show modal to open settings
          setPermissionModal({
            visible: true,
            title: 'Camera Permission Required',
            message: 'Camera permission is required to take photos. Please enable it in settings.'
          });
          return false;
        } else {
          // Permission denied permanently or "Ask Me Later"
          setPermissionModal({
            visible: true,
            title: 'Camera Permission Required',
            message: 'Camera permission is required to take photos. Please enable it in settings.'
          });
          return false;
        }
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true;
  };

  const handleCameraPress = async () => {
    setUploadModal(false);
    
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return; // Permission handling is done in requestCameraPermission
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        showError('Camera error: ' + response.errorMessage, 'Camera Error');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const timestamp = new Date().toLocaleString();
        const fileName = asset.fileName || `Camera_Photo_${timestamp.replace(/[^\w\s]/gi, '_')}.jpg`;
        setUploadedFile(fileName);
        console.log('Photo taken:', asset.uri);
      }
    });
  };

  const handleGalleryPress = () => {
    setUploadModal(false);

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
      } else if (response.errorMessage) {
        showError('Gallery error: ' + response.errorMessage, 'Gallery Error');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const timestamp = new Date().toLocaleString();
        const fileName = asset.fileName || `Gallery_Photo_${timestamp.replace(/[^\w\s]/gi, '_')}.jpg`;
        setUploadedFile(fileName);
        console.log('Photo selected:', asset.uri);
      }
    });
  };

  const handleContinue = () => {
    // Validation commented out for now
    // if (!selectedIDType) {
    //   showError('Please select an ID type', 'Selection Required');
    //   return;
    // }
    // if (!uploadedFile) {
    //   showError('Please upload a document', 'Upload Required');
    //   return;
    // }
    navigation.navigate('Location');
  };

  // Memoize gradient colors to prevent re-renders
  const gradientColors = useMemo(() => ['#C53E8D', '#8A52F3'], []);

  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon width={24} height={24} color="#D9D8F3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Location')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Upload ID</Text>
        
        <View style={styles.contentContainer}>
          <Text style={styles.description}>
            We strongly give full freedom to our users, but to avoid any kind of mishap & nuisance we recommend you to provide a ID proof for safety & security
          </Text>

          <View style={styles.idTypeContainer}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorder}
            >
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDropdown(!showDropdown)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dropdownText,
                  !selectedIDType && styles.placeholderText
                ]}>
                  {selectedIDType || 'ID Proof'}
                </Text>
                <DropdownArrow width={16} height={16} color="white" />
              </TouchableOpacity>
            </LinearGradient>

            {showDropdown && (
              <View style={styles.dropdownList}>
                {idTypes.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => handleIDTypeSelect(type)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.uploadContainer}>
            <TouchableOpacity
              style={[
                styles.uploadArea,
                uploadedFile && styles.uploadedArea
              ]}
              onPress={handleFileUpload}
            >
              <UploadDocIcon width={60} height={92} />
              <Text style={styles.uploadText}>
                {uploadedFile ? 'Document Uploaded' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
            
            {uploadedFile && (
              <View style={styles.documentInfoContainer}>
                <Text style={styles.documentNameLabel}>Selected Document:</Text>
                <Text style={styles.documentName}>{uploadedFile}</Text>
                <TouchableOpacity 
                  style={styles.changeDocumentButton}
                  onPress={handleFileUpload}
                >
                  <Text style={styles.changeDocumentText}>Change Document</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
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

      <UploadModal
        visible={uploadModal}
        onClose={() => setUploadModal(false)}
        onCameraPress={handleCameraPress}
        onGalleryPress={handleGalleryPress}
      />

      <PermissionModal
        visible={permissionModal.visible}
        title={permissionModal.title}
        message={permissionModal.message}
        onClose={() => setPermissionModal(prev => ({ ...prev, visible: false }))}
        onOpenSettings={openAppSettings}
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
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.medium,
    color: '#FF6B6B',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  contentContainer: {
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.regular,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    opacity: 0.8,
  },
  idTypeContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 35,
    elevation: 0,
    shadowOpacity: 0,
  },
  dropdown: {
    backgroundColor: '#03000C',
    borderRadius: 33,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.regular,
    color: 'white',
  },
  placeholderText: {
    color: '#B58FDB',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.regular,
    color: 'white',
  },
  uploadContainer: {
    alignItems: 'center',
  },
  uploadArea: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#8A52F3',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: 'rgba(138, 82, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  uploadedArea: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  uploadText: {
    fontSize: 18,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.semibold,
    color: '#B58FDB',
    marginTop: 12,
    textAlign: 'center',
  },
  documentInfoContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  documentNameLabel: {
    fontSize: 14,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.medium,
    color: '#B58FDB',
    marginBottom: 8,
  },
  documentName: {
    fontSize: 16,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.semibold,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  changeDocumentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(138, 82, 243, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8A52F3',
  },
  changeDocumentText: {
    fontSize: 14,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.semibold,
    color: '#8A52F3',
  },
  buttonContainer: {
    marginTop: 20,
  },
  continueButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 35,
  },
});

export default UploadIDScreen;
