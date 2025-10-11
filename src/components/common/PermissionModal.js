// src/components/common/PermissionModal.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
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

// Camera Icon Component
const CameraIcon = ({ width = 60, height = 60 }) => (
  <Svg width={width} height={height} viewBox="0 0 60 60" fill="none">
    <Path
      d="M30 5C16.745 5 6 15.745 6 30C6 44.255 16.745 55 30 55C43.255 55 54 44.255 54 30C54 15.745 43.255 5 30 5Z"
      fill="url(#paint0_linear_camera)"
      stroke="#DD3562"
      strokeWidth="2"
    />
    <Path
      d="M30 20C25.582 20 22 23.582 22 28C22 32.418 25.582 36 30 36C34.418 36 38 32.418 38 28C38 23.582 34.418 20 30 20Z"
      fill="white"
    />
    <Path
      d="M30 20C25.582 20 22 23.582 22 28C22 32.418 25.582 36 30 36C34.418 36 38 32.418 38 28C38 23.582 34.418 20 30 20Z"
      stroke="white"
      strokeWidth="2"
    />
    <Path
      d="M30 24C27.791 24 26 25.791 26 28C26 30.209 27.791 32 30 32C32.209 32 34 30.209 34 28C34 25.791 32.209 24 30 24Z"
      fill="#DD3562"
    />
    <Path
      d="M20 20H16C15.448 20 15 20.448 15 21V25C15 25.552 15.448 26 16 26H20"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M40 20H44C44.552 20 45 20.448 45 21V25C45 25.552 44.552 26 44 26H40"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <SvgLinearGradient id="paint0_linear_camera" x1="6" y1="6" x2="54" y2="54" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

// Settings Icon Component
const SettingsIcon = ({ width = 20, height = 20, color = '#FFFFFF' }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.6066 6.3934L14.5355 5.32233C14.2426 5.02944 14.2426 4.55456 14.5355 4.26167L15.7383 3.05885C16.0312 2.76596 16.5061 2.76596 16.799 3.05885L17.8701 4.12992C18.163 4.42281 18.163 4.89769 17.8701 5.19058L16.6673 6.3934C16.3744 6.68629 15.8995 6.68629 15.6066 6.3934Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.3934 13.6066L5.46447 14.6777C5.75736 14.9706 5.75736 15.4454 5.46447 15.7383L4.26165 16.9412C3.96876 17.234 3.49388 17.234 3.20099 16.9412L2.12992 15.8701C1.83703 15.5772 1.83703 15.1023 2.12992 14.8094L3.33274 13.6066C3.62563 13.3137 4.10051 13.3137 4.3934 13.6066Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.3934 4.3934L5.32233 5.46447C5.02944 5.75736 5.02944 6.23224 5.32233 6.52513L6.52513 7.72795C6.81802 8.02084 7.2929 8.02084 7.58579 7.72795L8.65686 6.65688C8.94975 6.36399 8.94975 5.88911 8.65686 5.59622L7.45404 4.3934C7.16115 4.10051 6.68629 4.10051 6.3934 4.3934Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.6066 15.6066L14.6777 14.5355C14.9706 14.2426 14.9706 13.7678 14.6777 13.4749L13.4749 12.2721C13.182 11.9792 12.7071 11.9792 12.4142 12.2721L11.3431 13.3431C11.0502 13.636 11.0502 14.1109 11.3431 14.4038L12.5459 15.6066C12.8388 15.8995 13.3137 15.8995 13.6066 15.6066Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function PermissionModal({ 
  visible, 
  title = "Camera Permission Required", 
  message = "Camera permission is required to take photos. Please enable it in settings.", 
  onClose, 
  onOpenSettings 
}) {
  if (!visible) return null;

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
                <CameraIcon width={70} height={70} />
              </View>
              
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalMessage}>{message}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={onOpenSettings}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={gradients.primary}
                    style={styles.settingsButtonGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  >
                    <SettingsIcon width={18} height={18} color="#FFFFFF" />
                    <Text style={styles.settingsButtonText}>Open Settings</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalGradient: {
    borderRadius: 24,
    padding: 3,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 21,
    padding: 32,
    paddingTop: 60,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.lightGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 16,
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.lightGray,
  },
  settingsButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  settingsButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default PermissionModal;
