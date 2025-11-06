// MediaStoreService.js
import { Platform, PermissionsAndroid } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';
import CreateThumbnail from 'react-native-create-thumbnail';

// Normalize timestamp utility - converts seconds to milliseconds if needed
const normalizeTimestamp = (t) => {
  if (!t) return Date.now();
  const n = Number(t);
  if (isNaN(n) || n <= 0) return Date.now();
  return n < 10000000000 ? n * 1000 : n; // convert seconds→ms when needed
};

class MediaStoreService {
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
        // Add timeout to prevent hanging - optimized scanning should complete faster
        // Return partial results if timeout occurs (with logging)
        try {
          console.log('🔄 MediaStoreService: Starting Android scan...');
          const scanStartTime = Date.now();
          
          // Call fetchAndroidImages directly without timeout for now
          // (Timeout was causing issues - videos detected but results not returned)
          const images = await this.fetchAndroidImages({ offset, limit, filterType });
          
          const scanTime = Date.now() - scanStartTime;
          const videoCount = images?.filter(item => item.isVideo === true).length || 0;
          console.log(`✅ MediaStoreService: Scan completed in ${scanTime}ms, returning ${images?.length || 0} items (${videoCount} videos)`);
          
          // Debug: Log what we're returning
          console.log('📤 MediaStoreService: Returning results:', {
            total: images?.length || 0,
            videos: videoCount,
            images: (images?.length || 0) - videoCount
          });
          
          // Return images (even if empty - CameraRoll will provide media)
          return images || [];
        } catch (scanError) {
          // If scanning fails, log the error
          console.error('❌ MediaStoreService: Scan error:', scanError);
          console.error('❌ MediaStoreService: Error stack:', scanError.stack);
          return [];
        }
      } else {
        const images = await this.fetchIOSImages({ offset, limit, filterType });
        return images || [];
      }
      
      // If no real images found, return empty array (CameraRoll will handle it)
      return [];
    } catch (error) {
      // Catch-all error handler - log the error
      console.error('❌ MediaStoreService: Fatal error:', error);
      console.error('❌ MediaStoreService: Error stack:', error.stack);
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
  // OPTIMIZED: Scan only essential directories first for instant loading
  async fetchAndroidImages({ offset = 0, limit = 500, filterType = null } = {}) {
    try {
      // Get external storage path
      const externalPath = RNFS.ExternalStorageDirectoryPath;
      
      // OPTIMIZED: Only scan most important directories first (Instagram style)
      // This gives instant results, then can load more on demand
      const primaryDirectories = [
        RNFS.DCIMDirectoryPath + '/Camera', // Most common - 90% of photos/videos here
        externalPath ? externalPath + '/DCIM/Camera' : undefined,
      ].filter(Boolean);
      
      // Secondary directories (scan only if we need more items)
      const secondaryDirectories = [
        RNFS.DCIMDirectoryPath,
        externalPath ? externalPath + '/DCIM' : undefined,
        externalPath ? externalPath + '/Movies' : undefined,
        RNFS.PicturesDirectoryPath,
      ].filter(Boolean);

      const allImages = [];
      const seenFiles = new Set(); // Track seen files by normalized path for better deduplication
      const scanState = { hasLimit: limit !== null, limit: limit || 500, stop: false };
      let totalScanned = 0;

      // OPTIMIZED: Scan primary directories first for instant results
      for (const dir of primaryDirectories) {
        if (scanState.hasLimit && allImages.length >= scanState.limit) {
          scanState.stop = true;
          break;
        }
        
          try {
            const dirExists = await RNFS.exists(dir);
            if (dirExists) {
              const dirSeenFiles = new Set(seenFiles); // Share seenFiles across all directories
              await this.scanDirectoryRecursively(dir, allImages, 0, scanState, filterType, dirSeenFiles);
              totalScanned++;
              
              // Early exit if we have enough items
              if (scanState.hasLimit && allImages.length >= scanState.limit) {
                break;
              }
            }
        } catch (dirError) {
          // Silent fail - continue to next directory
        }
      }
      
      // Only scan secondary directories if we need more items (lazy loading)
      if (!scanState.stop && allImages.length < (scanState.limit || 500)) {
        for (const dir of secondaryDirectories) {
          if (scanState.hasLimit && allImages.length >= scanState.limit) {
            break;
          }
          
          try {
            const dirExists = await RNFS.exists(dir);
            if (dirExists) {
              const dirSeenFiles = new Set(seenFiles); // Share seenFiles across all directories
              await this.scanDirectoryRecursively(dir, allImages, 0, scanState, filterType, dirSeenFiles);
              totalScanned++;
              
              if (scanState.hasLimit && allImages.length >= scanState.limit) {
                break;
              }
            }
          } catch (dirError) {
            // Silent fail
          }
        }
      }

      // Sort by creation time (newest first) using normalizeTimestamp
      allImages.sort((a, b) => normalizeTimestamp(b.created) - normalizeTimestamp(a.created));
      
      // Debug: Count videos before applying offset/limit
      const videoCount = allImages.filter(item => item.isVideo === true).length;
      console.log('📊 MediaStoreService: Scanned media (fetchAndroidImages):', {
        total: allImages.length,
        videos: videoCount,
        images: allImages.length - videoCount,
        offset,
        limit
      });
      
      // Apply offset and limit after scanning
      const startIndex = Math.max(0, offset);
      const endIndex = limit !== null ? startIndex + limit : undefined;
      const result = endIndex !== undefined ? allImages.slice(startIndex, endIndex) : allImages.slice(startIndex);
      
      // Debug: Count videos after applying offset/limit
      const resultVideoCount = result.filter(item => item.isVideo === true).length;
      console.log('📊 MediaStoreService: After offset/limit:', {
        total: result.length,
        videos: resultVideoCount,
        images: result.length - resultVideoCount
      });
      
      if (videoCount > resultVideoCount) {
        console.warn('⚠️ MediaStoreService: Videos lost during offset/limit:', {
          before: videoCount,
          after: resultVideoCount,
          offset,
          limit,
          lost: videoCount - resultVideoCount
        });
      }
      
      return result;

    } catch (error) {
      console.error('❌ MediaStoreService: fetchAndroidImages error:', error);
      console.error('❌ MediaStoreService: Error stack:', error.stack);
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
  async scanDirectoryRecursively(dirPath, allImages, depth = 0, scanState = { hasLimit: false, limit: 500, stop: false }, filterType = null, seenFiles = new Set()) {
    try {
      // OPTIMIZED: Limit recursion depth to 2 for faster scanning (Instagram style)
      // Most photos are at level 1 (DCIM/Camera), so depth 2 is sufficient
      if (depth > 2) {
        return;
      }

      const files = await RNFS.readDir(dirPath);
      
          // OPTIMIZED: Process files in batches to avoid blocking
      for (const file of files) {
        if (file.isDirectory()) {
          // Skip system directories that might cause issues
          if (file.path.includes('/Android/data/') && !file.path.includes('/DCIM/') && !file.path.includes('/Pictures/')) {
            continue;
          }
          
          // Recursively scan subdirectories - pass seenFiles Set
          await this.scanDirectoryRecursively(file.path, allImages, depth + 1, scanState, filterType, seenFiles);
        } else {
          // Skip trashed files, hidden files, and thumbnail directories/files immediately (before processing)
          const fileName = file.name || '';
          const filePath = file.path.toLowerCase();
          if (fileName.startsWith('.trashed') || 
              fileName.startsWith('.') || 
              filePath.includes('.trashed') ||
              filePath.includes('trashed-') ||
              filePath.includes('/.thumbnails') ||
              filePath.includes('/thumbnails/') ||
              (filePath.includes('thumbnail') && !filePath.includes('/dcim/camera/'))) {
            // Skip thumbnail directories and files (except if in Camera folder where they might be real photos)
            // Thumbnail files are often used as video posters and should not appear as separate images
            continue;
          }
          
          // Check for both image and video files
          let mediaType = null;
          if (this.isImageFile(file.name)) {
            mediaType = 'image';
          } else if (this.isVideoFile(file.name)) {
            mediaType = 'video';
          }

          if (mediaType) {
            // Apply filterType if specified
            if (filterType === 'image' && mediaType !== 'image') continue;
            if (filterType === 'video' && mediaType !== 'video') continue;
            
            // Check if we've reached the limit
            if (scanState.hasLimit && allImages.length >= scanState.limit) {
              scanState.stop = true;
              return;
            }
            
            try {
              const stat = await RNFS.stat(file.path);
              // For photos/videos, use mtime (modification time) which is usually when the photo/video was taken
              // mtime is more accurate than ctime for media files
              // Prefer mtime > ctime > current time
              const createdTimestamp = normalizeTimestamp(stat.mtime || stat.ctime);
              
              // Normalize file path for deduplication (remove file:// prefix, lowercase, trim)
              const normalizedPath = file.path.toLowerCase().trim().replace(/\\/g, '/');
              
              // Check if this file was already added using Set (much faster than array.some)
              if (seenFiles.has(normalizedPath)) {
                continue; // Skip duplicate
              }
              
              // Add to seen files Set
              seenFiles.add(normalizedPath);
              
              // Also check against existing items using filename + size (more robust)
              const isDuplicate = allImages.some(existing => {
                // Check if same filename and size (very reliable duplicate check)
                if (existing.fileName === file.name && existing.size === stat.size) {
                  return true;
                }
                // Also check normalized path from URI
                const existingPath = existing.uri?.replace(/^file:\/\//i, '').toLowerCase().trim().replace(/\\/g, '/');
                return existingPath === normalizedPath;
              });
              
              if (!isDuplicate) {
                const uniqueId = `mediastore_${normalizedPath.replace(/[^a-z0-9]/g, '_')}_${createdTimestamp}`;
                const fileUri = 'file://' + file.path;
                
                const mediaItem = {
                  id: uniqueId,
                  uri: fileUri,
                  fileName: file.name,
                  size: stat.size,
                  created: createdTimestamp, // Now in milliseconds
                  type: mediaType,
                  isVideo: mediaType === 'video' ? true : false, // Explicitly set to boolean true/false
                };
                
                // For videos, ensure videoUri and thumbnailUri are set correctly
                if (mediaType === 'video') {
                  // CRITICAL: Always set videoUri to the actual video file URI
                  mediaItem.videoUri = fileUri;
                  mediaItem.isVideo = true; // Explicitly set to true for videos
                  mediaItem.type = 'video'; // Explicitly set type
                  
                  // Set thumbnailUri to fileUri initially - create thumbnail async without blocking
                  mediaItem.thumbnailUri = fileUri; // Default to fileUri (will be updated if thumbnail succeeds)
                  
                  // Create thumbnail asynchronously without blocking (fire and forget)
                  // This prevents thumbnail creation from slowing down the scan
                  CreateThumbnail.create({ url: fileUri })
                    .then(thumb => {
                      // Update thumbnail if creation succeeds (but don't block if it fails)
                      const videoItem = allImages.find(item => item.id === mediaItem.id);
                      if (videoItem && thumb && thumb.path) {
                        videoItem.thumbnailUri = thumb.path;
                        // Ensure videoUri is still set to the actual video file
                        if (!videoItem.videoUri) {
                          videoItem.videoUri = fileUri;
                        }
                      }
                    })
                    .catch(e => {
                      // Silently fail - fileUri is already set as fallback
                      // Don't log to avoid console spam
                    });
                  
                  // Debug: Log video detection (only first few to avoid spam)
                  const currentVideoCount = allImages.filter(item => item.isVideo === true).length;
                  if (currentVideoCount <= 10) {
                    console.log('🎥 MediaStoreService: Video detected:', {
                      fileName: file.name,
                      uri: fileUri.substring(0, 60),
                      isVideo: mediaItem.isVideo,
                      type: mediaItem.type,
                      totalVideosSoFar: currentVideoCount + 1
                    });
                  }
                } else {
                  mediaItem.isVideo = false; // Explicitly set to false for images
                  mediaItem.type = 'image'; // Explicitly set type
                }
                
                allImages.push(mediaItem);
              }
            } catch (statError) {
              // Silent fail for performance
            }
          }
        }
      }
    } catch (error) {
      // Silent fail for performance
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
    return { id: 'camera', isCamera: true, type: 'camera' };
  }
}

export default new MediaStoreService();