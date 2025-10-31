import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PostScreen from '../screens/SocialScreen/Post/PostScreen';
import CropScreen from '../screens/SocialScreen/Post/CropScreen';

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
    </Stack.Navigator>
  );
}

export default PostStackNavigator;

