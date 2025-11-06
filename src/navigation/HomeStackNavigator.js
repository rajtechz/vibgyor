import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/SocialScreen/Home/HomeScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import StoryScreen from '../screens/SocialScreen/Home/StoryScreen';
import PostEditScreen from '../screens/SocialScreen/Post/PostEditScreen';
import SelfStoryScreen from '../screens/SocialScreen/Home/SelfStoryScreen';
import OtherUserProfileScreen from '../screens/SocialScreen/Profile/OtherUserProfileScreen';
import OtherUserPostViewScreen from '../screens/SocialScreen/Profile/OtherUserPostViewScreen';
import PostCreationScreen from '../screens/SocialScreen/Post/PostCreationScreen';
import UploadVibesScreen from '../screens/SocialScreen/Post/UploadVibesScreen';
import LikesScreen from '../screens/SocialScreen/Profile/LikesScreen';
import CommentsScreen from '../screens/SocialScreen/Profile/CommentsScreen';

const Stack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Story" component={StoryScreen} />
      <Stack.Screen name="PostEdit" component={PostEditScreen} />
      <Stack.Screen name="UploadVibes" component={UploadVibesScreen} />
      <Stack.Screen name="SelfStory" component={SelfStoryScreen} />
      <Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen} />
        <Stack.Screen name="OtherUserPostView" component={OtherUserPostViewScreen} />
        <Stack.Screen name="PostCreation" component={PostCreationScreen} />
        <Stack.Screen name="Likes" component={LikesScreen} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
      </Stack.Navigator>
    );
  }

export default HomeStackNavigator;



