// src/navigation/DatingTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  DatingSwipeIcon,
  DatingGridIcon,
  DatingChatIcon,
  DatingProfileIcon
} from '../components/common/DatingTabIcons';
import { ActiveIndicator } from '../components/common/ActiveIndicator';
import SwipeScreen from '../screens/DatingScreens/SwipeScreens/SwipeScreen';
import ProfileDetailsScreen from '../screens/DatingScreens/SwipeScreens/ProfileDetailsScreen';
import LikeResultScreen from '../screens/DatingScreens/SwipeScreens/LikeResultScreen';
import CelebrationMatchScreen from '../screens/DatingScreens/SwipeScreens/CelebrationMatchScreen';
import MatchScreen from '../screens/DatingScreens/MatchScreens/MatchScreen';
import DatingProfileScreen from '../screens/DatingScreens/DatingProfile/DatingProfileScreen';
import DatingEditProfileScreen from '../screens/DatingScreens/DatingProfile/DatingEditProfileScreen';
import DatingAccountScreen from '../screens/DatingScreens/DatingProfile/DatingAccountScreen';
import DatingManageMatchesScreen from '../screens/DatingScreens/DatingProfile/DatingManageMatchesScreen';
import DatingPrivacyOptionsScreen from '../screens/DatingScreens/DatingProfile/DatingPrivacyOptionsScreen';
import DatingBlockedAccountsScreen from '../screens/DatingScreens/DatingProfile/DatingBlockedAccountsScreen';
import DatingNotificationsScreen from '../screens/DatingScreens/DatingProfile/DatingNotificationsScreen';
import DatingSettingsScreen from '../screens/DatingScreens/DatingProfile/DatingSettingsScreen';
import DeleteAccountScreen from '../screens/DatingScreens/DatingProfile/DeleteAccountScreen';
import ChatSupportScreen from '../screens/DatingScreens/DatingProfile/ChatSupportScreen';
import HelpCenterScreen from '../screens/DatingScreens/DatingProfile/HelpCenterScreen';
import TermsConditionsScreen from '../screens/DatingScreens/DatingProfile/TermsConditionsScreen';
import PrivacyPolicyScreen from '../screens/DatingScreens/DatingProfile/PrivacyPolicyScreen';
import DatingMessagesScreen from '../screens/DatingScreens/MessageScreen/DatingMessagesScreen';
import DatingChatScreen from '../screens/DatingScreens/MessageScreen/DatingChatScreen';
import DatingAudioCallScreen from '../screens/DatingScreens/MessageScreen/DatingAudioCallScreen';
import DatingVideoCallScreen from '../screens/DatingScreens/MessageScreen/DatingVideoCallScreen';
import DatingArchiveMessage from '../screens/DatingScreens/MessageScreen/DatingArchiveMessage';
import FilterOptionsScreen from '../screens/DatingScreens/MatchScreens/FilterOptionsScreen';
import DatingFilterOptionsScreen from '../screens/DatingScreens/FilterOptionsScreen';
import NotificationScreen from '../screens/DatingScreens/NotificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab icon wrapper
function TabIconWithIndicator({ IconComponent, focused, size }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent focused={focused} size={size} />
    </View>
  );
}

// Custom tab bar with gradient background for dating mode
function CustomDatingTabBar({ state, descriptors, navigation }) {
  const { isTabBarVisible } = useSelector((state) => state.ui);
  
  console.log('🎉 DatingTabNavigator: isTabBarVisible =', isTabBarVisible);
  
  // Don't render tab bar if it's hidden
  if (!isTabBarVisible) {
    console.log('🎉 DatingTabNavigator: Tab bar is hidden, returning null');
    return null;
  }
  
  return (
    <View style={{ position: 'relative' }}>
      <LinearGradient
        colors={['#2B0266', '#190140', '#080110']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          height: 80,
          flexDirection: 'row',
          paddingBottom: 12,
          paddingTop: 12,
          borderTopWidth: 0,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const IconComponent = options.tabBarIcon;
          const iconSize = 28;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                height: '100%',
                paddingVertical: 8,
              }}
            >
              <TabIconWithIndicator
                IconComponent={IconComponent}
                focused={isFocused}
                size={iconSize}
              />
              {isFocused && (
                <View style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  marginLeft: -16,
                  width: 32,
                  height: 3,
                }}>
                  <ActiveIndicator isActive={true} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

// Swipe Stack Navigator for Dating
function DatingSwipeStackNavigator() {
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
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 250,
              useNativeDriver: true,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 250,
              useNativeDriver: true,
            },
          },
        },
      }}
      initialRouteName="SwipeMain"
    >
      <Stack.Screen 
        name="SwipeMain" 
        component={SwipeScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="ProfileDetails" 
        component={ProfileDetailsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingFilterOptions" 
        component={DatingFilterOptionsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="Notification" 
        component={NotificationScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="LikeResult" 
        component={LikeResultScreen}
        options={{
          cardStyle: { 
            backgroundColor: '#140034',
            overflow: 'hidden',
          },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="CelebrationMatch" 
        component={CelebrationMatchScreen}
        options={{
          cardStyle: { 
            backgroundColor: '#140034',
            overflow: 'hidden',
          },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack Navigator for Dating
function DatingProfileStackNavigator() {
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
      initialRouteName="DatingProfileMain"
    >
      <Stack.Screen 
        name="DatingProfileMain" 
        component={DatingProfileScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingEditProfile" 
        component={DatingEditProfileScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingAccount" 
        component={DatingAccountScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingManageMatches" 
        component={DatingManageMatchesScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingPrivacyOptions" 
        component={DatingPrivacyOptionsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingBlockedAccounts" 
        component={DatingBlockedAccountsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingNotifications" 
        component={DatingNotificationsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingSettings" 
        component={DatingSettingsScreen}
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

// Matches Stack Navigator for Dating
function DatingMatchesStackNavigator() {
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
      initialRouteName="MatchesMain"
    >
      <Stack.Screen 
        name="MatchesMain" 
        component={MatchScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="FilterOptions" 
        component={FilterOptionsScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
    </Stack.Navigator>
  );
}

// Messages Stack Navigator for Dating
function DatingMessagesStackNavigator() {
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
      initialRouteName="DatingMessagesMain"
    >
      <Stack.Screen 
        name="DatingMessagesMain" 
        component={DatingMessagesScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingChat" 
        component={DatingChatScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
      <Stack.Screen 
        name="DatingAudioCall" 
        component={DatingAudioCallScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
          presentation: 'modal',
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="DatingVideoCall" 
        component={DatingVideoCallScreen}
        options={{
          cardStyle: { backgroundColor: '#140034' },
          presentation: 'modal',
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="DatingArchive" 
        component={DatingArchiveMessage}
        options={{
          cardStyle: { backgroundColor: '#140034' },
        }}
      />
    </Stack.Navigator>
  );
}

function DatingTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomDatingTabBar {...props} />}
    >
      <Tab.Screen
        name="Swipe"
        component={DatingSwipeStackNavigator}
        options={{
          tabBarIcon: DatingSwipeIcon
        }}
      />
      <Tab.Screen
        name="Matches"
        component={DatingMatchesStackNavigator}
        options={{
          tabBarIcon: DatingGridIcon
        }}
      />
      <Tab.Screen
        name="Chats"
        component={DatingMessagesStackNavigator}
        options={{
          tabBarIcon: DatingChatIcon
        }}
      />
      <Tab.Screen
        name="Profile"
        component={DatingProfileStackNavigator}
        options={{
          tabBarIcon: DatingProfileIcon
        }}
      />
    </Tab.Navigator>
  );
}

export default DatingTabNavigator;
