// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import datingReducer from './slices/datingSlice';
import socialReducer from './slices/socialSlice';
import userReducer from './slices/userSlice';
import roleReducer from './slices/roleSlice';
import uiReducer from './slices/uiSlice';
import postReducer from './slices/postSlice';

console.log('🔧 Store.js: Creating Redux store...');

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    dating: datingReducer,
    social: socialReducer,
    user: userReducer,
    role: roleReducer,
    ui: uiReducer,
    post: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {},
      },
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredActionPaths: ['payload'],
        ignoredPaths: [
          'auth.user', 
          'auth.accessToken', 
          'auth.refreshToken',
          // Allow media items with proper serialization handling
        ],
        // Warn but don't error on non-serializable values in post slice (we're fixing this)
        warnAfter: 128,
      },
    }),
});



export { store };

// Type definitions for TypeScript (if needed)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
