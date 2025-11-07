import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { socialAPI } from '../../api/socialAPI';

const PostsTab = ({ navigation, refreshKey = 0 }) => {
  // Use navigation prop if provided, otherwise use useNavigation hook
  const nav = navigation || useNavigation();
  
  // Redux state
  const authState = useSelector((state) => state.auth);
  
  // Local state
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    hasMore: true,
  });
  
  // Track if component has mounted to prevent double-fetch on initial focus
  const hasMountedRef = useRef(false);
  const lastRefreshKeyRef = useRef(refreshKey);

  // Fetch posts function
  const fetchPosts = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      console.log('📝 PostsTab: Fetching posts, page:', page);

      const result = await socialAPI.getUserPosts(authState.accessToken, {
        page,
        limit: pagination.limit,
      });

      if (result.success) {
        const newPosts = result.data.posts || [];
        
        if (append) {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        } else {
          setPosts(newPosts);
        }

        setPagination({
          page: result.data.pagination.page || result.data.pagination.currentPage || 1,
          limit: result.data.pagination.limit || pagination.limit,
          hasMore: result.data.pagination.hasMore !== undefined 
                   ? result.data.pagination.hasMore 
                   : (result.data.pagination.hasNext !== undefined 
                      ? result.data.pagination.hasNext 
                      : false),
          totalCount: result.data.totalCount || result.data.pagination.totalPosts || 0,
        });

        console.log('✅ PostsTab: Posts fetched successfully, count:', newPosts.length);
      } else {
        setError(result.error || 'Failed to fetch posts');
        console.log('❌ PostsTab: Failed to fetch posts:', result.error);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('💥 PostsTab: Error fetching posts:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [authState.accessToken, pagination.limit]);

  // Initial fetch on mount and when auth state changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.accessToken) {
      fetchPosts(1, false);
      hasMountedRef.current = true;
    } else {
      // Reset state if not authenticated
      setPosts([]);
      setIsLoading(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated, authState.accessToken]);

  // Refresh posts when ProfileScreen is focused (e.g., after creating a post)
  // This ensures posts are updated when user navigates back from post creation
  useFocusEffect(
    useCallback(() => {
      // Only refresh if component has already mounted (prevents double-fetch on initial mount)
      if (hasMountedRef.current && authState.isAuthenticated && authState.accessToken) {
        console.log('🔄 PostsTab: Screen focused, refreshing posts...');
        fetchPosts(1, false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState.isAuthenticated, authState.accessToken])
  );

  // Refresh posts when refreshKey changes (triggered by pull-to-refresh)
  useEffect(() => {
    if (refreshKey !== lastRefreshKeyRef.current && hasMountedRef.current && authState.isAuthenticated && authState.accessToken) {
      console.log('🔄 PostsTab: Refresh key changed, refreshing posts...');
      lastRefreshKeyRef.current = refreshKey;
      fetchPosts(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, authState.isAuthenticated, authState.accessToken]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (!isLoadingMore && pagination.hasMore) {
      const nextPage = pagination.page + 1;
      fetchPosts(nextPage, true);
    }
  }, [isLoadingMore, pagination.hasMore, pagination.page, fetchPosts]);

  // Handle post press
  const handlePostPress = useCallback((post, index) => {
    console.log('Post pressed:', post._id || post.id, 'at index:', index);
    // Navigate to post detail screen if available
    // You can customize this navigation based on your app structure
    if (nav && nav.navigate) {
      nav.navigate('OtherUserPostView', { postId: post._id || post.id, post });
    }
  }, [nav]);

  // Render post item
  const renderPostItem = useCallback(({ item, index }) => {
    // Get the first media item (image or video thumbnail)
    // Handle both API response format (media array with url) and transformed format
    let firstMedia, imageUri, isVideo;
    
    if (item.media && Array.isArray(item.media)) {
      // API response format: media array with url field
      firstMedia = item.media[0];
      imageUri = firstMedia?.url || firstMedia?.uri || firstMedia?.thumbnailUri;
      isVideo = firstMedia?.type === 'video';
    } else {
      // Transformed format or legacy format
      firstMedia = item.mediaItems?.[0] || item.media?.[0] || item.files?.[0];
      imageUri = firstMedia?.uri || firstMedia?.url || firstMedia?.thumbnailUri;
      isVideo = firstMedia?.isVideo || firstMedia?.type === 'video';
    }

    return (
      <TouchableOpacity
        style={styles.contentItem}
        onPress={() => handlePostPress(item, index)}
        activeOpacity={0.8}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.postImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        {isVideo && (
          <View style={styles.videoIndicator}>
            <Text style={styles.videoIndicatorText}>▶</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [handlePostPress]);

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
    <FlatList
      data={posts}
      renderItem={renderPostItem}
      keyExtractor={(item, index) => item._id || item.id || `post-${index}`}
      numColumns={3}
      contentContainerStyle={styles.listContainer}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      scrollEnabled={false} // Disable scroll since parent ScrollView handles it
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
  },
  contentItem: {
    width: '33.33%',
    marginBottom: 0,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 0,
    resizeMode: 'cover',
  },
  placeholderContainer: {
    width: '100%',
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIndicatorText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    minHeight: 200,
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

export default PostsTab;
