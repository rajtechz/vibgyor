// src/screens/Profile/OtherUserPostViewScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import CommonBackground from '../../../components/common/CommonBackground';
import PostCardView from '../../../components/common/PostCardView';
import Svg, { Path } from 'react-native-svg';

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

// Sample data for other user's posts
const OTHER_USER_POSTS_DATA = [
  {
    id: '1',
    user: {
      name: 'Emma Wilson',
      location: 'Hamburg, Germany',
      isVerified: true,
    },
    image: require('../../../assets/images/postImage/Gallery Image 4 (1).png'),
    text: 'Which team do you believe will take home the trophy in Euro 2020? Who are your favorites?',
    likes: 245,
    comments: 24,
    shares: 8,
  },
  {
    id: '2',
    user: {
      name: 'Emma Wilson',
      location: 'Hamburg, Germany',
      isVerified: true,
    },
    image: require('../../../assets/images/postImage/Gallery Image 4.png'),
    text: 'Beautiful sunset today! 🌅 #nature #sunset',
    likes: 189,
    comments: 12,
    shares: 3,
  },
  {
    id: '3',
    user: {
      name: 'Emma Wilson',
      location: 'Hamburg, Germany',
      isVerified: true,
    },
    image: require('../../../assets/images/postImage/Gallery Image 10.png'),
    text: 'Coffee and coding ☕️ #developer #coffee',
    likes: 156,
    comments: 7,
    shares: 5,
  },
  {
    id: '4',
    user: {
      name: 'Emma Wilson',
      location: 'Hamburg, Germany',
      isVerified: true,
    },
    image: require('../../../assets/images/postImage/Gallery Image 16.png'),
    text: 'Weekend vibes! 🎉 #weekend #fun',
    likes: 298,
    comments: 15,
    shares: 12,
  },
];

function OtherUserPostViewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  // Get user data from route params
  const { userData } = route.params || {};
  
  // State for managing comments for each post
  const [commentStates, setCommentStates] = useState({});
  const [commentTexts, setCommentTexts] = useState({});

  const handlePostPress = (post) => {
    console.log('Post pressed:', post.id);
    // Handle post press if needed
  };

  const handleComment = (postId) => {
    setCommentStates(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentTextChange = (postId, text) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  const handlePostComment = (postId) => {
    const commentText = commentTexts[postId];
    if (commentText && commentText.trim()) {
      console.log('Posting comment for post:', postId, 'Comment:', commentText);
      // Here you would typically send the comment to your backend
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

  const handleLike = (postId, isLiked) => {
    console.log('Like toggled for post:', postId, 'Is liked:', isLiked);
    // Here you would typically update the like status in your backend
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackArrowIcon width={24} height={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Posts</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {OTHER_USER_POSTS_DATA.map((post) => (
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default OtherUserPostViewScreen;
