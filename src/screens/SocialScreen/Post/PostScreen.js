// src/screens/Post/PostScreen.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Image, Dimensions, Alert, Platform, PermissionsAndroid, ActivityIndicator, Linking, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';
import MediaStoreService from '../../../services/MediaStoreService';
import { colors, gradients } from '../../../styles/colors';

const { width } = Dimensions.get('window');
const imageWidth = width / 3; // 3 columns with no spacing

// Camera Icon Component
const CameraIcon = ({ width = 24, height = 24, color = '#B0B0B0' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Image Icon Component
const ImageIcon = ({ width = 24, height = 24, color = '#B0B0B0' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 15L16 10L5 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Hamburger Menu Icon
const HamburgerIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <Path
      d="M28 6.66634C28 5.92996 27.403 5.33301 26.6667 5.33301H5.33333C4.59695 5.33301 4 5.92996 4 6.66634C4 7.40272 4.59695 7.99967 5.33333 7.99967H26.6667C27.403 7.99967 28 7.40272 28 6.66634ZM28 15.9997C28 15.2633 27.403 14.6663 26.6667 14.6663H13.3333C12.597 14.6663 12 15.2633 12 15.9997C12 16.7361 12.597 17.333 13.3333 17.333H26.6667C27.403 17.333 28 16.7361 28 15.9997ZM28 25.333C28 24.5966 27.403 23.9997 26.6667 23.9997H5.33333C4.59695 23.9997 4 24.5966 4 25.333C4 26.0694 4.59695 26.6663 5.33333 26.6663H26.6667C27.403 26.6663 28 26.0694 28 25.333Z"
      fill="white"
    />
  </Svg>
);

// Chevron Down Icon
const ChevronDownIcon = ({ width = 16, height = 16, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Post Card Component
const PostCard = ({ author, time, content, likes, comments }) => (
  <View style={styles.postCard}>
    <View style={styles.postHeader}>
      <View style={styles.authorInfo}>
        <View style={styles.authorAvatar}>
          <Text style={styles.authorInitial}>{author.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.authorName}>{author} </Text>
          <Text style={styles.postTime}>{time}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.postContent}>{content}</Text>
    <View style={styles.postActions}>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>❤️ {likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>💬 {comments}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>📤 Share</Text>
      </TouchableOpacity>
    </View>
  </View>
);

function PostScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Vibes');
  const [galleryImages, setGalleryImages] = useState([]);
  const [allMedia, setAllMedia] = useState([]); // Store all media (images + videos)
  const [mediaFilter, setMediaFilter] = useState('recent'); // 'recent', 'photo', 'video'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [hasPermission, setHasPermission] = useState(null); // null = not checked, true = granted, false = denied
  const isLoadingRef = useRef(false);
  const hasCheckedPermissionRef = useRef(false);
  const hasPermissionRef = useRef(null);
  const dropdownRef = useRef(null);
  const insets = useSafeAreaInsets();

  const filterTabs = ['Thought', 'Images', 'Vibes', 'Videos', 'Sticker'];

  // Check storage permission status (including videos)
  const checkStoragePermission = React.useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      // For Android 13+ (API 33+), check both READ_MEDIA_IMAGES and READ_MEDIA_VIDEO
      if (Platform.Version >= 33) {
        const mediaImagesCheck = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        const mediaVideosCheck = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
        );
        
        console.log('📱 Permission check - Images:', mediaImagesCheck, 'Videos:', mediaVideosCheck);
        
        // At least images permission is required, videos is optional
        if (mediaImagesCheck) {
          console.log('✅ Images permission granted - allowing access');
          return true;
        } else {
          console.log('❌ Images permission not granted');
          return false;
        }
      }
      
      // For older Android versions, check READ_EXTERNAL_STORAGE
      const checkResult = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      console.log('📱 Permission check (old Android):', checkResult);
      return checkResult;
    } catch (err) {
      console.warn('Permission check error:', err);
      return false;
    }
  }, []);

  // Request storage permission for Android (including videos)
  const requestStoragePermission = React.useCallback(async () => {
    if (Platform.OS !== 'android') {
      setHasPermission(true);
      return true;
    }

    try {
      let imagesGranted = false;
      let videosGranted = false;
      
      // For Android 13+ (API 33+), request both READ_MEDIA_IMAGES and READ_MEDIA_VIDEO
      if (Platform.Version >= 33) {
        // Request images permission
        imagesGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Photo Access Permission',
            message: 'This app needs access to your photos and videos to show them in the gallery.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );
        
        // Request videos permission
        videosGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          {
            title: 'Video Access Permission',
            message: 'This app needs access to your videos to show them in the gallery.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );
        
        // At least images permission is required, videos is optional
        const isGranted = imagesGranted === PermissionsAndroid.RESULTS.GRANTED;
        console.log('📱 Permission request result - Images:', imagesGranted === PermissionsAndroid.RESULTS.GRANTED, 'Videos:', videosGranted === PermissionsAndroid.RESULTS.GRANTED);
        
        if (!isGranted && videosGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('⚠️ Videos permission granted but images not granted - requesting images again');
        }
        
        setHasPermission(isGranted);
        hasPermissionRef.current = isGranted;
        return isGranted;
      } else {
        // For older Android versions, use READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your photos and videos to show them.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );
        
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setHasPermission(isGranted);
        hasPermissionRef.current = isGranted;
        return isGranted;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      setHasPermission(false);
      return false;
    }
  }, []);

  // Open device settings
  const openSettings = () => {
    Linking.openSettings().catch((err) => {
      console.error('Error opening settings:', err);
      Alert.alert('Error', 'Failed to open settings. Please go to Settings > Apps > Vibgyor > Permissions manually.');
    });
  };

  // Memoized filtered media - only recalculates when allMedia or mediaFilter changes
  const filteredMedia = useMemo(() => {
    if (mediaFilter === 'photo') {
      return allMedia.filter(item => item.type === 'image');
    } else if (mediaFilter === 'video') {
      return allMedia.filter(item => item.type === 'video');
    }
    return allMedia; // 'recent' - show all
  }, [allMedia, mediaFilter]);

  // Memoized gallery items - only recalculates when filteredMedia changes
  const galleryItems = useMemo(() => {
    return filteredMedia.map((item, index) => ({
      id: item.id || `gallery_${index}`,
      uri: item.uri,
      type: item.type,
      isAddButton: false,
      isVideo: item.type === 'video',
    }));
  }, [filteredMedia]);

  // Handle filter selection - optimized with immediate UI update
  const handleFilterSelect = useCallback((filter) => {
    // Immediately close dropdown for better UX
    setShowFilterDropdown(false);
    
    // Update filter - this will trigger useMemo and useEffect to update gallery
    setMediaFilter(filter);
    
    console.log(`✅ PostScreen: Filter changed to ${filter}`);
  }, []);
  
  // Sync galleryImages with filtered media whenever filter or allMedia changes
  useEffect(() => {
    if (allMedia.length === 0) return; // Don't update if no media loaded yet
    
    const cameraItem = { id: 'camera', type: 'add', isAddButton: true };
    
    // Use the memoized filteredMedia or calculate it directly
    let filtered = allMedia;
    if (mediaFilter === 'photo') {
      filtered = allMedia.filter(item => item.type === 'image');
    } else if (mediaFilter === 'video') {
      filtered = allMedia.filter(item => item.type === 'video');
    }
    
    const items = filtered.map((item, index) => ({
      id: item.id || `gallery_${index}`,
      uri: item.uri,
      type: item.type,
      isAddButton: false,
      isVideo: item.type === 'video',
    }));
    
    const totalImages = allMedia.filter(i => i.type === 'image').length;
    const totalVideos = allMedia.filter(i => i.type === 'video').length;
    
    console.log(`📊 PostScreen: Filter "${mediaFilter}" - Total media: ${allMedia.length}, Filtered: ${filtered.length}`);
    console.log(`📊 Media breakdown - Images: ${totalImages}, Videos: ${totalVideos}`);
    
    // Debug: If filtering videos and none found, log details
    if (mediaFilter === 'video' && filtered.length === 0 && totalVideos > 0) {
      console.warn(`⚠️ Video filter active but no videos in filtered result! Total videos in allMedia: ${totalVideos}`);
      console.warn(`   First 3 videos in allMedia:`, allMedia.filter(i => i.type === 'video').slice(0, 3).map(v => ({ type: v.type, uri: v.uri, fileName: v.fileName })));
    }
    
    setGalleryImages([cameraItem, ...items]);
    console.log(`✅ PostScreen: Gallery updated for filter "${mediaFilter}" - showing ${items.length} items (${items.filter(i => i.isVideo).length} videos)`);
  }, [allMedia, mediaFilter]);

  // Toggle dropdown - memoized for performance
  const toggleDropdown = useCallback(() => {
    setShowFilterDropdown(prev => !prev);
  }, []);

  // Load gallery images from device
  const loadGalleryImages = React.useCallback(async (skipPermissionCheck = false) => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      console.log('⏸️ PostScreen: Already loading, skipping...');
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      console.log('📸 PostScreen: Loading gallery images...');
      
      // Check permissions first (don't request if already checked)
      let permissionGranted = false;
      if (!skipPermissionCheck) {
        // Check if permission is already granted
        permissionGranted = await checkStoragePermission();
        
        if (!permissionGranted && hasPermission !== false) {
          // Only request if we haven't been denied yet
          permissionGranted = await requestStoragePermission();
        } else if (hasPermission === false) {
          // Already denied, don't ask again
          permissionGranted = false;
        }
      } else {
        permissionGranted = await checkStoragePermission();
      }
      
      if (!permissionGranted) {
        console.log('❌ PostScreen: Storage permission not granted');
        // Set at least camera button so screen is not empty
        setGalleryImages([{ id: 'camera', type: 'add', isAddButton: true }]);
        setIsLoading(false);
        isLoadingRef.current = false;
        return;
      }

      // Fetch gallery images with initial limit for faster loading (load more on demand)
      // Load first 500 items for initial display - this is much faster
      const allMediaItems = await MediaStoreService.fetchGalleryImages({ limit: 500 });
      console.log(`✅ PostScreen: Loaded ${allMediaItems.length} media items (showing first 500 for performance)`);
      
      // Store all media for filtering - this will trigger useEffect to update galleryImages
      setAllMedia(allMediaItems);
      setHasPermission(true);
    } catch (error) {
      console.error('❌ PostScreen: Error loading gallery images:', error);
      // On error, show only camera button
      setGalleryImages([{ id: 'camera', type: 'add', isAddButton: true }]);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [requestStoragePermission, checkStoragePermission, hasPermission, mediaFilter]);

  // Handle opening gallery
  const handleOpenGallery = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to access photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      selectionLimit: 0, // 0 means no limit (but may be limited by system)
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('📸 PostScreen: User cancelled gallery');
      } else if (response.errorMessage) {
        console.error('❌ PostScreen: Gallery error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        console.log(`✅ PostScreen: Selected ${response.assets.length} images from gallery`);
        // Reload gallery after selection to refresh the grid
        loadGalleryImages();
      }
    });
  };

  // Handle camera button press
  const handleCameraPress = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (hasPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Camera permission is required.');
        return;
      }
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('📸 PostScreen: User cancelled camera');
      } else if (response.errorMessage) {
        console.error('❌ PostScreen: Camera error:', response.errorMessage);
        Alert.alert('Error', 'Failed to open camera. Please try again.');
      } else if (response.assets && response.assets[0]) {
        console.log('✅ PostScreen: Photo captured:', response.assets[0].uri);
        // Reload gallery after capture to show new photo
        loadGalleryImages();
      }
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showFilterDropdown) {
        setShowFilterDropdown(false);
      }
    };
    // Note: For React Native, we'll handle this differently
    // Dropdown will close when an option is selected
  }, [showFilterDropdown]);

  // Check permission status on mount (only once)
  useEffect(() => {
    if (hasCheckedPermissionRef.current) return;
    
    const checkPermissionStatus = async () => {
      hasCheckedPermissionRef.current = true;
      console.log('🔍 Initial permission check on mount...');
      const granted = await checkStoragePermission();
      console.log('🔍 Initial permission check result:', granted);
      setHasPermission(granted);
      hasPermissionRef.current = granted;
      
      if (granted && !isLoadingRef.current) {
        // Load images if permission is already granted
        console.log('✅ Permission granted on mount, loading gallery...');
        setTimeout(() => {
          if (!isLoadingRef.current) {
            loadGalleryImages(true);
          }
        }, 300);
      } else {
        console.log('❌ Permission not granted on mount, will show permission screen');
        // Set to null initially to show loading, then false if not granted
        if (!granted) {
          setHasPermission(false);
        }
      }
    };
    
    checkPermissionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-open gallery when screen is focused (only once)
  useFocusEffect(
    React.useCallback(() => {
      console.log('📸 PostScreen: Screen focused');
      
      // Only check permission once per session using ref
      if (!hasCheckedPermissionRef.current) {
        hasCheckedPermissionRef.current = true;
        checkStoragePermission().then(granted => {
          setHasPermission(granted);
          hasPermissionRef.current = granted;
          
          if (granted && !isLoadingRef.current) {
            console.log('✅ PostScreen: Permission granted, loading gallery...');
            loadGalleryImages(true);
          } else if (!granted && !isLoadingRef.current) {
            // Request permission only if not granted
            requestStoragePermission().then(granted => {
              if (granted && !isLoadingRef.current) {
                loadGalleryImages(true);
              }
            });
          }
        });
      } else {
        // Re-check permission when screen comes back from settings (without state dependency)
        checkStoragePermission().then(granted => {
          const previousPermission = hasPermissionRef.current;
          console.log('🔄 Re-checking permissions - Previous:', previousPermission, 'Current:', granted);
          
          if (granted !== previousPermission) {
            console.log('✅ Permission status changed, updating...');
            setHasPermission(granted);
            hasPermissionRef.current = granted;
            if (granted && !isLoadingRef.current) {
              console.log('✅ PostScreen: Permission granted after returning from settings');
              loadGalleryImages(true);
            }
          } else if (granted) {
            // Permission already granted, but reload if gallery is empty
            console.log('✅ Permission already granted, ensuring gallery is loaded');
            if (galleryImages.length <= 1 && !isLoadingRef.current) {
              loadGalleryImages(true);
            }
          }
        });
      }

      // Auto-open gallery picker (Instagram style) - only once when screen first opens
      if (!hasAutoOpened && hasPermissionRef.current === true) {
        const timer = setTimeout(async () => {
          console.log('📸 PostScreen: Auto-opening gallery picker...');
          const options = {
            mediaType: 'photo',
            quality: 0.8,
            includeBase64: false,
            selectionLimit: 0,
          };

          launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log('📸 PostScreen: User cancelled auto-opened gallery');
            } else if (response.errorMessage) {
              console.error('❌ PostScreen: Gallery error:', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
              console.log(`✅ PostScreen: Selected ${response.assets.length} images`);
              // Reload gallery after selection
              if (!isLoadingRef.current) {
                loadGalleryImages(true);
              }
            }
          });
          setHasAutoOpened(true);
        }, 800); // Small delay to let screen render

        return () => clearTimeout(timer);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAutoOpened])
  );

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />

      {/* Header */}
      <ModeSwitchHeader customTitle="Uploads" style={{ paddingTop: insets.top }} />

      {/* Sub Header */}
      <View style={styles.subHeader}>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={styles.recentButton}
            onPress={toggleDropdown}
            activeOpacity={0.7}
            ref={dropdownRef}
          >
            <Text style={styles.recentText}>
              {mediaFilter === 'recent' ? 'Recent' : mediaFilter === 'photo' ? 'Photos' : 'Videos'}
            </Text>
            <ChevronDownIcon width={16} height={16} color="white" />
          </TouchableOpacity>
          
          {/* Overlay to close dropdown when clicking outside */}
          {showFilterDropdown && (
            <Pressable 
              style={styles.dropdownOverlay}
              onPress={() => setShowFilterDropdown(false)}
              android_disableSound={true}
            />
          )}
          
          {/* Filter Dropdown */}
          {showFilterDropdown && (
            <View style={styles.filterDropdown}>
              <TouchableOpacity
                style={[styles.filterOption, mediaFilter === 'recent' && styles.filterOptionActive]}
                onPress={() => handleFilterSelect('recent')}
                activeOpacity={0.6}
              >
                <Text style={[styles.filterOptionText, mediaFilter === 'recent' && styles.filterOptionTextActive]}>
                  Recent
                </Text>
                {mediaFilter === 'recent' && <View style={styles.filterIndicator} />}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterOption, mediaFilter === 'photo' && styles.filterOptionActive]}
                onPress={() => handleFilterSelect('photo')}
                activeOpacity={0.6}
              >
                <Text style={[styles.filterOptionText, mediaFilter === 'photo' && styles.filterOptionTextActive]}>
                  Photos
                </Text>
                {mediaFilter === 'photo' && <View style={styles.filterIndicator} />}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterOption, mediaFilter === 'video' && styles.filterOptionActive]}
                onPress={() => handleFilterSelect('video')}
                activeOpacity={0.6}
              >
                <Text style={[styles.filterOptionText, mediaFilter === 'video' && styles.filterOptionTextActive]}>
                  Videos
                </Text>
                {mediaFilter === 'video' && <View style={styles.filterIndicator} />}
              </TouchableOpacity>
            </View>
          )}
        </View>
    
      </View>

      {/* Upload Grid (Scrollable) */}
      {hasPermission === false ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Permission Required</Text>
          <Text style={styles.permissionText}>
            Please allow access to your photos to view and select images from your gallery.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={async () => {
              console.log('🔐 User clicked Grant Permission button');
              // First check current permission status
              const currentPermission = await checkStoragePermission();
              console.log('🔐 Current permission status:', currentPermission);
              
              if (currentPermission) {
                // Permission already granted, just update state
                console.log('✅ Permission already granted, updating state');
                setHasPermission(true);
                hasPermissionRef.current = true;
                loadGalleryImages(true);
              } else {
                // Request permission
                const granted = await requestStoragePermission();
                console.log('🔐 Permission request result:', granted);
                if (granted) {
                  hasPermissionRef.current = true;
                  loadGalleryImages(true);
                }
              }
            }}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={async () => {
              console.log('⚙️ Opening settings...');
              openSettings();
              // Re-check permission after a delay when returning from settings
              setTimeout(async () => {
                const granted = await checkStoragePermission();
                console.log('🔐 Permission status after settings:', granted);
                if (granted) {
                  setHasPermission(true);
                  hasPermissionRef.current = true;
                  loadGalleryImages(true);
                }
              }, 1000);
            }}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DD3562" />
          <Text style={styles.loadingText}>Loading gallery...</Text>
        </View>
      ) : (
      <ScrollView
        style={styles.uploadScroll}
        contentContainerStyle={styles.uploadGrid}
        showsVerticalScrollIndicator={false}
      >
          {galleryImages.length === 0 || galleryImages.length === 1 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No images found</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => loadGalleryImages(false)}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            galleryImages.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.uploadCard}
                onPress={() => {
                  if (item.isAddButton) {
                    handleCameraPress();
                  } else if (!item.isVideo) {
                    // Navigate to CropScreen when image is selected (only for images, not videos)
                    navigation.navigate('Crop', { 
                      imageUri: item.uri
                    });
                  }
                  // Videos can be handled differently if needed
                }}
              >
            {item.isAddButton ? (
              <View style={styles.addButton}>
                <CameraIcon width={32} height={32} color="white" />
              </View>
                ) : item.isVideo ? (
                  <View style={styles.videoContainer}>
                    <Image source={{ uri: item.uri }} style={styles.uploadImage} resizeMode="cover" />
                    <View style={styles.videoOverlay}>
                      <View style={styles.playIcon}>
                        <Svg width={24} height={24} viewBox="0 0 24 24" fill="white">
                          <Path d="M8 5v14l11-7z" />
                        </Svg>
                      </View>
                    </View>
                  </View>
                ) : (
                  <Image source={{ uri: item.uri }} style={styles.uploadImage} resizeMode="cover" />
            )}
          </TouchableOpacity>
            ))
          )}
      </ScrollView>
      )}

      {/* <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {filterTabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                activeOpacity={1}
                style={styles.tabButton}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {isActive ? (
                    <LinearGradient
                      colors={gradients.primary}
                      start={{ x: 0.3, y: 0 }}
                      end={{ x: 0.7, y: 1 }}
                      style={styles.pillTab}
                    >
                      <Text style={styles.pillTabText}>{tab}</Text>
                      <Svg
                        width="100%"
                        height={8}
                        style={styles.pillCurveSvg}
                        viewBox="0 0 90 8"
                        preserveAspectRatio="none"
                      >
                        <Path
                          d="M0 8 Q45 -6 90 8"
                          fill="none"
                          stroke="#B34AFF"
                          strokeWidth="1.5"
                        />
                      </Svg>
                    </LinearGradient>
                  ) : (
                    <Text style={styles.inactiveTabText}>{tab}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View> */}

    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#140034',
  },
  filterContainer: {
    position: 'relative',
    zIndex: 100,
  },
  dropdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 98,
  },
  recentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
   
    borderRadius: 8,
    minWidth: 100,
  },
  recentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  filterDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#1a0a3d',
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 150,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 150,
  },
  filterOptionActive: {
    backgroundColor: 'rgba(221, 53, 98, 0.15)',
  },
  filterOptionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  filterIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DD3562',
  },
  menuButton: {
    padding: 4,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 0,
  },
  uploadScroll: {
    flex: 1,
  },
  uploadCard: {
    width: imageWidth,
    height: imageWidth,
    overflow: 'hidden',
    position: 'relative',
  },
  addButton: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadImage: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#140034',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabsScrollContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  tabWrapper: {
    marginHorizontal: 6,
    alignItems: 'center',
  },
  activeTab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#DD3562',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  inactiveTab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeTabText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
 
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: '#DD3562',
    borderRadius: 2,
  },
  activeTabPill: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24, // Large value for full pill shape
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DD3562',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
    position: 'relative',
    zIndex: 2,
    // Optionally: raise the pill above others for "lift" effect
    marginTop: -14, // Lifts the pill visually above the bar
    marginBottom: -8, // Allows pill to overlap tab bar
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)', // Matches subtle Figma border
  },
  
  tabsWrapper: {
    paddingTop: 10,
    backgroundColor: '#140034',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    zIndex: 10,
  },
  tabBarContent: {
    minHeight: 48,
    alignItems: 'flex-end',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  tabButton: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
    paddingBottom: 0,
  },

  /** ACTIVE TAB (PILL) **/
  pillTab: {
    paddingHorizontal: 22,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 18,
    backgroundColor: undefined, // LinearGradient takes over the bg
    shadowColor: '#8354FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 7,
    minWidth: 82,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    borderWidth: 1.5,
    borderColor: 'rgba(179,74,255,1)', // matches the glow edge in Figma
    overflow: 'visible',
    marginTop: -10,
  },
  pillTabText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
    zIndex: 2,
    paddingHorizontal: 3,
    paddingBottom: 0,
  },
  pillCurveSvg: {
    position: 'absolute',
    width: '100%',
    height: 8,
    bottom: -8,
    left: 0,
    right: 0,
    zIndex: 0,
    // This creates the little up curve effect under the pill (fine-tune color to Figma)
  },

  /** INACTIVE TAB **/
  inactiveTabText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
    height: 38,
    textAlignVertical: 'bottom',
    textAlign: 'center',
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
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#DD3562',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 50,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#DD3562',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minWidth: 200,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PostScreen;
