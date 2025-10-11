import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { FilterIconDating, NotificationIconDating, SwitchIcon } from '../icons/SvgIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setMode } from '../../redux/slices/roleSlice';

const DatingHeader = ({ onMenuPress, onNotificationPress, showDiscover = false, showProfile = false, showMessage = false }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentMode = useSelector((state) => state.role.currentMode);

  const handleModeToggle = () => {
    const newMode = currentMode === 'social' ? 'dating' : 'social';
    dispatch(setMode(newMode));
  };

  const handleFilterPress = () => {
    navigation.navigate('DatingFilterOptions');
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftIcons}>
        {showDiscover ? (
          <Text style={styles.discoverText}>Discover</Text>
        ) : showProfile ? (
          <Text style={styles.profileText}>Profile</Text>
        ) : showMessage ? (
          <Text style={styles.messageText}>Messages</Text>
        ) : (
          <>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleFilterPress}
              activeOpacity={0.7}
            >
              <FilterIconDating width={25} height={30} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotificationPress}
              activeOpacity={0.7}
            >
              <NotificationIconDating width={25} height={30} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.switchText}>
          Switch to{'\n'}Social Vibe
        </Text>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={handleModeToggle}
          activeOpacity={0.7}
        >
          <SwitchIcon isDatingMode={currentMode === 'dating'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : StatusBar.currentHeight + 15,
    paddingBottom: 8,
    height: Platform.OS === 'android' ? 50 + StatusBar.currentHeight + 8 : 65 + StatusBar.currentHeight + 15,
    backgroundColor: '#140034',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
    padding: 5,
  },
  switchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    marginRight: 12,
    lineHeight: 18,
  },
  switchButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discoverText: {
    color: '#DD3562',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Lexend',
  },
  profileText: {
    color: '#DD3562',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Lexend',
  },
  messageText: {
    color: '#DD3562',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Lexend',
  },
});

export default DatingHeader;
