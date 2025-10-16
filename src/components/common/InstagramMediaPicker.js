import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
  Modal,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { launchImageLibrary, launchCamera, requestCameraPermission } from 'react-native-image-picker';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import MediaStoreService from '../../services/MediaStoreService';
import ImageCropModal from './ImageCropModal';
import { BackIcon, DropdownArrow, CameraFillIcon } from '../icons/SvgIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); 

const InstagramMediaPicker = ({ visible, onClose, onMediaSelected }) => {
  const [selectedTab, setSelectedTab] = useState('Vibes');
  const [galleryImages, setGalleryImages] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [galleryPermission, setGalleryPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Recents');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState(null);

  // Camera setup
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef(null);

  const tabs = ['Thought', 'Images', 'Vibes', 'Videos', 'Sticker'];
  
  const dropdownOptions = [
    { id: 'recent', label: 'Recents', icon: '' },
    { id: 'photos', label: 'Photos', icon: '' },
    { id: 'videos', label: 'Videos', icon: '' },
    { id: 'google', label: 'Google Photos', icon: '' },
    { id: 'albums', label: 'All Albums', icon: '' },
  ];

  const requestPermissions = async () => {
    // Instagram style - no permission dialogs, just try to access directly
    try {
      // Set permissions to true by default (Instagram style)
      setCameraPermission(true);
      setGalleryPermission(true);
      return true;
    } catch (err) {
      console.warn('Permission setup error:', err);
      return true; // Still return true to avoid blocking
    }
  };

  const loadGalleryImages = async () => {
    setIsLoading(true);
    
    try {
      // Try to get real gallery images first
      const images = await MediaStoreService.fetchGalleryImages();
      
      // Add camera placeholder as first item
      const cameraPlaceholder = MediaStoreService.getCameraPlaceholder();
      
      if (images.length > 0) {
        // Store all media and show ALL of them at once (recent)
        setAllImages(images);
        setGalleryImages([cameraPlaceholder, ...images]);
        console.log(`🎉 SUCCESS! Loaded ALL ${images.length} real gallery media!`);
        console.log(`📱 Complete gallery access - no limits applied`);
      } else {
        // No real images found, show camera placeholder only
        console.log('❌ No real images found, showing camera placeholder');
        setAllImages([]);
        setGalleryImages([cameraPlaceholder]);
      }
    } catch (error) {
      console.error('❌ Error loading gallery:', error);
      
      // On error, show camera placeholder only
      console.log('🔄 Error occurred, showing camera placeholder');
      const cameraPlaceholder = MediaStoreService.getCameraPlaceholder();
      setAllImages([]);
      setGalleryImages([cameraPlaceholder]);
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative method to get real gallery images
  const getRealGalleryImages = () => {
    return new Promise((resolve) => {
      // For now, let's just return empty array and let the user manually select
      // This will show the camera placeholder and let user tap to open gallery
      resolve([]);
    });
  };

  useEffect(() => {
    if (visible) {
      requestPermissions().then(() => {
        loadGalleryImages();
      });
    }
  }, [visible]);

  // Apply default "Recents" filter when images are loaded
  useEffect(() => {
    if (allImages.length > 0 && selectedFilter === 'Recents') {
      const cameraPlaceholder = MediaStoreService.getCameraPlaceholder();
      setGalleryImages([cameraPlaceholder, ...allImages]);
      console.log('📱 Applied default Recents filter:', allImages.length, 'items');
      console.log('📱 Current selected filter:', selectedFilter);
    }
  }, [allImages, selectedFilter]);

  // Log initial state when component mounts
  useEffect(() => {
    if (visible) {
      console.log('📱 InstagramMediaPicker opened with default filter:', selectedFilter);
    }
  }, [visible, selectedFilter]);

  const requestCameraPermissionAndroid = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to camera to take photos and videos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true; // iOS doesn't need explicit permission for image picker
  };

  const handleCameraPress = async () => {
    console.log('📷 handleCameraPress called!');
    
    try {
      let permissionGranted = false;
      
      // Try the image picker's built-in permission request first
      try {
        const permission = await requestCameraPermission();
        console.log('📷 Camera permission result (image picker):', permission);
        permissionGranted = permission === 'granted';
      } catch (error) {
        console.log('📷 Image picker permission failed, trying Android permission:', error);
        // Fallback to Android permission request
        permissionGranted = await requestCameraPermissionAndroid();
      }
      
      if (permissionGranted) {
        const options = {
          mediaType: 'mixed',
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
          quality: 0.8,
        };

        console.log('📷 Launching camera with options:', options);
        launchCamera(options, handleImagePickerResponse);
      } else {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to take photos and videos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => {
              console.log('User should go to settings to enable camera permission');
            }}
          ]
        );
      }
    } catch (error) {
      console.error('📷 Camera permission error:', error);
      Alert.alert('Error', 'Failed to request camera permission. Please try again.');
    }
  };

  const handleGalleryPress = (mediaType = 'mixed') => {
    // Instagram style - direct gallery access without permission checks
    const options = {
      mediaType: mediaType, // Use the passed media type
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, handleImagePickerResponse);
  };

  const handleImageSelect = (image) => {
    if (image.isCamera) {
      handleCameraPress();
    } else if (image.isGallery) {
      handleGalleryPress();
    } else {
      // For photos, show crop modal
      if (image.type === 'image' || !image.isVideo) {
        setSelectedImageForCrop(image.uri);
        setShowCropModal(true);
      } else {
        // For videos, select directly
        onMediaSelected({
          uri: image.uri,
          type: image.type,
          fileName: image.fileName || `video_${image.id}.mp4`,
        });
        onClose();
      }
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFilterSelect = (option) => {
    setSelectedFilter(option.label);
    setShowDropdown(false);

    const cameraPlaceholder = MediaStoreService.getCameraPlaceholder();
    
    // Debug: Log all available media items
    console.log('🔍 All available media items:', allImages.map(item => ({
      type: item.type,
      isVideo: item.isVideo,
      fileName: item.fileName,
      id: item.id
    })));

    if (option.id === 'recent') {
      // Show all recent media (images + videos)
      if (allImages.length > 0) {
        setGalleryImages([cameraPlaceholder, ...allImages]);
        console.log('Showing all recent media:', allImages.length);
      } else {
        // If no images loaded, show camera placeholder and open gallery
        setGalleryImages([cameraPlaceholder]);
        console.log('No images loaded, opening gallery for recent');
        handleGalleryPress('mixed');
      }
    } else if (option.id === 'photos') {
      // Filter to show only photos
      if (allImages.length > 0) {
        const filteredPhotos = allImages.filter(item => 
          item.type === 'image' && item.isVideo !== true
        );
        setGalleryImages([cameraPlaceholder, ...filteredPhotos]);
        console.log('Showing photos only:', filteredPhotos.length);
        console.log('Photo items:', filteredPhotos.map(p => ({ type: p.type, isVideo: p.isVideo, fileName: p.fileName })));
      } else {
        // If no images loaded, open gallery for photos
        setGalleryImages([cameraPlaceholder]);
        console.log('No images loaded, opening gallery for photos');
        handleGalleryPress('photo');
      }
    } else if (option.id === 'videos') {
      // Filter to show only videos
      if (allImages.length > 0) {
        const filteredVideos = allImages.filter(item => 
          item.type === 'video' || item.isVideo === true
        );
        
        if (filteredVideos.length > 0) {
          setGalleryImages([cameraPlaceholder, ...filteredVideos]);
          console.log('Showing videos only:', filteredVideos.length);
          console.log('Video items:', filteredVideos.map(v => ({ type: v.type, isVideo: v.isVideo, fileName: v.fileName })));
        } else {
          // No videos found in loaded images, open gallery for videos
          console.log('No videos found in loaded images, opening gallery for videos');
          setGalleryImages([cameraPlaceholder]);
          handleGalleryPress('video');
        }
      } else {
        // If no images loaded, open gallery for videos
        setGalleryImages([cameraPlaceholder]);
        console.log('No images loaded, opening gallery for videos');
        handleGalleryPress('video');
      }
    } else if (option.id === 'google') {
      // Open system gallery which includes Google Photos
      console.log('Opening Google Photos via system gallery');
      setGalleryImages([cameraPlaceholder]);
      handleGalleryPress('mixed');
    } else if (option.id === 'albums') {
      // Open system gallery for albums
      console.log('Opening All Albums via system gallery');
      setGalleryImages([cameraPlaceholder]);
      handleGalleryPress('mixed');
    }
  };

  // Handle crop modal close
  const handleCloseCropModal = () => {
    setShowCropModal(false);
    setSelectedImageForCrop(null);
  };

  // Handle cropped image
  const handleImageCropped = (croppedImage) => {
    console.log('Image cropped successfully:', croppedImage);
    onMediaSelected({
      uri: croppedImage.path,
      type: 'image',
      fileName: croppedImage.fileName || `cropped_${Date.now()}.jpg`,
      width: croppedImage.width,
      height: croppedImage.height,
    });
    onClose();
  };

  const handleImagePickerResponse = (response) => {
    console.log('📷 Camera response received:', response);
    
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'Failed to select media. Please try again.');
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      console.log('📷 Asset captured:', asset);
      
      // For photos, show crop modal
      if (asset.type === 'image' || asset.mediaType === 'photo') {
        console.log('📷 Photo captured, showing crop modal');
        setSelectedImageForCrop(asset.uri);
        setShowCropModal(true);
      } else {
        console.log('📷 Video captured, selecting directly');
        // For videos, select directly
        onMediaSelected(asset);
        onClose();
      }
    } else {
      console.log('📷 No assets in response');
    }
  };

  const renderGalleryItem = ({ item, index }) => {
    if (item.isCamera) {
      return (
        <TouchableOpacity
          style={styles.galleryItem}
          onPress={() => {
            console.log('📷 Camera icon clicked!');
            Alert.alert('Camera', 'Camera button clicked! Opening camera...');
            handleCameraPress();
          }}
        >
          <View style={styles.cameraPreview}>
            <View style={styles.cameraPlaceholder}>
              <CameraFillIcon width={24} height={24} color="#D9D8F3" />
              <Text style={styles.cameraText}>Camera</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    if (item.isGallery) {
      return (
        <TouchableOpacity
          style={styles.galleryItem}
          onPress={() => handleGalleryPress()}
        >
          <View style={styles.galleryPlaceholder}>
            <Text style={styles.galleryIcon}></Text>
            <Text style={styles.galleryText}>Gallery</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.galleryItem}
        onPress={() => handleImageSelect(item)}
      >
        <Image source={{ uri: item.uri }} style={styles.galleryImage} />
        {item.isVideo && (
          <View style={styles.videoIndicator}>
            <Text style={styles.playIcon}></Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <BackIcon width={24} height={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Vibes</Text>
         
        </View>

        {/* Recent Dropdown */}
        <View style={styles.recentBar}>
          <TouchableOpacity style={styles.recentButton} onPress={toggleDropdown}>
            <Text style={styles.recentText}>{selectedFilter}</Text>
            <View style={[styles.dropdownIcon, showDropdown && styles.dropdownIconUp]}>
              <DropdownArrow width={10} height={6} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu */}
        {showDropdown && (
          <View style={styles.dropdownMenu}>
            {dropdownOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.dropdownItem,
                  selectedFilter === option.label && styles.dropdownItemSelected
                ]}
                onPress={() => handleFilterSelect(option)}
              >
                <Text style={styles.dropdownItemIcon}>{option.icon}</Text>
                <Text style={[
                  styles.dropdownItemText,
                  selectedFilter === option.label && styles.dropdownItemTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Gallery Grid */}
        <View style={styles.galleryContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#DD3562" />
              <Text style={styles.loadingText}>Loading your photos...</Text>
            </View>
          ) : (
            <FlatList
              data={galleryImages}
              renderItem={renderGalleryItem}
              numColumns={3}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.galleryGrid}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Image Crop Modal */}
        <ImageCropModal
          visible={showCropModal}
          onClose={handleCloseCropModal}
          onImageCropped={handleImageCropped}
          imageUri={selectedImageForCrop}
        />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#DD3562',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 20,
  },
  recentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  recentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 5,
  },
  dropdownIcon: {
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIconUp: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  dropdownItemSelected: {
    backgroundColor: '#DD3562',
  },
  dropdownItemIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  galleryGrid: {
    padding: 5,
  },
  galleryItem: {
    width: (screenWidth - 30) / 3,
    height: (screenWidth - 30) / 3,
    margin: 2,
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoIndicator: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 12,
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#DD3562',
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DD3562',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DD3562',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cameraIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconText: {
    fontSize: 20,
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraView: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  cameraPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  galleryPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DD3562',
    borderStyle: 'dashed',
  },
  galleryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  galleryText: {
    color: '#DD3562',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default InstagramMediaPicker;
