// src/components/common/SuccessModal.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';
import { colors, gradients } from '../../styles/colors';

const { width: screenWidth } = Dimensions.get('window');

// Close Icon Component
const CloseIcon = ({ width = 24, height = 24, color = '#FFFFFF' }) => (
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

// Success Icon Component
const SuccessIcon = ({ width = 60, height = 60 }) => (
  <Svg width={width} height={height} viewBox="0 0 60 60" fill="none">
    <Circle
      cx="30"
      cy="30"
      r="25"
      fill="url(#paint0_linear_success)"
      stroke="#00C851"
      strokeWidth="2"
    />
    <Path
      d="M20 30L27 37L40 24"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <SvgLinearGradient id="paint0_linear_success" x1="5" y1="5" x2="55" y2="55" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#00C851"/>
        <Stop offset="1" stopColor="#007E33"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

function SuccessModal({ visible, message, onClose, title = "Success", onButtonPress }) {
  if (!visible) return null;

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={gradients.primary}
            style={styles.modalGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <CloseIcon width={24} height={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.iconContainer}>
                <SuccessIcon width={60} height={60} />
              </View>
              
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalMessage}>{message}</Text>

              <TouchableOpacity
                style={styles.okButton}
                onPress={handleButtonPress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={gradients.primary}
                  style={styles.okButtonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Text style={styles.okButtonText}>OK</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    borderRadius: 20,
    padding: 2,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Lexend-Bold',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.lightGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    fontFamily: 'Lexend-Regular',
  },
  okButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  okButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  okButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'Lexend-SemiBold',
  },
});

export default SuccessModal;

