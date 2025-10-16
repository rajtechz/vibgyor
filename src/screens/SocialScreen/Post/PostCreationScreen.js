import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import CommonBackground from '../../../components/common/CommonBackground';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Back Icon Component
const BackIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
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

// Camera Icon Component
const CameraIcon = ({ width = 24, height = 24, color = 'white' }) => (
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

// Gallery Icon Component
const GalleryIcon = ({ width = 24, height = 24, color = 'white' }) => (
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

// Video Icon Component
const VideoIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 7L16 12L23 17V7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Sticker Icon Component
const StickerIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 14S9.5 16 12 16S16 14 16 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 9H9.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 9H15.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function PostCreationScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Images');
  const [selectedImages, setSelectedImages] = useState([]);

  const tabs = [
    { id: 'Images', label: 'Images', icon: GalleryIcon },
    { id: 'Vibes', label: 'Vibes', icon: CameraIcon },
    { id: 'Videos', label: 'Videos', icon: VideoIcon },
    { id: 'Sticker', label: 'Sticker', icon: StickerIcon },
  ];

  // Request camera permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Vibgyor needs access to your camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Request storage permission
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Vibgyor needs access to your photos to select images',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Open camera
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to open camera');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setSelectedImages(prev => [...prev, {
          uri: asset.uri,
          type: 'camera',
          fileName: asset.fileName || 'camera_photo.jpg',
        }]);
        console.log('Camera photo captured:', asset.uri);
      }
    });
  };

  // Open gallery
  const openGallery = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to access photos');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      selectionLimit: 10, // Allow multiple selection
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
      } else if (response.errorMessage) {
        console.log('Gallery Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to open gallery');
      } else if (response.assets) {
        const newImages = response.assets.map(asset => ({
          uri: asset.uri,
          type: 'gallery',
          fileName: asset.fileName || 'gallery_image.jpg',
        }));
        setSelectedImages(prev => [...prev, ...newImages]);
        console.log('Gallery images selected:', newImages.length);
      }
    });
  };

  // Handle tab press
  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    
    switch (tabId) {
      case 'Images':
        openGallery();
        break;
      case 'Vibes':
        openCamera();
        break;
      case 'Videos':
        // Handle video recording
        Alert.alert('Videos', 'Video recording feature coming soon!');
        break;
      case 'Sticker':
        // Handle sticker selection
        Alert.alert('Stickers', 'Sticker selection feature coming soon!');
        break;
      default:
        break;
    }
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Create Post</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {selectedImages.length > 0 ? (
          <ScrollView style={styles.imageGrid}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                <Text style={styles.imageLabel}>
                  {image.type === 'camera' ? '📷 Camera' : '🖼️ Gallery'}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Select a tab below to start creating your post
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={[styles.bottomTabBar, { paddingBottom: insets.bottom + 10 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, isActive && styles.activeTabButton]}
                onPress={() => handleTabPress(tab.id)}
                activeOpacity={0.8}
              >
                {isActive ? (
                  <LinearGradient
                    colors={['#C53E8D', '#8A52F3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tabGradient}
                  >
                    <IconComponent width={20} height={20} color="white" />
                    <Text style={styles.activeTabText}>{tab.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveTabContent}>
                    <IconComponent width={20} height={20} color="#B0B0B0" />
                    <Text style={styles.inactiveTabText}>{tab.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#140034',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
  },
  imageGrid: {
    flex: 1,
  },
  imageContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  bottomTabBar: {
    backgroundColor: '#140034',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 15,
  },
  tabContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  tabButton: {
    minWidth: 80,
    alignItems: 'center',
  },
  activeTabButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  inactiveTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  activeTabText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#B0B0B0',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PostCreationScreen;
