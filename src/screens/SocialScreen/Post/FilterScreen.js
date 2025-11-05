import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Video from 'react-native-video';
import ViewShot from 'react-native-view-shot';
import { setCurrentScreen, hideTabBar, showTabBar } from '../../../redux/slices/uiSlice';
import CustomButton from '../../../components/common/CustomButton';

// Safely import CameraRoll
let CameraRoll = null;
try {
  const cameraRollModule = require('@react-native-camera-roll/camera-roll');
  CameraRoll = cameraRollModule.CameraRoll || cameraRollModule.default;
} catch (error) {
  console.warn('⚠️ CameraRoll module not available:', error);
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Back Arrow Icon
const BackIcon = ({ width = 24, height = 24, color = 'white' }) => (
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

// Download Icon
const DownloadIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 10L12 15L17 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15V3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Filter definitions with overlay colors to simulate filters
const FILTERS = [
  {
    id: 'default',
    name: 'Default',
    overlayColor: null,
    opacity: 0,
  },
  {
    id: 'brightness',
    name: 'Bright',
    overlayColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.15,
  },
  {
    id: 'contrast',
    name: 'Contrast',
    overlayColor: 'rgba(0, 0, 0, 0.2)',
    opacity: 0.3,
  },
  {
    id: 'sepia',
    name: 'Vintage',
    overlayColor: 'rgba(255, 220, 177, 0.4)',
    opacity: 0.5,
  },
  {
    id: 'grayscale',
    name: 'Mono',
    overlayColor: 'rgba(128, 128, 128, 0.5)',
    opacity: 0.6,
    blendMode: 'saturation',
  },
  {
    id: 'warm',
    name: 'Warm',
    overlayColor: 'rgba(255, 200, 150, 0.3)',
    opacity: 0.35,
  },
  {
    id: 'cool',
    name: 'Cool',
    overlayColor: 'rgba(150, 200, 255, 0.3)',
    opacity: 0.35,
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    overlayColor: 'rgba(255, 100, 100, 0.2)',
    opacity: 0.25,
  },
];

function FilterScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const viewShotRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { 
    croppedImage, 
    mediaItems, 
    isMultiple,
    caption,
    location,
    likeVisibility,
    commentVisibility,
  } = route.params || {};
  
  // Prepare display media items - support both single and multiple images
  const displayMediaItems = React.useMemo(() => {
    if (mediaItems && mediaItems.length > 0) {
      return mediaItems;
    } else if (croppedImage?.uri) {
      return [{ uri: croppedImage.uri, type: 'image' }];
    }
    return [];
  }, [mediaItems, croppedImage]);

  // Store filter for each image (index-based)
  const [imageFilters, setImageFilters] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get current image and its filter
  const currentImage = displayMediaItems[currentIndex];
  const currentImageUri = currentImage?.uri;
  const selectedFilter = imageFilters[currentIndex] || 'default';

  // Redux-based tab bar hiding when FilterScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('🎨 FilterScreen Focused - Hiding TabBar');
      dispatch(setCurrentScreen('Filter'));
      dispatch(hideTabBar());
      
      return () => {
        console.log('🎨 FilterScreen Unfocused - Showing TabBar');
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [navigation, dispatch])
  );

  useLayoutEffect(() => {
    dispatch(setCurrentScreen('Filter'));
    dispatch(hideTabBar());

    return () => {
      dispatch(showTabBar());
      dispatch(setCurrentScreen(null));
    };
  }, [dispatch]);

  useEffect(() => {
    // Initialize filters for all images to 'default'
    if (displayMediaItems.length > 0) {
      const initialFilters = {};
      displayMediaItems.forEach((_, index) => {
        initialFilters[index] = 'default';
      });
      setImageFilters(initialFilters);
    }
    // Set loading to false immediately - images are already loaded
    setIsLoading(false);
  }, [displayMediaItems]);

  const handleFilterSelect = useCallback((filterId) => {
    // Apply filter to current image - instant, no loading needed
    setImageFilters(prev => ({
      ...prev,
      [currentIndex]: filterId,
    }));
  }, [currentIndex]);

  const handleBack = () => {
    dispatch(showTabBar());
    dispatch(setCurrentScreen(null));
    
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('PostMain');
    }
  };

  const handleAdd = () => {
    console.log('Add button pressed');
    // Handle add functionality - maybe allow adding more images
  };

  // Request storage permission for Android
  const requestStoragePermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        const statuses = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]);
        const hasImagesPermission = statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED;
        const hasVideosPermission = statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED;
        return hasImagesPermission && hasVideosPermission;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to save photos to your gallery.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!currentImage || isDownloading) {
      return;
    }

    // Check if it's a video - don't download videos
    if (currentImage.isVideo || currentImage.type === 'video') {
      Alert.alert('Info', 'Video download is not supported yet.');
      return;
    }

    try {
      setIsDownloading(true);

      // Request permission first
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to save photos. Please enable storage permission in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() },
          ]
        );
        setIsDownloading(false);
        return;
      }

      // Check if CameraRoll is available
      if (!CameraRoll || typeof CameraRoll.save !== 'function') {
        Alert.alert('Error', 'CameraRoll module is not available. Please rebuild the app.');
        setIsDownloading(false);
        return;
      }

      // Capture the filtered image view
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        console.log('📸 Captured image URI:', uri);

        // Save to gallery
        await CameraRoll.save(uri, {
          type: 'photo',
          album: 'Vibgyor',
        });

        Alert.alert('Success', 'Image saved to gallery!');
      } else {
        // Fallback: Save original image if viewShot fails
        await CameraRoll.save(currentImage.uri, {
          type: 'photo',
          album: 'Vibgyor',
        });
        Alert.alert('Success', 'Image saved to gallery!');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [currentImage, isDownloading, requestStoragePermission]);

  const handleUploadVibes = () => {
    console.log('Upload Vibes button pressed');
    // Prepare filtered media items with their respective filters
    const filteredMediaItems = displayMediaItems.map((item, index) => ({
      ...item,
      filter: imageFilters[index] || 'default',
    }));

    // Navigate to PostEdit or final upload screen with all filtered images
    const rootNavigator = navigation.getParent()?.getParent();
    if (rootNavigator) {
      rootNavigator.navigate('Main', {
        screen: 'Home',
        params: {
          screen: 'PostEdit',
          params: {
            mediaItems: filteredMediaItems,
            isMultiple: isMultiple || filteredMediaItems.length > 1,
            caption,
            location,
            likeVisibility,
            commentVisibility,
          },
        },
      });
    } else {
      navigation.navigate('PostEdit', {
        mediaItems: filteredMediaItems,
        isMultiple: isMultiple || filteredMediaItems.length > 1,
        caption,
        location,
        likeVisibility,
        commentVisibility,
      });
    }
  };

  const renderFilteredImage = useCallback(({ item, index }) => {
    const imageFilter = imageFilters[index] || 'default';
    const filterConfig = FILTERS.find((f) => f.id === imageFilter);
    const isVideo = item.isVideo || item.type === 'video';

    return (
      <View style={styles.imageWrapper}>
        {isVideo ? (
          <Video
            source={{ uri: item.uri }}
            style={styles.fullScreenImage}
            resizeMode="cover"
            paused={true}
            muted={true}
            poster={item.uri}
          />
        ) : (
          <Image
            source={{ uri: item.uri }}
            style={styles.fullScreenImage}
            resizeMode="cover"
            cache="force-cache"
          />
        )}
        {filterConfig && filterConfig.overlayColor && (
          <View
            style={[
              styles.filterOverlay,
              {
                backgroundColor: filterConfig.overlayColor,
                opacity: filterConfig.opacity || 0.5,
              },
            ]}
          />
        )}
      </View>
    );
  }, [imageFilters]);

  const renderImageContainer = () => {
    if (displayMediaItems.length === 0) {
      return (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image Selected</Text>
        </View>
      );
    }

    if (displayMediaItems.length === 1) {
      // Single image - no swiper needed
      return renderFilteredImage({ item: displayMediaItems[0], index: 0 });
    }

    // Multiple images - use swiper
    return (
      <SwiperFlatList
        ref={swiperRef}
        data={displayMediaItems}
        renderItem={renderFilteredImage}
        horizontal
        showPagination={true}
        paginationDefaultColor="rgba(255, 255, 255, 0.3)"
        paginationActiveColor="#DD3562"
        paginationStyle={styles.paginationStyle}
        paginationStyleItem={styles.paginationItem}
        onChangeIndex={({ index }) => {
          setCurrentIndex(index);
        }}
        style={styles.swiper}
      />
    );
  };

  const renderFilterThumbnail = useCallback((filter) => {
    const isSelected = filter.id === selectedFilter;

    if (!currentImageUri) {
      return (
        <View style={[styles.filterThumbnail, isSelected && styles.selectedFilterThumbnail]}>
          <View style={styles.filterThumbnailPlaceholder}>
            <Text style={styles.filterThumbnailText}>{filter.name}</Text>
          </View>
          <Text
            style={[
              styles.filterName,
              isSelected && styles.selectedFilterName,
            ]}
          >
            {filter.name}
          </Text>
        </View>
      );
    }

    if (filter.id === 'default') {
      return (
        <TouchableOpacity
          style={styles.filterItemContainer}
          onPress={() => handleFilterSelect(filter.id)}
        >
          <View
            style={[
              styles.filterThumbnail,
              isSelected && styles.selectedFilterThumbnail,
            ]}
          >
            <View style={styles.defaultFilterContainer}>
              <Image
                source={{ uri: currentImageUri }}
                style={styles.filterThumbnailImage}
                resizeMode="cover"
                cache="force-cache"
              />
              <View style={styles.defaultFilterOverlay}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M12 7V12L15 15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </View>
          </View>
          <Text
            style={[
              styles.filterName,
              isSelected && styles.selectedFilterName,
            ]}
          >
            {filter.name}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.filterItemContainer}
        onPress={() => handleFilterSelect(filter.id)}
      >
        <View
          style={[
            styles.filterThumbnail,
            isSelected && styles.selectedFilterThumbnail,
          ]}
        >
          <View style={styles.filterThumbnailWrapper}>
            <Image
              source={{ uri: currentImageUri }}
              style={styles.filterThumbnailImage}
              resizeMode="cover"
              cache="force-cache"
            />
            {filter.overlayColor && (
              <View
                style={[
                  styles.filterThumbnailOverlay,
                  {
                    backgroundColor: filter.overlayColor,
                    opacity: filter.opacity || 0.5,
                  },
                ]}
              />
            )}
          </View>
        </View>
        <Text
          style={[
            styles.filterName,
            isSelected && styles.selectedFilterName,
          ]}
        >
          {filter.name}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedFilter, currentImageUri, handleFilterSelect]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Full Screen Image Container */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'jpg', quality: 0.9 }}
        style={styles.imageContainer}
      >
        {renderImageContainer()}
      </ViewShot>

      {/* Header - Overlay on top */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon width={24} height={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Upload Vibes</Text>
            {displayMediaItems.length > 1 && (
              <Text style={styles.imageCounter}>
                {currentIndex + 1} of {displayMediaItems.length}
              </Text>
            )}
          </View>
          
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

   

      {/* Filters Section - Horizontal Scroll */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          style={styles.filtersScrollView}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => handleFilterSelect(filter.id)}
              style={styles.filterItemWrapper}
            >
              {renderFilterThumbnail(filter)}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Action Buttons */}
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={handleDownload}
            disabled={isDownloading || !currentImage || currentImage.isVideo || currentImage.type === 'video'}
            style={[
              styles.downloadButton,
              (isDownloading || !currentImage || currentImage.isVideo || currentImage.type === 'video') && styles.downloadButtonDisabled,
            ]}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#DD3562" />
            ) : (
              <>
                <DownloadIcon width={20} height={20} color="#DD3562" />
                <Text style={styles.downloadButtonText}>Save</Text>
              </>
            )}
          </TouchableOpacity>

          <CustomButton
            title="Upload Vibes"
            onPress={handleUploadVibes}
            style={styles.uploadButton}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140034',
    width: SCREEN_WIDTH,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  swiper: {
    width: '100%',
    height: '100%',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: '100%',
    position: 'relative',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  paginationStyle: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
  },
  paginationItem: {
    width: 8,
    height: 8,
    marginHorizontal: 4,
  },
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    backgroundColor: '#140034',
    borderBottomWidth: 1,
    borderBottomColor: '#281A62',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 40,
  },
  imageCounter: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  progressIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  progressLine: {
    height: 2,
    width: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  progressLineActive: {
    width: 50,
    backgroundColor: '#DD3562',
  },
  headerTitle: {
    color: '#DD3562',
    fontSize: 16,
    fontWeight: '600',
  },
  defaultFilterButtonContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.25,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  defaultFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  defaultFilterButtonActive: {
    backgroundColor: 'rgba(221, 53, 98, 0.3)',
    borderColor: '#DD3562',
  },
  defaultFilterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filtersSection: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.15,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.12,
    zIndex: 10,
  },
  filtersScrollView: {
    flex: 1,
  },
  filtersList: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  filterItemWrapper: {
    marginRight: 12,
  },
  filterItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterThumbnail: {
    width: SCREEN_WIDTH * 0.18,
    height: SCREEN_HEIGHT * 0.08,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFilterThumbnail: {
    borderColor: '#DD3562',
    borderWidth: 3,
    backgroundColor: 'rgba(221, 53, 98, 0.3)',
  },
  filterThumbnailWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  filterThumbnailImage: {
    width: '100%',
    height: '100%',
  },
  filterThumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterThumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterThumbnailText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  defaultFilterContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  defaultFilterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
  },
  selectedFilterName: {
    color: '#DD3562',
    fontWeight: 'bold',
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#140034',
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    gap: 12,
    backgroundColor: '#140034',
  },
  addButton: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(68, 68, 68, 0.8)',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    flex: 2,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(221, 53, 98, 0.5)',
    minHeight: 50,
  },
  downloadButtonText: {
    color: '#DD3562',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadButtonDisabled: {
    opacity: 0.5,
  },
});

export default FilterScreen;
