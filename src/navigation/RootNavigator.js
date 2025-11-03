

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus, isTokenExpired } from '../utils/authUtils';
import { getInitialRoute } from '../utils/appConfig';
import { setTokens, setProfileCompletion, refreshAccessToken } from '../redux/slices/authSlice';
import { store } from '../redux/store';
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
            console.log('🔄 RootNavigator: Refresh token from AsyncStorage:', authStatus.refreshToken ? 'Present' : 'Missing');
            console.log('🔄 RootNavigator: Refresh token type:', typeof authStatus.refreshToken);
            console.log('🔄 RootNavigator: Refresh token length:', authStatus.refreshToken?.length);
            
            if (!authStatus.refreshToken || typeof authStatus.refreshToken !== 'string' || authStatus.refreshToken.trim().length === 0) {
              console.log('❌ RootNavigator: Invalid refresh token, redirecting to login');
              setInitialRoute('Auth');
              return;
            }
            
            try {
              const refreshResult = await dispatch(refreshAccessToken(authStatus.refreshToken.trim()));
              
              if (refreshAccessToken.fulfilled.match(refreshResult)) {
                console.log('✅ RootNavigator: Token refreshed successfully');
                // Extract token from nested response structure: payload.data.data.accessToken
                const responseData = refreshResult.payload?.data || refreshResult.payload;
                const newAccessToken = responseData?.data?.accessToken || responseData?.accessToken || refreshResult.payload?.accessToken;
                const newRefreshToken = responseData?.data?.refreshToken || responseData?.refreshToken || refreshResult.payload?.refreshToken;
                
                console.log('🔄 RootNavigator: Extracted new accessToken:', newAccessToken ? 'Present' : 'Missing');
                
                if (newAccessToken) {
                  dispatch(setTokens({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken || authStatus.refreshToken,
                    user: null
                  }));
                } else {
                  console.log('⚠️ RootNavigator: No accessToken in refresh response');
                }
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
          
          // Get token from Redux state (it might have been refreshed)
          const reduxState = store.getState();
          const currentAccessToken = reduxState.auth.accessToken || authStatus.accessToken;
          
          // Check profile status from API if we have a valid token
          if (currentAccessToken && !isTokenExpired(currentAccessToken)) {
            try {
              console.log('📊 RootNavigator: Checking profile status from API...');
              const { authAPI } = await import('../api/authAPI');
              const profileStepResult = await authAPI.getProfileStep(currentAccessToken);
              
              if (profileStepResult.success) {
                const currentStep = profileStepResult.data?.data?.currentStep || profileStepResult.data?.data?.profileCompletionStep;
                const isProfileCompleted = profileStepResult.data?.data?.isProfileCompleted || 
                                          profileStepResult.data?.data?.isCurrentStepCompleted ||
                                          currentStep === 'completed';
                
                console.log('📊 RootNavigator: API Profile Status - Step:', currentStep, 'Completed:', isProfileCompleted);
                
                // Update Redux and AsyncStorage with actual status from API
                dispatch(setProfileCompletion({
                  isCompleted: isProfileCompleted,
                  step: isProfileCompleted ? 'completed' : currentStep || 'personal_details'
                }));
              } else {
                console.log('⚠️ RootNavigator: Failed to get profile status from API, using AsyncStorage value');
                dispatch(setProfileCompletion({
                  isCompleted: authStatus.isProfileSetupDone,
                  step: authStatus.isProfileSetupDone ? 'completed' : 'personal_details'
                }));
              }
            } catch (error) {
              console.error('❌ RootNavigator: Error checking profile status from API:', error);
              // Fallback to AsyncStorage value
              dispatch(setProfileCompletion({
                isCompleted: authStatus.isProfileSetupDone,
                step: authStatus.isProfileSetupDone ? 'completed' : 'personal_details'
              }));
            }
          } else {
            // Set profile completion status from AsyncStorage
            dispatch(setProfileCompletion({
              isCompleted: authStatus.isProfileSetupDone,
              step: authStatus.isProfileSetupDone ? 'completed' : 'personal_details'
            }));
          }
        }
        
        // Determine initial route - use actual profile status from Redux (updated by API check)
        let route;
        if (authStatus.accessToken && authStatus.refreshToken) {
          // If user is logged in, determine route based on actual profile status from API
          const reduxState = store.getState();
          const profileCompleted = reduxState.auth.isProfileCompleted;
          
          if (profileCompleted) {
            route = 'Main';
            console.log('✅ RootNavigator: Profile is completed → Navigating to Main');
          } else {
            route = 'ProfileSetup';
            console.log('ℹ️ RootNavigator: Profile not completed → Navigating to ProfileSetup');
          }
        } else {
          // User not logged in, use getInitialRoute
          route = await getInitialRoute(checkAuthStatus);
        }
        
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
