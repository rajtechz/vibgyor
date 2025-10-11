// src/navigation/MessagesStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesScreen from '../screens/SocialScreen/Messages/MessagesScreen';
import ArchiveMessage from '../screens/SocialScreen/Messages/ArchiveMessage';
import ChatScreen from '../screens/SocialScreen/Messages/ChatScreen';
import CallScreen from '../screens/SocialScreen/Messages/CallScreen';
import VideoCallScreen from '../screens/SocialScreen/Messages/VideoCallScreen';

const Stack = createStackNavigator();

// Custom screen options for Chat screen to hide tab bar
const getChatScreenOptions = () => ({
  cardStyle: { backgroundColor: '#140034' },
  presentation: 'modal',
  animationTypeForReplace: 'push',
  // This will be handled by the ChatScreen component itself
});

function MessagesStackNavigator() {
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
      initialRouteName="MessagesMain"
    >
      <Stack.Screen 
        name="MessagesMain" 
        component={MessagesScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="Archive" 
        component={ArchiveMessage}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={getChatScreenOptions}
      />
      <Stack.Screen 
        name="Call" 
        component={CallScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
          presentation: 'modal',
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="VideoCall" 
        component={VideoCallScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
          presentation: 'modal',
          animationTypeForReplace: 'push',
        }}
      />
    </Stack.Navigator>
  );
}

export default MessagesStackNavigator;
