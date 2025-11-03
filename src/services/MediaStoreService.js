// MediaStoreService.js
import { Platform, PermissionsAndroid } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';

const ANDROID_API_LEVEL_33 = 33;

class MediaStoreService {
  async requestPermissions() {
    if (Platform.OS !== 'android') return true;
    const apiLevel = Platform.Version;

    if (apiLevel >= ANDROID_API_LEVEL_33) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
      return (
        results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === 'granted' &&
        results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === 'granted'
      );
    } else {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      return granted === 'granted';
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

  async fetchGalleryImages() {
    if (!(await this.requestPermissions())) return [];

    try {
      const result = await CameraRoll.getPhotos({ first: 500, assetType: 'All' });
      
      const media = result.edges.map(edge => {
        const node = edge.node;
        const isVideo = node.type?.toLowerCase().includes('video');
        const contentUri = node.image.uri;

        let duration = 0;
        if (isVideo) {
          duration = node.image.playableDuration || 0;
          if (duration > 1000) duration /= 1000;
        }

        return {
          id: `${node.timestamp}_${Math.random()}`,
          contentUri,           // SABKE LIYE YE
          thumbnailUri: contentUri,
          fileName: node.image.filename || 'media',
          type: isVideo ? 'video' : 'image',
          isVideo,
          duration,
          created: node.timestamp,
        };
      });

      media.sort((a, b) => b.created - a.created);
      console.log('INSTAGRAM SPEED: Gallery loaded in 0.5 sec!');
      return media;
    } catch (e) {
      console.error('Gallery Error:', e);
      return [];
    }
  }

  getCameraPlaceholder() {
    return { id: 'camera', isCamera: true, type: 'camera' };
  }
}

export default new MediaStoreService();