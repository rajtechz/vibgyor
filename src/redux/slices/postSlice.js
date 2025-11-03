// src/redux/slices/postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  galleryMedia: [{ id: 'camera', isAddButton: true }],
  allMedia: [],
  selectedFilter: 'Recents',
  selectedImageIds: [],
  selectedPreviewItem: null,
  isLoading: false,
  hasPermission: null,
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setGalleryMedia: (state, action) => {
      state.galleryMedia = action.payload;
    },
    setAllMedia: (state, action) => {
      state.allMedia = action.payload;
    },
    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload;
    },
    setSelectedImageIds: (state, action) => {
      state.selectedImageIds = action.payload;
    },
    addSelectedImageId: (state, action) => {
      if (!state.selectedImageIds.includes(action.payload)) {
        state.selectedImageIds.push(action.payload);
      }
    },
    removeSelectedImageId: (state, action) => {
      state.selectedImageIds = state.selectedImageIds.filter(id => id !== action.payload);
    },
    clearSelectedImageIds: (state) => {
      state.selectedImageIds = [];
    },
    setSelectedPreviewItem: (state, action) => {
      state.selectedPreviewItem = action.payload;
    },
    clearSelectedPreviewItem: (state) => {
      state.selectedPreviewItem = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setPermission: (state, action) => {
      state.hasPermission = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetPostState: (state) => {
      return initialState;
    },
  },
});

export const {
  setGalleryMedia,
  setAllMedia,
  setSelectedFilter,
  setSelectedImageIds,
  addSelectedImageId,
  removeSelectedImageId,
  clearSelectedImageIds,
  setSelectedPreviewItem,
  clearSelectedPreviewItem,
  setLoading,
  setPermission,
  setError,
  resetPostState,
} = postSlice.actions;

export default postSlice.reducer;

