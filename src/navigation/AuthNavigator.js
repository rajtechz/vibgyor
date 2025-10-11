// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import IntroScreen from '../screens/Auth/IntroScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import VerifyNumberScreen from '../screens/Auth/VerifyNumberScreen';
import VerifySuccessScreen from '../screens/Auth/VerifySuccessScreen';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: '#1a0033' },
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
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.5, 1],
              }),
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              }),
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
              useNativeDriver: true,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 300,
              useNativeDriver: true,
            },
          },
        },
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
      />
      <Stack.Screen 
        name="Intro" 
        component={IntroScreen} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
      />
      <Stack.Screen 
        name="VerifyNumber" 
        component={VerifyNumberScreen} 
      />
      <Stack.Screen 
        name="VerifySuccess" 
        component={VerifySuccessScreen} 
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
