
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';

// Test console.log immediately
console.log('🚀 App.js: Starting app initialization');
console.log('📦 App.js: Store object:', store);
console.log('📦 App.js: Store type:', typeof store);
console.log('📦 App.js: Store keys:', Object.keys(store || {}));

// Test different console methods
console.warn('⚠️ App.js: This is a warning test');
// consoler.error('❌ App.js: This is an error test'); // Removed for production
console.info('ℹ️ App.js: This is an info test');

function App() {
  console.log('🎯 App.js: App component rendering');
  
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