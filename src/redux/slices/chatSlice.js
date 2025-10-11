// src/redux/slices/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  currentChat: null,
  isTyping: false,
  unreadCount: 0,
  isChatScreenActive: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setChatScreenActive: (state, action) => {
      state.isChatScreenActive = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.currentChat = null;
      state.isTyping = false;
    },
  },
});

export const { 
  setCurrentChat, 
  addMessage, 
  setMessages, 
  setTyping, 
  setUnreadCount, 
  setChatScreenActive,
  clearChat 
} = chatSlice.actions;

export default chatSlice.reducer;
