
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { API_CONFIG } from './src/api/config';

// Test console.log immediately
console.log('🚀 App.js: Starting app initialization');
console.log('📦 App.js: Store object:', store);
console.log('📦 App.js: Store type:', typeof store);
console.log('📦 App.js: Store keys:', Object.keys(store || {}));

// Test different console methods
console.warn('⚠️ App.js: This is a warning test');
// console.error('❌ App.js: This is an error test'); // Removed for production
console.info('ℹ️ App.js: This is an info test');

function App() {
  console.log('🎯 App.js: App component rendering');
  
  // Test API connection on app start
  useEffect(() => {
    const testAPIConnection = async () => {
      try {
        console.log('🔌 App.js: Testing API connection...');
        console.log('🌐 App.js: Server URL:', API_CONFIG.BASE_URL);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        const responseText = await response.text();
        console.log('✅ App.js: Server connection successful!');
        console.log('📡 App.js: Response Status:', response.status);
        console.log('📄 App.js: Server Response:', responseText.substring(0, 200)); // First 200 chars
        
        if (response.ok) {
          console.log('✅ App.js: API Server is reachable and responding');
        } else {
          console.warn('⚠️ App.js: Server responded but with status:', response.status);
        }
      } catch (error) {
        console.error('❌ App.js: API Connection Error:', error.message);
        console.error('❌ App.js: Error Type:', error.name);
        console.error('❌ App.js: Full Error:', error);
        console.warn('⚠️ App.js: Make sure your backend server is running on:', API_CONFIG.BASE_URL);
        console.warn('⚠️ App.js: Check that both device and server are on the same network');
      }
    };
    
    // Run connection test immediately
    testAPIConnection();
  }, []);
  
  if (!store) {
    console.error('❌ App.js: Store is undefined!');
    return null;
  }
  
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;