// src/screens/Profile/PostCardViewScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CommonBackground from '../../../components/common/CommonBackground';
import PostCardView from '../../../components/common/PostCardView';

// Sample data for posts
const MY_POSTS_DATA = [
  {
    id: '1',
    user: {
      name: 'Mathew Ben',
      location: 'New York, USA',
      isVerified: true,
    },
    image: require('../../../assets/images/postImage/Gallery Image 4 (1).png'),
    text: 'Beautiful sunset today! 🌅 #nature #sunset',
    likes: 245,
    comments: 12,
    shares: 8,
  },
  {
    id: '2',
    user: {
      name: 'Mathew Ben',
      location: 'New York, USA',
      isVerified: true,
    },
    image: require('../../../assets/images/postImage/Gallery Image 4.png'),
    text: 'Coffee and coding ☕️ #developer #coffee',
    likes: 189,
    comments: 7,
    shares: 3,
  },
  {
    id: '3',
    user: {
      name: 'Mathew Ben',
      location: 'New York, USA',
      isVerified: true,
    },
    image: require('../../../assets/images/postImage/Gallery Image 10.png'),
    text: 'Weekend vibes! 🎉 #weekend #fun',
    likes: 156,
    comments: 9,
    shares: 5,
  },
  {
    id: '4',
    user: {
      name: 'Mathew Ben',
      location: 'New York, USA',
      isVerified: true,
    },
    image: require('../../../assets/images/postImage/Gallery Image 16.png'),
    text: 'New project coming soon! 🚀 #work #project',
    likes: 298,
    comments: 15,
    shares: 12,
  },
];

function PostCardViewScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
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
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
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

export default PostCardViewScreen;
