// src/utils/appConfig.js

/**
 * App Configuration
 * Set ALWAYS_START_FRESH to true to always start from splash screen
 * Set to false to remember user authentication state
 */
export const APP_CONFIG = {
  ALWAYS_START_FRESH: false, // Set to false to remember user state and avoid re-navigation to profile setup
};

/**
 * Get the initial route based on configuration and auth status
 */
export const getInitialRoute = async (checkAuthStatus) => {
  if (APP_CONFIG.ALWAYS_START_FRESH) {
    return 'Auth';
  }
  
  try {
    const { isVerified, isProfileSetupDone } = await checkAuthStatus();
    
    if (!isVerified) {
      return 'Auth';
    } else if (isVerified && !isProfileSetupDone) {
      return 'ProfileSetup';
    } else {
      return 'Main';
    }
  } catch (error) {
    console.log('Error checking auth status:', error);
    return 'Auth'; // fallback to auth flow
  }
};
