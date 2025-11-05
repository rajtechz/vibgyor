import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
  InteractionManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Video from 'react-native-video';
import CommonBackground from '../../../components/common/CommonBackground';
import { launchCamera } from 'react-native-image-picker';
import MediaStoreService from '../../../services/MediaStoreService';
import {
  setGalleryMedia,
  setAllMedia,
  setSelectedFilter,
  setSelectedImageIds,
  addSelectedImageId,
  removeSelectedImageId,
  clearSelectedImageIds,
  setSelectedPreviewItem,
  clearSelectedPreviewItem,
  setLoading,
  setPermission,
  setError,
} from '../../../redux/slices/postSlice';

// Safely import CameraRoll
let CameraRoll = null;
try {
  const cameraRollModule = require('@react-native-camera-roll/camera-roll');
  CameraRoll = cameraRollModule.CameraRoll || cameraRollModule.default;
} catch (error) {
  console.warn('⚠️ CameraRoll module not available:', error);
}

const { width } = Dimensions.get('window');
const imageWidth = width / 3;

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

// Select Multiple Icon (Two overlapping squares)
const SelectMultipleIcon = ({ width = 20, height = 20, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 8H16V16H8V8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Camera Icon
const CameraIcon = ({ width = 32, height = 32, color = 'white' }) => (
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

// Recents Icon (play button over stack)
const RecentsIcon = ({ width = 20, height = 20, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 19.5C4 18.3954 4.89543 17.5 6 17.5H18C19.1046 17.5 20 18.3954 20 19.5C20 20.6046 19.1046 21.5 18 21.5H6C4.89543 21.5 4 20.6046 4 19.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 15.5C4 14.3954 4.89543 13.5 6 13.5H18C19.1046 13.5 20 14.3954 20 15.5C20 16.6046 19.1046 17.5 18 17.5H6C4.89543 17.5 4 16.6046 4 15.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 11.5C4 10.3954 4.89543 9.5 6 9.5H12C13.1046 9.5 14 10.3954 14 11.5C14 12.6046 13.1046 13.5 12 13.5H6C4.89543 13.5 4 12.6046 4 11.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 9L20 12L16 15V9Z"
      fill={color}
    />
  </Svg>
);

// Photos Icon (mountain/landscape)
const PhotosIcon = ({ width = 20, height = 20, color = 'white' }) => (
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
    <Path
      d="M17 7L14 10L10 6L5 11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Videos Icon (play button in circle)
const VideosIcon = ({ width = 20, height = 20, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 8L16 12L10 16V8Z"
      fill={color}
    />
  </Svg>
);

// Play Icon (for video overlay)
const PlayIcon = ({ width = 32, height = 32, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 5V19L19 12L8 5Z"
      fill={color}
    />
  </Svg>
);

// Format duration helper
const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Normalize timestamp utility - converts seconds to milliseconds if needed
const normalizeTimestamp = (t) => {
  if (!t) return Date.now();
  const n = Number(t);
  if (isNaN(n) || n <= 0) return Date.now();
  return n < 10000000000 ? n * 1000 : n; // convert seconds→ms when needed
};

// Sanitize media item to ensure all values are Redux-serializable
const sanitizeMediaItem = (item) => {
  if (!item) return null;
  
  // Ensure created is always a valid number
  let created = item.created;
  if (typeof created !== 'number' || isNaN(created) || created <= 0) {
    created = Date.now();
  }
  
  // Return sanitized item - preserve videoUri for videos
  const sanitized = {
    ...item,
    created: created, // Ensure it's a number
    isVideo: item.isVideo === true, // Ensure boolean
  };
  
  // CRITICAL: For videos, ensure videoUri is preserved
  if (sanitized.isVideo === true) {
    // Ensure videoUri is set - use existing or fallback to uri
    if (!sanitized.videoUri) {
      sanitized.videoUri = sanitized.uri;
    }
    // Ensure thumbnailUri is set
    if (!sanitized.thumbnailUri) {
      sanitized.thumbnailUri = sanitized.videoUri || sanitized.uri;
    }
  } else {
    // For images, remove videoUri if present
    if (sanitized.videoUri) {
      delete sanitized.videoUri;
    }
  }
  
  return sanitized;
};

// Simple deduplication using Map with URI as key
// IMPORTANT: Preserve videos even if URI conflicts with images, and prefer newer items
const createMediaMap = (items) => {
  const map = new Map();
  let videoCount = 0;
  let duplicateVideos = 0;
  
  items.forEach(item => {
    if (!item || !item.uri) return;
    
    // Sanitize item before processing
    const sanitizedItem = sanitizeMediaItem(item);
    if (!sanitizedItem) return;
    
    // Use URI as key for deduplication
    const key = sanitizedItem.uri;
    
    // If key exists, check if we should replace it
    if (map.has(key)) {
      const existing = map.get(key);
      
      // Prefer video over image if URI conflicts
      if (sanitizedItem.isVideo === true && existing.isVideo !== true) {
        // Replace image with video
        map.set(key, sanitizedItem);
        videoCount++;
      } else if (sanitizedItem.isVideo !== true && existing.isVideo === true) {
        // Keep existing video, don't replace with image
        return;
      } else {
        // Both same type (both videos or both images)
        // Prefer the NEWER item (higher created timestamp)
        const existingTime = existing.created || 0;
        const newTime = sanitizedItem.created || 0;
        
        if (newTime > existingTime) {
          // New item is newer, replace existing
          map.set(key, sanitizedItem);
          if (sanitizedItem.isVideo === true) {
            videoCount++;
            if (existing.isVideo === true) duplicateVideos--;
          }
        } else {
          // Existing item is newer or same, keep existing
          if (sanitizedItem.isVideo === true) duplicateVideos++;
        }
        return;
      }
    } else {
      // New key, add item
      map.set(key, sanitizedItem);
      if (sanitizedItem.isVideo === true) videoCount++;
    }
  });
  
  // Debug: Log deduplication stats
  if (duplicateVideos > 0) {
    console.log('🔍 Deduplication stats:', {
      totalInput: items.length,
      totalOutput: map.size,
      videosAdded: videoCount,
      duplicateVideosSkipped: duplicateVideos
    });
  }
  
  return map;
};


// Check Icon (for selected items)
const CheckIcon = ({ width = 16, height = 16, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17L4 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Center Tab Background SVG Component (from center.svg)
const CenterTabBackground = ({ width = 145, height = 39 }) => (
  <Svg width={width} height={height} viewBox="0 0 145 39" fill="none">
    <Path
      d="M111.681 0.5H33.3187C27.8289 0.5 22.7224 3.31453 19.7909 7.9561L0.5 38.5H144.5L125.209 7.95611C122.278 3.31454 117.171 0.5 111.681 0.5Z"
      fill="#D9D9D9"
    />
    <Path
      d="M111.681 0.5H33.3187C27.8289 0.5 22.7224 3.31453 19.7909 7.9561L0.5 38.5H144.5L125.209 7.95611C122.278 3.31454 117.171 0.5 111.681 0.5Z"
      fill="url(#paint0_linear_5396_2528)"
    />
    <Path
      d="M144.5 38.5L125.209 7.95611C122.278 3.31454 117.171 0.5 111.681 0.5H33.3187C27.8289 0.5 22.7224 3.31453 19.7909 7.9561L0.5 38.5"
      stroke="url(#paint1_linear_5396_2528)"
      strokeLinecap="round"
    />
    <Defs>
      <SvgLinearGradient
        id="paint0_linear_5396_2528"
        x1="93.4032"
        y1="-10.5833"
        x2="93.4032"
        y2="35.3333"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#190140" />
        <Stop offset="1" stopColor="#080110" />
      </SvgLinearGradient>
      <SvgLinearGradient
        id="paint1_linear_5396_2528"
        x1="72.5"
        y1="38.5"
        x2="72.5"
        y2="0.5"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#030111" />
        <Stop offset="1" stopColor="#5604CC" />
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

function PostScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    galleryMedia, 
    allMedia, 
    selectedFilter, 
    selectedImageIds, 
    selectedPreviewItem, 
    isLoading, 
    hasPermission 
  } = useSelector(state => state.post);
  
  // Local state
  const [selectedTab, setSelectedTab] = useState('POST'); // POST, STORY, REEL
  const [showRecentsDropdown, setShowRecentsDropdown] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const flatListRef = useRef(null);
  const isFirstMount = useRef(true);
  const lastCursorRef = useRef(null);
  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  
  // Local filter state for instant UI update (syncs with Redux)
  const [localSelectedFilter, setLocalSelectedFilter] = useState(selectedFilter || 'Recents');
  
  // Sync local filter with Redux state (for initial load and external updates)
  useEffect(() => {
    if (selectedFilter) {
      setLocalSelectedFilter(selectedFilter);
      console.log('🔄 Synced local filter with Redux:', selectedFilter);
    }
  }, [selectedFilter]);

  // Debug: Log galleryMedia whenever it changes
  useEffect(() => {
    if (galleryMedia && galleryMedia.length > 0) {
      const videoItems = galleryMedia.filter(item => 
        !item.isAddButton && 
        (item.isVideo === true || item.type === 'video' || 
         (item.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.uri)))
      );
      console.log('🖼️ GALLERY MEDIA UPDATED:', {
        total: galleryMedia.length,
        videos: videoItems.length,
        videoItems: videoItems.slice(0, 3).map(v => ({
          id: v.id,
          isVideo: v.isVideo,
          type: v.type,
          uri: v.uri?.substring(0, 50)
        }))
      });
    }
  }, [galleryMedia]);

  // Check storage permission
  const checkStoragePermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        const [hasReadMediaImagesPermission, hasReadMediaVideoPermission] = await Promise.all([
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
        ]);
        return hasReadMediaImagesPermission && hasReadMediaVideoPermission;
        } else {
        return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      }
    } catch (err) {
      console.warn('Permission check error:', err);
      return false;
    }
  }, []);

  // Request storage permission
  const requestStoragePermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      dispatch(setPermission(true));
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
        const isGranted = hasImagesPermission && hasVideosPermission;
        dispatch(setPermission(isGranted));
        return isGranted;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your photos and videos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        dispatch(setPermission(isGranted));
        return isGranted;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      dispatch(setPermission(false));
      return false;
    }
  }, [dispatch]);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      // iOS handles camera permissions automatically
      return true;
    }

    try {
      // Check if permission is already granted
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      
      if (hasPermission) {
        return true;
      }

      // Request camera permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos and videos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  }, []);

  // OPTIMIZED: Memoized filter function - fast and smooth (Instagram style)
  // Defined before loadGalleryImages so it can be used
  const getFilteredMedia = useCallback((mediaItems, filterType) => {
    try {
      if (!mediaItems || !Array.isArray(mediaItems) || mediaItems.length === 0) {
        console.log('⚠️ getFilteredMedia: No media items provided', {
          isNull: !mediaItems,
          isArray: Array.isArray(mediaItems),
          length: mediaItems?.length
        });
        return [];
      }

      console.log('🔍 getFilteredMedia called:', {
        filterType,
        totalItems: mediaItems.length,
        firstItem: mediaItems[0] ? {
          type: mediaItems[0].type,
          isVideo: mediaItems[0].isVideo,
          hasUri: !!mediaItems[0].uri
        } : 'No items'
      });

      let filtered = [];
      
      try {
        switch (filterType) {
          case 'Photos':
            // Filter only images - simple and reliable check
            filtered = mediaItems.filter(item => {
              try {
                if (!item || item.isAddButton || !item.uri) return false;
                
                // First check: If explicitly marked as video, exclude it
                if (item.isVideo === true || item.type === 'video') {
                  return false;
                }
                
                // Second check: If URI has video extension, exclude it
                const uriIsVideoExt = /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.uri);
                if (uriIsVideoExt) return false;
                
                // Third check: If filename has video extension, exclude it
                if (item.fileName && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.fileName)) {
                  return false;
                }
                
                // Everything else is an image
                return true;
              } catch (itemError) {
                console.error('❌ Error filtering item:', itemError, item);
                return false;
              }
            });
            break;
            
          case 'Videos':
            // Filter only videos - explicit check with fast detection
            filtered = mediaItems.filter(item => {
              try {
                if (!item || !item.uri || item.isAddButton) return false;
                
                // Fast video detection - check flags first (most reliable)
                if (item.isVideo === true || item.type === 'video') {
                  return true;
                }
                
                // Fallback: Check URI extension
                const uriIsVideo = /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.uri);
                if (uriIsVideo) return true;
                
                // Check filename extension
                if (item.fileName && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.fileName)) {
                  return true;
                }
                
                return false;
              } catch (itemError) {
                console.error('❌ Error filtering video item:', itemError, item);
                return false;
              }
            });
            break;
            
          case 'Recents':
          case 'All albums':
          default:
            filtered = mediaItems;
            break;
        }
        
        console.log('✅ getFilteredMedia completed:', {
          filterType,
          inputCount: mediaItems.length,
          outputCount: filtered.length
        });
        
      } catch (switchError) {
        console.error('❌ ERROR in filter switch statement:', switchError);
        console.error('❌ Switch Error Stack:', switchError.stack);
        throw switchError;
      }
      
      return filtered;
      
    } catch (error) {
      console.error('❌❌❌ CRITICAL ERROR IN getFilteredMedia ❌❌❌');
      console.error('❌ Error Message:', error.message);
      console.error('❌ Error Stack:', error.stack);
      console.error('❌ Filter Type:', filterType);
      console.error('❌ Media Items:', mediaItems);
      throw error;
    }
  }, []);

  // Load more gallery images (pagination)
  const loadMoreGalleryImages = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMoreRef.current || !CameraRoll) {
      return;
    }

    isLoadingMoreRef.current = true;
    try {
      const result = await CameraRoll.getPhotos({
        first: 60,
        after: lastCursorRef.current,
        assetType: 'All',
        groupTypes: 'All',
      });

      const edges = result.edges || [];
      const pageInfo = result.page_info || {};

      if (edges.length === 0) {
        hasMoreRef.current = false;
        return;
      }

      // Update cursor for next page
      lastCursorRef.current = pageInfo.end_cursor || null;
      hasMoreRef.current = pageInfo.has_next_page !== false;

      // Process new items
      const newItems = edges.map((edge, index) => {
        const node = edge.node;
        
        // Enhanced video detection - check multiple sources
        const hasVideoType = node.type === 'video' || node.mediaType === 'video';
        const hasVideoObject = node.video && typeof node.video === 'object' && node.video.uri;
        const hasPlayableDuration = node.playableDuration !== undefined && node.playableDuration !== null;
        const uriIsVideo = node.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(node.uri);
        const imageUriIsVideo = node.image?.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(node.image.uri);
        
        const isVideo = hasVideoType || hasVideoObject || hasPlayableDuration || uriIsVideo || imageUriIsVideo;
        
        // Debug: Log video detection for first video found
        if (isVideo && newItems.filter(item => item.isVideo).length === 0) {
          console.log('🎥 First video detected in loadMore:', {
            index,
            type: node.type,
            mediaType: node.mediaType,
            hasVideoObject,
            hasPlayableDuration,
            uriIsVideo,
            imageUriIsVideo,
            nodeUri: node.uri?.substring(0, 60),
            imageUri: node.image?.uri?.substring(0, 60)
          });
        }
        
        let mediaUri = '';
        let thumbnailUri = '';
        
        if (isVideo) {
          // CRITICAL: For videos, prioritize actual video file URI
          // Try multiple sources to find the actual video file (not thumbnail)
          const videoUriCandidate = node.video?.uri || node.uri || '';
          const imageUriCandidate = node.image?.uri || '';
          
          // Check which URI is actually a video file (has video extension)
          const videoUriIsVideo = videoUriCandidate && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(videoUriCandidate);
          const imageUriIsVideo = imageUriCandidate && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(imageUriCandidate);
          
          // Use the URI that is actually a video file
          if (videoUriIsVideo) {
            mediaUri = videoUriCandidate;
            thumbnailUri = imageUriCandidate && !imageUriIsVideo ? imageUriCandidate : mediaUri;
          } else if (imageUriIsVideo) {
            // If imageUri is actually a video, use it
            mediaUri = imageUriCandidate;
            thumbnailUri = mediaUri; // No separate thumbnail
          } else {
            // Fallback: use videoUri if available, otherwise node.uri
            mediaUri = videoUriCandidate || node.uri || '';
            thumbnailUri = imageUriCandidate || mediaUri;
          }
        } else {
          mediaUri = node.image?.uri || node.uri || '';
          thumbnailUri = mediaUri;
        }

        // Format URIs
        if (mediaUri && !mediaUri.startsWith('file://') && !mediaUri.startsWith('content://') && 
            !mediaUri.startsWith('http') && !mediaUri.startsWith('ph://')) {
          mediaUri = mediaUri.startsWith('/') ? `file://${mediaUri}` : `content://${mediaUri}`;
        }
        if (thumbnailUri && !thumbnailUri.startsWith('file://') && !thumbnailUri.startsWith('content://') && 
            !thumbnailUri.startsWith('http') && !thumbnailUri.startsWith('ph://')) {
          thumbnailUri = thumbnailUri.startsWith('/') ? `file://${thumbnailUri}` : thumbnailUri;
        }

        const duration = isVideo ? (node.video?.duration || node.playableDuration || node.duration || null) : null;
        
        // Normalize timestamp using utility function
        const finalTimestamp = normalizeTimestamp(node.timestamp || node.creationTime || node.modificationTime || node.image?.timestamp);

        const mediaItem = {
          id: mediaUri || `cameraroll_${index}_${finalTimestamp}`,
          uri: mediaUri,
          thumbnailUri: thumbnailUri,
          type: isVideo ? 'video' : 'image',
          isVideo: isVideo ? true : false, // Explicitly set to boolean true/false
          duration: duration && duration > 10000 ? duration / 1000 : duration,
          created: finalTimestamp, // Use validated timestamp
          fileName: node.image?.filename || node.filename,
          source: 'cameraroll',
        };
        
        // For videos, ensure videoUri is set to real video file path
        if (isVideo) {
          // CRITICAL: Ensure videoUri is always set to the actual video file URI (never thumbnail)
          // Verify mediaUri is actually a video file (has video extension)
          const mediaUriIsVideo = mediaUri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(mediaUri);
          
          if (mediaUriIsVideo) {
            // mediaUri is confirmed to be a video file
            mediaItem.videoUri = mediaUri;
          } else {
            // mediaUri might be a thumbnail - try to find actual video URI
            // Check if node.video.uri exists and is different
            const actualVideoUri = node.video?.uri;
            if (actualVideoUri && actualVideoUri !== mediaUri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(actualVideoUri)) {
              mediaItem.videoUri = actualVideoUri;
              // Update mediaUri to actual video
              mediaItem.uri = actualVideoUri;
            } else {
              // Fallback: use mediaUri even if extension check failed
              mediaItem.videoUri = mediaUri;
            }
          }
          
          mediaItem.isVideo = true; // Explicitly set to true for videos
          mediaItem.type = 'video'; // Explicitly set type
          
          // Ensure thumbnailUri is different from videoUri
          // If thumbnailUri is the same as videoUri, it means no thumbnail was created
          if (!mediaItem.thumbnailUri || mediaItem.thumbnailUri === mediaItem.videoUri) {
            // Try to use node.image.uri as thumbnail if it's different
            const imageUri = node.image?.uri;
            if (imageUri && imageUri !== mediaItem.videoUri && !/\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(imageUri)) {
              mediaItem.thumbnailUri = imageUri;
            } else {
              mediaItem.thumbnailUri = mediaItem.videoUri; // Fallback to video URI if no thumbnail
            }
          }
          
          // Debug logging for videos
          console.log('🎥 Video detected (loadMore):', {
            index,
            uri: mediaUri?.substring(0, 80),
            videoUri: mediaItem.videoUri?.substring(0, 80),
            thumbnailUri: mediaItem.thumbnailUri?.substring(0, 80),
            duration,
            fileName: mediaItem.fileName,
            nodeVideoUri: node.video?.uri?.substring(0, 60),
            nodeImageUri: node.image?.uri?.substring(0, 60)
          });
        } else {
          mediaItem.isVideo = false; // Explicitly set to false for images
          mediaItem.type = 'image'; // Explicitly set type
          // Ensure images don't have videoUri
          mediaItem.videoUri = undefined;
        }
        
        return mediaItem;
      });

      // Get current media and deduplicate
      const currentMedia = allMedia && Array.isArray(allMedia) ? allMedia : [];
      const mediaMap = createMediaMap([...currentMedia, ...newItems]);
      const deduplicatedMedia = Array.from(mediaMap.values());

      // Sort once by created timestamp (newest first) using normalizeTimestamp
      deduplicatedMedia.sort((a, b) => normalizeTimestamp(b.created) - normalizeTimestamp(a.created));

      // Sanitize media items before dispatching to Redux
      const sanitizedMedia = deduplicatedMedia.map(item => sanitizeMediaItem(item)).filter(Boolean);

      // Update Redux
      dispatch(setAllMedia(sanitizedMedia));
      
      const currentFilter = selectedFilter || 'Recents';
      const filteredItems = getFilteredMedia(sanitizedMedia, currentFilter);
      const sanitizedFilteredItems = filteredItems.map(item => sanitizeMediaItem(item)).filter(Boolean);
      const updatedGallery = [
        { id: 'camera', isAddButton: true },
        ...sanitizedFilteredItems,
      ];
      dispatch(setGalleryMedia(updatedGallery));
    } catch (error) {
      console.warn('Error loading more gallery images:', error);
      hasMoreRef.current = false;
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [allMedia, selectedFilter, getFilteredMedia, dispatch]);

  // Load initial gallery images from device - CameraRoll only with pagination
  const loadGalleryImages = useCallback(async () => {
    // Wrap in InteractionManager for instant UI render
    InteractionManager.runAfterInteractions(() => {
      (async () => {
        dispatch(setLoading(true));
        try {
          // Check permissions first
          let permissionGranted = await checkStoragePermission();
          
          if (!permissionGranted) {
            permissionGranted = await requestStoragePermission();
          }

          if (!permissionGranted) {
            dispatch(setPermission(false));
            dispatch(setGalleryMedia([{ id: 'camera', isAddButton: true }]));
            dispatch(setLoading(false));
            return;
          }

          dispatch(setPermission(true));

          // Start with CameraRoll only - load initial batch
          if (!CameraRoll || typeof CameraRoll.getPhotos !== 'function') {
            dispatch(setGalleryMedia([{ id: 'camera', isAddButton: true }]));
            dispatch(setLoading(false));
            return;
          }

          // Reset pagination state
          lastCursorRef.current = null;
          hasMoreRef.current = true;
          isLoadingMoreRef.current = false;

          const result = await CameraRoll.getPhotos({
            first: 60,
            assetType: 'All',
            groupTypes: 'All',
          });

          const edges = result.edges || [];
          const pageInfo = result.page_info || {};

          // Debug: Log raw CameraRoll response - DETAILED
          const videoNodes = edges.filter(edge => 
            edge.node?.type === 'video' || 
            edge.node?.mediaType === 'video' || 
            edge.node?.video || 
            edge.node?.playableDuration !== undefined
          );
          
          // Log ALL nodes to see their structure
          console.log('📸 CameraRoll response - ALL NODES:', {
            totalEdges: edges.length,
            videoNodesFound: videoNodes.length,
            sampleNodes: edges.slice(0, 5).map((edge, idx) => {
              const node = edge.node;
              return {
                index: idx,
                type: node?.type,
                mediaType: node?.mediaType,
                hasVideo: !!node?.video,
                hasImage: !!node?.image,
                videoUri: node?.video?.uri?.substring(0, 50),
                imageUri: node?.image?.uri?.substring(0, 50),
                nodeUri: node?.uri?.substring(0, 50),
                playableDuration: node?.playableDuration,
                filename: node?.image?.filename || node?.filename,
                // Check URI extensions
                uriIsVideo: node?.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(node.uri),
                imageUriIsVideo: node?.image?.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(node.image.uri),
              };
            })
          });
          
          if (videoNodes.length > 0) {
            console.log('🎥 FIRST VIDEO NODE DETAILS:', JSON.stringify({
              type: videoNodes[0].node?.type,
              mediaType: videoNodes[0].node?.mediaType,
              video: videoNodes[0].node?.video,
              image: videoNodes[0].node?.image,
              uri: videoNodes[0].node?.uri,
              playableDuration: videoNodes[0].node?.playableDuration,
              timestamp: videoNodes[0].node?.timestamp,
            }, null, 2));
          }

          // Update cursor for next page
          lastCursorRef.current = pageInfo.end_cursor || null;
          hasMoreRef.current = pageInfo.has_next_page !== false;

          // Process items - use thumbnailUri for videos
          const mediaItems = edges.map((edge, index) => {
            const node = edge.node;
            
            // ENHANCED video detection - check ALL possible sources
            const hasVideoType = node.type === 'video' || node.mediaType === 'video';
            const hasVideoObject = node.video && (typeof node.video === 'object' || typeof node.video === 'string');
            const hasVideoUri = node.video?.uri || (typeof node.video === 'string' ? node.video : null);
            const hasPlayableDuration = node.playableDuration !== undefined && node.playableDuration !== null && node.playableDuration > 0;
            const uriIsVideo = (node.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(node.uri)) || false;
            const imageUriIsVideo = (node.image?.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(node.image.uri)) || false;
            const filenameIsVideo = ((node.image?.filename || node.filename) && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(node.image?.filename || node.filename)) || false;
            
            // If ANY indicator says video, it's a video
            const isVideo = hasVideoType || hasVideoObject || hasVideoUri || hasPlayableDuration || uriIsVideo || imageUriIsVideo || filenameIsVideo;
            
            // Debug: Log ALL items for first batch to see what we're getting
            if (index < 10) {
              const rawTimestamp = node.timestamp;
              const timestampDate = rawTimestamp ? new Date(rawTimestamp < 10000000000 ? rawTimestamp * 1000 : rawTimestamp).toISOString() : 'N/A';
              console.log(`🔍 Item ${index} detection:`, {
                type: node.type,
                mediaType: node.mediaType,
                hasVideoType,
                hasVideoObject,
                hasVideoUri: !!hasVideoUri,
                hasPlayableDuration,
                uriIsVideo,
                imageUriIsVideo,
                filenameIsVideo,
                finalIsVideo: isVideo,
                nodeUri: node.uri?.substring(0, 60),
                imageUri: node.image?.uri?.substring(0, 60),
                videoObj: node.video,
                filename: node.image?.filename || node.filename,
                rawTimestamp: rawTimestamp,
                timestampDate: timestampDate,
                // Check for other timestamp fields
                timestampFields: {
                  timestamp: node.timestamp,
                  creationTime: node.creationTime,
                  modificationTime: node.modificationTime,
                  group_name: node.group_name,
                }
              });
            }
            
            let mediaUri = '';
            let thumbnailUri = '';
            
            if (isVideo) {
              // CRITICAL: For videos, prioritize actual video file URI
              // Try multiple sources to find the actual video file (not thumbnail)
              const videoUriCandidate = node.video?.uri || node.uri || '';
              const imageUriCandidate = node.image?.uri || '';
              
              // Check which URI is actually a video file (has video extension)
              const videoUriIsVideo = videoUriCandidate && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(videoUriCandidate);
              const imageUriIsVideo = imageUriCandidate && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(imageUriCandidate);
              
              // Use the URI that is actually a video file
              if (videoUriIsVideo) {
                mediaUri = videoUriCandidate;
                thumbnailUri = imageUriCandidate && !imageUriIsVideo ? imageUriCandidate : mediaUri;
              } else if (imageUriIsVideo) {
                // If imageUri is actually a video, use it
                mediaUri = imageUriCandidate;
                thumbnailUri = mediaUri; // No separate thumbnail
              } else {
                // Fallback: use videoUri if available, otherwise node.uri
                mediaUri = videoUriCandidate || node.uri || '';
                thumbnailUri = imageUriCandidate || mediaUri;
              }
            } else {
              mediaUri = node.image?.uri || node.uri || '';
              thumbnailUri = mediaUri;
            }

            // Format URIs
            if (mediaUri && !mediaUri.startsWith('file://') && !mediaUri.startsWith('content://') && 
                !mediaUri.startsWith('http') && !mediaUri.startsWith('ph://')) {
              mediaUri = mediaUri.startsWith('/') ? `file://${mediaUri}` : `content://${mediaUri}`;
            }
            if (thumbnailUri && !thumbnailUri.startsWith('file://') && !thumbnailUri.startsWith('content://') && 
                !thumbnailUri.startsWith('http') && !thumbnailUri.startsWith('ph://')) {
              thumbnailUri = thumbnailUri.startsWith('/') ? `file://${thumbnailUri}` : thumbnailUri;
            }

            const duration = isVideo ? (node.video?.duration || node.playableDuration || node.duration || null) : null;
            
            // Normalize timestamp using utility function
            const finalTimestamp = normalizeTimestamp(node.timestamp || node.creationTime || node.modificationTime || node.image?.timestamp);

            const mediaItem = {
              id: mediaUri || `cameraroll_${index}_${finalTimestamp}`,
              uri: mediaUri,
              thumbnailUri: thumbnailUri,
              type: isVideo ? 'video' : 'image',
              isVideo: isVideo ? true : false, // Explicitly set to boolean true/false
              duration: duration && duration > 10000 ? duration / 1000 : duration,
              created: finalTimestamp, // Use validated timestamp
              fileName: node.image?.filename || node.filename,
              source: 'cameraroll',
            };
            
            // For videos, ensure videoUri is set to real video file path
            if (isVideo) {
              // CRITICAL: Ensure videoUri is always set to the actual video file URI (never thumbnail)
              // Verify mediaUri is actually a video file (has video extension)
              const mediaUriIsVideo = mediaUri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(mediaUri);
              
              if (mediaUriIsVideo) {
                // mediaUri is confirmed to be a video file
                mediaItem.videoUri = mediaUri;
              } else {
                // mediaUri might be a thumbnail - try to find actual video URI
                // Check if node.video.uri exists and is different
                const actualVideoUri = node.video?.uri;
                if (actualVideoUri && actualVideoUri !== mediaUri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(actualVideoUri)) {
                  mediaItem.videoUri = actualVideoUri;
                  // Update mediaUri to actual video
                  mediaItem.uri = actualVideoUri;
                } else {
                  // Fallback: use mediaUri even if extension check failed
                  mediaItem.videoUri = mediaUri;
                }
              }
              
              mediaItem.isVideo = true; // Explicitly set to true for videos
              mediaItem.type = 'video'; // Explicitly set type
              
              // Ensure thumbnailUri is different from videoUri
              // If thumbnailUri is the same as videoUri, it means no thumbnail was created
              if (!mediaItem.thumbnailUri || mediaItem.thumbnailUri === mediaItem.videoUri) {
                // Try to use node.image.uri as thumbnail if it's different
                const imageUri = node.image?.uri;
                if (imageUri && imageUri !== mediaItem.videoUri && !/\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(imageUri)) {
                  mediaItem.thumbnailUri = imageUri;
                } else {
                  mediaItem.thumbnailUri = mediaItem.videoUri; // Fallback to video URI if no thumbnail
                }
              }
              
              // Debug logging for videos
              console.log('🎥 Video detected:', {
                index,
                uri: mediaUri?.substring(0, 80),
                videoUri: mediaItem.videoUri?.substring(0, 80),
                thumbnailUri: mediaItem.thumbnailUri?.substring(0, 80),
                duration,
                fileName: mediaItem.fileName,
                nodeVideoUri: node.video?.uri?.substring(0, 60),
                nodeImageUri: node.image?.uri?.substring(0, 60)
              });
            } else {
              mediaItem.isVideo = false; // Explicitly set to false for images
              mediaItem.type = 'image'; // Explicitly set type
              // Ensure images don't have videoUri
              mediaItem.videoUri = undefined;
            }
            
            return mediaItem;
          });

          // Debug: Check videos before deduplication - DETAILED
          const videosBeforeDedup = mediaItems.filter(item => item.isVideo === true);
          console.log('🎥 Videos before deduplication:', videosBeforeDedup.length);
          
          if (videosBeforeDedup.length === 0 && mediaItems.length > 0) {
            // No videos detected - let's check what we got
            console.warn('⚠️ NO VIDEOS DETECTED! Checking first 5 items:', mediaItems.slice(0, 5).map(item => ({
              id: item.id,
              uri: item.uri?.substring(0, 60),
              fileName: item.fileName,
              type: item.type,
              isVideo: item.isVideo,
              uriIsVideo: item.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.uri),
              fileNameIsVideo: item.fileName && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.fileName),
            })));
          }

          // Simple deduplication using Map
          const mediaMap = createMediaMap(mediaItems);
          const deduplicatedMedia = Array.from(mediaMap.values());
          
          // Debug: Check videos after deduplication
          const videosAfterDedup = deduplicatedMedia.filter(item => item.isVideo === true);
          console.log('🎥 Videos after deduplication:', videosAfterDedup.length);
          
          if (videosBeforeDedup.length > videosAfterDedup.length) {
            console.warn('⚠️ WARNING: Videos lost during deduplication!', {
              before: videosBeforeDedup.length,
              after: videosAfterDedup.length,
              lost: videosBeforeDedup.length - videosAfterDedup.length
            });
          }

          // Filter invalid items
          const validMedia = deduplicatedMedia.filter(item => {
            if (!item.uri || item.uri.trim().length === 0) return false;
            const uri = item.uri.toLowerCase();
            if (uri.includes('.trashed') || uri.includes('/.thumbnails') || 
                uri.includes('trashed-') || item.fileName?.startsWith('.trashed') ||
                item.fileName?.startsWith('.')) {
              return false;
            }
            return true;
          });
          
          // Debug: Check videos after validMedia filter
          const videosAfterValid = validMedia.filter(item => item.isVideo === true).length;
          if (videosAfterDedup.length > videosAfterValid) {
            console.warn('⚠️ WARNING: Videos lost during validMedia filter!', {
              before: videosAfterDedup.length,
              after: videosAfterValid,
              lost: videosAfterDedup.length - videosAfterValid
            });
          }

          // CRITICAL: Sort CameraRoll items by created timestamp (newest first) BEFORE merging
          // This ensures we have the latest items from CameraRoll first
          validMedia.sort((a, b) => normalizeTimestamp(b.created) - normalizeTimestamp(a.created));
          
          // Debug: Log sorted CameraRoll sample with full details
          const sortedCameraRollSample = validMedia.slice(0, 5).map((item, idx) => ({
            index: idx,
            fileName: item.fileName,
            created: item.created,
            createdDate: new Date(item.created).toISOString(),
            isVideo: item.isVideo,
            source: item.source
          }));
          console.log('📊 CameraRoll items after sorting (first 5):', sortedCameraRollSample);

          // Fetch device media from MediaStoreService (already sorted newest first)
          const deviceMedia = await MediaStoreService.fetchGalleryImages({ limit: 500 });
          
          // Debug: Count videos before merging and log sample timestamps
          const cameraRollVideos = validMedia.filter(item => item.isVideo === true).length;
          const deviceMediaVideos = deviceMedia.filter(item => item.isVideo === true).length;
          
          // Debug: Log sample timestamps to see what we're getting
          const sampleCameraRoll = validMedia.slice(0, 3).map(item => ({
            fileName: item.fileName,
            created: item.created,
            createdDate: new Date(item.created).toISOString(),
            isVideo: item.isVideo
          }));
          const sampleDeviceMedia = deviceMedia.slice(0, 3).map(item => ({
            fileName: item.fileName,
            created: item.created,
            createdDate: new Date(item.created).toISOString(),
            isVideo: item.isVideo
          }));
          
          console.log('📊 Before merging:', {
            cameraRoll: { total: validMedia.length, videos: cameraRollVideos, sample: sampleCameraRoll },
            deviceMedia: { total: deviceMedia.length, videos: deviceMediaVideos, sample: sampleDeviceMedia }
          });
          
          // Merge both lists into one
          const mergedMap = createMediaMap([...validMedia, ...deviceMedia]);
          const mergedMedia = Array.from(mergedMap.values());
          
          // CRITICAL: Sort mergedMedia by created timestamp (newest first) using normalizeTimestamp
          mergedMedia.sort((a, b) => normalizeTimestamp(b.created) - normalizeTimestamp(a.created));
          
          // Debug: Log sorted sample to verify sorting worked with dates
          const sortedSample = mergedMedia.slice(0, 10).map((item, idx) => ({
            position: idx + 1,
            fileName: item.fileName,
            created: item.created,
            createdDate: new Date(item.created).toISOString(),
            isVideo: item.isVideo,
            source: item.source,
            timeAgo: Math.round((Date.now() - item.created) / (1000 * 60 * 60)) + ' hours ago'
          }));
          console.log('📊 After sorting merged media (first 10 - NEWEST FIRST):', sortedSample);
          
          // Verify sorting is correct - first item should be newest
          if (mergedMedia.length > 1) {
            const firstTime = mergedMedia[0].created;
            const secondTime = mergedMedia[1].created;
            if (firstTime < secondTime) {
              console.error('❌ SORTING ERROR: First item is OLDER than second item!', {
                first: { fileName: mergedMedia[0].fileName, time: new Date(firstTime).toISOString() },
                second: { fileName: mergedMedia[1].fileName, time: new Date(secondTime).toISOString() }
              });
            } else {
              console.log('✅ Sorting verified: First item is newer than second item');
            }
          }
          
          // Debug: Count videos in mergedMedia
          const videoCount = mergedMedia.filter(item => item.isVideo === true).length;
          const expectedVideos = cameraRollVideos + deviceMediaVideos;
          console.log('📊 Gallery loaded (merged):', {
            cameraRoll: validMedia.length,
            deviceMedia: deviceMedia.length,
            total: mergedMedia.length,
            videos: videoCount,
            expectedVideos,
            images: mergedMedia.length - videoCount
          });
          
          // Warn if videos were lost during merging
          if (expectedVideos > videoCount) {
            console.warn('⚠️ WARNING: Videos lost during merging!', {
              expected: expectedVideos,
              actual: videoCount,
              lost: expectedVideos - videoCount
            });
            
            // Debug: Show sample videos that might have been lost
            const allVideos = [...validMedia, ...deviceMedia].filter(item => item.isVideo === true);
            const mergedVideos = mergedMedia.filter(item => item.isVideo === true);
            const lostVideos = allVideos.filter(video => 
              !mergedVideos.some(merged => merged.uri === video.uri || merged.id === video.id)
            );
            if (lostVideos.length > 0) {
              console.warn('⚠️ Lost videos sample:', lostVideos.slice(0, 3).map(v => ({
                id: v.id,
                uri: v.uri?.substring(0, 60),
                fileName: v.fileName
              })));
            }
          }
          
          // Sanitize all media items before dispatching to Redux
          const sanitizedMedia = mergedMedia.map(item => sanitizeMediaItem(item)).filter(Boolean);
          
          // Update allMedia in Redux
          dispatch(setAllMedia(sanitizedMedia));
          
          // Get current filter and apply it
          const currentFilter = selectedFilter || 'Recents';
          const filteredItems = getFilteredMedia(sanitizedMedia, currentFilter);
          
          // Sanitize filtered items before dispatching
          const sanitizedFilteredItems = filteredItems.map(item => sanitizeMediaItem(item)).filter(Boolean);
          
          // Debug: Count videos in filteredItems
          const filteredVideoCount = sanitizedFilteredItems.filter(item => item.isVideo === true).length;
          console.log('📊 After filter:', {
            filter: currentFilter,
            total: sanitizedFilteredItems.length,
            videos: filteredVideoCount,
            images: sanitizedFilteredItems.length - filteredVideoCount
          });
          
          dispatch(setGalleryMedia([{ id: 'camera', isAddButton: true }, ...sanitizedFilteredItems]));
        } catch (error) {
          dispatch(setError(error.message));
          dispatch(setGalleryMedia([{ id: 'camera', isAddButton: true }]));
          
          if (error?.message?.includes('RNCCameraRoll') || error?.message?.includes('TurboModule')) {
            Alert.alert(
              'Native Module Error',
              'CameraRoll module is not linked. Please rebuild the app.',
              [{ text: 'OK' }]
            );
          }
        } finally {
          dispatch(setLoading(false));
        }
      })();
    });
  }, [dispatch, checkStoragePermission, requestStoragePermission, selectedFilter, getFilteredMedia]);

  // Handle filter selection - FIXED: Direct synchronous update
  const handleFilterSelect = useCallback((filterType) => {
    console.log('═══════════════════════════════════════');
    console.log('🔍 FILTER SELECTION - STARTING');
    console.log('🔍 Filter Type:', filterType);
    console.log('🔍 All Media Count:', allMedia?.length || 0);
    
    // STEP 1: Update local state for instant text change
    setLocalSelectedFilter(filterType);
    setShowRecentsDropdown(false);
    
    // STEP 2: Update Redux filter state
    dispatch(setSelectedFilter(filterType));
    
    // STEP 3: Get media and filter it
    const currentMedia = allMedia && Array.isArray(allMedia) ? allMedia : [];
    
    if (currentMedia.length === 0) {
      console.log('⚠️ No media loaded - setting empty gallery');
      dispatch(setGalleryMedia([{ id: 'camera', isAddButton: true }]));
      return;
    }
    
    // STEP 4: Apply filter
    let filtered = [];
    try {
      filtered = getFilteredMedia(currentMedia, filterType);
      console.log('✅ Filter applied:', {
        input: currentMedia.length,
        output: filtered.length,
        type: filterType
      });
    } catch (error) {
      console.error('❌ Filter error:', error);
      return;
    }
    
    // STEP 5: Update gallery with filtered results
    const filteredGallery = [
      { id: 'camera', isAddButton: true },
      ...filtered,
    ];
    
    // CRITICAL: Final normalization - ensure ALL videos are properly marked and sanitized before dispatch
    const normalizedFilteredGallery = filteredGallery.map(item => {
      if (item.isAddButton) return item;
      
      // Re-detect video using all possible indicators
      const hasVideoFlag = item.isVideo === true || item.type === 'video';
      const uriIsVideo = item.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.uri);
      const fileNameIsVideo = item.fileName && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.fileName);
      const hasVideoUri = !!item.videoUri;
      // Only use thumbnail difference if other indicators also suggest video
      const thumbnailDifferent = item.thumbnailUri && item.thumbnailUri !== item.uri && 
                                 (hasVideoFlag || uriIsVideo || fileNameIsVideo || hasVideoUri);
      
      const isVideo = hasVideoFlag || uriIsVideo || fileNameIsVideo || hasVideoUri || thumbnailDifferent;
      
      let normalizedItem = item;
      if (isVideo) {
        // Ensure video is properly marked with videoUri
        normalizedItem = {
          ...item,
          isVideo: true,
          type: 'video',
          // CRITICAL: Ensure videoUri is set - use existing videoUri or uri
          videoUri: item.videoUri || item.uri,
          // Ensure thumbnailUri is set (use existing or videoUri)
          thumbnailUri: item.thumbnailUri || item.videoUri || item.uri,
        };
      }
      
      // Sanitize item before returning
      return sanitizeMediaItem(normalizedItem);
    }).filter(Boolean);
    
    console.log('✅ Updating gallery with', normalizedFilteredGallery.length, 'items');
    
    // CRITICAL: Update Redux gallery state
    dispatch(setGalleryMedia(normalizedFilteredGallery));
    
    console.log('✅✅✅ FILTER COMPLETE - Gallery should update now');
    console.log('═══════════════════════════════════════');
  }, [dispatch, allMedia, getFilteredMedia]);

  // DISABLED: useEffect filter sync - handleFilterSelect now handles everything instantly
  // This was causing conflicts - filter is now handled directly in handleFilterSelect
  // useEffect(() => {
  //   // Filter sync disabled - handled by handleFilterSelect for instant response
  // }, [selectedFilter, allMedia?.length]);

  // Load gallery on initial mount
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      loadGalleryImages();
    }
  }, [loadGalleryImages]);

  // Reload gallery when screen comes into focus (but not on initial mount)
  useFocusEffect(
    useCallback(() => {
      if (!isFirstMount.current) {
        loadGalleryImages();
      }
    }, [loadGalleryImages])
  );

  const getScreenTitle = () => {
    switch (selectedTab) {
      case 'STORY':
        return 'New story';
      case 'REEL':
        return 'New reel';
      default:
        return 'New post';
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    // Check if there are multiple selected images
    const hasMultipleSelections = selectedImageIds && selectedImageIds.length > 0;
    
    if (hasMultipleSelections) {
      // Get the actual media items from galleryMedia using selected IDs
      const selectedMediaItems = galleryMedia.filter(item => 
        !item.isAddButton && selectedImageIds.includes(item.id)
      );
      
      if (selectedMediaItems.length === 0) {
        Alert.alert('No Selection', 'Please select at least one image or video.');
        return;
      }
      
      // Navigate with multiple media items
      navigation.navigate('CropFilter', {
        mediaItems: selectedMediaItems,
        isMultiple: true,
      });
      
      console.log('📸 Navigating with multiple items:', selectedMediaItems.length);
    } else if (selectedPreviewItem) {
      // Navigate with single preview item
      navigation.navigate('CropFilter', {
        mediaItems: [selectedPreviewItem],
        isMultiple: false,
        imageUri: selectedPreviewItem.uri, // Keep for backward compatibility
      });
      
      console.log('📸 Navigating with single item:', selectedPreviewItem.uri);
    } else {
      Alert.alert('No Selection', 'Please select an image or video to continue.');
    }
  };

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  // Handle long press to enable multi-select mode and select item
  const handleImageLongPress = (item) => {
    if (item.isAddButton || item.isVideo === true) {
      return;
    }

    // Enable multi-select mode if not already enabled
    if (!isMultiSelect) {
      setIsMultiSelect(true);
    }

    // Select the item using Redux
    if (!selectedImageIds.includes(item.id)) {
      dispatch(addSelectedImageId(item.id));
    }
  };

  // Handle image press
  // Handle camera button press - open camera with permission check
  const handleCameraPress = useCallback(async () => {
    // Check and request camera permission
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to take photos and videos. Please enable camera permission in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
      return;
    }

    // Open camera with options
    const options = {
      mediaType: 'mixed', // Allow both photo and video
      includeBase64: false,
      quality: 0.8,
      videoQuality: 'high',
      saveToPhotos: true, // Save captured media to gallery
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (response.errorCode) {
        console.error('Camera Error:', response.errorMessage);
        Alert.alert('Camera Error', response.errorMessage || 'Failed to open camera. Please try again.');
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const isVideo = asset.type?.includes('video') || asset.uri?.includes('.mp4') || asset.uri?.includes('.mov');
        
        // Create preview item from captured media
        const capturedItem = {
          id: `camera_${Date.now()}`,
          uri: asset.uri,
          thumbnailUri: isVideo ? asset.uri : asset.uri, // For videos, use same URI as thumbnail
          fileName: asset.fileName || (isVideo ? `camera_video_${Date.now()}.mp4` : `camera_photo_${Date.now()}.jpg`),
          type: isVideo ? 'video' : 'image',
          isVideo: isVideo,
          duration: asset.duration || null,
          created: asset.timestamp || Date.now(),
          size: asset.fileSize || null,
          source: 'camera',
        };

        // Set as preview item
        dispatch(setSelectedPreviewItem(capturedItem));
        
        console.log('📸 Camera media captured:', {
          type: isVideo ? 'video' : 'photo',
          uri: asset.uri,
        });
      }
    });
  }, [requestCameraPermission, dispatch]);

  const handleImagePress = (item) => {
    if (item.isAddButton) {
      // Handle camera press - open camera with permission check
      handleCameraPress();
      return;
    }

    // If multi-select mode is enabled, toggle selection
    if (isMultiSelect && item.isVideo !== true) {
      if (selectedImageIds.includes(item.id)) {
        dispatch(removeSelectedImageId(item.id));
      } else {
        dispatch(addSelectedImageId(item.id));
      }
      return;
    }

    // Normal mode - show preview using Redux
    // Ensure item has correct properties before dispatching
    // Use same priority-based detection as in final mapping
    const hasExplicitVideoFlag = item.isVideo === true || item.type === 'video';
    const uriIsVideo = item.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.uri);
    const fileNameIsVideo = item.fileName && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.fileName);
    
    // Use explicit flag first, then extension-based detection
    const isVideo = hasExplicitVideoFlag || uriIsVideo || fileNameIsVideo;
    
    // For videos, use videoUri if available, otherwise use uri
    let videoUri = item.videoUri || item.uri;
    if (isVideo) {
      // Ensure video URI is properly formatted
      if (videoUri && !videoUri.startsWith('file://') && !videoUri.startsWith('content://') && 
          !videoUri.startsWith('http') && !videoUri.startsWith('ph://')) {
        if (videoUri.startsWith('/')) {
          videoUri = `file://${videoUri}`;
        }
      }
    }
    
    const previewItem = {
      ...item,
      // Explicitly set isVideo
      isVideo: isVideo ? true : false,
      type: isVideo ? 'video' : (item.type || 'image'),
      // For videos, use videoUri || uri, otherwise use uri
      uri: isVideo ? (item.videoUri || item.uri) : item.uri,
      // CRITICAL: Ensure videoUri is set for videos
      videoUri: isVideo ? (item.videoUri || item.uri) : undefined,
      // Keep thumbnailUri for poster - use it if different from videoUri, otherwise use videoUri
      thumbnailUri: isVideo 
        ? (item.thumbnailUri && item.thumbnailUri !== item.videoUri && item.thumbnailUri !== item.uri 
          ? item.thumbnailUri 
          : (item.videoUri || item.uri))
        : item.thumbnailUri || item.uri,
    };
    
    console.log('📸 Setting preview item:', {
      id: previewItem.id,
      type: previewItem.type,
      isVideo: previewItem.isVideo,
      uri: previewItem.uri?.substring(0, 100),
      thumbnailUri: previewItem.thumbnailUri?.substring(0, 80),
      fileName: previewItem.fileName,
    });
    
    dispatch(setSelectedPreviewItem(previewItem));
  };

  // Clear selections when exiting multi-select mode
  const handleMultiSelectToggle = () => {
    setIsMultiSelect(!isMultiSelect);
    if (isMultiSelect) {
      // Exiting multi-select mode, clear selections
      dispatch(clearSelectedImageIds());
    }
  };


  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <CloseIcon width={24} height={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
  {/* Preview Section - Always visible when item is selected */}
  {selectedPreviewItem && (
        <View style={styles.previewContainer}>
          <TouchableOpacity
            style={styles.previewCloseButton}
            onPress={() => dispatch(clearSelectedPreviewItem())}
            activeOpacity={0.7}
          >
            <CloseIcon width={20} height={20} color="white" />
          </TouchableOpacity>
          
          {/* Explicitly check if it's a video */}
          {selectedPreviewItem.isVideo === true ? (
            (() => {
              // CRITICAL: Use videoUri if available, otherwise fall back to uri
              // videoUri should always point to the actual video file
              let videoUri = selectedPreviewItem.videoUri || selectedPreviewItem.uri;
              
              // CRITICAL: Verify videoUri is actually a video file (not a thumbnail)
              // If videoUri doesn't have a video extension, it might be a thumbnail
              const videoUriIsVideo = videoUri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(videoUri);
              const uriIsVideo = selectedPreviewItem.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(selectedPreviewItem.uri);
              
              // If videoUri is not a video file but uri is, use uri
              if (!videoUriIsVideo && uriIsVideo) {
                videoUri = selectedPreviewItem.uri;
                console.warn('⚠️ videoUri was not a video file, using uri instead:', {
                  videoUri: selectedPreviewItem.videoUri?.substring(0, 60),
                  uri: selectedPreviewItem.uri?.substring(0, 60)
                });
              }
              
              // Use thumbnailUri for poster if it's different from videoUri and not a video file
              let thumbnailUri = selectedPreviewItem.thumbnailUri;
              if (thumbnailUri && thumbnailUri === videoUri) {
                thumbnailUri = undefined; // Don't use same URI as poster
              } else if (thumbnailUri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(thumbnailUri)) {
                // If thumbnailUri is actually a video file, don't use it as poster
                thumbnailUri = undefined;
              }
              
              // Validate video URI
              if (!videoUri || videoUri.trim().length === 0) {
                console.error('❌ Invalid video URI in preview:', {
                  videoUri: selectedPreviewItem.videoUri,
                  uri: selectedPreviewItem.uri,
                  isVideo: selectedPreviewItem.isVideo,
                  type: selectedPreviewItem.type
                });
                return (
                  <View style={[styles.previewMedia, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }]}>
                    <Text style={{ color: 'white' }}>Invalid video URI</Text>
                  </View>
                );
              }
              
              console.log('🎥 Rendering Video component:', {
                videoUri: videoUri.substring(0, 100),
                uri: selectedPreviewItem.uri?.substring(0, 100),
                thumbnailUri: thumbnailUri?.substring(0, 80),
                isVideo: selectedPreviewItem.isVideo,
                type: selectedPreviewItem.type,
                hasVideoUri: !!selectedPreviewItem.videoUri,
                videoUriIsVideo: videoUriIsVideo,
                uriIsVideo: uriIsVideo
              });
              
              return (
                <Video
                  source={{ uri: videoUri }}
                  style={styles.previewMedia}
                  paused={false}
                  muted={true}
                  resizeMode="contain"
                  poster={thumbnailUri}
                  posterResizeMode="cover"
                  repeat={true}
                  playInBackground={false}
                  ignoreSilentSwitch="ignore"
                  controls={false}
                  onError={(error) => {
                    console.error('❌ Video playback error:', error);
                    console.error('❌ Video URI:', videoUri);
                    console.error('❌ Original URI:', selectedPreviewItem.uri);
                    console.error('❌ VideoUri property:', selectedPreviewItem.videoUri);
                    console.error('❌ Preview item type:', selectedPreviewItem.type, 'isVideo:', selectedPreviewItem.isVideo);
                    console.error('❌ Error details:', JSON.stringify(error.nativeEvent || error, null, 2));
                  }}
                  onLoadStart={() => {
                    console.log('🎥 Video load started:', videoUri?.substring(0, 100));
                  }}
                  onLoad={() => {
                    console.log('✅ Video loaded successfully');
                  }}
                  onBuffer={({ isBuffering }) => {
                    if (isBuffering) {
                      console.log('⏳ Video buffering...');
                    }
                  }}
                />
              );
            })()
          ) : (
            <Image
              source={{ uri: selectedPreviewItem.uri }}
              style={styles.previewMedia}
              resizeMode="contain"
              onError={(error) => {
                console.error('❌ Image load error:', error);
                console.error('❌ Image URI:', selectedPreviewItem.uri);
                console.error('❌ Preview item type:', selectedPreviewItem.type, 'isVideo:', selectedPreviewItem.isVideo);
              }}
              onLoadStart={() => {
                console.log('📸 Image load started:', selectedPreviewItem.uri?.substring(0, 100));
              }}
              onLoad={() => {
                console.log('✅ Image loaded successfully');
              }}
            />
          )}
          
          {/* Video duration overlay for videos */}
          {selectedPreviewItem.isVideo === true && selectedPreviewItem.duration && (
            <View style={styles.previewDurationBadge}>
              <Text style={styles.previewDurationText}>
                {formatDuration(selectedPreviewItem.duration)}
              </Text>
            </View>
          )}
        </View>
      )}
      {/* Gallery Controls */}
      <View style={styles.galleryControls}>
          <View style={styles.filterContainer}>
            <TouchableOpacity
            style={styles.recentsButton}
            onPress={() => setShowRecentsDropdown(!showRecentsDropdown)}
              activeOpacity={0.7}
            >
            <Text style={styles.recentsText}>{localSelectedFilter || selectedFilter || 'Recents'}</Text>
            <View style={{ marginLeft: 4 }}>
              <ChevronDownIcon width={16} height={16} color="white" />
            </View>
            </TouchableOpacity>

          {/* Dropdown Menu */}
          {showRecentsDropdown && (
            <View style={styles.dropdownMenu}>
                <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleFilterSelect('Recents')}
                activeOpacity={0.7}
              >
                <RecentsIcon width={20} height={20} color="white" />
                <Text style={styles.dropdownItemText}>Recents</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleFilterSelect('Photos')}
                activeOpacity={0.7}
              >
                <PhotosIcon width={20} height={20} color="white" />
                <Text style={styles.dropdownItemText}>Photos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleFilterSelect('Videos')}
                activeOpacity={0.7}
              >
                <VideosIcon width={20} height={20} color="white" />
                <Text style={styles.dropdownItemText}>Videos</Text>
                </TouchableOpacity>

           
              </View>
            )}
          </View>

          <TouchableOpacity
          style={styles.selectMultipleButton}
          onPress={handleMultiSelectToggle}
            activeOpacity={0.7}
          >
          <SelectMultipleIcon 
              width={18} 
              height={18} 
            color={isMultiSelect ? '#0095F6' : 'white'} 
          />
          <Text style={[
            styles.selectMultipleText,
            isMultiSelect && styles.selectMultipleTextActive
          ]}>
            SELECT MULTIPLE
          </Text>
          </TouchableOpacity>
        </View>

      {/* Image Grid */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0095F6" />
          <Text style={styles.loadingText}>Loading gallery...</Text>
        </View>
      ) : hasPermission === false ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Permission Required</Text>
          <Text style={styles.permissionText}>
            Please allow access to your photos to view and select images from your gallery.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
                const granted = await requestStoragePermission();
                if (granted) {
                loadGalleryImages();
              }
            }}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={galleryMedia}
          renderItem={({ item, index }) => {
            const isSelected = selectedImageIds.includes(item.id);
            
            // CRITICAL: Enhanced video detection - check ALL possible sources
            // This ensures videos are ALWAYS detected even if flags are missing
            const isVideoExplicit = item.isVideo === true || item.type === 'video';
            const uriIsVideo = item.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.uri);
            const fileNameIsVideo = item.fileName && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.fileName);
            const hasVideoUri = !!item.videoUri;
            const thumbnailUriIsVideo = item.thumbnailUri && item.thumbnailUri !== item.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.thumbnailUri);
            
            // If ANY indicator says it's a video, treat it as video
            const isVideo = isVideoExplicit || uriIsVideo || fileNameIsVideo || hasVideoUri || thumbnailUriIsVideo;
            
            // Debug: Log videos being rendered
            if (isVideo && index < 10 && !item.isAddButton) {
              console.log(`🎬 RENDERING VIDEO ${index}:`, {
                id: item.id,
                isVideo: item.isVideo,
                type: item.type,
                hasVideoUri,
                uriIsVideo,
                fileNameIsVideo,
                finalIsVideo: isVideo,
                uri: item.uri?.substring(0, 50),
                thumbnailUri: item.thumbnailUri?.substring(0, 50)
              });
            }
            
            const showCheckbox = isMultiSelect && !item.isAddButton && !isVideo;

            return (
              <TouchableOpacity
                style={[
                  styles.imageCard,
                  isSelected && styles.imageCardSelected
                ]}
                onPress={() => handleImagePress(item)}
                onLongPress={() => handleImageLongPress(item)}
                activeOpacity={0.8}
              >
                {item.isAddButton ? (
                  <View style={styles.cameraButton}>
                    <CameraIcon width={32} height={32} color="white" />
                  </View>
                ) : isVideo ? (
                  // Video thumbnail rendering - Use thumbnailUri for videos
                  <View style={styles.videoContainer}>
                    <Image
                      source={{ uri: item.thumbnailUri || item.uri }}
                      style={styles.image}
                      resizeMode="cover"
                      onError={(error) => {
                        const uri = (item.thumbnailUri || item.uri || '').toLowerCase();
                        if (!uri.includes('.trashed') && !uri.includes('trashed-')) {
                          console.warn(`⚠️ Video thumbnail load error for ${item.uri?.substring(0, 50)}:`, error);
                        }
                      }}
                    />
                    {/* Play icon overlay - ALWAYS show for videos */}
                    <View style={styles.videoPlayOverlay} pointerEvents="none">
                      <View style={styles.videoPlayButton}>
                        <PlayIcon width={24} height={24} color="white" />
                      </View>
                    </View>
                    {/* Duration badge */}
                    {item.duration && (
                      <View style={styles.videoDurationBadge}>
                        <Text style={styles.videoDurationText}>
                          {formatDuration(item.duration)}
                        </Text>
                      </View>
                    )}
                    {showCheckbox && (
                      <View style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected
                      ]}>
                        {isSelected && (
                          <CheckIcon width={14} height={14} color="white" />
                        )}
                      </View>
                    )}
                    {isSelected && (
                      <View style={styles.selectedOverlay} />
                    )}
                  </View>
                ) : (
                  // Image rendering
                  <>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    {showCheckbox && (
                      <View style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected
                      ]}>
                        {isSelected && (
                          <CheckIcon width={14} height={14} color="white" />
                        )}
                      </View>
                    )}
                    {isSelected && (
                      <View style={styles.selectedOverlay} />
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
          numColumns={3}
          initialNumToRender={25}
          windowSize={10}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          onEndReached={loadMoreGalleryImages}
          onEndReachedThreshold={0.5}
          style={[
            styles.flatList,
            selectedPreviewItem && styles.flatListWithPreview
          ]}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Tab Bar */}
      <LinearGradient
        colors={['rgba(1, 1, 13, 0)', 'rgba(1, 1, 13, 0.5)', '#01010D']}
        locations={[0, 0.2, 1]}
        style={[styles.bottomTabBar, { paddingBottom: insets.bottom }]}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'POST' && styles.tabButtonActive
          ]}
          onPress={() => handleTabPress('POST')}
          activeOpacity={0.7}
        >
          {selectedTab === 'POST' && (
            <View style={styles.tabBackgroundContainer}>
              <CenterTabBackground width={145} height={39} />
            </View>
          )}
          <Text
            style={[
              styles.tabText,
              selectedTab === 'POST' && styles.tabTextActive
            ]}
          >
            POST
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'STORY' && styles.tabButtonActive
          ]}
          onPress={() => handleTabPress('STORY')}
          activeOpacity={0.7}
        >
          {selectedTab === 'STORY' && (
            <View style={styles.tabBackgroundContainer}>
              <CenterTabBackground width={145} height={39} />
            </View>
          )}
          <Text
            style={[
              styles.tabText,
              selectedTab === 'STORY' && styles.tabTextActive
            ]}
          >
            STORY
          </Text>
        </TouchableOpacity>

      </LinearGradient>

      {/* Dropdown Overlay */}
      {showRecentsDropdown && (
        <Pressable
          style={styles.dropdownOverlay}
          onPress={() => setShowRecentsDropdown(false)}
        />
      )}
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  nextButtonText: {
    color: '#0095F6',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 100,
  },
  previewContainer: {
    height: Dimensions.get('window').height * 0.3,
    width: '100%',
    backgroundColor: '#000000',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewMedia: {
    width: '100%',
    height: '100%',
  },
  previewCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  previewDurationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  previewDurationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  flatList: {
    flex: 1,
  },
  flatListWithPreview: {
    height: Dimensions.get('window').height * 0.5,
  },
  flatListContent: {
    paddingBottom: 100,
  },
  filterContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  recentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 6,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
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
    zIndex: 1001,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 16,
  },
  selectMultipleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectMultipleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  selectMultipleTextActive: {
    color: '#0095F6',
  },
  imageCard: {
    width: imageWidth,
    height: imageWidth,
    backgroundColor: '#000000',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  imageCardSelected: {
    opacity: 0.7,
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  checkboxSelected: {
    backgroundColor: '#0095F6',
    borderColor: '#0095F6',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 149, 246, 0.2)',
    zIndex: 5,
  },
  cameraButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 10,
    elevation: 5, // Android elevation
  },
  videoPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
    elevation: 6, // Android elevation
  },
  videoDurationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 4,
  },
  videoDurationText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginHorizontal: 2,
    borderRadius: 8,
    position: 'relative',
    overflow: 'visible',
    minHeight: 39,
  },
  tabButtonActive: {
    // Background removed - using SVG instead
  },
  tabBackgroundContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12.5, // Half of SVG height (39/2)
    marginLeft: -72.5, // Half of SVG width (145/2)
    width: 145,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  tabTextActive: {
    color: 'white',
    fontWeight: '700',
    zIndex: 1,
  },
  dropdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
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
    backgroundColor: '#0095F6',
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
