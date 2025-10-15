// src/navigation/ProfileSetupNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PersonalDetailsScreen from '../screens/ProfileSetup/PersonalDetailsScreen';
import GenderScreen from '../screens/ProfileSetup/GenderScreen';
import PronounsScreen from '../screens/ProfileSetup/PronounsScreen';
import InterestsScreen from '../screens/ProfileSetup/InterestsScreen';
import UploadIDScreen from '../screens/ProfileSetup/UploadIDScreen';
import LocationScreen from '../screens/ProfileSetup/LocationScreen';
import PreferencesScreen from '../screens/ProfileSetup/PreferencesScreen';
import SwitchProfilesScreen from '../screens/ProfileSetup/SwitchProfilesScreen';

const Stack = createStackNavigator();

function ProfileSetupNavigator() {
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
      initialRouteName="PersonalDetails"
    >
      <Stack.Screen 
        name="PersonalDetails" 
        component={PersonalDetailsScreen} 
      />
      <Stack.Screen 
        name="Gender" 
        component={GenderScreen} 
      />
      <Stack.Screen 
        name="Pronouns" 
        component={PronounsScreen} 
      />
      <Stack.Screen 
        name="Interests" 
        component={InterestsScreen} 
      />
      <Stack.Screen 
        name="UploadID" 
        component={UploadIDScreen} 
      />
      <Stack.Screen 
        name="Location" 
        component={LocationScreen} 
      />
      <Stack.Screen 
        name="Preferences" 
        component={PreferencesScreen} 
      />
      <Stack.Screen 
        name="SwitchProfiles" 
        component={SwitchProfilesScreen} 
      />
    </Stack.Navigator>
  );
}

export default ProfileSetupNavigator;
