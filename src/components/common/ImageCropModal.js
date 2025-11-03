// ImageCropModal.js (AS IT IS)
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import Video from 'react-native-video';

const ImageCropModal = ({ visible, onClose, onImageCropped, imageUri, mediaType }) => {
  const isVideo = mediaType === 'video';
  const videoRef = useRef(null);

  useEffect(() => {
    if (visible && isVideo) {
      console.log('VIDEO PLAYING:', imageUri);
    }
  }, [visible]);

  const handleNext = () => {
    if (!imageUri) return;
    onImageCropped({
      uri: imageUri,
      type: isVideo ? 'video' : 'image',
      fileName: isVideo ? `video_${Date.now()}.mp4` : `img_${Date.now()}.jpg`,
      width: 1080,
      height: 1920,
    });
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Crop {isVideo ? 'Video' : 'Image'}</Text>
          <TouchableOpacity onPress={handleNext}>
            <Text style={styles.next}>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mediaContainer}>
          {isVideo ? (
            <Video
              ref={videoRef}
              source={{ uri: imageUri }}
              style={styles.media}
              resizeMode="cover"
              repeat={true}
              controls={true}
              onError={(e) => Alert.alert('Error', 'Video failed to load')}
            />
          ) : (
            <Image source={{ uri: imageUri }} style={styles.media} resizeMode="cover" />
          )}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#1a0033' },
  back: { color: '#fff', fontSize: 18 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  next: { color: '#DD3562', fontSize: 18, fontWeight: 'bold' },
  mediaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  media: { width: '90%', height: '70%', borderRadius: 12 },
  nextButton: { backgroundColor: '#DD3562', margin: 20, padding: 15, borderRadius: 30, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ImageCropModal;