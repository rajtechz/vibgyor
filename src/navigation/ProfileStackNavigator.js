import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/SocialScreen/Profile/ProfileScreen';
import EditProfileScreen from '../screens/SocialScreen/Profile/EditProfileScreen';
import SettingsScreen from '../screens/SocialScreen/Profile/SettingsScreen';
import AccountScreen from '../screens/SocialScreen/Profile/AccountScreen';
import NotificationsScreen from '../screens/SocialScreen/Profile/NotificationsScreen';
import PrivacyOptionsScreen from '../screens/SocialScreen/Profile/PrivacyOptionsScreen';
import BlockedAccountsScreen from '../screens/SocialScreen/Profile/BlockedAccountsScreen';
import GetVerifiedScreen from '../screens/SocialScreen/Profile/GetVerifiedScreen';
import DeleteAccountScreen from '../screens/SocialScreen/Profile/DeleteAccountScreen';
import ChatSupportScreen from '../screens/SocialScreen/Profile/ChatSupportScreen';
import HelpCenterScreen from '../screens/SocialScreen/Profile/HelpCenterScreen';
import TermsConditionsScreen from '../screens/SocialScreen/Profile/TermsConditionsScreen';
import PrivacyPolicyScreen from '../screens/SocialScreen/Profile/PrivacyPolicyScreen';

const Stack = createStackNavigator();

function ProfileStackNavigator() {
  return (
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
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
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
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        gestureResponseDistance: 50,
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="PrivacyOptions" 
        component={PrivacyOptionsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="BlockedAccounts" 
        component={BlockedAccountsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="GetVerified" 
        component={GetVerifiedScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DeleteAccount" 
        component={DeleteAccountScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="ChatSupport" 
        component={ChatSupportScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="HelpCenter" 
        component={HelpCenterScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="TermsConditions" 
        component={TermsConditionsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;


