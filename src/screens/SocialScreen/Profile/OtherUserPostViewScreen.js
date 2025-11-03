// src/screens/Profile/OtherUserPostViewScreen.js
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import CommonBackground from '../../../components/common/CommonBackground';
import PostCardView from '../../../components/common/PostCardView';
import { BackIcon } from '../../../components/icons/SvgIcons';
import { hideTabBar, showTabBar, setCurrentScreen } from '../../../redux/slices/uiSlice';

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
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  // Get user data from route params
  const { userData } = route.params || {};
  
  // State for managing comments for each post
  const [commentStates, setCommentStates] = useState({});
  const [commentTexts, setCommentTexts] = useState({});

  // Redux-based tab bar hiding when OtherUserPostViewScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('📝 OtherUserPostViewScreen Focused - Hiding TabBar');
      dispatch(setCurrentScreen('MyPosts'));
      dispatch(hideTabBar());

      return () => {
        console.log('📝 OtherUserPostViewScreen Unfocused - Showing TabBar');
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [dispatch])
  );

  // Additional backup using useLayoutEffect
  useLayoutEffect(() => {
    dispatch(setCurrentScreen('MyPosts'));
    dispatch(hideTabBar());

    return () => {
      dispatch(showTabBar());
      dispatch(setCurrentScreen(null));
    };
  }, [dispatch]);

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
          <BackIcon width={24} height={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Posts</Text>
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
