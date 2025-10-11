import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/SocialScreen/Home/HomeScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import StoryScreen from '../screens/SocialScreen/Home/StoryScreen';
import PostEditScreen from '../screens/SocialScreen/Post/PostEditScreen';

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
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;



