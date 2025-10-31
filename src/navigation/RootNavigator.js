

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus, isTokenExpired } from '../utils/authUtils';
import { getInitialRoute } from '../utils/appConfig';
import { setTokens, setProfileCompletion, refreshAccessToken } from '../redux/slices/authSlice';
import { authAPI } from '../api/authAPI';
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
        
        // If no tokens, user is not logged in - go to Auth
        if (!authStatus.accessToken || !authStatus.refreshToken) {
          console.log('❌ RootNavigator: No tokens found, redirecting to Auth');
          setInitialRoute('Auth');
          return;
        }
        
        console.log('💾 RootNavigator: Tokens found, validating and checking profile status...');
        
        // Check if access token is expired
        let validAccessToken = authStatus.accessToken;
        if (isTokenExpired(authStatus.accessToken)) {
          console.log('⚠️ RootNavigator: Access token expired, refreshing...');
          try {
            const refreshResult = await dispatch(refreshAccessToken(authStatus.refreshToken));
            
            if (refreshAccessToken.fulfilled.match(refreshResult)) {
              console.log('✅ RootNavigator: Token refreshed successfully');
              const responseData = refreshResult.payload?.data || refreshResult.payload;
              validAccessToken = responseData?.accessToken || refreshResult.payload?.accessToken || authStatus.accessToken;
              const newRefreshToken = responseData?.refreshToken || refreshResult.payload?.refreshToken || authStatus.refreshToken;
              
              dispatch(setTokens({
                accessToken: validAccessToken,
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
            accessToken: validAccessToken,
            refreshToken: authStatus.refreshToken,
            user: null // Will be fetched later if needed
          }));
        }
        
        // Check profile completion status via API (this is the source of truth)
        // Use Promise.race with timeout to prevent blocking navigation
        try {
          console.log('📊 RootNavigator: Checking profile step via API...');
          
          // Create a timeout promise (5 seconds)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API request timeout')), 5000)
          );
          
          // Race between API call and timeout
          const profileStepResult = await Promise.race([
            authAPI.getProfileStep(validAccessToken),
            timeoutPromise
          ]);
          
          if (profileStepResult && profileStepResult.success) {
            const profileData = profileStepResult.data?.data || {};
            const currentStep = profileData.currentStep || profileData.profileCompletionStep;
            const isCompleted = profileData.isCurrentStepCompleted || profileData.isProfileCompleted || currentStep === 'completed';
            
            console.log('📊 RootNavigator: Profile Step API Response:', {
              currentStep,
              isCompleted,
              data: profileData
            });
            
            // Update Redux with actual profile status
            dispatch(setProfileCompletion({
              isCompleted: isCompleted,
              step: currentStep || 'personal_details'
            }));
            
            // Update AsyncStorage with actual status
            const { setProfileSetupStatus, setVerificationStatus } = await import('../utils/authUtils');
            await setVerificationStatus(true);
            await setProfileSetupStatus(isCompleted);
            
            // Determine route based on API response
            if (isCompleted || currentStep === 'completed') {
              console.log('✅ RootNavigator: Profile is completed, navigating to Main');
              setInitialRoute('Main');
            } else {
              console.log('📝 RootNavigator: Profile not completed, navigating to ProfileSetup');
              setInitialRoute('ProfileSetup');
            }
          } else {
            console.log('❌ RootNavigator: Failed to get profile step, using fallback logic');
            // If API call fails, use AsyncStorage flags as fallback
            dispatch(setProfileCompletion({
              isCompleted: authStatus.isProfileSetupDone,
              step: authStatus.isProfileSetupDone ? 'completed' : 'personal_details'
            }));
            
            if (authStatus.isProfileSetupDone) {
              setInitialRoute('Main');
            } else {
              setInitialRoute('ProfileSetup');
            }
          }
        } catch (error) {
          console.error('💥 RootNavigator: Error checking profile step:', error);
          console.error('💥 RootNavigator: Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          
          // On error (network failure, timeout, etc.), use AsyncStorage flags as fallback
          console.log('📊 RootNavigator: Using AsyncStorage fallback due to API error');
          dispatch(setProfileCompletion({
            isCompleted: authStatus.isProfileSetupDone,
            step: authStatus.isProfileSetupDone ? 'completed' : 'personal_details'
          }));
          
          if (authStatus.isProfileSetupDone) {
            console.log('📊 RootNavigator: Using fallback - Profile marked as done, navigating to Main');
            setInitialRoute('Main');
          } else {
            console.log('📊 RootNavigator: Using fallback - Profile not done, navigating to ProfileSetup');
            setInitialRoute('ProfileSetup');
          }
        }
        
        console.log('✅ RootNavigator: App initialization complete');
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
