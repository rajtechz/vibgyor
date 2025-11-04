import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import Video from 'react-native-video';
import CommonBackground from '../../../components/common/CommonBackground';
import MediaStoreService from '../../../services/MediaStoreService';
import { launchCamera } from 'react-native-image-picker';
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

// Normalize URI to extract file path for better deduplication
const normalizeUriPath = (uri) => {
  if (!uri) return '';
  
  // For content:// URIs, we can't extract file path, so return empty
  // We'll rely on filename + timestamp matching for those
  if (uri.startsWith('content://') || uri.startsWith('ph://')) {
    return '';
  }
  
  // Remove protocol prefixes and normalize
  let path = uri
    .replace(/^file:\/\//, '')
    .replace(/^https?:\/\//, '');
  
  return path.toLowerCase().trim();
};

// Extract filename from URI or item
const extractFilename = (uri, fileName) => {
  // Prefer explicit fileName property
  if (fileName) {
    // Remove path and get just the filename
    const cleanName = fileName.split('/').pop().split('\\').pop();
    return cleanName.toLowerCase().trim();
  }
  
  if (!uri) return '';
  
  // For content:// URIs, we can't extract filename from path
  if (uri.startsWith('content://') || uri.startsWith('ph://')) {
    return '';
  }
  
  // Extract filename from file path
  const path = normalizeUriPath(uri);
  if (!path) return '';
  
  const parts = path.split('/');
  const filename = parts[parts.length - 1] || '';
  // Remove query params if any
  return filename.split('?')[0].toLowerCase().trim();
};

// Enhanced deduplication - check if two items represent the same file
// AGGRESSIVE: Multiple checks to catch all duplicates
const isSameFile = (item1, item2) => {
  // 1. Direct URI match (exact same URI) - most reliable
  if (item1.uri && item2.uri && item1.uri === item2.uri) return true;
  
  // 2. Check if URIs point to same file path (normalized)
  const path1 = normalizeUriPath(item1.uri || '');
  const path2 = normalizeUriPath(item2.uri || '');
  
  if (path1 && path2 && path1 === path2 && path1.length > 0) {
    return true;
  }
  
  // 2b. Normalize paths more aggressively (handle different URI schemes)
  const normalizePath = (path) => {
    if (!path) return '';
    return path.toLowerCase()
      .replace(/^file:\/\//i, '')
      .replace(/^content:\/\//i, '')
      .replace(/^ph:\/\//i, '')
      .replace(/\\/g, '/')
      .trim();
  };
  
  const normPath1 = normalizePath(item1.uri);
  const normPath2 = normalizePath(item2.uri);
  
  if (normPath1 && normPath2 && normPath1 === normPath2 && normPath1.length > 5) {
    return true;
  }
  
  // 3. Check if one item's URI matches another item's thumbnail URI (or vice versa)
  // This prevents video thumbnails from appearing as separate photos
  const thumbPath1 = normalizeUriPath(item1.thumbnailUri || '');
  const thumbPath2 = normalizeUriPath(item2.thumbnailUri || '');
  
  // Check if item1's URI matches item2's thumbnail URI
  if (path1 && thumbPath2 && path1 === thumbPath2 && path1.length > 5) {
    // item1's URI is actually item2's thumbnail - they're duplicates
    return true;
  }
  
  // Check if item2's URI matches item1's thumbnail URI
  if (path2 && thumbPath1 && path2 === thumbPath1 && path2.length > 5) {
    // item2's URI is actually item1's thumbnail - they're duplicates
    return true;
  }
  
  // Check if thumbnail URIs match (but don't match video URI to thumbnail URI)
  if (thumbPath1 && thumbPath2 && thumbPath1 === thumbPath2 && thumbPath1.length > 0 && 
      thumbPath1 !== path1 && thumbPath2 !== path2) {
    return true;
  }
  
  // 4. Filename + size match (very reliable - same filename with same size = duplicate)
  const filename1 = extractFilename(item1.uri, item1.fileName);
  const filename2 = extractFilename(item2.uri, item2.fileName);
  
  if (filename1 && filename2 && filename1 === filename2 && filename1.length > 3) {
    // If both have size info and sizes match, it's the same file
    if (item1.size && item2.size && item1.size === item2.size) {
      return true;
    }
    
    // Fallback: filename + timestamp match (within 5 seconds for same filename)
    const timeDiff = Math.abs((item1.created || 0) - (item2.created || 0));
    if (timeDiff < 5000) {
      return true;
    }
  }
  
  // 5. Extract filename from URI path directly (more comprehensive)
  if (item1.uri && item2.uri) {
    const getFileNameFromUri = (uri) => {
      if (!uri) return null;
      const cleanUri = uri.split('?')[0].split('#')[0].toLowerCase();
      // Extract filename with extension
      const match = cleanUri.match(/([^/\\]+\.(jpg|jpeg|png|gif|bmp|webp|heic|heif|mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime))$/i);
      return match ? match[1].toLowerCase() : null;
    };
    
    const uriFileName1 = getFileNameFromUri(item1.uri);
    const uriFileName2 = getFileNameFromUri(item2.uri);
    
    if (uriFileName1 && uriFileName2 && uriFileName1 === uriFileName2) {
      // If sizes match, definitely the same file
      if (item1.size && item2.size && item1.size === item2.size) {
        return true;
      }
      
      // Otherwise check timestamp (within 5 seconds for same filename)
      const timeDiff = Math.abs((item1.created || 0) - (item2.created || 0));
      if (timeDiff < 5000) {
        return true;
      }
    }
  }
  
  return false;
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
  const scrollViewRef = useRef(null);
  const isFirstMount = useRef(true);
  
  // Local filter state for instant UI update (syncs with Redux)
  const [localSelectedFilter, setLocalSelectedFilter] = useState(selectedFilter || 'Recents');
  
  // Sync local filter with Redux state (for initial load and external updates)
  useEffect(() => {
    if (selectedFilter) {
      setLocalSelectedFilter(selectedFilter);
      console.log('🔄 Synced local filter with Redux:', selectedFilter);
    }
  }, [selectedFilter]);

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

  // Load gallery images from device - Combining MediaStoreService + CameraRoll
  const loadGalleryImages = useCallback(async () => {    
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

      // OPTIMIZED: Use BOTH MediaStoreService and CameraRoll - optimized for fast initial load
      // Load CameraRoll first (faster), then MediaStoreService in background
      const results = await Promise.allSettled([
        // Fetch from MediaStoreService (better for videos on Android) - reduced limit
        MediaStoreService.fetchGalleryImages({ limit: 300, filterType: null }),
        // Fetch from CameraRoll (better metadata) - faster native API
        (CameraRoll && typeof CameraRoll.getPhotos === 'function') 
          ? CameraRoll.getPhotos({
              first: 300, // Reduced for faster initial load
              assetType: 'All',
              groupTypes: 'All',
            }).then(result => result.edges || []).catch(() => [])
          : Promise.resolve([])
      ]);

      // Extract results from Promise.allSettled
      const mediaStoreItems = results[0].status === 'fulfilled' ? results[0].value : [];
      const cameraRollItems = results[1].status === 'fulfilled' ? results[1].value : [];
      
      // Silent fail - continue without logging

      // Combine both sources - prioritize MediaStoreService for videos
      // Use normalized URI path as map key for better deduplication
      const combinedMediaMap = new Map();
      let duplicateCount = 0;

      // First, add MediaStoreService items (better video URIs)
      mediaStoreItems.forEach((item, index) => {
        // Ensure created is always a number (timestamp), never an object
        let createdTimestamp = Date.now();
        if (item.created) {
          if (typeof item.created === 'number') {
            createdTimestamp = item.created;
            // Ensure it's in milliseconds
            if (createdTimestamp < 10000000000) {
              createdTimestamp = createdTimestamp * 1000;
            }
          } else if (item.created instanceof Date) {
            createdTimestamp = item.created.getTime();
          } else if (typeof item.created === 'object' && Object.keys(item.created).length > 0) {
            // If it's an object with properties, try to extract timestamp
            createdTimestamp = item.created.getTime?.() || Date.now();
          }
        }
        
        // Generate a unique key based on normalized file path for better deduplication
        // Use filename + size + timestamp for more reliable deduplication
        const normalizedPath = normalizeUriPath(item.uri || '');
        const fileName = extractFilename(item.uri, item.fileName);
        // Use filename + size + timestamp as key if available (size is most reliable)
        const mapKey = fileName && fileName.length > 3 && item.size
          ? `${fileName}_${item.size}_${Math.floor(createdTimestamp / 1000)}` 
          : fileName && fileName.length > 3
          ? `${fileName}_${Math.floor(createdTimestamp / 1000)}`
          : (normalizedPath || item.id || `mediastore_${index}_${createdTimestamp}`);
        const id = item.id || mapKey;
        // Enhanced video detection - use extension-based detection (more reliable)
        // Only check explicit flags and file extensions, NOT keywords (to avoid false positives)
        const hasExplicitVideoFlag = item.isVideo === true || item.type === 'video';
        const uriIsVideo = item.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.uri);
        const fileNameIsVideo = item.fileName && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.fileName);
        const isVideo = hasExplicitVideoFlag || uriIsVideo || fileNameIsVideo;
        
        // Remove debug logs for performance
        
        // Ensure URI is properly formatted for videos
        let videoUri = item.uri;
        let thumbnailUri = item.thumbnailUri || item.uri;
        
        if (isVideo && videoUri) {
          // Format video URI for Android
          if (!videoUri.startsWith('file://') && !videoUri.startsWith('content://') && !videoUri.startsWith('http') && !videoUri.startsWith('ph://')) {
            if (videoUri.startsWith('/')) {
              videoUri = `file://${videoUri}`;
            } else {
              videoUri = `content://${videoUri}`;
            }
          }
          
          // For MediaStoreService videos, we need to ensure thumbnailUri is set
          // If thumbnailUri is not provided or same as videoUri, use videoUri as thumbnail
          // (React Native Image can handle video URIs as thumbnails)
          if (!item.thumbnailUri || item.thumbnailUri === item.uri) {
            thumbnailUri = videoUri; // Use video URI as thumbnail (Image component can handle it)
          } else {
            // Format thumbnail URI if provided separately
            thumbnailUri = item.thumbnailUri;
            if (!thumbnailUri.startsWith('file://') && !thumbnailUri.startsWith('content://') && !thumbnailUri.startsWith('http')) {
              if (thumbnailUri.startsWith('/')) {
                thumbnailUri = `file://${thumbnailUri}`;
              } else {
                thumbnailUri = `file://${thumbnailUri}`;
              }
            }
          }
        } else if (videoUri && !videoUri.startsWith('file://') && !videoUri.startsWith('content://') && !videoUri.startsWith('http')) {
          if (videoUri.startsWith('/')) {
            videoUri = `file://${videoUri}`;
          }
          thumbnailUri = videoUri;
        }
        
        // Check if item already exists - ALWAYS check all items for duplicates
        let existing = null;
        let existingKey = null;
        
        // Create a temporary item object for comparison
        const tempItem = {
          uri: videoUri || item.uri,
          thumbnailUri: thumbnailUri,
          fileName: item.fileName,
          created: createdTimestamp
        };
        
        // First check by mapKey (fast path)
        if (combinedMediaMap.has(mapKey)) {
          const existingByKey = combinedMediaMap.get(mapKey);
          // Verify it's actually the same file
          if (isSameFile(tempItem, existingByKey)) {
            existing = existingByKey;
            existingKey = mapKey;
          }
        }
        
        // If not found by key, check ALL items in map (comprehensive check)
        if (!existing) {
          for (const [key, value] of combinedMediaMap.entries()) {
            if (isSameFile(tempItem, value)) {
              existing = value;
              existingKey = key;
              break; // Found duplicate - stop searching
            }
          }
        }
        
        // If still not found, check by ID (fallback)
        if (!existing && combinedMediaMap.has(id)) {
          existing = combinedMediaMap.get(id);
          existingKey = id;
        }
        
        if (existing) {
          duplicateCount++;
          // Always prefer newer timestamp for sorting
          if (createdTimestamp > (existing.created || 0)) {
            existing.created = createdTimestamp;
          }
          
          // Ensure video flags are set correctly - CRITICAL: Check if this is a video first
          if (isVideo) {
            existing.isVideo = true;
            existing.type = 'video';
            
            // For videos, prioritize actual video URI (not thumbnail)
            // Use the videoUri (which is the actual video file from MediaStoreService)
            if (videoUri) {
              existing.uri = videoUri; // Always use actual video URI
            }
            
            // Set thumbnailUri separately - prefer provided thumbnail, fallback to video URI
            if (thumbnailUri && thumbnailUri !== videoUri) {
              existing.thumbnailUri = thumbnailUri;
            } else if (!existing.thumbnailUri || existing.thumbnailUri === existing.uri) {
              existing.thumbnailUri = item.thumbnailUri || videoUri || existing.uri;
            }
          } else {
            // Update URI if better one is available (for non-videos)
            if (videoUri && (!existing.uri || existing.uri.length < videoUri.length)) {
              existing.uri = videoUri;
            }
          }
          
          // Update duration if missing
          if (item.duration && !existing.duration) {
            existing.duration = item.duration;
          }
          
          // Update size if missing (important for deduplication)
          if (item.size && !existing.size) {
            existing.size = item.size;
          }
        } else {
          // Use mapKey (filename + timestamp) as key for consistent deduplication
          const finalKey = mapKey;
          combinedMediaMap.set(finalKey, {
            id,
            uri: videoUri || item.uri,
            thumbnailUri: thumbnailUri || item.uri,
            // CRITICAL: Explicitly set type - don't rely on item.type which might be wrong
            type: isVideo ? 'video' : 'image',
            isVideo: isVideo, // Explicitly set boolean
            duration: item.duration || null,
            size: item.size || null, // Preserve size for better deduplication
            isAddButton: false,
            created: createdTimestamp, // Always a number in milliseconds
            source: 'mediastore', // Track source
            fileName: item.fileName, // Preserve fileName for debugging
          });
        }
      });

      // Then, merge CameraRoll items (add missing or update metadata)
      // Track duplicates from CameraRoll separately for logging
      let cameraRollDuplicateCount = 0;
      cameraRollItems.forEach((edge, index) => {
        const node = edge.node;
        
        // Enhanced video detection
        const hasVideoProperty = node.video !== null && node.video !== undefined;
        const hasPlayableDuration = node.playableDuration !== undefined && node.playableDuration !== null;
        const typeIsVideo = node.type === 'video';
        const mediaTypeIsVideo = node.mediaType === 'video';
        const filenameIsVideo = node.image?.filename && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(node.image.filename);
        
        const isVideo = typeIsVideo || mediaTypeIsVideo || hasVideoProperty || hasPlayableDuration || filenameIsVideo;
        
        // Get URIs
        let mediaUri = '';
        let thumbnailUri = '';
        if (isVideo) {
          // For videos, try video.uri first (actual video file), then image.uri (thumbnail), then node.uri
          mediaUri = node.video?.uri || node.image?.uri || node.uri || '';
          // For CameraRoll videos, image.uri is usually the thumbnail
          // If image.uri exists and is different from video.uri, use it as thumbnail
          // Otherwise, use mediaUri as thumbnail (Image can handle video URIs)
          if (node.image?.uri && node.image.uri !== mediaUri && node.image.uri !== node.video?.uri) {
            thumbnailUri = node.image.uri;
          } else {
            // Use video URI as thumbnail if no separate thumbnail available
            thumbnailUri = mediaUri;
          }
        } else {
          mediaUri = node.image?.uri || node.uri || '';
          thumbnailUri = mediaUri;
        }
        
        // Ensure proper URI format for Android
        // Android videos work better with content:// or file:// prefix
        if (mediaUri) {
          if (!mediaUri.startsWith('file://') && !mediaUri.startsWith('content://') && !mediaUri.startsWith('http') && !mediaUri.startsWith('ph://')) {
            // Check if it's an absolute path
            if (mediaUri.startsWith('/')) {
              mediaUri = `file://${mediaUri}`;
      } else {
              // Try content:// for Android MediaStore
              mediaUri = `content://${mediaUri}`;
            }
          }
        }
        
        // Format thumbnail URI similarly
        if (thumbnailUri && !thumbnailUri.startsWith('file://') && !thumbnailUri.startsWith('content://') && !thumbnailUri.startsWith('http') && !thumbnailUri.startsWith('ph://')) {
          if (thumbnailUri.startsWith('/')) {
            thumbnailUri = `file://${thumbnailUri}`;
          }
        }
        
        // Get duration
        let duration = null;
        if (isVideo) {
          duration = node.video?.duration || node.playableDuration || node.duration || null;
          if (duration && duration > 10000) {
            duration = duration / 1000;
          }
        }
        
        // Ensure created is always a number (timestamp), never an object
        let createdTimestamp = Date.now();
        if (node.timestamp) {
          if (typeof node.timestamp === 'number') {
            createdTimestamp = node.timestamp;
          } else if (node.timestamp instanceof Date) {
            createdTimestamp = node.timestamp.getTime();
          } else if (typeof node.timestamp === 'object' && node.timestamp !== null) {
            // If it's an object, try to extract timestamp or use current time
            createdTimestamp = node.timestamp.getTime?.() || Date.now();
          }
        }
        
        // Generate ID and map key - use filename + size + timestamp for better deduplication
        const normalizedPath = normalizeUriPath(mediaUri || '');
        const fileName = extractFilename(mediaUri, node.image?.filename || node.filename);
        // Get file size if available (from image.size or video.size)
        const fileSize = node.image?.size || node.video?.size || node.size || null;
        // Use filename + size + timestamp as key if available (size is most reliable)
        const mapKey = fileName && fileName.length > 3 && fileSize
          ? `${fileName}_${fileSize}_${Math.floor(createdTimestamp / 1000)}`
          : fileName && fileName.length > 3
          ? `${fileName}_${Math.floor(createdTimestamp / 1000)}`
          : (normalizedPath || mediaUri || `cameraroll_${index}_${createdTimestamp}`);
        const id = mediaUri || `cameraroll_${index}_${createdTimestamp}`;
        
        // Check if item already exists - ALWAYS check all items for duplicates
        let existing = null;
        let existingKey = null;
        
        // Create a temporary item object for comparison
        const tempItem = {
          uri: mediaUri,
          thumbnailUri: thumbnailUri,
          fileName: node.image?.filename || node.filename,
          created: createdTimestamp
        };
        
        // First check by mapKey (fast path)
        if (combinedMediaMap.has(mapKey)) {
          const existingByKey = combinedMediaMap.get(mapKey);
          // Verify it's actually the same file
          if (isSameFile(tempItem, existingByKey)) {
            existing = existingByKey;
            existingKey = mapKey;
          }
        }
        
        // If not found by key, check ALL items in map (comprehensive check)
        if (!existing) {
          for (const [key, value] of combinedMediaMap.entries()) {
            if (isSameFile(tempItem, value)) {
              existing = value;
              existingKey = key;
              break; // Found duplicate - stop searching
            }
          }
        }
        
        // If still not found, check by ID (fallback)
        if (!existing && combinedMediaMap.has(id)) {
          existing = combinedMediaMap.get(id);
          existingKey = id;
        }
        
        if (existing) {
          cameraRollDuplicateCount++;
          // Always prefer newer timestamp for latest items first
          if (createdTimestamp > (existing.created || 0)) {
            existing.created = createdTimestamp;
          }
          
          // Ensure video flags are set correctly - CRITICAL for video playback
          if (isVideo) {
            existing.isVideo = true;
            existing.type = 'video';
            
            // IMPORTANT: Always use actual video URI, not thumbnail URI
            // For CameraRoll videos, node.video.uri is the actual video file
            // node.image.uri is usually the thumbnail/poster
            if (node.video?.uri) {
              // CRITICAL: Use video.uri as the main URI (actual video file for playback)
              existing.uri = node.video.uri;
              
              // Set thumbnailUri separately - use image.uri if available and different
              if (node.image?.uri && node.image.uri !== node.video.uri) {
                existing.thumbnailUri = node.image.uri;
              } else {
                // Fallback: use video URI as thumbnail (Image component can handle it)
                existing.thumbnailUri = existing.uri || node.video.uri;
              }
            } else if (mediaUri) {
              // If no video.uri, use mediaUri but ensure we're not using thumbnail
              // Check if existing URI is a thumbnail (usually shorter or different path)
              const existingIsThumbnail = existing.uri && 
                (existing.uri.includes('thumbnail') || 
                 existing.uri.length < mediaUri.length ||
                 (existing.thumbnailUri && existing.uri === existing.thumbnailUri));
              
              if (existingIsThumbnail || !existing.uri) {
                existing.uri = mediaUri;
              }
              
              // Set thumbnail separately
              if (node.image?.uri && node.image.uri !== mediaUri && node.image.uri !== existing.uri) {
                existing.thumbnailUri = node.image.uri;
              } else if (!existing.thumbnailUri || existing.thumbnailUri === existing.uri) {
                existing.thumbnailUri = mediaUri;
              }
            }
            
            // Final fallback: ensure thumbnailUri is always set
            if (!existing.thumbnailUri) {
              existing.thumbnailUri = node.image?.uri || existing.uri || mediaUri;
            }
          } else {
            // For non-videos, update URI if better one is available
            if (mediaUri && (!existing.uri || existing.uri.length < mediaUri.length)) {
              existing.uri = mediaUri;
            }
          }
          
          // Update duration if missing
          if (duration && !existing.duration) {
            existing.duration = duration;
          }
          
          // Update size if missing (important for deduplication)
          if (fileSize && !existing.size) {
            existing.size = fileSize;
          }
          
          // Update source if this is better (prefer cameraroll for metadata)
          if (existing.source === 'mediastore') {
            existing.source = 'both'; // Mark as from both sources
          }
        } else {
          // Add new item
          // IMPORTANT: For videos, use node.video.uri as main URI (actual video), node.image.uri as thumbnail
          let finalVideoUri = mediaUri;
          let finalThumbnailUri = thumbnailUri;
          
          if (isVideo && node.video?.uri) {
            // Use video.uri as the actual video file URI
            finalVideoUri = node.video.uri;
            // Use image.uri as thumbnail if available and different
            if (node.image?.uri && node.image.uri !== node.video.uri) {
              finalThumbnailUri = node.image.uri;
            } else {
              finalThumbnailUri = finalVideoUri;
            }
          }
          
          // Use mapKey (filename + timestamp) as key for consistent deduplication
          const finalKey = mapKey;
          combinedMediaMap.set(finalKey, {
            id,
            uri: finalVideoUri, // Always use actual video URI for videos
            thumbnailUri: isVideo ? finalThumbnailUri : mediaUri,
            // CRITICAL: Explicitly set type - don't rely on node.type which might be wrong
            type: isVideo ? 'video' : 'image',
            isVideo: isVideo, // Explicitly set boolean
            duration: duration,
            size: fileSize || null, // Preserve size for better deduplication
            isAddButton: false,
            created: createdTimestamp, // Always a number in milliseconds
            source: 'cameraroll',
            fileName: node.image?.filename || node.filename, // Preserve fileName for debugging
          });
        }
      });

      // Final deduplication pass - remove any remaining duplicates by comprehensive check
      // Use Set-based approach for faster duplicate detection
      const finalMediaArray = [];
      const seenPaths = new Set(); // Track normalized paths
      const seenThumbnailPaths = new Set(); // Track thumbnail URIs to prevent them appearing as separate items
      const seenFileSizes = new Map(); // Track filename + size combinations
      
      Array.from(combinedMediaMap.values()).forEach(item => {
        // Create multiple identifiers for this item
        const normalizedPath = normalizeUriPath(item.uri || '');
        const fileName = extractFilename(item.uri, item.fileName);
        
        // Normalize path more aggressively for better matching
        const normalizePath = (path) => {
          if (!path) return '';
          return path.toLowerCase()
            .replace(/^file:\/\//i, '')
            .replace(/^content:\/\//i, '')
            .replace(/^ph:\/\//i, '')
            .replace(/\\/g, '/')
            .trim();
        };
        
        const aggNormPath = normalizePath(item.uri);
        
        // Normalize thumbnail URI if present
        const normalizedThumbnailPath = item.thumbnailUri ? normalizePath(item.thumbnailUri) : null;
        
        // Check if we've seen this file before using multiple methods
        let isDuplicate = false;
        
        // CRITICAL: Check if this item's URI matches a thumbnail URI of an existing item
        // This prevents video thumbnails from appearing as separate photos
        if (!isDuplicate && normalizedPath && normalizedPath.length > 5) {
          if (seenThumbnailPaths.has(normalizedPath)) {
            // This item's URI is already used as a thumbnail by another item (likely a video)
            // Skip it to prevent duplicate thumbnail display
            isDuplicate = true;
          }
        }
        
        // Check 1: Normalized path
        if (!isDuplicate && normalizedPath && normalizedPath.length > 5) {
          if (seenPaths.has(normalizedPath)) {
            isDuplicate = true;
          } else {
            seenPaths.add(normalizedPath);
          }
        }
        
        // Check 2: Aggressively normalized path
        if (!isDuplicate && aggNormPath && aggNormPath.length > 5) {
          if (seenPaths.has(aggNormPath)) {
            isDuplicate = true;
          } else {
            seenPaths.add(aggNormPath);
          }
        }
        
        // Check 3: Filename + size (very reliable for duplicates)
        if (!isDuplicate && fileName && fileName.length > 3 && item.size) {
          const fileSizeKey = `${fileName}_${item.size}`;
          if (seenFileSizes.has(fileSizeKey)) {
            // Check if it's really a duplicate by comparing with existing
            const existingItem = seenFileSizes.get(fileSizeKey);
            if (isSameFile(item, existingItem)) {
              isDuplicate = true;
            }
          } else {
            seenFileSizes.set(fileSizeKey, item);
          }
        }
        
        // Check 4: Comprehensive isSameFile check against all existing items
        if (!isDuplicate) {
          for (const existingItem of finalMediaArray) {
            if (isSameFile(item, existingItem)) {
              isDuplicate = true;
              break;
            }
            
            // CRITICAL: Also check if this item's URI matches existing item's thumbnail URI
            // This catches cases where a thumbnail image is also scanned as a standalone photo
            if (item.uri && existingItem.thumbnailUri) {
              const itemUriNorm = normalizePath(item.uri);
              const existingThumbNorm = normalizePath(existingItem.thumbnailUri);
              if (itemUriNorm && existingThumbNorm && itemUriNorm === existingThumbNorm && itemUriNorm.length > 5) {
                // This item is actually a thumbnail of an existing item (likely a video)
                // Skip it to prevent duplicate
                isDuplicate = true;
                break;
              }
            }
            
            // Also check reverse: if existing item's URI matches this item's thumbnail
            if (existingItem.uri && item.thumbnailUri) {
              const existingUriNorm = normalizePath(existingItem.uri);
              const itemThumbNorm = normalizePath(item.thumbnailUri);
              if (existingUriNorm && itemThumbNorm && existingUriNorm === itemThumbNorm && existingUriNorm.length > 5) {
                // Existing item is a thumbnail of this item
                // But we should keep the one with the actual media URI (video), not the thumbnail
                // If this item is a video and existing is an image, keep this one
                if (item.isVideo && !existingItem.isVideo) {
                  // Remove the existing thumbnail item and keep this video
                  const existingIndex = finalMediaArray.indexOf(existingItem);
                  if (existingIndex > -1) {
                    finalMediaArray.splice(existingIndex, 1);
                  }
                  // Continue with this item (don't mark as duplicate)
                } else {
                  // This item is likely a thumbnail, skip it
                  isDuplicate = true;
                  break;
                }
              }
            }
          }
        }
        
        // Only add if not duplicate
        if (!isDuplicate) {
          finalMediaArray.push(item);
          
          // Track thumbnail URI if this item is a video with a separate thumbnail
          // This helps prevent the thumbnail from appearing as a separate photo
          if (item.isVideo && normalizedThumbnailPath && normalizedThumbnailPath !== normalizedPath && normalizedThumbnailPath.length > 5) {
            seenThumbnailPaths.add(normalizedThumbnailPath);
          }
        }
      });
      
      console.log(`✅ Deduplication: ${combinedMediaMap.size} → ${finalMediaArray.length} items (removed ${combinedMediaMap.size - finalMediaArray.length} duplicates)`);
      
      // Convert final deduplicated array and sort by creation time (newest first)
      // Ensure all items have valid timestamps, and sort properly
      const mediaItems = finalMediaArray
        .filter(item => {
          // Filter out items without valid URIs
          if (!item.uri || item.uri.trim().length === 0) {
            return false;
          }
          
          // Filter out trashed files and invalid paths (silently skip - no console spam)
          const uri = item.uri.toLowerCase();
          if (uri.includes('.trashed') || 
              uri.includes('/.thumbnails') ||
              uri.includes('trashed-') ||
              item.fileName?.startsWith('.trashed') ||
              item.fileName?.startsWith('.')) {
            // Silently skip trashed files - no console warning (expected behavior)
            return false;
          }
          
          return true;
        })
        .map(item => {
          // Ensure created is always a valid number
          if (!item.created || typeof item.created !== 'number' || isNaN(item.created)) {
            // If no timestamp, use current time minus 1 day (older items first)
            item.created = Date.now() - 86400000;
          }
          
          // Ensure timestamps are in milliseconds (not seconds)
          if (item.created < 10000000000) {
            item.created = item.created * 1000;
          }
          
          // Ensure video flags are correct - check URI as fallback
          // CRITICAL: Use priority-based detection - explicit flags first, then extensions, then keywords
          const hasExplicitVideoFlag = item.type === 'video' || item.isVideo === true;
          const uriIsVideo = item.uri && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.uri);
          const fileNameIsVideo = item.fileName && /\.(mp4|mov|avi|mkv|3gp|wmv|flv|webm|m4v|quicktime)$/i.test(item.fileName);
          
          // Only use keyword check if no extension match (to avoid false positives)
          // And only if URI path specifically contains video directories
          const hasVideoKeyword = !uriIsVideo && !fileNameIsVideo && 
                                  item.uri && (
                                    /\/videos?\/|movies?\/|dcim\/video/i.test(item.uri) ||
                                    (item.uri.toLowerCase().includes('video') && /\.(mp4|mov|avi)$/i.test(item.uri))
                                  );
          
          // Priority-based detection: explicit flags > extensions > keywords
          const isVideo = hasExplicitVideoFlag || uriIsVideo || fileNameIsVideo || hasVideoKeyword;
          
          if (isVideo) {
            item.isVideo = true;
            item.type = 'video';
            
            // CRITICAL: Ensure we have a valid video URI (not thumbnail)
            // Don't override the URI if it's already set correctly
            if (!item.uri || item.uri.trim().length === 0) {
              console.warn('⚠️ Video item has no URI:', item);
            }
            
            // Ensure thumbnailUri is always set for videos
            // If not set or same as video URI, use video URI (Image component can handle it)
            if (!item.thumbnailUri || item.thumbnailUri === item.uri) {
              item.thumbnailUri = item.uri;
            }
            
            // Debug log for video items (only if URI is missing - for debugging)
            if (!item.uri || item.uri.trim().length === 0) {
              console.warn('⚠️ Video item missing URI:', {
                isVideo: item.isVideo,
                type: item.type,
                source: item.source,
                fileName: item.fileName
              });
            }
          } else {
            // Explicitly mark as image if not video
            item.isVideo = false;
            item.type = 'image'; // Force to image if not video
          }
          
          return item;
        })
        .sort((a, b) => {
          // Sort by created timestamp (newest first)
          const aTime = a.created || 0;
          const bTime = b.created || 0;
          return bTime - aTime; // Descending order (newest first)
        });

      // Update allMedia in Redux
      dispatch(setAllMedia(mediaItems));
      
      // Get current filter and apply it
      const currentFilter = selectedFilter || 'Recents';
      const filteredItems = getFilteredMedia(mediaItems, currentFilter);
      
      const initialGallery = [
        { id: 'camera', isAddButton: true },
        ...filteredItems,
      ];
      
      dispatch(setGalleryMedia(initialGallery));
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
    
    console.log('✅ Updating gallery with', filteredGallery.length, 'items');
    
    // CRITICAL: Update Redux gallery state
    dispatch(setGalleryMedia(filteredGallery));
    
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
    if (item.isAddButton || item.isVideo) {
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
    if (isMultiSelect && !item.isVideo) {
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
    
    // For videos, ensure we use the actual video URI, not thumbnail URI
    let videoUri = item.uri;
    if (isVideo) {
      // Make sure we're using the video URI, not thumbnail URI
      // thumbnailUri should only be used for poster/thumbnail display
      if (!videoUri || videoUri === item.thumbnailUri) {
        // If URI is missing or same as thumbnail, log warning
        console.warn('⚠️ Video URI might be incorrect:', {
          uri: item.uri,
          thumbnailUri: item.thumbnailUri,
          fileName: item.fileName
        });
      }
      
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
      // Ensure URI is correct for videos
      uri: isVideo ? videoUri : item.uri,
      // Keep thumbnailUri for poster
      thumbnailUri: item.thumbnailUri || (isVideo ? videoUri : item.uri),
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
          
          {/* Explicitly check if it's a video - use multiple conditions */}
          {(selectedPreviewItem.isVideo === true || selectedPreviewItem.type === 'video') ? (
            (() => {
              // Ensure we have a valid video URI
              const videoUri = selectedPreviewItem.uri;
              const thumbnailUri = selectedPreviewItem.thumbnailUri || videoUri;
              
              // Validate video URI
              if (!videoUri || videoUri.trim().length === 0) {
                console.error('❌ Invalid video URI in preview');
                return (
                  <View style={[styles.previewMedia, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }]}>
                    <Text style={{ color: 'white' }}>Invalid video URI</Text>
                  </View>
                );
              }
              
              console.log('🎥 Rendering Video component:', {
                uri: videoUri.substring(0, 100),
                thumbnailUri: thumbnailUri?.substring(0, 80),
                isVideo: selectedPreviewItem.isVideo,
                type: selectedPreviewItem.type
              });
              
              return (
                <Video
                  source={{ uri: videoUri }}
                  style={styles.previewMedia}
                  paused={false}
                  muted={true}
                  resizeMode="contain"
                  poster={thumbnailUri !== videoUri ? thumbnailUri : undefined}
                  posterResizeMode="cover"
                  repeat={true}
                  playInBackground={false}
                  ignoreSilentSwitch="ignore"
                  controls={false}
                  onError={(error) => {
                    console.error('❌ Video playback error:', error);
                    console.error('❌ Video URI:', videoUri);
                    console.error('❌ Preview item type:', selectedPreviewItem.type, 'isVideo:', selectedPreviewItem.isVideo);
                    console.error('❌ Error details:', JSON.stringify(error.nativeEvent || error, null, 2));
                  }}
                  onLoadStart={() => {
                    console.log('🎥 Video load started:', videoUri.substring(0, 100));
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
          {(selectedPreviewItem.isVideo === true || selectedPreviewItem.type === 'video') && selectedPreviewItem.duration && (
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
        <ScrollView
          ref={scrollViewRef}
          style={[
            styles.scrollView,
            selectedPreviewItem && styles.scrollViewWithPreview
          ]}
          contentContainerStyle={styles.imageGrid}
          showsVerticalScrollIndicator={false}
        >
          {galleryMedia.map((item) => {
            const isSelected = selectedImageIds.includes(item.id);
            const showCheckbox = isMultiSelect && !item.isAddButton && !item.isVideo;

              return (
                <TouchableOpacity
                  key={item.id}
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
                ) : item.isVideo ? (
                  // Video thumbnail rendering - Use Image for better performance
                  <View style={styles.videoContainer}>
                    <Image
                      source={{ uri: item.thumbnailUri || item.uri }}
                      style={styles.image}
                      resizeMode="cover"
                      onError={(error) => {
                        // Only log if it's not a trashed file (to reduce spam)
                        const uri = (item.thumbnailUri || item.uri || '').toLowerCase();
                        if (!uri.includes('.trashed') && !uri.includes('trashed-')) {
                          console.warn(`⚠️ Video thumbnail load error for ${item.uri?.substring(0, 50)}:`, error);
                        }
                      }}
                      onLoadStart={() => {
                        // Thumbnail loading started
                      }}
                      onLoad={() => {
                        // Thumbnail loaded successfully
                      }}
                    />
                    {/* Play icon overlay */}
                    <View style={styles.videoPlayOverlay}>
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
            })}
        </ScrollView>
      )}

      {/* Bottom Tab Bar */}
      <View style={[styles.bottomTabBar, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'POST' && styles.tabButtonActive
          ]}
          onPress={() => handleTabPress('POST')}
          activeOpacity={0.7}
        >
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
          <Text
            style={[
              styles.tabText,
              selectedTab === 'STORY' && styles.tabTextActive
            ]}
          >
            STORY
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'REEL' && styles.tabButtonActive
          ]}
          onPress={() => handleTabPress('REEL')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'REEL' && styles.tabTextActive
            ]}
          >
            REEL
          </Text>
        </TouchableOpacity>
      </View>

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
  scrollView: {
    flex: 1,
  },
  scrollViewWithPreview: {
    height: Dimensions.get('window').height * 0.5,
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
  scrollView: {
    flex: 1,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 100,
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
    zIndex: 3,
  },
  videoPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
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
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: 'white',
    fontWeight: '700',
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
