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
import MyFollowersScreen from '../screens/SocialScreen/Profile/MyFollowersScreen';
import MyFollowingScreen from '../screens/SocialScreen/Profile/MyFollowingScreen';
import VerificationScreen from '../screens/SocialScreen/Profile/VerificationScreen';
import UploadAadharScreen from '../screens/SocialScreen/Profile/UploadAadharScreen';
import StartVerificationScreen from '../screens/SocialScreen/Profile/StartVerificationScreen';
import MyPostScreen from '../screens/SocialScreen/Profile/MyPostScreen';
import PostCardViewScreen from '../screens/SocialScreen/Profile/PostCardViewScreen';
import OtherUserPostViewScreen from '../screens/SocialScreen/Profile/OtherUserPostViewScreen';
import LikesScreen from '../screens/SocialScreen/Profile/LikesScreen';
import CommentsScreen from '../screens/SocialScreen/Profile/CommentsScreen';
import PersonalDetailsScreen from '../screens/ProfileSetup/PersonalDetailsScreen';
import GenderScreen from '../screens/ProfileSetup/GenderScreen';
import PronounsScreen from '../screens/ProfileSetup/PronounsScreen';
import InterestsScreen from '../screens/ProfileSetup/InterestsScreen';
import UploadIDScreen from '../screens/ProfileSetup/UploadIDScreen';
import LocationScreen from '../screens/ProfileSetup/LocationScreen';
import ViewPersonalDetailsScreen from '../screens/SocialScreen/Profile/ViewPersonalDetailsScreen';

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
      <Stack.Screen 
        name="MyFollowers" 
        component={MyFollowersScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="MyFollowing" 
        component={MyFollowingScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
        <Stack.Screen 
          name="Verification" 
          component={VerificationScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="UploadAadhar" 
          component={UploadAadharScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="StartVerification" 
          component={StartVerificationScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="MyPostScreen" 
          component={MyPostScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="PostCardView" 
          component={PostCardViewScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="OtherUserPostView" 
          component={OtherUserPostViewScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="Likes" 
          component={LikesScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="Comments" 
          component={CommentsScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="PersonalDetails" 
          component={PersonalDetailsScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="Gender" 
          component={GenderScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="Pronouns" 
          component={PronounsScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="LikesInterests" 
          component={InterestsScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="UploadID" 
          component={UploadIDScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="Location" 
          component={LocationScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
        <Stack.Screen 
          name="ViewPersonalDetails" 
          component={ViewPersonalDetailsScreen}
          options={{
            cardStyle: { backgroundColor: '#140034' },
          }}
        />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;


