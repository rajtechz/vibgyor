import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { CropView } from 'react-native-image-crop-tools';
import SwiperFlatList from 'react-native-swiper-flatlist';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Svg, { Path } from 'react-native-svg';
import { setCurrentScreen, hideTabBar, showTabBar } from '../../../redux/slices/uiSlice';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Back Arrow Icon (Chevron Left)
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

// Location Pin Icon
const LocationIcon = ({ width = 20, height = 20, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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

// Play Icon for Videos
const PlayIcon = ({ width = 40, height = 40, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 5V19L19 12L8 5Z"
      fill={color}
    />
  </Svg>
);

// Close Icon (X)
const CloseIcon = ({ width = 24, height = 24, color = 'white' }) => (
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

// Filter Icon (from PNG file)
const FilterIcon = ({ width = 35, height = 35 }) => (
  <Image
    source={require('../../../assets/icons/filterIcon.png')}
    style={{ width, height }}
    resizeMode="contain"
  />
);

function CropFilterScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  // Get media items from route params (supports both single and multiple)
  const { 
    mediaItems, 
    isMultiple, 
    imageUri // Backward compatibility
  } = route.params || {};
  
  // Determine the current image URI to display
  const currentImageUri = mediaItems && mediaItems.length > 0 
    ? mediaItems[0].uri 
    : imageUri;
  
  const cropViewRef = useRef(null);
  const swiperRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Form state
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [likeVisibility, setLikeVisibility] = useState('Public');
  const [commentVisibility, setCommentVisibility] = useState('Public');
  const [showLikeDropdown, setShowLikeDropdown] = useState(false);
  const [showCommentDropdown, setShowCommentDropdown] = useState(false);

  const displayMediaItems = mediaItems && mediaItems.length > 0 ? mediaItems : (currentImageUri ? [{ uri: currentImageUri, type: 'image' }] : []);

  // Redux-based tab bar hiding when CropFilterScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('✂️ CropFilterScreen Focused - Hiding TabBar');
      dispatch(setCurrentScreen('Crop'));
      dispatch(hideTabBar());
      
      return () => {
        console.log('✂️ CropFilterScreen Unfocused - Showing TabBar');
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [navigation, dispatch])
  );

  useLayoutEffect(() => {
    dispatch(setCurrentScreen('Crop'));
    dispatch(hideTabBar());

    return () => {
      dispatch(showTabBar());
      dispatch(setCurrentScreen(null));
    };
  }, [dispatch]);

  const handleNext = async () => {
    const currentItem = displayMediaItems[currentIndex];
    const uriToCrop = currentItem?.uri;
    
    if (!uriToCrop) {
      Alert.alert('Error', 'No image available');
      return;
    }

    // Hide tab bar immediately before navigation
    dispatch(setCurrentScreen('Filter'));
    dispatch(hideTabBar());

    // For videos, skip cropping and navigate directly
    if (currentItem?.isVideo) {
      navigation.navigate('Filter', {
        mediaItems: displayMediaItems,
        isMultiple: isMultiple || displayMediaItems.length > 1,
        croppedImage: null,
        caption,
        location,
        likeVisibility,
        commentVisibility,
      });
      return;
    }

    // For images, we can skip cropping for now and go to filter screen
    // Or implement cropping if needed
    navigation.navigate('Filter', {
      mediaItems: displayMediaItems,
      isMultiple: isMultiple || displayMediaItems.length > 1,
      croppedImage: null,
      caption,
      location,
      likeVisibility,
      commentVisibility,
    });
  };

  const handleBack = () => {
    dispatch(showTabBar());
    dispatch(setCurrentScreen(null));
    
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('PostMain');
    }
  };

  const handleImageCrop = (res) => {
    if (res) {
      setImageLoaded(true);
    }
  };

  const renderMediaItem = ({ item, index }) => {
    const isVideo = item.isVideo || item.type === 'video';
    
    return (
      <View style={styles.mediaItemContainer}>
        {isVideo ? (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: item.uri }}
              style={styles.mediaImage}
              resizeMode="cover"
              paused={true}
              muted={true}
            />
            <View style={styles.playIconOverlay}>
              <View style={styles.playIconContainer}>
                <PlayIcon width={40} height={40} color="white" />
              </View>
            </View>
          </View>
        ) : (
          <Image
            source={{ uri: item.uri }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        )}
        
        {/* Close Button - Top Right */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => {
            // Handle remove item
            Alert.alert('Remove', 'Remove this media?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', style: 'destructive', onPress: () => {
                // Remove logic can be added here
                console.log('Remove item:', index);
              }}
            ]);
          }}
        >
          <View style={styles.closeButtonCircle}>
            <CloseIcon width={16} height={16} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Sticky Header */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon width={24} height={24} color="white" />
          </TouchableOpacity>
          
      
          
          <Text style={styles.headerTitle}>Upload Images</Text>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Media Preview Section */}
        <View style={styles.mediaPreviewSection}>
          {displayMediaItems.length > 0 ? (
            displayMediaItems.length > 1 ? (
              <View style={styles.swiperContainer}>
                <SwiperFlatList
                  ref={swiperRef}
                  data={displayMediaItems}
                  renderItem={renderMediaItem}
                  horizontal
                  showPagination={false}
                  onChangeIndex={({ index }) => setCurrentIndex(index)}
                  style={styles.swiper}
                  contentContainerStyle={styles.swiperContent}
                  // Configure to show first image complete and second partially visible
                />
              </View>
            ) : (
              <View style={styles.singleMediaContainer}>
                <View style={styles.singleMediaWrapper}>
                  {displayMediaItems[0].isVideo ? (
                    <View style={styles.videoContainer}>
                      <Video
                        source={{ uri: displayMediaItems[0].uri }}
                        style={styles.mediaImage}
                        resizeMode="cover"
                        paused={true}
                        muted={true}
                      />
                      <View style={styles.playIconOverlay}>
                        <View style={styles.playIconContainer}>
                          <PlayIcon width={40} height={40} color="white" />
                        </View>
                      </View>
                    </View>
                  ) : (
                    <Image
                      source={{ uri: displayMediaItems[0].uri }}
                      style={styles.mediaImage}
                      resizeMode="cover"
                    />
                  )}
                  
                  {/* Close Button - Top Right */}
                  <TouchableOpacity style={styles.closeButton}>
                    <View style={styles.closeButtonCircle}>
                      <CloseIcon width={16} height={16} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No Media Selected</Text>
            </View>
          )}
        </View>

        {/* Filter Icon - Below Image Section */}
        {displayMediaItems.length > 0 && (
          <View style={styles.filterIconContainer}>
            <TouchableOpacity 
              style={styles.filterButtonBelow}
              onPress={() => {
                // Hide tab bar immediately before navigation
                dispatch(setCurrentScreen('Filter'));
                dispatch(hideTabBar());
                
                const currentItem = displayMediaItems[currentIndex];
                navigation.navigate('Filter', {
                  mediaItems: displayMediaItems,
                  isMultiple: isMultiple || displayMediaItems.length > 1,
                  croppedImage: currentItem ? { uri: currentItem.uri, type: currentItem.type || 'image' } : null,
                  caption,
                  location,
                  likeVisibility,
                  commentVisibility,
                });
              }}
              activeOpacity={0.7}
            >
              <FilterIcon width={35} height={35} />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Fields Section */}
        <View style={styles.inputSection}>
          {/* Add Caption */}
          <TextInput
            style={styles.captionInput}
            placeholder="Add Caption"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={caption}
            onChangeText={setCaption}
            multiline
            textAlignVertical="top"
          />
          
          <View style={styles.divider} />

          {/* Add Location */}
          <Text style={styles.label}>Add Location</Text>
          <LinearGradient
            colors={['#DD3562', '#8354FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputGradientBorder}
          >
            <View style={styles.locationContainer}>
              <TextInput
                style={styles.locationInput}
                placeholder="Location"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={location}
                onChangeText={setLocation}
              />
              <LocationIcon width={20} height={20} color="white" />
            </View>
          </LinearGradient>

          {/* Like Visibility */}
          <Text style={styles.label}>Like Visibility</Text>
          <LinearGradient
            colors={['#DD3562', '#8354FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputGradientBorder}
          >
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                setShowLikeDropdown(!showLikeDropdown);
                setShowCommentDropdown(false);
              }}
            >
              <Text style={styles.dropdownText}>{likeVisibility}</Text>
              <ChevronDownIcon width={16} height={16} color="white" />
            </TouchableOpacity>
          </LinearGradient>
          {showLikeDropdown && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setLikeVisibility('Public');
                  setShowLikeDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Public</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setLikeVisibility('Friends');
                  setShowLikeDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setLikeVisibility('Private');
                  setShowLikeDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Private</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Comment Visibility */}
          <Text style={styles.label}>Comment Visibility</Text>
          <LinearGradient
            colors={['#DD3562', '#8354FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputGradientBorder}
          >
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                setShowCommentDropdown(!showCommentDropdown);
                setShowLikeDropdown(false);
              }}
            >
              <Text style={styles.dropdownText}>{commentVisibility}</Text>
              <ChevronDownIcon width={16} height={16} color="white" />
            </TouchableOpacity>
          </LinearGradient>
          {showCommentDropdown && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setCommentVisibility('Public');
                  setShowCommentDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Public</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setCommentVisibility('Friends');
                  setShowCommentDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setCommentVisibility('Private');
                  setShowCommentDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Private</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Upload Button */}
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
        <TouchableOpacity
          style={styles.uploadButtonContainer}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#DD3562', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.uploadButton}
          >
            <Text style={styles.uploadButtonText}>
              {isProcessing ? 'Processing...' : 'Upload'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140034',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerSafeArea: {
    backgroundColor: '#140034',
    zIndex: 1000,
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
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
 
  headerTitle: {
    color: '#DD3562',
    fontSize: 16,
    fontWeight: '600',
  },
  mediaPreviewSection: {
    height: SCREEN_HEIGHT * 0.5, // Increased to 50% for taller images
    backgroundColor: '#140034',
    marginBottom: 20,
    marginTop: 15,
  },
  swiperContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiper: {
    height: '100%',
  },
  swiperContent: {
    paddingHorizontal: SCREEN_WIDTH * 0.075, // ~7.5% padding on each side to center 85% width items
    alignItems: 'center',
  },
  singleMediaContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleMediaWrapper: {
    width: SCREEN_WIDTH * 0.85, // 85% of screen width
    height: '100%',
    position: 'relative',
  },
  mediaItemContainer: {
    width: SCREEN_WIDTH * 0.85, // 85% of screen width
    height: '100%',
    marginRight: 16, // Space between items for peek effect
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingRight: 20, // 20px from right edge
    backgroundColor: '#140034',
    zIndex: 5,
  },
  filterButtonBelow: {
    // Filter icon positioned below the image section at right edge
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
  },
  inputSection: {
    paddingHorizontal: 20,
    backgroundColor: '#140034',
  },
  captionInput: {
    color: 'white',
    fontSize: 16,
    minHeight: 80,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 20,
  },
  label: {
    color: '#DD3562',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
  },
  inputGradientBorder: {
    borderRadius: 12,
    padding: 1,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#140034',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  locationInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginRight: 12,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#140034',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownMenu: {
    backgroundColor: '#2A1A4A',
    borderRadius: 12,
    marginTop: -14,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 16,
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#140034',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  uploadButtonContainer: {
    width: '100%',
  },
  uploadButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CropFilterScreen;
