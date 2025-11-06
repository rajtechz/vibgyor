import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Modal,
  Alert,
  PanResponder,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageCropModal = ({ visible, onClose, onImageCropped, imageUri, mediaType = 'image' }) => {
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCropFrame, setShowCropFrame] = useState(false);
  const [cropArea, setCropArea] = useState({
    x: 20,
    y: 20,
    width: screenWidth - 80,
    height: (screenHeight - 200) * 0.6 - 40,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  
  const pan = useRef(new Animated.ValueXY()).current;
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const isVideo = mediaType === 'video';
  const [draggingHandle, setDraggingHandle] = useState(null);
  const [minCropSize] = useState(50);

  // Auto-play video when modal opens (Instagram style)
  useEffect(() => {
    if (visible && isVideo) {
      setIsVideoPaused(false);
    } else if (!visible && isVideo) {
      setIsVideoPaused(true);
    }
  }, [visible, isVideo]);

  // Reset crop frame when modal opens
  useEffect(() => {
    if (visible) {
      setShowCropFrame(false);
      setCropArea({
        x: 20,
        y: 20,
        width: screenWidth - 40,
        height: screenHeight - 260, // Full height minus header and button
      });
      setDraggingHandle(null);
      setIsDragging(false);
    }
  }, [visible]);

  // PanResponder for crop area interaction
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => showCropFrame && !draggingHandle,
      onMoveShouldSetPanResponder: () => showCropFrame && !draggingHandle,
      onPanResponderGrant: (evt) => {
        if (!showCropFrame || draggingHandle) return;
        setIsDragging(true);
        setDragStart({ x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY });
      },
      onPanResponderMove: (evt) => {
        if (!showCropFrame || draggingHandle) return;
        
        try {
          const { locationX, locationY } = evt.nativeEvent;
          const deltaX = locationX - dragStart.x;
          const deltaY = locationY - dragStart.y;
          
          if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
          
          setCropArea(prev => {
            const maxWidth = screenWidth;
            const maxHeight = screenHeight - 200; // Full height minus header and button area
            
            return {
              ...prev,
              x: Math.max(0, Math.min(maxWidth - prev.width, prev.x + deltaX)),
              y: Math.max(0, Math.min(maxHeight - prev.height, prev.y + deltaY)),
            };
          });
          
          setDragStart({ x: locationX, y: locationY });
        } catch (error) {
          console.warn('Error in main pan responder:', error);
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
    })
  ).current;

  // PanResponder for corner handles - stretchable
  const createCornerPanResponder = (handleType) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (!showCropFrame) return;
        setDraggingHandle(handleType);
        setDragStart({ x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY });
      },
      onPanResponderMove: (evt) => {
        if (!showCropFrame || draggingHandle !== handleType) return;
        
        try {
          const { locationX, locationY } = evt.nativeEvent;
          const deltaX = locationX - dragStart.x;
          const deltaY = locationY - dragStart.y;
          
          if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
          
          setCropArea(prev => {
            const maxWidth = screenWidth;
            const maxHeight = screenHeight - 200; // Full height minus header and button area
            
            let newCropArea = { ...prev };
            
            switch (handleType) {
              case 'topLeft':
                newCropArea.x = Math.max(0, prev.x + deltaX);
                newCropArea.y = Math.max(0, prev.y + deltaY);
                newCropArea.width = Math.max(minCropSize, prev.width - deltaX);
                newCropArea.height = Math.max(minCropSize, prev.height - deltaY);
                break;
              case 'topRight':
                newCropArea.y = Math.max(0, prev.y + deltaY);
                newCropArea.width = Math.max(minCropSize, Math.min(prev.width + deltaX, maxWidth - prev.x));
                newCropArea.height = Math.max(minCropSize, prev.height - deltaY);
                break;
              case 'bottomLeft':
                newCropArea.x = Math.max(0, prev.x + deltaX);
                newCropArea.width = Math.max(minCropSize, prev.width - deltaX);
                newCropArea.height = Math.max(minCropSize, Math.min(prev.height + deltaY, maxHeight - prev.y));
                break;
              case 'bottomRight':
                newCropArea.width = Math.max(minCropSize, Math.min(prev.width + deltaX, maxWidth - prev.x));
                newCropArea.height = Math.max(minCropSize, Math.min(prev.height + deltaY, maxHeight - prev.y));
                break;
            }
            
            newCropArea.x = Math.max(0, Math.min(newCropArea.x, maxWidth - newCropArea.width));
            newCropArea.y = Math.max(0, Math.min(newCropArea.y, maxHeight - newCropArea.height));
            newCropArea.width = Math.max(minCropSize, newCropArea.width);
            newCropArea.height = Math.max(minCropSize, newCropArea.height);
            
            return newCropArea;
          });
          
          setDragStart({ x: locationX, y: locationY });
        } catch (error) {
          console.warn('Error in corner pan responder:', error);
        }
      },
      onPanResponderRelease: () => {
        setDraggingHandle(null);
      },
    });
  };

  const handleCrop = () => {
    if (!imageUri || isVideo) return;
    setShowCropFrame(true);
    setDraggingHandle(null);
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    if (!imageUri) {
      Alert.alert('Error', `No ${isVideo ? 'video' : 'image'} selected`);
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const croppedMedia = {
        uri: imageUri,
        width: showCropFrame ? cropArea.width : imageDimensions.width,
        height: showCropFrame ? cropArea.height : imageDimensions.height,
        fileName: isVideo ? `video_${Date.now()}.mp4` : `cropped_${Date.now()}.jpg`,
        type: isVideo ? 'video' : 'image',
        cropArea: showCropFrame ? cropArea : null,
      };
      
      onClose();
      onImageCropped(croppedMedia);
      setIsProcessing(false);
    }, 1000);
  };

  const handleNext = () => {
    if (!imageUri) {
      Alert.alert('Error', `No ${isVideo ? 'video' : 'image'} selected`);
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const croppedMedia = {
        uri: imageUri,
        width: showCropFrame ? cropArea.width : imageDimensions.width,
        height: showCropFrame ? cropArea.height : imageDimensions.height,
        fileName: isVideo ? `video_${Date.now()}.mp4` : `cropped_${Date.now()}.jpg`,
        type: isVideo ? 'video' : 'image',
        cropArea: showCropFrame ? cropArea : null,
      };
      
      setIsProcessing(false);
      
      // Navigate to UploadVibesScreen
      onClose();
      navigation.navigate('UploadVibes', {
        imageUri: imageUri,
        mediaType: mediaType,
        croppedMedia: croppedMedia,
      });
    }, 300);
  };

  // Crop Icon Component
  const CropIcon = ({ width = 20, height = 20, color = "#fff" }) => (
    <View style={{ width, height }}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: width * 0.6,
        height: 2,
        backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 2,
        height: width * 0.6,
        backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: width * 0.6,
        height: 2,
        backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 2,
        height: width * 0.6,
        backgroundColor: color,
      }} />
    </View>
  );

  // Back Icon Component
  const BackIcon = () => (
    <Text style={styles.backIcon}>←</Text>
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        {/* Header - Screenshot2 style: Back left, Crop right */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
          <View style={styles.headerCenter} />
          {!isVideo && (
            <TouchableOpacity onPress={handleCrop} style={styles.cropButton}>
              <CropIcon width={20} height={20} color="#fff" />
              <Text style={styles.cropButtonText}>Crop</Text>
            </TouchableOpacity>
          )}
          {isVideo && <View style={styles.cropButton} />}
        </View>

        {/* Media (Image/Video) with interactive crop area */}
        <View style={styles.imageContainer}>
          {imageUri ? (
            <View style={styles.imageWrapper}>
              {isVideo ? (
                <View style={styles.videoWrapper}>
                  <Video
                    ref={videoRef}
                    source={{ uri: imageUri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                    paused={isVideoPaused}
                    repeat={true}
                    muted={false}
                    controls={true}
                    playInBackground={false}
                    playWhenInactive={false}
                    onLoad={(data) => {
                      setImageDimensions({ width: data.width || screenWidth, height: data.height || (screenHeight - 200) });
                    }}
                    onError={(error) => {
                      console.error('❌ Video error:', error);
                      Alert.alert('Error', 'Failed to load video');
                    }}
                  />
                </View>
              ) : (
                <Image 
                  ref={imageRef}
                  source={{ uri: imageUri }} 
                  style={styles.previewImage}
                  resizeMode="contain"
                  onLoad={(event) => {
                    const { width, height } = event.nativeEvent.source;
                    setImageDimensions({ width, height });
                  }}
                />
              )}
              
              {/* Interactive Crop Area - Only show when crop button is clicked (images only) */}
              {showCropFrame && !isVideo && (
                <View style={styles.cropContainer}>
                  {/* Dark overlay outside crop area */}
                  <View style={[styles.overlayTop, { height: cropArea.y }]} />
                  <View style={[styles.overlayBottom, { 
                    height: (screenHeight - 200) - cropArea.y - cropArea.height 
                  }]} />
                  <View style={[styles.overlayLeft, { 
                    top: cropArea.y,
                    width: cropArea.x,
                    height: cropArea.height 
                  }]} />
                  <View style={[styles.overlayRight, { 
                    top: cropArea.y,
                    width: screenWidth - cropArea.x - cropArea.width,
                    height: cropArea.height 
                  }]} />
                  
                  {/* Crop area frame with stretchable corners */}
                  <View 
                    style={[
                      styles.cropFrame,
                      {
                        left: cropArea.x,
                        top: cropArea.y,
                        width: cropArea.width,
                        height: cropArea.height,
                      }
                    ]}
                    {...panResponder.panHandlers}
                  >
                    {/* Corner handles for resizing - STRETCHABLE */}
                    <View 
                      style={[styles.cornerHandle, styles.topLeft]} 
                      {...createCornerPanResponder('topLeft').panHandlers}
                    />
                    <View 
                      style={[styles.cornerHandle, styles.topRight]} 
                      {...createCornerPanResponder('topRight').panHandlers}
                    />
                    <View 
                      style={[styles.cornerHandle, styles.bottomLeft]} 
                      {...createCornerPanResponder('bottomLeft').panHandlers}
                    />
                    <View 
                      style={[styles.cornerHandle, styles.bottomRight]} 
                      {...createCornerPanResponder('bottomRight').panHandlers}
                    />
                    
                    {/* 3x3 Grid inside crop area */}
                    <View style={styles.gridOverlay}>
                      <View style={[styles.gridLine, styles.verticalLine1]} />
                      <View style={[styles.gridLine, styles.verticalLine2]} />
                      <View style={[styles.gridLine, styles.horizontalLine1]} />
                      <View style={[styles.gridLine, styles.horizontalLine2]} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image Selected</Text>
            </View>
          )}
        </View>

        {/* Next Button - Bottom centered (Screenshot2 style) */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[styles.nextButton, isProcessing && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {isProcessing ? 'Processing...' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1a0033',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
  },
  cropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cropButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 0, // Remove padding to fill entire space
    width: '100%', // Full screen width
  },
  imageWrapper: {
    position: 'relative',
    width: screenWidth, // Full width - touch both sides
    height: screenHeight - 200, // Fill most of screen height
    flex: 1,
    alignSelf: 'stretch', // Stretch to full width
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 0, // No border radius to fill edge to edge
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0, // Remove border radius to fill edge to edge
  },
  cropContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayLeft: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayRight: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cropFrame: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  cornerHandle: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#DD3562',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  topLeft: {
    top: -12,
    left: -12,
  },
  topRight: {
    top: -12,
    right: -12,
  },
  bottomLeft: {
    bottom: -12,
    left: -12,
  },
  bottomRight: {
    bottom: -12,
    right: -12,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  verticalLine1: {
    width: 1,
    height: '100%',
    left: '33.33%',
  },
  verticalLine2: {
    width: 1,
    height: '100%',
    left: '66.66%',
  },
  horizontalLine1: {
    height: 1,
    width: '100%',
    top: '33.33%',
  },
  horizontalLine2: {
    height: 1,
    width: '100%',
    top: '66.66%',
  },
  placeholderImage: {
    width: screenWidth - 40,
    height: (screenHeight - 200) * 0.6,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 15,
    backgroundColor: '#000', // Black background - no purple
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 80, // Small space for button at bottom
  },
  nextButton: {
    backgroundColor: '#2a2a2a', // Dark charcoal gray (NOT pink - like screenshot)
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    maxWidth: 150, // Reduced button width - smaller
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0.1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ImageCropModal;
