// src/redux/slices/roleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentMode: 'social', // 'social' or 'dating'
  isSwitching: false,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    switchToSocial: (state) => {
      state.currentMode = 'social';
      state.isSwitching = false;
    },
    switchToDating: (state) => {
      state.currentMode = 'dating';
      state.isSwitching = false;
    },
    toggleMode: (state) => {
      state.isSwitching = true;
      // The actual mode switch will be handled by the component
    },
    setMode: (state, action) => {
      state.currentMode = action.payload;
      state.isSwitching = false;
    },
    setSwitching: (state, action) => {
      state.isSwitching = action.payload;
    },
  },
});

export const { switchToSocial, switchToDating, toggleMode, setMode, setSwitching } = roleSlice.actions;
export default roleSlice.reducer;
