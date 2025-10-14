// src/screens/Profile/MyPostScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, Dimensions, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';
import PostCardView from '../../../components/common/PostCardView';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// Back Arrow Icon
const BackArrowIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Heart Icon
const HeartIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Comment Icon
const CommentIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Share Icon
const ShareIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 6L12 2L8 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 2V15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Options Icon (3 dots)
const OptionsIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Verified Badge Icon
const VerifiedBadgeIcon = ({ width = 16, height = 16 }) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 0L9.5 2.5L12 2L9.5 3.5L8 6L6.5 3.5L4 2L6.5 2.5L8 0Z"
      fill="#8A52F3"
    />
  </Svg>
);

// Multiple posts data for MyPostScreen
const MY_POSTS_DATA = [
  {
    id: '1',
    user: {
      name: 'Brandon Aminoff',
      location: 'Hamburg',
      isVerified: true,
    },
    text: 'Which team do you believe will take home the trophy in Euro 2020? Who are... More',
    image: require('../../../assets/images/story1.png'),
    likes: 12,
    comments: 24,
    timeAgo: '2 hours ago',
  },
  {
    id: '2',
    user: {
      name: 'Alex Chen',
      location: 'Tokyo',
      isVerified: false,
    },
    text: 'Working on some new projects today. The creative energy in this city is unmatched! 🎨',
    image: require('../../../assets/images/story2.png'),
    likes: 15,
    comments: 3,
    timeAgo: '4 hours ago',
  },
  {
    id: '3',
    user: {
      name: 'Sarah Johnson',
      location: 'London',
      isVerified: true,
    },
    text: 'Beautiful sunset from my window today. Sometimes the simple moments are the most precious. 🌅',
    likes: 42,
    comments: 12,
    timeAgo: '6 hours ago',
  },
  {
    id: '4',
    user: {
      name: 'Mike Rodriguez',
      location: 'Barcelona',
      isVerified: false,
    },
    text: 'New coffee shop discovered! The atmosphere here is perfect for getting work done. ☕',
    likes: 18,
    comments: 5,
    timeAgo: '8 hours ago',
  },
  {
    id: '5',
    user: {
      name: 'Emma Wilson',
      location: 'Berlin',
      isVerified: true,
    },
    text: 'Just had an amazing day exploring the city! The architecture here is incredible.',
    image: require('../../../assets/images/story1.png'),
    likes: 24,
    comments: 8,
    timeAgo: '2 hours ago',
  },
];

function MyPostScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [commentStates, setCommentStates] = useState({});
  const [commentTexts, setCommentTexts] = useState({});

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLike = (postId, isLiked) => {
    console.log('Like pressed for post:', postId, 'isLiked:', isLiked);
    // Handle like/unlike functionality here
    // You can update the post data or make API calls
  };

  const handleComment = (postId) => {
    console.log('Comment pressed for post:', postId);
    setCommentStates(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleShare = () => {
    console.log('Share pressed');
  };

  const handleOptions = () => {
    console.log('Options pressed');
  };

  const handlePostPress = (post) => {
    console.log('Post pressed:', post.id);
    // Handle post press - could navigate to post details or show actions
  };

  const handlePostComment = (postId) => {
    const commentText = commentTexts[postId] || '';
    if (commentText.trim()) {
      console.log('Posting comment for post:', postId, 'Comment:', commentText);
      setCommentTexts(prev => ({
        ...prev,
        [postId]: ''
      }));
      setCommentStates(prev => ({
        ...prev,
        [postId]: false
      }));
    }
  };

  const handleCommentTextChange = (postId, text) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackArrowIcon width={24} height={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Posts</Text>
        
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Multiple Post Cards */}
          {MY_POSTS_DATA.map((post) => (
            <PostCardView
              key={post.id}
              post={post}
              onPress={() => handlePostPress(post)}
              onCommentPress={handleComment}
              onLikePress={handleLike}
              showCommentInput={commentStates[post.id] || false}
              commentText={commentTexts[post.id] || ''}
              onCommentTextChange={handleCommentTextChange}
              onPostComment={handlePostComment}
            />
          ))}
      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140034',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#140034',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
});

export default MyPostScreen;
