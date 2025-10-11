import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SwitchIcon } from '../icons/SvgIcons';
import { setMode } from '../../redux/slices/roleSlice';

const VLogo = () => {
  const { width: screenWidth } = Dimensions.get('window');
  const logoSize = Math.max(16, screenWidth * 0.08); // Reduced minimum size to 16 and 8% of screen width

  return (
    <Image
      source={require('../../assets/icons/logo.png')}
      style={[styles.logoImage, { width: logoSize, height: logoSize }]}
    />
  );
};

const ModeSwitchHeader = ({ style, showSwitchButton = true, customTitle = null, navigation }) => {
  const dispatch = useDispatch();
  const currentMode = useSelector((state) => state.role.currentMode);

  const handleModeToggle = () => {
    const newMode = currentMode === 'social' ? 'dating' : 'social';
    dispatch(setMode(newMode));
  };

  return (
    <View style={[styles.scrollableHeader, style]}>
      {customTitle ? (
        <Text style={styles.customTitle}>{customTitle}</Text>
      ) : (
        <VLogo />
      )}
      {showSwitchButton && (
        <TouchableOpacity style={styles.switchButton} onPress={handleModeToggle} activeOpacity={0.7}>
          <Text style={styles.switchText}>
            {currentMode === 'dating' ? 'Switch to Social' : 'Switch to\nDating Vibe'}
          </Text>
          <SwitchIcon isDatingMode={currentMode === 'dating'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#140034',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
 
  logoImage: {
    // Width and height are now set dynamically in the component
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  customTitle: {
    color: '#DD3562',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ModeSwitchHeader;
