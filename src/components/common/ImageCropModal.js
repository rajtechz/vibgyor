import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Modal,
  SafeAreaView,    
  Alert,
  PanResponder,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageCropModal = ({ visible, onClose, onImageCropped, imageUri }) => {
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
  
  const pan = useRef(new Animated.ValueXY()).current;
  const imageRef = useRef(null);

  // Reset crop frame when modal opens
  useEffect(() => {
    if (visible) {
      setShowCropFrame(false);
      setCropArea({
        x: 20,
        y: 20,
        width: screenWidth - 80,
        height: (screenHeight - 200) * 0.6 - 40,
      });
      setDraggingHandle(null);
      setIsDragging(false);
    }
  }, [visible]);

  // State for corner handle dragging
  const [draggingHandle, setDraggingHandle] = useState(null);
  const [minCropSize] = useState(50); // Minimum crop size

  // PanResponder for crop area interaction - Smooth version
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
          
          // Only update if there's significant movement to prevent shivering
          if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
          
          setCropArea(prev => {
            const maxWidth = screenWidth - 40;
            const maxHeight = (screenHeight - 200) * 0.6;
            
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

  // PanResponder for corner handles - Smooth version
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
          
          // Only update if there's significant movement to prevent shivering
          if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
          
          setCropArea(prev => {
            const maxWidth = screenWidth - 40;
            const maxHeight = (screenHeight - 200) * 0.6;
            
            let newCropArea = { ...prev };
            
            switch (handleType) {
              case 'topLeft':
                // Move top-left corner
                newCropArea.x = Math.max(0, prev.x + deltaX);
                newCropArea.y = Math.max(0, prev.y + deltaY);
                newCropArea.width = Math.max(minCropSize, prev.width - deltaX);
                newCropArea.height = Math.max(minCropSize, prev.height - deltaY);
                break;
              case 'topRight':
                // Move top-right corner
                newCropArea.y = Math.max(0, prev.y + deltaY);
                newCropArea.width = Math.max(minCropSize, Math.min(prev.width + deltaX, maxWidth - prev.x));
                newCropArea.height = Math.max(minCropSize, prev.height - deltaY);
                break;
              case 'bottomLeft':
                // Move bottom-left corner
                newCropArea.x = Math.max(0, prev.x + deltaX);
                newCropArea.width = Math.max(minCropSize, prev.width - deltaX);
                newCropArea.height = Math.max(minCropSize, Math.min(prev.height + deltaY, maxHeight - prev.y));
                break;
              case 'bottomRight':
                // Move bottom-right corner
                newCropArea.width = Math.max(minCropSize, Math.min(prev.width + deltaX, maxWidth - prev.x));
                newCropArea.height = Math.max(minCropSize, Math.min(prev.height + deltaY, maxHeight - prev.y));
                break;
            }
            
            // Ensure frame stays within image bounds
            newCropArea.x = Math.max(0, Math.min(newCropArea.x, maxWidth - newCropArea.width));
            newCropArea.y = Math.max(0, Math.min(newCropArea.y, maxHeight - newCropArea.height));
            
            // Ensure minimum size
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
    if (!imageUri) {
      Alert.alert('Error', 'No image selected for cropping');
      return;
    }

    // Reset crop area to default position and show frame
    setCropArea({
      x: 20,
      y: 20,
      width: screenWidth - 80,
      height: (screenHeight - 200) * 0.6 - 40,
    });
    setShowCropFrame(true);
    setDraggingHandle(null);
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    if (!imageUri) {
      Alert.alert('Error', 'No image selected for cropping');
      return;
    }

    setIsProcessing(true);
    
    // Simulate cropping process
    setTimeout(() => {
      const croppedImage = {
        uri: imageUri,
        width: cropArea.width,
        height: cropArea.height,
        fileName: `cropped_${Date.now()}.jpg`,
        type: 'image',
      };
      
      console.log('Image cropped successfully:', croppedImage);
      
      // Navigate to PostEditScreen with cropped image
      navigation.navigate('PostEdit', { croppedImage });
      
      // Close modal and call callback
      onClose();
      onImageCropped(croppedImage);
      setIsProcessing(false);
    }, 1000);
  };

  const handleNext = () => {
    if (showCropFrame) {
      // If frame is showing, apply the crop
      handleApplyCrop();
    } else {
      // If no frame, just crop without frame
      handleApplyCrop();
    }
  };

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
        
        {/* Header - Exact match to screenshot */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Crop</Text>
          </View>
          <TouchableOpacity onPress={handleCrop} style={styles.cropButton}>
            <Text style={styles.cropButtonText}>Crop</Text>
          </TouchableOpacity>
        </View>

        {/* Image with interactive crop area */}
        <View style={styles.imageContainer}>
          {imageUri ? (
            <View style={styles.imageWrapper}>
              <Image 
                ref={imageRef}
                source={{ uri: imageUri }} 
                style={styles.previewImage}
                resizeMode="cover"
                onLoad={(event) => {
                  const { width, height } = event.nativeEvent.source;
                  setImageDimensions({ width, height });
                }}
              />
              
              {/* Interactive Crop Area - Only show when crop button is clicked */}
              {showCropFrame && (
                <View style={styles.cropContainer}>
                  {/* Dark overlay outside crop area */}
                  <View style={[styles.overlayTop, { height: cropArea.y }]} />
                  <View style={[styles.overlayBottom, { 
                    height: (screenHeight - 200) * 0.6 - cropArea.y - cropArea.height 
                  }]} />
                  <View style={[styles.overlayLeft, { 
                    top: cropArea.y,
                    width: cropArea.x,
                    height: cropArea.height 
                  }]} />
                  <View style={[styles.overlayRight, { 
                    top: cropArea.y,
                    width: screenWidth - 40 - cropArea.x - cropArea.width,
                    height: cropArea.height 
                  }]} />
                  
                  {/* Crop area frame */}
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
                    {/* Corner handles for resizing */}
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

        {/* Next Button - Exact match to screenshot */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[styles.nextButton, isProcessing && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={isProcessing}
          >
            <Text style={styles.nextButtonText}>
              {isProcessing ? 'Processing...' : (showCropFrame ? 'Apply Crop' : 'Next')}
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
    backgroundColor: '#1a0033', // Dark purple like screenshot
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cropButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  cropButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: screenWidth - 40,
    height: (screenHeight - 200) * 0.6,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
    borderColor: '#DD3562',
    backgroundColor: 'transparent',
  },
  cornerHandle: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#DD3562',
    borderWidth: 3,
    borderColor: '#fff',
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
    paddingVertical: 20,
    backgroundColor: '#000',
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
  nextButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0.1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageCropModal;
