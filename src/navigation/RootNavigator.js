

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus, isTokenExpired } from '../utils/authUtils';
import { getInitialRoute } from '../utils/appConfig';
import { setTokens, setProfileCompletion, refreshAccessToken } from '../redux/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import ProfileSetupNavigator from './ProfileSetupNavigator';
import MainTabNavigator from './MainTabNavigator';
import DatingTabNavigator from './DatingTabNavigator';

const Stack = createStackNavigator();

function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);
  const { currentMode } = useSelector((state) => state.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 RootNavigator: Initializing app...');
        
        // Get auth status from AsyncStorage
        const authStatus = await checkAuthStatus();
        console.log('🔍 RootNavigator: Auth status from AsyncStorage:', authStatus);
        
        // Initialize Redux state with data from AsyncStorage
        // Check tokens first, even if isVerified is false (in case of app refresh before flags were saved)
        if (authStatus.accessToken && authStatus.refreshToken) {
          console.log('💾 RootNavigator: Restoring Redux state from AsyncStorage');
          
          // If tokens exist but isVerified is false, set it to true
          if (!authStatus.isVerified) {
            console.log('⚠️ RootNavigator: Tokens found but isVerified is false, setting to true');
            const { setVerificationStatus } = await import('../utils/authUtils');
            await setVerificationStatus(true);
            authStatus.isVerified = true;
          }
          
          // Check if access token is expired
          if (isTokenExpired(authStatus.accessToken)) {
            console.log('⚠️ RootNavigator: Access token expired, refreshing...');
            try {
              const refreshResult = await dispatch(refreshAccessToken(authStatus.refreshToken));
              
              if (refreshAccessToken.fulfilled.match(refreshResult)) {
                console.log('✅ RootNavigator: Token refreshed successfully');
                const newAccessToken = refreshResult.payload?.accessToken || authStatus.accessToken;
                const newRefreshToken = refreshResult.payload?.refreshToken || authStatus.refreshToken;
                
                dispatch(setTokens({
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                  user: null
                }));
              } else {
                console.log('❌ RootNavigator: Token refresh failed, redirecting to login');
                // Token refresh failed, user needs to login again
                setInitialRoute('Auth');
                return;
              }
            } catch (error) {
              console.error('💥 RootNavigator: Error refreshing token:', error);
              setInitialRoute('Auth');
              return;
            }
          } else {
            // Token is still valid, restore it
            dispatch(setTokens({
              accessToken: authStatus.accessToken,
              refreshToken: authStatus.refreshToken,
              user: null // Will be fetched later if needed
            }));
          }
          
          // Set profile completion status
          dispatch(setProfileCompletion({
            isCompleted: authStatus.isProfileSetupDone,
            step: authStatus.isProfileSetupDone ? 'completed' : 'personal_details'
          }));
        }
        
        // Determine initial route
        const route = await getInitialRoute(checkAuthStatus);
        setInitialRoute(route);
        console.log('✅ RootNavigator: App starting with route:', route);
      } catch (error) {
        console.log('❌ RootNavigator: Error initializing app:', error);
        setInitialRoute('Auth'); // fallback to auth flow
      }
    };

    initializeApp();
  }, [dispatch]);

  // Conditional Tab Navigator Component
  const ConditionalTabNavigator = () => {
    if (currentMode === 'dating') {
      return <DatingTabNavigator />;
    } else {
      return <MainTabNavigator />;
    }
  };

  if (!initialRoute) {
    // Show loader until we know where to go
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a0033' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1a0033" 
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#140034' },
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 300,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 300,
                },
              },
            },
          }}
          initialRouteName={initialRoute}
        >
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupNavigator} />
          <Stack.Screen name="Main" component={ConditionalTabNavigator} />
          <Stack.Screen name="Dating" component={DatingTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default RootNavigator;
