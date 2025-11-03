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
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { CropView } from 'react-native-image-crop-tools';
import Svg, { Path } from 'react-native-svg';
import { setCurrentScreen, hideTabBar, showTabBar } from '../../../redux/slices/uiSlice';

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

// Crop Icon (Grid)
const CropIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2V6H2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 2V6H22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 22V18H22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 22V18H2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12H22"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="2 2"
    />
    <Path
      d="M12 2V22"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="2 2"
    />
  </Svg>
);

function CropScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  const { imageUri } = route.params || {};
  const cropViewRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Redux-based tab bar hiding when CropScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('✂️ CropScreen Focused - Hiding TabBar');
      // Dispatch Redux actions to hide tab bar and set crop screen as active
      dispatch(setCurrentScreen('Crop'));
      dispatch(hideTabBar());
      
      // Show tab bar when screen is unfocused
      return () => {
        console.log('✂️ CropScreen Unfocused - Showing TabBar');
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [navigation, dispatch])
  );

  // Additional backup using useLayoutEffect
  useLayoutEffect(() => {
    dispatch(setCurrentScreen('Crop'));
    dispatch(hideTabBar());

    return () => {
      dispatch(showTabBar());
      dispatch(setCurrentScreen(null));
    };
  }, [dispatch]);

  const handleNext = async () => {
    if (!imageUri || !cropViewRef.current) {
      Alert.alert('Error', 'No image available');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('📸 Starting crop process...');
      
      // Use CropView's saveImage method to crop and save
      const croppedPath = await cropViewRef.current.saveImage(true, 90);
      
      console.log('✅ Image cropped successfully:', croppedPath);
      
      const croppedUri = croppedPath.startsWith('file://') ? croppedPath : `file://${croppedPath}`;
      
      const finalImage = {
        uri: croppedUri,
        type: 'image',
        // Dimensions will be set by the crop operation
      };

      // Navigate to FilterScreen
      navigation.navigate('Filter', { 
        croppedImage: finalImage
      });
    } catch (error) {
      console.error('❌ Error cropping image:', error);
      Alert.alert('Error', 'Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    // Dispatch Redux actions to show tab bar before going back
    dispatch(showTabBar());
    dispatch(setCurrentScreen(null));
    
    // Check if we can go back, otherwise navigate to PostMain
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback: navigate to PostMain if there's no previous screen
      navigation.navigate('PostMain');
    }
  };

  const handleImageCrop = (res) => {
    console.log('📸 Image crop callback:', res);
    if (res) {
      setImageLoaded(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Crop Container - Full screen */}
      <View style={styles.cropContainer}>
        {imageUri ? (
          <CropView
            sourceUrl={imageUri}
            style={styles.cropView}
            ref={cropViewRef}
            onImageCrop={handleImageCrop}
            keepAspectRatio={false}
            aspectRatio={{ width: 1, height: 1 }}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image Selected</Text>
          </View>
        )}
      </View>

      {/* Header - Overlay on top of image */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon width={24} height={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Crop</Text>
            <CropIcon width={20} height={20} color="white" />
          </View>
        
        </View>
      </SafeAreaView>

      {/* Next Button - Overlay at bottom */}
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[styles.nextButton, (!imageLoaded || isProcessing) && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!imageLoaded || isProcessing}
          >
            <Text style={styles.nextButtonText}>
              {isProcessing ? 'Processing...' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: SCREEN_WIDTH,
  },
  cropContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    width: SCREEN_WIDTH,
  },
  cropView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
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
 
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 30,
    backgroundColor: '#140034',
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
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
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#140034',
  },
  nextButton: {
    backgroundColor: '#DD3562',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#DD3562',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0.1,
  },
});

export default CropScreen;
