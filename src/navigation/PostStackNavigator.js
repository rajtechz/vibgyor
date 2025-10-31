import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PostScreen from '../screens/SocialScreen/Post/PostScreen';
import CropScreen from '../screens/SocialScreen/Post/CropScreen';
import FilterScreen from '../screens/SocialScreen/Post/FilterScreen';

const Stack = createStackNavigator();

function PostStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PostMain" component={PostScreen} />
      <Stack.Screen name="Crop" component={CropScreen} />
      <Stack.Screen name="Filter" component={FilterScreen} />
    </Stack.Navigator>
  );
}

export default PostStackNavigator;

