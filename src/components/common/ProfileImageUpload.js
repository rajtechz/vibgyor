
// src/components/common/ProfileImageUpload.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Modal, Dimensions, Platform, PermissionsAndroid, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors, gradients } from '../../styles/colors';
import { authAPI } from '../../api/authAPI';
import { useSelector } from 'react-redux';

// Close Icon Component
const CloseIcon = ({ width = 24, height = 24, color = '#FFFFFF' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Camera Icon Component from cmra.svg
const CameraIcon = ({ width = 44, height = 44 }) => (
  <Svg width={width} height={height} viewBox="0 0 44 44" fill="none">
    <Path
      d="M22 2.75C11.5 2.75 2.75 11.5 2.75 22C2.75 32.5 11.5 41.25 22 41.25C32.5 41.25 41.25 32.5 41.25 22C41.25 11.5 32.5 2.75 22 2.75Z"
      fill="url(#paint0_linear_63_2331)"
      stroke="#0E0127"
      strokeWidth="3.5"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.9993 20.894C21.3263 20.894 20.6948 21.1454 20.2082 21.6179C19.732 22.0804 19.4732 22.6937 19.4835 23.3271V23.3372C19.4835 23.9907 19.7423 24.604 20.2186 25.0665C20.6948 25.529 21.3263 25.7804 21.9993 25.7804C23.3866 25.7804 24.5047 24.6845 24.5151 23.3372C24.5151 22.6837 24.2562 22.0704 23.78 21.6079C23.3038 21.1454 22.6722 20.894 21.9993 20.894ZM27.8075 20.9644C27.2899 20.9644 26.8757 20.5622 26.8757 20.0595C26.8757 19.5568 27.2899 19.1446 27.8075 19.1446C28.3252 19.1446 28.7496 19.5568 28.7496 20.0595C28.7496 20.5622 28.3252 20.9644 27.8075 20.9644ZM24.8673 26.1323C24.1323 26.8461 23.1177 27.2885 21.9996 27.2885C20.9125 27.2885 19.8979 26.8763 19.1214 26.1323C18.3553 25.3782 17.9308 24.3929 17.9308 23.3372C17.9205 22.2916 18.345 21.3063 19.1111 20.5522C19.8876 19.7981 20.9125 19.3859 21.9996 19.3859C23.0866 19.3859 24.1116 19.7981 24.8777 20.5421C25.6438 21.2962 26.0683 22.2916 26.0683 23.3372C26.0579 24.4331 25.6024 25.4184 24.8673 26.1323ZM27.8385 16.3194C27.7453 16.3194 27.6728 16.2691 27.6314 16.1987L27.5279 15.9775C27.2484 15.4044 26.9274 14.7409 26.7307 14.3588C26.2545 13.4539 25.4366 12.9512 24.4324 12.9412H19.5561C18.5519 12.9512 17.7444 13.4539 17.2681 14.3588C17.0611 14.761 16.7091 15.4849 16.4192 16.0781L16.3571 16.1987C16.326 16.2792 16.2432 16.3194 16.1604 16.3194C13.6653 16.3194 11.6465 18.29 11.6465 20.703V26.6752C11.6465 29.0882 13.6653 31.0588 16.1604 31.0588H27.8385C30.3232 31.0588 32.3524 29.0882 32.3524 26.6752V20.703C32.3524 18.29 30.3232 16.3194 27.8385 16.3194Z"
      fill="white"
    />
    <Defs>
      <SvgLinearGradient id="paint0_linear_63_2331" x1="2.7767" y1="36.8" x2="46.7172" y2="34.5598" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

// User Icon Component
const UserIcon = ({ width = 40, height = 40, color = '#8A2BE2' }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
    <Path
      d="M20 20C24.1421 20 27.5 16.6421 27.5 12.5C27.5 8.35786 24.1421 5 20 5C15.8579 5 12.5 8.35786 12.5 12.5C12.5 16.6421 15.8579 20 20 20Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 35C5 28.9249 9.92487 24 16 24H24C30.0751 24 35 28.9249 35 35"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function ProfileImageUpload({ onImageSelected, currentImage, size = 120 }) {
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get access token from Redux
  const accessToken = useSelector((state) => state.auth.accessToken);
  
  // DEBUG: Get full auth state for debugging
  const fullAuthState = useSelector((state) => state.auth);
  
  // --- COMPREHENSIVE DEBUG LOGS ---
  useEffect(() => {
    console.log('📸 DEBUG: ProfileImageUpload mounted/updated');
    console.log('📸 DEBUG: Full Redux Auth State:', {
      accessToken: fullAuthState.accessToken ? 'Present' : 'Missing',
      refreshToken: fullAuthState.refreshToken ? 'Present' : 'Missing',
      isAuthenticated: fullAuthState.isAuthenticated,
      user: fullAuthState.user ? 'Present' : 'Missing'
    });
    console.log('📸 DEBUG: Current accessToken:', accessToken ? 'Present' : 'Missing');
    if (accessToken) {
      console.log('📸 DEBUG: AccessToken length:', accessToken.length);
      console.log('📸 DEBUG: AccessToken preview:', accessToken.substring(0, 20) + '...');
    }
  }, [accessToken, fullAuthState]);

  console.log('📸 DEBUG: ProfileImageUpload render - accessToken:', accessToken ? 'Present' : 'Missing');

  // Upload profile picture to server
  const uploadProfilePicture = async (imageData) => {
    // --- DETAILED DEBUG LOG ---
    console.log('📸 DEBUG: uploadProfilePicture called');
    console.log('📸 DEBUG: Checking accessToken before upload:', accessToken ? 'Present' : 'Missing');
    console.log('📸 DEBUG: AccessToken value:', accessToken);
    console.log('📸 DEBUG: AccessToken type:', typeof accessToken);
    console.log('📸 DEBUG: AccessToken length:', accessToken?.length);
    
    // FIX: Get latest accessToken from Redux store directly
    const latestAccessToken = fullAuthState.accessToken;
    console.log('📸 DEBUG: Latest accessToken from Redux:', latestAccessToken ? 'Present' : 'Missing');
    console.log('📸 DEBUG: Latest accessToken value:', latestAccessToken);
    
    const tokenToUse = latestAccessToken || accessToken;
    console.log('📸 DEBUG: Token to use for upload:', tokenToUse ? 'Present' : 'Missing');
    
    if (!tokenToUse) {
      console.log('❌ DEBUG: No access token available for upload');
      console.log('❌ DEBUG: This means Redux state is not properly updated');
      Alert.alert('Authentication Error', 'Please login to upload profile picture');
      return;
    }

    // Upload profile picture to server
    try {
      setIsUploading(true);
      
      
      const result = await authAPI.uploadProfilePicture(imageData, tokenToUse);
      
      console.log('📊 DEBUG: Upload API Response:', result);
      console.log('📊 DEBUG: Response Success:', result.success);
      console.log('📊 DEBUG: Response Data:', result.data);
      
      if (result.success) {
        console.log('✅ DEBUG: Profile picture uploaded successfully');
        console.log('✅ DEBUG: Full result:', JSON.stringify(result, null, 2));
        
        // Get uploaded image URL from response
        const uploadedImageUrl = result.data?.data?.profilePictureUrl || result.data?.profilePictureUrl;
        console.log('📸 DEBUG: Uploaded image URL:', uploadedImageUrl);
        
        // Update imageData with the uploaded URL
        const updatedImageData = {
          ...imageData,
          uploadedUrl: uploadedImageUrl,
          isUploaded: true
        };
        
        Alert.alert('Success', 'Profile picture uploaded successfully!');
        
        // Call the callback with the updated image data including uploaded URL
        onImageSelected && onImageSelected(updatedImageData);
      } else {
        console.log('❌ DEBUG: Upload failed');
        console.log('❌ DEBUG: Error:', result.error);
        Alert.alert('Upload Failed', result.error || 'Failed to upload profile picture. Please try again.');
        // Still call callback with local image data
        onImageSelected && onImageSelected(imageData);
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in uploadProfilePicture:', error);
      console.error('💥 DEBUG: Error type:', typeof error);
      console.error('💥 DEBUG: Error message:', error.message);
      Alert.alert('Upload Error', error.message || 'Failed to upload profile picture. Please try again.');
      // Still call callback with local image data
      onImageSelected && onImageSelected(imageData);
    } finally {
      setIsUploading(false);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check if permission is already granted
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        console.log('Camera permission already granted:', hasPermission);
        if (hasPermission) {
          return true;
        }

        console.log('Requesting camera permission...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Vibgyor needs access to your camera to take profile pictures',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Camera permission result:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Camera permission error:', err);
        return false;
      }
    }
    return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // For Android 13+ (API 33+), use READ_MEDIA_IMAGES
        const androidVersion = Platform.Version;
        let permission;
        
        if (androidVersion >= 33) {
          permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        } else {
          permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        }

        // Check if permission is already granted
        const hasPermission = await PermissionsAndroid.check(permission);
        console.log('Storage permission already granted:', hasPermission);
        if (hasPermission) {
          return true;
        }

        console.log('Requesting storage permission...');
        const granted = await PermissionsAndroid.request(
          permission,
          {
            title: 'Storage Permission',
            message: 'Vibgyor needs access to your photo library to select profile pictures',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Storage permission result:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Storage permission error:', err);
        return false;
      }
    }
    return true;
  };

  const handleImageUpload = () => {
    setShowModal(true);
  };

  const handleCamera = async () => {
    setShowModal(false);
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied', 
        'Camera permission is required to take photos. Please enable camera permission in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => {
            Linking.openSettings();
          }}
        ]
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      saveToPhotos: false,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }
      
      if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to open camera. Please try again.');
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const imageData = {
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName,
        };
        
        console.log('📸 DEBUG: Camera image selected:', imageData);
        
        // Upload the image to server
        await uploadProfilePicture(imageData);
      }
    });
  };

  const handleGallery = async () => {
    setShowModal(false);
    const hasPermission = await requestStoragePermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied', 
        'Storage permission is required to access photos. Please enable storage permission in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => {
            Linking.openSettings();
          }}
        ]
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
        return;
      }
      
      if (response.errorMessage) {
        console.log('Gallery Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to open gallery. Please try again.');
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const imageData = {
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName,
        };
        
        console.log('📸 DEBUG: Gallery image selected:', imageData);
        
        // Upload the image to server
        await uploadProfilePicture(imageData);
      }
    });
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { width: size, height: size }]}
        onPress={handleImageUpload}
        activeOpacity={0.8}
      >
        <View style={[styles.whiteBorder, { width: size, height: size }]}>
          <View style={[styles.innerContainer, { width: size - 6, height: size - 6 }]}>
            {currentImage ? (
              <Image
                source={{ uri: currentImage.uri }}
                style={[styles.defaultImage, { width: size - 6, height: size - 6 }]}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('../../assets/images/Profile.png')}
                style={[styles.defaultImage, { width: size - 6, height: size - 6 }]}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={styles.cameraIconContainer}>
            <CameraIcon width={32} height={32} />
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={gradients.primary}
              style={styles.modalGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  activeOpacity={0.8}
                >
                  <CloseIcon width={24} height={24} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.modalIconContainer}>
                  <CameraIcon width={60} height={60} />
                </View>
                
                <Text style={styles.modalTitle}>Upload Profile Picture</Text>
                <Text style={styles.modalDescription}>
                  {isUploading ? 'Uploading image...' : 'Choose how you\'d like to add your profile picture'}
                </Text>

                <View style={styles.modalOptions}>
                  <TouchableOpacity
                    style={[styles.optionButton, isUploading && styles.disabledButton]}
                    onPress={handleCamera}
                    activeOpacity={0.8}
                    disabled={isUploading}
                  >
                    <LinearGradient
                      colors={isUploading ? ['#666', '#666'] : gradients.primary}
                      style={styles.optionButtonGradient}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                    >
                      <Text style={styles.optionButtonText}>
                        {isUploading ? 'Uploading...' : 'Open Camera'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.optionButton, isUploading && styles.disabledButton]}
                    onPress={handleGallery}
                    activeOpacity={0.8}
                    disabled={isUploading}
                  >
                    <LinearGradient
                      colors={isUploading ? ['#666', '#666'] : gradients.primary}
                      style={styles.optionButtonGradient}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                    >
                      <Text style={styles.optionButtonText}>
                        {isUploading ? 'Uploading...' : 'Choose from Gallery'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 60,
    overflow: 'visible',
  },
  whiteBorder: {
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerContainer: {
    backgroundColor: '#1a0033',
    borderRadius: 57,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  defaultImage: {
    borderRadius: 57,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 32,
    marginBottom: 4,
  },
  uploadedText: {
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: '600',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: -7,
    right: -3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    borderRadius: 20,
    padding: 2,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: colors.lightGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  modalOptions: {
    width: '100%',
    gap: 15,
  },
  optionButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  optionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default ProfileImageUpload;
