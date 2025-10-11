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

  // Fetch images from device gallery using MediaStore
  async fetchGalleryImages() {
    // Instagram style - always try to get real images first
    this.permissionsGranted = true;

    try {
      if (Platform.OS === 'android') {
        // Add timeout to prevent hanging
        const images = await Promise.race([
          this.fetchAndroidImages(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Media scan timeout')), 10000)
          )
        ]);
        
        if (images.length > 0) {
          console.log('✅ Found real Android images:', images.length);
          return images;
        }
      } else {
        const images = await this.fetchIOSImages();
        if (images.length > 0) {
          console.log('✅ Found real iOS images:', images.length);
          return images;
        }
      }
      
      // If no real images found, return empty array
      console.log('❌ No real images found');
      return [];
    } catch (error) {
      console.error('❌ Error fetching gallery images:', error);
      return [];
    }
  }

  // Alternative method using react-native-image-picker
  async fetchImagesWithImagePicker() {
    // Don't return sample images - return empty array so gallery placeholders are shown
    console.log('No real images found, will show gallery placeholders');
    return [];
  }

  // Android MediaStore implementation - fetch real device photos
  async fetchAndroidImages() {
    try {
      console.log('🔍 Starting Android media scan...');
      
      // Get external storage path
      const externalPath = RNFS.ExternalStorageDirectoryPath;
      console.log('📱 External storage path:', externalPath);
      
      // Try to read from ALL possible Android photo directories
      const directories = [
        RNFS.DCIMDirectoryPath,
        RNFS.PicturesDirectoryPath,
        externalPath + '/DCIM',
        externalPath + '/DCIM/Camera',
        externalPath + '/Pictures',
        externalPath + '/Download',
        externalPath + '/WhatsApp/Media/WhatsApp Images',
        externalPath + '/WhatsApp/Media/WhatsApp Video',
        externalPath + '/Telegram',
        externalPath + '/Instagram',
        externalPath + '/Snapchat',
        externalPath + '/Screenshots',
        externalPath + '/Movies',
      ];

      const allImages = [];
      let totalScanned = 0;

      for (const dir of directories) {
        try {
          console.log('📂 Scanning directory:', dir);
          const dirExists = await RNFS.exists(dir);
          if (dirExists) {
            await this.scanDirectoryRecursively(dir, allImages);
            totalScanned++;
            console.log(`✅ Directory ${dir} scanned successfully`);
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
      console.log(`📱 Media types: ${allImages.filter(i => i.type === 'image').length} photos, ${allImages.filter(i => i.type === 'video').length} videos`);
      
      // Return ALL real images - no limits
      return allImages;

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
              const mediaItem = {
                id: `real_${file.name}_${stat.ctime}_${Math.random()}`,
                uri: 'file://' + file.path,
                fileName: file.name,
                size: stat.size,
                created: stat.ctime,
                type: mediaType,
                isVideo: mediaType === 'video',
              };
              
              allImages.push(mediaItem);
              console.log(`📸 Added ${mediaType}: ${file.name}`);
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
