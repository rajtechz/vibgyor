import React, { useState, useLayoutEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import CommonBackground from '../../../components/common/CommonBackground';
import { BackIcon, LikeIcon } from '../../../components/icons/SvgIcons';
import { TrashIcon, HamburgerIcon } from '../../../components/icons/SvgIcons';
import { hideTabBar, showTabBar, setCurrentScreen } from '../../../redux/slices/uiSlice';
import Svg, { Path } from 'react-native-svg';

// Sample data for comments
const SAMPLE_COMMENTS = [
  {
    id: '1',
    userId: '1',
    userName: 'Liam Johnson',
    profileImage: require('../../../assets/messageUser/message1.png'),
    timestamp: '8h',
    comment: 'Nice',
    isLiked: false,
    likes: 0,
  },
  {
    id: '2',
    userId: '2',
    userName: 'Emma Smith',
    profileImage: require('../../../assets/messageUser/message2.png'),
    timestamp: '7h',
    comment: 'Good',
    isLiked: false,
    likes: 2,
  },
  {
    id: '3',
    userId: '3',
    userName: 'Sophia Brown',
    profileImage: require('../../../assets/messageUser/message3.png'),
    timestamp: '6h',
    comment: 'Average',
    isLiked: true,
    likes: 5,
  },
  {
    id: '4',
    userId: '4',
    userName: 'Noah Davis',
    profileImage: require('../../../assets/messageUser/message4.png'),
    timestamp: '5h',
    comment: 'Excellent',
    isLiked: false,
    likes: 8,
  },
  {
    id: '5',
    userId: '5',
    userName: 'Olivia Wilson',
    profileImage: require('../../../assets/liveUser/user1.png'),
    timestamp: '4h',
    comment: 'Fair',
    isLiked: false,
    likes: 1,
  },
  {
    id: '6',
    userId: '6',
    userName: 'James Taylor',
    profileImage: require('../../../assets/liveUser/user3.png'),
    timestamp: '3h',
    comment: 'Outstanding',
    isLiked: true,
    likes: 12,
  },
  {
    id: '7',
    userId: '7',
    userName: 'Isabella Martinez',
    profileImage: require('../../../assets/liveUser/user4.png'),
    timestamp: '2h',
    comment: 'Below Average',
    isLiked: false,
    likes: 0,
  },
  {
    id: '8',
    userId: '8',
    userName: 'William Anderson',
    profileImage: require('../../../assets/liveUser/user5.png'),
    timestamp: '1h',
    comment: 'Poor',
    isLiked: false,
    likes: 3,
  },
  {
    id: '9',
    userId: '9',
    userName: 'Ava Thomas',
    profileImage: require('../../../assets/images/notificationUser/user1.png'),
    timestamp: '45m',
    comment: 'Great',
    isLiked: true,
    likes: 15,
  },
  {
    id: '10',
    userId: '10',
    userName: 'Mason Jackson',
    profileImage: require('../../../assets/images/notificationUser/user2.png'),
    timestamp: '30m',
    comment: 'Unsatisfactory',
    isLiked: false,
    likes: 0,
  },
];

function CommentsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { postId } = route.params || {};

  const [comments, setComments] = useState(SAMPLE_COMMENTS);
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const [tooltipCommentId, setTooltipCommentId] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const moreButtonRefs = useRef({});

  // Redux-based tab bar hiding when CommentsScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('💬 CommentsScreen Focused - Hiding TabBar');
      // Dispatch Redux actions to hide tab bar
      dispatch(setCurrentScreen('Comments'));
      dispatch(hideTabBar());

      // Show tab bar when screen is unfocused
      return () => {
        console.log('💬 CommentsScreen Unfocused - Showing TabBar');
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [navigation, dispatch])
  );

  // Additional backup using useLayoutEffect
  useLayoutEffect(() => {
    dispatch(setCurrentScreen('Comments'));
    dispatch(hideTabBar());

    return () => {
      dispatch(showTabBar());
      dispatch(setCurrentScreen(null));
    };
  }, [dispatch]);

  const handleLikePress = (commentId) => {
    setComments(prevComments =>
      prevComments.map(comment => {
        if (comment.id === commentId) {
          const newIsLiked = !comment.isLiked;
          return {
            ...comment,
            isLiked: newIsLiked,
            likes: newIsLiked ? comment.likes + 1 : Math.max(0, comment.likes - 1),
          };
        }
        return comment;
      })
    );
    // Here you would typically make an API call to like/unlike comment
    console.log('Like toggled for comment:', commentId);
  };

  const handleMorePress = (commentId, event) => {
    event.stopPropagation();
    
    if (moreButtonRefs.current[commentId]) {
      moreButtonRefs.current[commentId].measure((x, y, width, height, pageX, pageY) => {
        setTooltipPosition({
          x: pageX - 100, // Position tooltip to the left of the button
          y: pageY + 5, // Position tooltip slightly below the button
        });
        setTooltipCommentId(commentId);
        setShowDeleteTooltip(true);
      });
    }
  };

  const handleDeletePress = () => {
    if (tooltipCommentId) {
      // Remove the comment
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== tooltipCommentId)
      );
      console.log('Comment deleted:', tooltipCommentId);
    }
    setShowDeleteTooltip(false);
    setTooltipCommentId(null);
  };

  const handleCloseTooltip = () => {
    setShowDeleteTooltip(false);
    setTooltipCommentId(null);
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon width={24} height={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
      </View>
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <View style={styles.commentInfo}>
              <View style={styles.avatar}>
                {comment.profileImage ? (
                  <Image source={comment.profileImage} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{comment.userName.charAt(0)}</Text>
                )}
              </View>
              <View style={styles.commentDetails}>
                <View style={styles.commentHeader}>
                  <Text style={styles.userName}>{comment.userName}</Text>
                  <Text style={styles.timestamp}>{comment.timestamp}</Text>
                </View>
                <Text style={styles.commentText}>{comment.comment}</Text>
              </View>
            </View>
            <View style={styles.commentActions}>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => handleLikePress(comment.id)}
                activeOpacity={0.8}
              >
                {comment.isLiked ? (
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z"
                      fill="#FF0000"
                    />
                  </Svg>
                ) : (
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                ref={(ref) => (moreButtonRefs.current[comment.id] = ref)}
                style={styles.moreButton}
                onPress={(e) => handleMorePress(comment.id, e)}
              >
                <HamburgerIcon width={18} height={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Delete Tooltip Modal */}
      <Modal
        visible={showDeleteTooltip}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseTooltip}
      >
        <TouchableOpacity 
          style={styles.tooltipOverlay}
          activeOpacity={1}
          onPress={handleCloseTooltip}
        >
          <View 
            style={[
              styles.deleteTooltip,
              {
                left: tooltipPosition.x,
                top: tooltipPosition.y,
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeletePress}
              activeOpacity={0.8}
            >
              <View style={styles.deleteIcon}>
                <TrashIcon width={16} height={16} color="white" />
              </View>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
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
  commentDetails: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  commentText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  likeButton: {
    padding: 4,
  },
  moreButton: {
    padding: 4,
  },
  // Tooltip styles
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  deleteTooltip: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CommentsScreen;

