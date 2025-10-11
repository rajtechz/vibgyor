// src/components/common/UploadModal.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../../styles/colors';

const { width, height } = Dimensions.get('window');

// Camera Icon Component
const CameraIcon = ({ width = 32, height = 32, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
    <Circle cx="20" cy="20" r="18" stroke={color} strokeWidth="2" fill="none"/>
    <Path
      d="M20 12C20 10.8954 20.8954 10 22 10H24C25.1046 10 26 10.8954 26 12V14H28C29.1046 14 30 14.8954 30 16V28C30 29.1046 29.1046 30 28 30H12C10.8954 30 10 29.1046 10 28V16C10 14.8954 10.8954 14 12 14H14V12C14 10.8954 14.8954 10 16 10H18C19.1046 10 20 10.8954 20 12Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="20" cy="22" r="4" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

// Gallery Icon Component
const GalleryIcon = ({ width = 32, height = 32, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
    <Path
      d="M8 12C8 10.8954 8.89543 10 10 10H30C31.1046 10 32 10.8954 32 12V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V12Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M14 18L18 14L22 18L26 14L30 18V28H10V18L14 18Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="16" cy="20" r="2" fill={color}/>
  </Svg>
);

// Close Icon Component
const CloseIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
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

const UploadModal = ({ visible, onClose, onCameraPress, onGalleryPress }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.8)" />
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Upload Document</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <CloseIcon width={24} height={24} color="#D9D8F3" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.subtitle}>
                Choose how you'd like to upload your ID document
              </Text>

              {/* Upload Options */}
              <View style={styles.optionsContainer}>
                {/* Camera Option */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={onCameraPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <CameraIcon width={32} height={32} color="#B58FDB" />
                    <Text style={styles.optionText}>Take Photo</Text>
                    <Text style={styles.optionSubtext}>Use camera to capture your ID</Text>
                  </View>
                </TouchableOpacity>

                {/* Gallery Option */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={onGalleryPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <GalleryIcon width={32} height={32} color="#B58FDB" />
                    <Text style={styles.optionText}>Choose from Gallery</Text>
                    <Text style={styles.optionSubtext}>Select from your photos</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Footer Info */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Make sure your ID is clearly visible and well-lit
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 350,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(221, 53, 98, 0.3)',
    padding: 16,
    marginVertical: 4,
  },
  optionContent: {
    alignItems: 'center',
    gap: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  optionSubtext: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    opacity: 0.7,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 16,
  },
});

export default UploadModal;
