// src/screens/Profile/ProfileScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar, Image, Animated, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Rect, G } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { clearAuthData } from '../../../utils/authUtils';
import { authAPI } from '../../../api/authAPI';
import { AccountVerifyBadge, HamburgerIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';
import PostsTab from '../../../components/profile/PostsTab';
import ReelsTab from '../../../components/profile/ReelsTab';

// Settings Icon Component
const SettingsIcon = ({ width = 24, height = 24, color = '#B0B0B0' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5166 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01062 9.77251C4.27925 9.5799 4.48278 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Profile Hamburger Icon Component
const ProfileHamburgerIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <Path
      d="M28 6.66634C28 5.92996 27.403 5.33301 26.6667 5.33301H5.33333C4.59695 5.33301 4 5.92996 4 6.66634C4 7.40272 4.59695 7.99967 5.33333 7.99967H26.6667C27.403 7.99967 28 7.40272 28 6.66634ZM28 15.9997C28 15.2633 27.403 14.6663 26.6667 14.6663H13.3333C12.597 14.6663 12 15.2633 12 15.9997C12 16.7361 12.597 17.333 13.3333 17.333H26.6667C27.403 17.333 28 16.7361 28 15.9997ZM28 25.333C28 24.5966 27.403 23.9997 26.6667 23.9997H5.33333C4.59695 23.9997 4 24.5966 4 25.333C4 26.0694 4.59695 26.6663 5.33333 26.6663H26.6667C27.403 26.6663 28 26.0694 28 25.333Z"
      fill="white"
    />
  </Svg>
);

// Post Icon Component
const PostIcon = ({ width = 24, height = 24, isActive = false }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <G opacity={isActive ? "1" : "0.3"}>
      <Rect x="5.86536" y="9.86732" width="5.02858" height="5.02864" stroke="#D9D8F3" strokeWidth="1.06667" />
      <Rect x="5.86536" y="17.4874" width="5.02858" height="5.02864" stroke="#D9D8F3" strokeWidth="1.06667" />
      <Rect x="13.4845" y="9.86732" width="5.02858" height="5.02864" stroke="#D9D8F3" strokeWidth="1.06667" />
      <Rect x="13.4845" y="17.4874" width="5.02858" height="5.02864" stroke="#D9D8F3" strokeWidth="1.06667" />
      <Rect x="21.1036" y="9.86732" width="5.02858" height="5.02864" stroke="#D9D8F3" strokeWidth="1.06667" />
      <Rect x="21.1036" y="17.4874" width="5.02858" height="5.02864" stroke="#D9D8F3" strokeWidth="1.06667" />
    </G>
  </Svg>
);

// Reels Icon Component
const ReelsIcon = ({ width = 24, height = 24, isActive = false }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <Path
      d="M26.168 23.75C26.168 23.9489 26.089 24.1397 25.9483 24.2803C25.8076 24.421 25.6169 24.5 25.418 24.5H7.41797C7.21906 24.5 7.02829 24.421 6.88764 24.2803C6.74699 24.1397 6.66797 23.9489 6.66797 23.75C6.66797 23.5511 6.74699 23.3603 6.88764 23.2197C7.02829 23.079 7.21906 23 7.41797 23H25.418C25.6169 23 25.8076 23.079 25.9483 23.2197C26.089 23.3603 26.168 23.5511 26.168 23.75ZM26.168 9.5V20C26.168 20.3978 26.0099 20.7794 25.7286 21.0607C25.4473 21.342 25.0658 21.5 24.668 21.5H8.16797C7.77014 21.5 7.38861 21.342 7.10731 21.0607C6.826 20.7794 6.66797 20.3978 6.66797 20V9.5C6.66797 9.10218 6.826 8.72064 7.10731 8.43934C7.38861 8.15804 7.77014 8 8.16797 8H24.668C25.0658 8 25.4473 8.15804 25.7286 8.43934C26.0099 8.72064 26.168 9.10218 26.168 9.5ZM19.793 14.75C19.7929 14.6295 19.7639 14.5108 19.7082 14.4039C19.6526 14.297 19.572 14.2051 19.4733 14.1359L15.7233 11.5109C15.6109 11.4322 15.4791 11.3858 15.3422 11.3768C15.2053 11.3678 15.0685 11.3965 14.9468 11.4599C14.8251 11.5232 14.7231 11.6187 14.6519 11.736C14.5807 11.8532 14.543 11.9878 14.543 12.125V17.375C14.543 17.5122 14.5807 17.6468 14.6519 17.764C14.7231 17.8813 14.8251 17.9768 14.9468 18.0401C15.0685 18.1035 15.2053 18.1322 15.3422 18.1232C15.4791 18.1142 15.6109 18.0678 15.7233 17.9891L19.4733 15.3641C19.572 15.2949 19.6526 15.203 19.7082 15.0961C19.7639 14.9892 19.7929 14.8705 19.793 14.75Z"
      fill={isActive ? "white" : "rgba(255, 255, 255, 0.3)"}
    />
  </Svg>
);

// Profile Section Component
const ProfileSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);


// Setting Item Component
const SettingItem = ({ title, subtitle, onPress, rightComponent, showArrow = true }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title} </Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    <View style={styles.settingRight}>
      {rightComponent}
      {showArrow && (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 18L15 12L9 6"
            stroke="#B0B0B0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </View>
  </TouchableOpacity>
);

// Grid Icon Component
const GridIcon = ({ width = 24, height = 24, color = '#B0B0B0', isActive = false }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3H10V10H3V3Z"
      stroke={isActive ? '#DD3562' : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 3H21V10H14V3Z"
      stroke={isActive ? '#DD3562' : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 14H21V21H14V14Z"
      stroke={isActive ? '#DD3562' : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 14H10V21H3V14Z"
      stroke={isActive ? '#DD3562' : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Play Icon Component
const PlayIcon = ({ width = 24, height = 24, color = '#B0B0B0', isActive = false }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3H21V21H3V3Z"
      stroke={isActive ? '#DD3562' : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 9L15 12L9 15V9Z"
      stroke={isActive ? '#DD3562' : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Gradient Border Component
const GradientBorder = ({ children, style }) => (
  <View style={[styles.gradientBorderContainer, style]}>
    <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <Path
        d="M12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12C0 5.37258 5.37258 0 12 0Z"
        stroke="url(#verifyGradient)"
        strokeWidth="2"
        fill="none"
      />
      <Defs>
        <SvgLinearGradient id="verifyGradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF6B9D" />
          <Stop offset="0.5" stopColor="#C53E8D" />
          <Stop offset="1" stopColor="#8A52F3" />
        </SvgLinearGradient>
      </Defs>
    </Svg>
    <View style={styles.gradientBorderContent}>
      {children}
    </View>
  </View>
);

function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('grid');
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // Get access token from Redux
  const authState = useSelector((state) => state.auth);
  
  // Animation for hamburger button
  const hamburgerScale = useRef(new Animated.Value(1)).current;

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('👤 ProfileScreen: Fetching user profile...');
        console.log('🔑 Auth State:', {
          isAuthenticated: authState.isAuthenticated,
          accessToken: authState.accessToken ? 'Present' : 'Missing',
        });

        if (!authState.isAuthenticated || !authState.accessToken) {
          console.log('❌ ProfileScreen: User not authenticated');
          setIsLoading(false);
          return;
        }

        const result = await authAPI.getUserProfile(authState.accessToken);
        
        console.log('🔍 ProfileScreen: Full API Result:', JSON.stringify(result, null, 2));
        console.log('🔍 ProfileScreen: result.success:', result.success);
        console.log('🔍 ProfileScreen: result.data:', result.data);
        console.log('🔍 ProfileScreen: result.data.data:', result.data?.data);
        
        if (result.success && result.data?.data) {
          console.log('✅ ProfileScreen: Profile fetched successfully');
          console.log('📊 Profile Data:', result.data.data);
          
          // Extract and validate profile picture URL
          const profilePicUrl = result.data.data.profilePictureUrl;
          console.log('🖼️ Profile Picture URL:', profilePicUrl);
          console.log('🖼️ URL exists:', !!profilePicUrl);
          console.log('🖼️ URL is string:', typeof profilePicUrl === 'string');
          console.log('🖼️ URL length:', profilePicUrl?.length);
          console.log('🖼️ URL starts with http:', profilePicUrl?.startsWith('http'));
          
          // Debug: Check all keys in the data object
          console.log('🔍 ProfileScreen: Keys in result.data.data:', Object.keys(result.data.data || {}));
          console.log('🔍 ProfileScreen: Has profilePictureUrl key:', 'profilePictureUrl' in (result.data.data || {}));
          console.log('🔍 ProfileScreen: profilePictureUrl value directly:', result.data.data?.profilePictureUrl);
          
          // Clean and validate URL
          if (profilePicUrl && typeof profilePicUrl === 'string') {
            const cleanedUrl = profilePicUrl.trim();
            if (cleanedUrl && cleanedUrl.startsWith('http')) {
              console.log('✅ ProfileScreen: Valid profile picture URL found');
            } else {
              console.log('⚠️ ProfileScreen: Invalid profile picture URL format');
              console.log('⚠️ Cleaned URL:', cleanedUrl);
            }
          } else {
            console.log('⚠️ ProfileScreen: profilePictureUrl is missing or invalid');
            console.log('⚠️ Type:', typeof profilePicUrl);
            console.log('⚠️ Value:', profilePicUrl);
          }
          
          setProfileData(result.data.data);
          setImageError(false); // Reset image error when new data is fetched
        } else {
          console.log('❌ ProfileScreen: Failed to fetch profile');
          console.log('❌ Error:', result.error);
        }
      } catch (error) {
        console.error('💥 ProfileScreen: Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [authState.isAuthenticated, authState.accessToken]);
  // Derive followers/following counts from profileData
  const followingCount = Array.isArray(profileData?.following) ? profileData.following.length : 0;
  const followersCount = Array.isArray(profileData?.followers) ? profileData.followers.length : 0;
  // Debug profile picture URL when profileData changes
  useEffect(() => {
    if (profileData) {
      console.log('🖼️ ProfileScreen: Profile data updated');
      console.log('🖼️ Profile data keys:', Object.keys(profileData));
      console.log('🖼️ Has profilePictureUrl:', 'profilePictureUrl' in profileData);
      console.log('🖼️ profilePictureUrl value:', profileData.profilePictureUrl);
      console.log('🖼️ profilePictureUrl type:', typeof profileData.profilePictureUrl);
      console.log('🖼️ profilePictureUrl length:', profileData.profilePictureUrl?.length);
      
      if (profileData.profilePictureUrl) {
        console.log('🖼️ ProfileScreen: Profile picture URL available');
        console.log('🖼️ URL:', profileData.profilePictureUrl);
        console.log('🖼️ URL Type:', typeof profileData.profilePictureUrl);
        console.log('🖼️ URL Length:', profileData.profilePictureUrl?.length);
        console.log('🖼️ URL Valid:', profileData.profilePictureUrl?.startsWith('http'));
      } else {
        console.log('⚠️ ProfileScreen: No profile picture URL in profile data');
        console.log('⚠️ ProfileData object:', JSON.stringify(profileData, null, 2));
      }
    } else {
      console.log('⚠️ ProfileScreen: No profile data available');
    }
  }, [profileData]);

  // Handle hamburger button press with animation
  const handleHamburgerPress = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(hamburgerScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(hamburgerScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate after animation completes
      navigation.navigate('Settings');
    });
  };

  const handleLogout = async () => {
    try {
      await clearAuthData();
      // Navigate to login screen or reset navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />

      {/* Header */}
      <ModeSwitchHeader customTitle="Profile" style={{ paddingTop: insets.top }} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A52F3" />
        </View>
      ) : (
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Username and Menu */}
        <View style={styles.usernameSection}>
          <Text style={styles.username}>{profileData?.username || 'Username'}</Text>
          <Animated.View style={{ transform: [{ scale: hamburgerScale }] }}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={handleHamburgerPress}
            >
              <ProfileHamburgerIcon width={24} height={24} /> 
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.profileImage}>
            {profileData?.profilePictureUrl && 
             typeof profileData.profilePictureUrl === 'string' && 
             profileData.profilePictureUrl.trim().length > 0 && 
             profileData.profilePictureUrl.trim().startsWith('http') && 
             !imageError ? (
              <Image
                key={profileData.profilePictureUrl} // Force re-render when URL changes
                source={{ uri: profileData.profilePictureUrl.trim() }}
                style={styles.profileImageStyle}
                resizeMode="cover"
                onLoadStart={() => {
                  console.log('🖼️ ProfileScreen: Starting to load profile picture');
                  console.log('🖼️ URL:', profileData.profilePictureUrl);
                }}
                onLoad={() => {
                  console.log('✅ ProfileScreen: Profile picture loaded successfully');
                  console.log('✅ ProfileScreen: Image dimensions loaded');
                }}
                onError={(error) => {
                  
                  setImageError(true);
                }}
              />
            ) : (
              <Image
                source={require('../../../assets/messageUser/message1.png')}
                style={styles.profileImageStyle}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={styles.profileRight}>
            <View style={styles.statsContainer}>
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => navigation.navigate('MyFollowing')}
              >
                <Text style={styles.statNumber}>{followingCount}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => navigation.navigate('MyFollowers')}
              >
                <Text style={styles.statNumber}>{followersCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.verifyButtonContainer}>
              <LinearGradient
                colors={['#FF6B9D', '#C53E8D', '#8A52F3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.verifyButtonGradient}
              >
                <TouchableOpacity 
                  style={styles.verifyButton} 
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Verification')}
                >
                  <MaskedView
                    maskElement={
                      <Text style={[styles.verifyButtonText, { backgroundColor: 'transparent' }]}>
                        Get Verified
                      </Text>
                    }
                    style={styles.maskedViewContainer}
                  >
                    <LinearGradient
                      colors={['#FF6B9D', '#C53E8D', '#8A52F3']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientTextContainer}
                    >
                      <Text style={[styles.verifyButtonText, { opacity: 0 }]}>
                        Get Verified
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Name and Bio */}
        <View style={styles.nameSection}>
          <View style={styles.nameRow}>
            <Text style={styles.fullName}>{profileData?.fullName || 'Full Name'}</Text>
            <AccountVerifyBadge width={20} height={20} />
          </View>
          <Text style={styles.gender}>
            {profileData?.gender || ''} {profileData?.pronouns ? `(${profileData.pronouns})` : ''}
          </Text>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.bioTitle}>Short Bio</Text>
          <Text style={styles.bioText}>
            {profileData?.bio || 'No bio available'}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.actionButtonText}>Edit Profile </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Content Tabs */}
        <View style={styles.contentTabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'grid' && styles.activeTab]}
            onPress={() => setActiveTab('grid')}
          >
            <PostIcon width={32} height={32} isActive={activeTab === 'grid'} />
            {activeTab === 'grid' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'play' && styles.activeTab]}
            onPress={() => setActiveTab('play')}
          >
            <ReelsIcon width={32} height={32} isActive={activeTab === 'play'} />
            {activeTab === 'play' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Divider with Active Indicator */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerInactive} />
          <View style={[styles.dividerActive, {
            width: activeTab === 'grid' ? '60%' : '40%',
            left: activeTab === 'grid' ? '0%' : '60%'
          }]} />
        </View>

        {/* Content Grid */}
        <View style={styles.contentGrid}>
          {activeTab === 'grid' ? <PostsTab navigation={navigation} /> : <ReelsTab />}
        </View>

      
      </ScrollView>
      )}
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  usernameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  menuButton: {
    padding: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#151535',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileImageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileRight: {
    flex: 1,
    justifyContent: 'space-between',
    height: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B783EB',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
  },
  verifyButtonContainer: {
    alignSelf: 'flex-start',
  },
  verifyButtonGradient: {
    borderRadius: 10,
    padding: 2,
  },
  verifyButton: {
    backgroundColor: '#151535',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  maskedViewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientTextContainer: {
    height: 20,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameSection: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  gender: {
    fontSize: 14,
    color: '#B783EB',
  },
  bioSection: {
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  contentTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -35,
    width: 70,
    height: 3,
    backgroundColor: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D8F3',
    marginVertical: 20,
    marginLeft: -20,
    marginRight: -20,
    position: 'relative',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  contentItem: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  contentPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentPlaceholderText: {
    color: '#B0B0B0',
    fontSize: 12,
  },
 
});

export default ProfileScreen;
