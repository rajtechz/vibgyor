import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import CommonBackground from '../../../components/common/CommonBackground';
import { BackIcon } from '../../../components/icons/SvgIcons';
import { hideTabBar, showTabBar, setCurrentScreen } from '../../../redux/slices/uiSlice';

// Sample data for users who liked the post
const SAMPLE_LIKED_USERS = [
  {
    id: '1',
    name: 'Sophia Turner',
    profileImage: require('../../../assets/messageUser/message1.png'),
    timestamp: '8h',
    followStatus: 'none', // 'none', 'following', 'followBack'
    isVerified: false,
  },
  {
    id: '2',
    name: 'David Lee',
    profileImage: require('../../../assets/messageUser/message2.png'),
    timestamp: '1h',
    followStatus: 'following',
    isVerified: false,
  },
  {
    id: '3',
    name: 'Olivia White',
    profileImage: require('../../../assets/messageUser/message3.png'),
    timestamp: '4h',
    followStatus: 'followBack',
    isVerified: false,
  },
  {
    id: '4',
    name: 'James Harris',
    profileImage: require('../../../assets/messageUser/message4.png'),
    timestamp: '3h',
    followStatus: 'none',
    isVerified: false,
  },
  {
    id: '5',
    name: 'Maria Gonzalez',
    profileImage: require('../../../assets/liveUser/user1.png'),
    timestamp: '2h',
    followStatus: 'none',
    isVerified: false,
  },
  {
    id: '6',
    name: 'Liam O\'Connor',
    profileImage: require('../../../assets/liveUser/user3.png'),
    timestamp: '1h 30m',
    followStatus: 'followBack',
    isVerified: false,
  },
  {
    id: '7',
    name: 'Sophia Kim',
    profileImage: require('../../../assets/liveUser/user4.png'),
    timestamp: '4h 15m',
    followStatus: 'followBack',
    isVerified: false,
  },
  {
    id: '8',
    name: 'Noah Patel',
    profileImage: require('../../../assets/liveUser/user5.png'),
    timestamp: '5h',
    followStatus: 'following',
    isVerified: false,
  },
  {
    id: '9',
    name: 'Emma Thompson',
    profileImage: require('../../../assets/images/notificationUser/user1.png'),
    timestamp: '2h 45m',
    followStatus: 'following',
    isVerified: false,
  },
  {
    id: '10',
    name: 'Alexander Lee',
    profileImage: require('../../../assets/images/notificationUser/user2.png'),
    timestamp: '3h 30m',
    followStatus: 'following',
    isVerified: false,
  },
];

function LikesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { postId } = route.params || {};

  const [users, setUsers] = useState(SAMPLE_LIKED_USERS);

  // Redux-based tab bar hiding when LikesScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('❤️ LikesScreen Focused - Hiding TabBar');
      // Dispatch Redux actions to hide tab bar
      dispatch(setCurrentScreen('Likes'));
      dispatch(hideTabBar());

      // Show tab bar when screen is unfocused
      return () => {
        console.log('❤️ LikesScreen Unfocused - Showing TabBar');
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [navigation, dispatch])
  );

  // Additional backup using useLayoutEffect
  useLayoutEffect(() => {
    dispatch(setCurrentScreen('Likes'));
    dispatch(hideTabBar());

    return () => {
      dispatch(showTabBar());
      dispatch(setCurrentScreen(null));
    };
  }, [dispatch]);

  const handleFollowPress = (userId, currentStatus) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === userId) {
          // Toggle follow status
          let newStatus;
          if (currentStatus === 'none') {
            newStatus = 'following';
          } else if (currentStatus === 'following') {
            newStatus = 'none';
          } else if (currentStatus === 'followBack') {
            newStatus = 'following';
          }
          return { ...user, followStatus: newStatus };
        }
        return user;
      })
    );
    // Here you would typically make an API call to follow/unfollow
    console.log('Follow status changed for user:', userId);
  };

  const getFollowButtonStyle = (status) => {
    if (status === 'following') {
      return styles.followingButton;
    } else {
      return styles.followButton;
    }
  };

  const getFollowButtonTextStyle = (status) => {
    if (status === 'following') {
      return styles.followingButtonText;
    } else {
      return styles.followButtonText;
    }
  };

  const getFollowButtonText = (status) => {
    if (status === 'following') {
      return 'Following';
    } else if (status === 'followBack') {
      return 'Follow Back';
    } else {
      return 'Follow';
    }
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon width={24} height={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Likes</Text>
      </View>
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {users.map((user) => (
          <View key={user.id} style={styles.userItem}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                {user.profileImage ? (
                  <Image source={user.profileImage} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                )}
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.timestamp}>{user.timestamp}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={getFollowButtonStyle(user.followStatus)}
              onPress={() => handleFollowPress(user.id, user.followStatus)}
              activeOpacity={0.8}
            >
              <Text style={getFollowButtonTextStyle(user.followStatus)}>
                {getFollowButtonText(user.followStatus)}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#140034',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DD3562',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DD3562',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  followButton: {
    backgroundColor: '#2285FA',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2285FA',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  followingButtonText: {
    color: '#2285FA',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LikesScreen;

