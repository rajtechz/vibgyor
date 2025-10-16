// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import datingReducer from './slices/datingSlice';
import socialReducer from './slices/socialSlice';
import userReducer from './slices/userSlice';
import roleReducer from './slices/roleSlice';
import uiReducer from './slices/uiSlice';

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {},
      },
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredActionPaths: ['payload'],
        ignoredPaths: ['auth.user', 'auth.accessToken', 'auth.refreshToken'],
      },
    }),
});

console.log('✅ Store.js: Store created successfully');
console.log('📦 Store.js: Store object:', store);
console.log('📦 Store.js: Store type:', typeof store);

export { store };

// Type definitions for TypeScript (if needed)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
