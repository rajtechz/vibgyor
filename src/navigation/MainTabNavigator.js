// src/navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  HomeIconGradient,
  SearchIconGradient,
  PostIconGradient,
  MessageIconGradient,
  UserIconGradient
} from '../components/common/TabIcons';
import { ActiveIndicator } from '../components/common/ActiveIndicator';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import MessagesStackNavigator from './MessagesStackNavigator';
import SearchScreen from '../screens/SocialScreen/Search/SearchScreen';
import PostScreen from '../screens/SocialScreen/Post/PostScreen';
import PostEditScreen from '../screens/SocialScreen/Post/PostEditScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Temporary placeholder screens
function PlaceholderScreen({ title }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a0033' }}>
      <Text style={{ color: 'white', fontSize: 24 }}>{title}</Text>
    </View>
  );
}

// Tab icon wrapper
function TabIconWithIndicator({ IconComponent, focused, size }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent focused={focused} size={size} />
    </View>
  );
}

// Custom tab bar with gradient background
function CustomTabBar({ state, descriptors, navigation }) {
  const { isTabBarVisible, isChatScreenActive, isCallScreenActive, isStoryScreenActive, isSettingsScreenActive } = useSelector((state) => state.ui);

  // Debug logging
  console.log('🔍 TabBar State:', { isTabBarVisible, isChatScreenActive, isCallScreenActive, isStoryScreenActive, isSettingsScreenActive });

  // Don't render tab bar if it should be hidden
  if (!isTabBarVisible || isChatScreenActive || isCallScreenActive || isStoryScreenActive || isSettingsScreenActive) {
    console.log('🚫 TabBar Hidden');
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

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: HomeIconGradient
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: SearchIconGradient
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{
          tabBarIcon: PostIconGradient
        }}
      />
      <Tab.Screen
        name="PostEdit"
        component={PostEditScreen}
        options={{
          tabBarIcon: PostIconGradient,
          tabBarButton: () => null, // Hide from tab bar
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStackNavigator}
        options={{
          tabBarIcon: MessageIconGradient
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: UserIconGradient
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
