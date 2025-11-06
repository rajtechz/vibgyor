// src/screens/Profile/OtherUserPostViewScreen.js
import React, { useState, useLayoutEffect, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CommonBackground from '../../../components/common/CommonBackground';
import PostCardView from '../../../components/common/PostCardView';
import { BackIcon } from '../../../components/icons/SvgIcons';
import { hideTabBar, showTabBar, setCurrentScreen } from '../../../redux/slices/uiSlice';
import { socialAPI } from '../../../api/socialAPI';
import { authAPI } from '../../../api/authAPI';

// Transform API post data to PostCardView format
const transformPostData = (apiPost, userProfile) => {
  // Get the first media item (image or video thumbnail)
  const firstMedia = apiPost.mediaItems?.[0] || apiPost.media?.[0] || apiPost.files?.[0];
  const imageUri = firstMedia?.uri || firstMedia?.url || firstMedia?.thumbnailUri;
  
  // Extract location string from location object
  let locationString = '';
  if (apiPost.location) {
    if (typeof apiPost.location === 'string') {
      locationString = apiPost.location;
    } else if (apiPost.location.name) {
      locationString = apiPost.location.name;
    } else if (apiPost.location.address) {
      locationString = apiPost.location.address;
    } else if (apiPost.location.city || apiPost.location.country) {
      // Build location string from city and country
      const parts = [];
      if (apiPost.location.city) parts.push(apiPost.location.city);
      if (apiPost.location.country) parts.push(apiPost.location.country);
      locationString = parts.join(', ');
    }
  }
  
  // Fallback to user profile location if post location is not available
  if (!locationString && userProfile?.location) {
    if (typeof userProfile.location === 'string') {
      locationString = userProfile.location;
    } else if (userProfile.location.city || userProfile.location.country) {
      const parts = [];
      if (userProfile.location.city) parts.push(userProfile.location.city);
      if (userProfile.location.country) parts.push(userProfile.location.country);
      locationString = parts.join(', ');
    }
  }
  
  return {
    id: apiPost._id || apiPost.id,
    _id: apiPost._id || apiPost.id,
    user: {
      name: userProfile?.fullName || userProfile?.username || 'User',
      location: locationString,
      isVerified: userProfile?.verificationStatus === 'approved' || false,
    },
    image: imageUri ? { uri: imageUri } : null,
    text: apiPost.content || apiPost.caption || '',
    likes: apiPost.likesCount || apiPost.likes || 0,
    comments: apiPost.commentsCount || apiPost.comments || 0,
    shares: apiPost.sharesCount || apiPost.shares || 0,
    // Keep original API data for reference
    originalData: apiPost,
  };
};

function OtherUserPostViewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  // Redux state
  const authState = useSelector((state) => state.auth);
  
  // Get user data from route params
  const { userData } = route.params || {};
  
  // State for posts and loading
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    hasMore: true,
  });
  
  // Track if component has mounted
  const hasMountedRef = useRef(false);
  
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

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!authState.isAuthenticated || !authState.accessToken) {
        return null;
      }

      const result = await authAPI.getUserProfile(authState.accessToken);
      if (result.success && result.data?.data) {
        return result.data.data;
      }
      return null;
    } catch (error) {
      console.error('💥 OtherUserPostViewScreen: Error fetching profile:', error);
      return null;
    }
  }, [authState.isAuthenticated, authState.accessToken]);

  // Fetch posts function
  const fetchPosts = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      console.log('📝 OtherUserPostViewScreen: Fetching posts, page:', page);

      const result = await socialAPI.getUserPosts(authState.accessToken, {
        page,
        limit: pagination.limit,
      });

      if (result.success) {
        const apiPosts = result.data.posts || [];
        
        // Ensure user profile is loaded before transforming
        let profileToUse = userProfile;
        if (!profileToUse) {
          profileToUse = await fetchUserProfile();
          if (profileToUse) {
            setUserProfile(profileToUse);
          }
        }
        
        // Transform API posts to PostCardView format
        const transformedPosts = apiPosts.map(post => 
          transformPostData(post, profileToUse)
        );
        
        if (append) {
          setPosts((prevPosts) => [...prevPosts, ...transformedPosts]);
        } else {
          setPosts(transformedPosts);
        }

        setPagination({
          page: result.data.pagination.page,
          limit: result.data.pagination.limit,
          hasMore: result.data.pagination.hasMore,
          totalCount: result.data.totalCount,
        });

        console.log('✅ OtherUserPostViewScreen: Posts fetched successfully, count:', transformedPosts.length);
      } else {
        setError(result.error || 'Failed to fetch posts');
        console.log('❌ OtherUserPostViewScreen: Failed to fetch posts:', result.error);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('💥 OtherUserPostViewScreen: Error fetching posts:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [authState.accessToken, pagination.limit, userProfile, fetchUserProfile]);

  // Initial fetch on mount
  useEffect(() => {
    if (authState.isAuthenticated && authState.accessToken) {
      fetchPosts(1, false);
      hasMountedRef.current = true;
    } else {
      setPosts([]);
      setIsLoading(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated, authState.accessToken]);

  // Refresh posts when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (hasMountedRef.current && authState.isAuthenticated && authState.accessToken) {
        console.log('🔄 OtherUserPostViewScreen: Screen focused, refreshing posts...');
        fetchPosts(1, false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState.isAuthenticated, authState.accessToken])
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    console.log('🔄 OtherUserPostViewScreen: Pull-to-refresh triggered');
    setRefreshing(true);
    await fetchPosts(1, false);
    setRefreshing(false);
  }, [fetchPosts]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (!isLoadingMore && pagination.hasMore) {
      const nextPage = pagination.page + 1;
      fetchPosts(nextPage, true);
    }
  }, [isLoadingMore, pagination.hasMore, pagination.page, fetchPosts]);

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

  // Render post item
  const renderPostItem = useCallback(({ item }) => (
    <PostCardView
      key={item.id}
      post={item}
      onPress={() => handlePostPress(item)}
      onCommentPress={() => handleComment(item.id)}
      onLikePress={handleLike}
      showCommentInput={commentStates[item.id] || false}
      commentText={commentTexts[item.id] || ''}
      onCommentTextChange={(text) => handleCommentTextChange(item.id, text)}
      onPostComment={() => handlePostComment(item.id)}
    />
  ), [commentStates, commentTexts]);

  // Render footer (loading indicator for pagination)
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#8A52F3" />
      </View>
    );
  }, [isLoadingMore]);

  // Render empty state
  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#8A52F3" />
          <Text style={styles.emptyText}>Loading posts...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchPosts(1, false)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts yet</Text>
      </View>
    );
  }, [isLoading, error, fetchPosts]);

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
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id || item._id || `post-${item.originalData?._id}`}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8A52F3"
              colors={['#8A52F3']}
              progressBackgroundColor="#140034"
            />
          }
        />
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    minHeight: 300,
  },
  emptyText: {
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 12,
  },
  errorText: {
    color: '#FF6B9D',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8A52F3',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OtherUserPostViewScreen;
