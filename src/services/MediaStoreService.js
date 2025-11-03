import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';

class MediaStoreService {
  constructor() {
    this.galleryImages = [];
    this.permissionsGranted = false;
  }

  // Request necessary permissions (Instagram style - silent)
  async requestPermissions() {
    // Instagram style - assume permissions are granted and let the system handle it
    this.permissionsGranted = true;
    return true;
  }

  // Fetch images/videos from device gallery with simple pagination and filtering
  // options: { offset?: number, limit?: number, filterType?: 'image' | 'video' | null }
  async fetchGalleryImages(options = {}) {
    const { offset = 0, limit = null, filterType = null } = options; // null = no limit, get all images
    // Instagram style - always try to get real images first
    this.permissionsGranted = true;

    try {
      if (Platform.OS === 'android') {
        // Add timeout to prevent hanging - increased timeout and make it more lenient
        // Return partial results if timeout occurs instead of throwing error
        try {
          const images = await Promise.race([
            this.fetchAndroidImages({ offset, limit, filterType }),
            new Promise((resolve) => 
              setTimeout(() => {
                console.warn('⚠️ Media scan timeout - returning partial results');
                resolve([]); // Return empty array instead of rejecting
              }, 60000) // Increased to 60 seconds for slower devices
            )
          ]);
          
          if (images.length > 0) {
            console.log('✅ Found real Android images:', images.length);
            return images;
          }
        } catch (scanError) {
          // If scanning fails, log but don't crash - return empty array
          console.warn('⚠️ Media scan error (non-fatal):', scanError.message);
          return [];
        }
      } else {
        const images = await this.fetchIOSImages({ offset, limit, filterType });
        if (images.length > 0) {
          console.log('✅ Found real iOS images:', images.length);
          return images;
        }
      }
      
      // If no real images found, return empty array (don't crash)
      console.log('⚠️ No real images found from MediaStoreService (will use CameraRoll)');
      return [];
    } catch (error) {
      // Catch-all error handler - return empty array instead of crashing
      console.warn('⚠️ Error fetching gallery images (non-fatal):', error.message);
      return [];
    }
  }

  async getRealVideoPath(contentUri) {
    if (!contentUri.startsWith('content://')) return contentUri;
    try {
      const ext = contentUri.includes('.mp4') ? 'mp4' : 'mov';
      const realPath = `${RNFS.CachesDirectoryPath}/real_video_${Date.now()}.${ext}`;
      await RNFS.copyFile(contentUri, realPath);
      console.log('REAL VIDEO PATH MADE:', realPath);
      return realPath;
    } catch (e) {
      console.warn('Using original URI:', contentUri);
      return contentUri;
    }
  }

  // Alternative method using react-native-image-picker
  async fetchImagesWithImagePicker() {
    // Don't return sample images - return empty array so gallery placeholders are shown
    console.log('No real images found, will show gallery placeholders');
    return [];
  }

  // Android MediaStore implementation - fetch real device media with pagination
  async fetchAndroidImages({ offset = 0, limit = null, filterType = null } = {}) {
    try {
      console.log('🔍 Starting Android media scan...');
      
      // Get external storage path
      const externalPath = RNFS.ExternalStorageDirectoryPath;
      console.log('📱 External storage path:', externalPath);
      
      // Prioritize most common directories first for faster scanning
      // Most users have photos in DCIM/Camera, so scan that first
      // Also prioritize video-specific folders
      // Limit to most important directories to avoid timeout
      const directories = [
        RNFS.DCIMDirectoryPath + '/Camera', // Most common - scan first (photos + videos)
        RNFS.DCIMDirectoryPath, // Camera folder parent (may contain videos)
        externalPath ? externalPath + '/DCIM/Camera' : undefined, // Alternative camera path
        externalPath ? externalPath + '/DCIM' : undefined,
        externalPath ? externalPath + '/Movies' : undefined, // Primary videos folder
        RNFS.PicturesDirectoryPath, // Pictures folder (may contain videos too)
        externalPath ? externalPath + '/Pictures' : undefined,
        externalPath ? externalPath + '/Videos' : undefined, // Alternative videos folder
        externalPath ? externalPath + '/Download' : undefined,
        externalPath ? externalPath + '/Screenshots' : undefined,
        // Skip social media folders by default to avoid timeout (can be enabled if needed)
        // externalPath ? externalPath + '/WhatsApp/Media/WhatsApp Video' : undefined,
        // externalPath ? externalPath + '/WhatsApp/Media/WhatsApp Images' : undefined,
      ].filter(Boolean);

      const allImages = [];
      const scanState = { hasLimit: limit !== null, limit: limit || Infinity, stop: false };
      let totalScanned = 0;

      // Scan directories with early stopping if limit reached
      for (const dir of directories) {
        // Stop early if we have enough items and limit is set
        if (scanState.hasLimit && allImages.length >= scanState.limit) {
          console.log(`⏸️ Reached limit of ${scanState.limit}, stopping scan`);
          scanState.stop = true;
          break;
        }
        if (scanState.stop && scanState.hasLimit) break;
        
        try {
          console.log('📂 Scanning directory:', dir);
          const dirExists = await RNFS.exists(dir);
          if (dirExists) {
            await this.scanDirectoryRecursively(dir, allImages, 0, scanState, filterType);
            totalScanned++;
            console.log(`✅ Directory ${dir} scanned - Found ${allImages.length} items so far`);
            
            // Stop early if we have enough
            if (scanState.hasLimit && allImages.length >= scanState.limit) {
              console.log(`⏸️ Reached limit after scanning ${dir}`);
              break;
            }
          } else {
            console.log(`❌ Directory ${dir} does not exist`);
          }
        } catch (dirError) {
          console.warn('⚠️ Error reading directory:', dir, dirError.message);
        }
      }

      // Sort by creation time (newest first)
      allImages.sort((a, b) => b.created - a.created);

      console.log(`🎉 SCAN COMPLETE! Found ${allImages.length} media files from ${totalScanned} directories`);
      const imageCount = allImages.filter(i => i.type === 'image').length;
      const videoCount = allImages.filter(i => i.type === 'video').length;
      console.log(`📱 Media types: ${imageCount} photos, ${videoCount} videos`);
      
      // Debug: Log first few videos found
      const videos = allImages.filter(i => i.type === 'video').slice(0, 5);
      if (videos.length > 0) {
        console.log(`🎥 Sample videos found:`);
        videos.forEach(v => console.log(`   - ${v.fileName || v.uri}`));
      } else {
        console.log(`⚠️ WARNING: No videos found! Check permissions and video file extensions.`);
      }
      
      // Apply offset and limit after scanning all images
      const startIndex = Math.max(0, offset);
      const endIndex = limit !== null ? startIndex + limit : undefined;
      const result = endIndex !== undefined ? allImages.slice(startIndex, endIndex) : allImages.slice(startIndex);
      
      console.log(`📊 Returning ${result.length} media items (offset: ${offset}, limit: ${limit || 'unlimited'})`);
      return result;

    } catch (error) {
      console.error('❌ Error fetching Android images:', error);
      return [];
    }
  }

  // iOS PhotoKit implementation (simplified)
  async fetchIOSImages() {
    try {
      // For iOS, we'll use a different approach
      // This is a simplified version - in production you'd use react-native-photos
      const documentsPath = RNFS.DocumentDirectoryPath;
      const files = await RNFS.readDir(documentsPath);
      
      const images = files
        .filter(file => this.isImageFile(file.name))
        .map(file => ({
          id: file.name + '_' + file.ctime,
          uri: 'file://' + file.path,
          fileName: file.name,
          size: file.size,
          created: file.ctime,
          type: 'image',
          isVideo: false,
        }))
        .sort((a, b) => b.created - a.created)
        .slice(0, 50);

      return images.length > 0 ? images : this.getSampleImages();
    } catch (error) {
      console.error('Error fetching iOS images:', error);
      return this.getSampleImages();
    }
  }

  // Recursively scan directory for images
  async scanDirectoryRecursively(dirPath, allImages, depth = 0) {
    try {
      // Limit recursion depth to avoid infinite loops
      if (depth > 3) {
        console.log(' Max depth reached for:', dirPath);
        return;
      }

      const files = await RNFS.readDir(dirPath);
      console.log(`📁 Found ${files.length} items in ${dirPath}`);
      
      for (const file of files) {
        if (file.isDirectory()) {
          // Skip system directories that might cause issues
          if (file.path.includes('/Android/data/') && !file.path.includes('/DCIM/') && !file.path.includes('/Pictures/')) {
            continue;
          }
          
          // Recursively scan subdirectories
          await this.scanDirectoryRecursively(file.path, allImages, depth + 1);
        } else {
          // Check for both image and video files
          let mediaType = null;
          if (this.isImageFile(file.name)) {
            mediaType = 'image';
          } else if (this.isVideoFile(file.name)) {
            mediaType = 'video';
          }

          if (mediaType) {
            try {
              const stat = await RNFS.stat(file.path);
              // Normalize timestamp to milliseconds
              let createdTimestamp = stat.ctime;
              if (createdTimestamp < 10000000000) {
                createdTimestamp = createdTimestamp * 1000; // Convert seconds to milliseconds
              }
              
              const filePath = file.path.toLowerCase().trim();
              // Use file path as unique identifier (without random) for better deduplication
              const uniqueId = `mediastore_${filePath.replace(/[^a-z0-9]/g, '_')}_${createdTimestamp}`;
              
              // Check if this file was already added (prevent duplicates from overlapping directories)
              const isDuplicate = allImages.some(existing => {
                const existingPath = existing.uri?.replace(/^file:\/\//i, '').toLowerCase().trim();
                return existingPath === filePath;
              });
              
              if (!isDuplicate) {
                const mediaItem = {
                  id: uniqueId,
                  uri: 'file://' + file.path,
                  fileName: file.name,
                  size: stat.size,
                  created: createdTimestamp, // Now in milliseconds
                  type: mediaType,
                  isVideo: mediaType === 'video',
                };
                
                allImages.push(mediaItem);
                console.log(`📸 Added ${mediaType}: ${file.name}`);
              } else {
                console.log(`⚠️ Skipping duplicate: ${file.name}`);
              }
            } catch (statError) {
              console.warn('⚠️ Error getting file stats for:', file.name, statError.message);
            }
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Error scanning directory:', dirPath, error.message);
    }
  }

  // Check if file is an image
  isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.heic', '.heif', '.tiff', '.tif', '.raw', '.cr2', '.nef', '.arw', '.dng'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(ext);
  }

  // Check if file is a video
  isVideoFile(filename) {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.3gp', '.m4v', '.wmv', '.flv', '.mpeg', '.mpg'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return videoExtensions.includes(ext);
  }

  // No more sample images - we want real gallery only

  // Get camera preview placeholder
  getCameraPlaceholder() {
    return {
      id: 'camera_preview',
      uri: null, // Will be handled by camera component
      type: 'camera',
      isVideo: false,
      fileName: 'camera',
      isCamera: true,
    };
  }
}

export default new MediaStoreService();
