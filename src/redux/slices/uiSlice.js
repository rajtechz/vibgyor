// src/redux/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isTabBarVisible: true,
  isChatScreenActive: false,
  isCallScreenActive: false,
  isStoryScreenActive: false,
  isSettingsScreenActive: false,
  isProfileDetailsScreenActive: false,
  currentActiveScreen: null,
  hasShownVerifyModal: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showTabBar: (state) => {
      state.isTabBarVisible = true;
      state.isChatScreenActive = false;
      state.isCallScreenActive = false;
      state.isStoryScreenActive = false;
    },
    hideTabBar: (state) => {
      console.log('🔄 Redux: hideTabBar called');
      state.isTabBarVisible = false;
      console.log('🔄 Redux: isTabBarVisible set to:', state.isTabBarVisible);
    },
    setChatScreenActive: (state, action) => {
      state.isChatScreenActive = action.payload;
      state.isTabBarVisible = !action.payload;
      if (action.payload) {
        state.isCallScreenActive = false;
      }
    },
    setCallScreenActive: (state, action) => {
      console.log('🔄 Redux: setCallScreenActive called with:', action.payload);
      state.isCallScreenActive = action.payload;
      state.isTabBarVisible = !action.payload;
      if (action.payload) {
        state.isChatScreenActive = false;
        state.isStoryScreenActive = false;
      }
      console.log('🔄 Redux: New state:', { 
        isCallScreenActive: state.isCallScreenActive, 
        isTabBarVisible: state.isTabBarVisible,
        isChatScreenActive: state.isChatScreenActive 
      });
    },
    setStoryScreenActive: (state, action) => {
      console.log('🔄 Redux: setStoryScreenActive called with:', action.payload);
      state.isStoryScreenActive = action.payload;
      state.isTabBarVisible = !action.payload;
      if (action.payload) {
        state.isChatScreenActive = false;
        state.isCallScreenActive = false;
      }
      console.log('🔄 Redux: New state:', { 
        isStoryScreenActive: state.isStoryScreenActive, 
        isTabBarVisible: state.isTabBarVisible,
        isChatScreenActive: state.isChatScreenActive,
        isCallScreenActive: state.isCallScreenActive
      });
    },
    setSettingsScreenActive: (state, action) => {
      console.log('🔄 Redux: setSettingsScreenActive called with:', action.payload);
      state.isSettingsScreenActive = action.payload;
      state.isTabBarVisible = !action.payload;
      if (action.payload) {
        state.isChatScreenActive = false;
        state.isCallScreenActive = false;
        state.isStoryScreenActive = false;
        state.isProfileDetailsScreenActive = false;
      }
      console.log('🔄 Redux: New state:', { 
        isSettingsScreenActive: state.isSettingsScreenActive, 
        isTabBarVisible: state.isTabBarVisible,
        isChatScreenActive: state.isChatScreenActive,
        isCallScreenActive: state.isCallScreenActive,
        isStoryScreenActive: state.isStoryScreenActive,
        isProfileDetailsScreenActive: state.isProfileDetailsScreenActive
      });
    },
    setProfileDetailsScreenActive: (state, action) => {
      console.log('🔄 Redux: setProfileDetailsScreenActive called with:', action.payload);
      state.isProfileDetailsScreenActive = action.payload;
      state.isTabBarVisible = !action.payload;
      if (action.payload) {
        state.isChatScreenActive = false;
        state.isCallScreenActive = false;
        state.isStoryScreenActive = false;
        state.isSettingsScreenActive = false;
      }
      console.log('🔄 Redux: New state:', { 
        isProfileDetailsScreenActive: state.isProfileDetailsScreenActive, 
        isTabBarVisible: state.isTabBarVisible,
        isChatScreenActive: state.isChatScreenActive,
        isCallScreenActive: state.isCallScreenActive,
        isStoryScreenActive: state.isStoryScreenActive,
        isSettingsScreenActive: state.isSettingsScreenActive
      });
    },
    setCurrentScreen: (state, action) => {
      state.currentActiveScreen = action.payload;
      // Auto-hide tab bar for specific screens
      if (action.payload === 'Chat') {
        state.isTabBarVisible = false;
        state.isChatScreenActive = true;
        state.isCallScreenActive = false;
        state.isStoryScreenActive = false;
      } else if (action.payload === 'Call') {
        state.isTabBarVisible = false;
        state.isCallScreenActive = true;
        state.isChatScreenActive = false;
        state.isStoryScreenActive = false;
      } else if (action.payload === 'Story') {
        state.isTabBarVisible = false;
        state.isStoryScreenActive = true;
        state.isChatScreenActive = false;
        state.isCallScreenActive = false;
      } else if (action.payload === 'Crop') {
        console.log('✂️ Redux: setCurrentScreen called with Crop - hiding tab bar');
        state.isTabBarVisible = false;
        state.isChatScreenActive = false;
        state.isCallScreenActive = false;
        state.isStoryScreenActive = false;
        console.log('✂️ Redux: isTabBarVisible set to:', state.isTabBarVisible);
      } else if (action.payload === 'Filter') {
        console.log('🎨 Redux: setCurrentScreen called with Filter - hiding tab bar');
        state.isTabBarVisible = false;
        state.isChatScreenActive = false;
        state.isCallScreenActive = false;
        state.isStoryScreenActive = false;
        console.log('🎨 Redux: isTabBarVisible set to:', state.isTabBarVisible);
      } else if (action.payload === 'LikeResult') {
        state.isTabBarVisible = false;
        state.isChatScreenActive = false;
        state.isCallScreenActive = false;
        state.isStoryScreenActive = false;
      } else if (action.payload === 'CelebrationMatch') {
        console.log('🎉 Redux: setCurrentScreen called with CelebrationMatch - hiding tab bar');
        state.isTabBarVisible = false;
        state.isChatScreenActive = false;
        state.isCallScreenActive = false;
        state.isStoryScreenActive = false;
        console.log('🎉 Redux: isTabBarVisible set to:', state.isTabBarVisible);
      } else {
        state.isTabBarVisible = true;
        state.isChatScreenActive = false;
        state.isCallScreenActive = false;
        state.isStoryScreenActive = false;
      }
    },
    setVerifyModalShown: (state, action) => {
      state.hasShownVerifyModal = action.payload;
    },
    resetUI: (state) => {
      state.isTabBarVisible = true;
      state.isChatScreenActive = false;
      state.isCallScreenActive = false;
      state.isStoryScreenActive = false;
      state.isSettingsScreenActive = false;
      state.isProfileDetailsScreenActive = false;
      state.currentActiveScreen = null;
      state.hasShownVerifyModal = false;
    },
  },
});

export const { 
  showTabBar, 
  hideTabBar, 
  setChatScreenActive, 
  setCallScreenActive,
  setStoryScreenActive,
  setSettingsScreenActive,
  setProfileDetailsScreenActive,
  setCurrentScreen,
  setVerifyModalShown,
  resetUI 
} = uiSlice.actions;

export default uiSlice.reducer;
