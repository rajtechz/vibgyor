import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Modal, TextInput } from 'react-native';
import { AccountVerifyBadge, HamburgerIcon, LikeIcon, CommentIcon, ShareIcon, TrashIcon } from '../icons/SvgIcons';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const PostCard = ({ post, onPress, onCommentPress, showCommentInput, commentText, onCommentTextChange, onPostComment, onLikePress }) => {
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const moreButtonRef = useRef(null);

  const handleMorePress = (event) => {
    event.stopPropagation(); // Prevent triggering the post press
    
    if (moreButtonRef.current) {
      moreButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setTooltipPosition({
          x: pageX - 100, // Position tooltip to the left of the button
          y: pageY + 5 // Position tooltip slightly below the button
        });
        setShowDeleteTooltip(true);
      });
    }
  };

  const handleDeletePress = () => {
    setShowDeleteTooltip(false);
    // Handle delete functionality here
    console.log('Delete pressed for post:', post.id);
  };

  const handleCloseTooltip = () => {
    setShowDeleteTooltip(false);
  };

  const handleLikePress = (event) => {
    event.stopPropagation(); // Prevent triggering the post press
    
    if (isLiked) {
      // Unlike the post
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      // Like the post
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
    
    // Call parent component's like handler if provided
    if (onLikePress) {
      onLikePress(post.id, !isLiked);
    }
  };


  return (
    <TouchableOpacity style={styles.postCard} onPress={onPress} activeOpacity={0.8}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{post.user.name.charAt(0)}</Text>
          </View>
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{post.user.name}</Text>
              {post.user.isVerified && <AccountVerifyBadge width={14} height={15} />}
            </View>
            <Text style={styles.userLocation}>{post.user.location}</Text>
          </View>
        </View>
        <TouchableOpacity 
          ref={moreButtonRef}
          style={styles.moreButton}
          onPress={handleMorePress}
        >
          <HamburgerIcon width={18} height={20} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
      
        {post.image && (
          <Image source={post.image} style={styles.postImage} resizeMode="cover" />
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleLikePress}
          >
            {isLiked ? (
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
            <Text style={styles.actionCount}>{likeCount}+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={(e) => {
              e.stopPropagation();
              if (onCommentPress) {
                onCommentPress(post.id);
              }
            }}
          >
            <CommentIcon width={20} height={20} />
            <Text style={styles.actionCount}>{post.comments}+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightAction}>
          <ShareIcon width={20} height={20} />
        </View>
      </View>

      {/* Post Text Content */}
      {post.text && (
        <View style={styles.postTextContainer}>
          <Text style={styles.postText}>{post.text}</Text>
          <Text style={styles.moreText}>More</Text>
        </View>
      )}

     

      {/* Comment Input Box */}
      {showCommentInput && (
        <View style={styles.commentInputContainer}>
          <View style={styles.commentInputBox}>
            <TouchableOpacity style={styles.emojiButton}>
              <Text style={styles.emojiIcon}>😊</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.commentInput}
              placeholder="Comment here...."
              placeholderTextColor="#B0B0B0"
              value={commentText || ''}
              onChangeText={(text) => onCommentTextChange && onCommentTextChange(post.id, text)}
              multiline
              autoFocus
            />
            <TouchableOpacity 
              style={styles.postButton}
              onPress={() => onPostComment && onPostComment(post.id)}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Post Footer */}
      <View style={styles.postFooter}>
        <View style={styles.footerLine} />
      </View>

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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postCard: {
    // backgroundColor: '#2A1A4A',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    // padding: 16,
    // shadowColor: '#421192',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DD3562',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 6,
  },
  userLocation: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  moreButton: {
    padding: 8,
  },
  postContent: {
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 450,
    borderRadius: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  rightAction: {
    alignItems: 'center',
  },
  actionCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  postTextContainer: {
    marginBottom: 16,
  },
  postText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  moreText: {
    color: '#DD3562',
    fontSize: 14,
    fontWeight: '500',
  },
  lastCommentSection: {
    marginBottom: 16,
  },
  lastCommentLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lastCommentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastCommentText: {
    color: 'white',
    fontSize: 14,
    marginRight: 8,
  },
  lastCommentEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  lastCommentHeart: {
    fontSize: 16,
  },
  postFooter: {
    alignItems: 'center',
  },
  footerLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
  // Comment input styles
  commentInputContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  commentInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A1A4A',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#8A52F3',
  },
  emojiButton: {
    marginRight: 12,
  },
  emojiIcon: {
    fontSize: 20,
  },
  commentInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxHeight: 100,
  },
  postButton: {
    backgroundColor: '#8A52F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  postButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PostCard;
