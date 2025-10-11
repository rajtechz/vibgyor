// src/utils/authUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clear all authentication and profile setup data
 * Useful for testing or logout functionality
 */
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['isVerified', 'isProfileSetup']);
    console.log('Authentication data cleared successfully');
  } catch (error) {
    console.error('Error clearing authentication data:', error);
  }
};

/**
 * Check if user is authenticated and profile setup is complete
 */
export const checkAuthStatus = async () => {
  try {
    const verified = await AsyncStorage.getItem('isVerified');
    const profileSetupDone = await AsyncStorage.getItem('isProfileSetup');
    
    return {
      isVerified: verified === 'true',
      isProfileSetupDone: profileSetupDone === 'true',
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return {
      isVerified: false,
      isProfileSetupDone: false,
    };
  }
};

/**
 * Set verification status
 */
export const setVerificationStatus = async (isVerified = true) => {
  try {
    await AsyncStorage.setItem('isVerified', isVerified.toString());
  } catch (error) {
    console.error('Error setting verification status:', error);
  }
};

/**
 * Set profile setup completion status
 */
export const setProfileSetupStatus = async (isComplete = true) => {
  try {
    await AsyncStorage.setItem('isProfileSetup', isComplete.toString());
  } catch (error) {
    console.error('Error setting profile setup status:', error);
  }
};
