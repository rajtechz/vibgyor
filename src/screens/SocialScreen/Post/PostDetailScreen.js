import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions, TextInput } from 'react-native';
import { AccountVerifyBadge, HamburgerIcon } from '../../components/icons/SvgIcons';
import PostTooltip from '../../components/common/PostTooltip';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// Gradient Border Component
const GradientBorder = ({ children, style }) => (
  <View style={[styles.gradientBorderContainer, style]}>
    <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <Path
        d="M12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12C0 5.37258 5.37258 0 12 0Z"
        stroke="url(#commentGradient)"
        strokeWidth="1"
        fill="none"
      />
      <Defs>
        <SvgLinearGradient id="commentGradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#C53E8D"/>
          <Stop offset="1" stopColor="#8A52F3"/>
        </SvgLinearGradient>
      </Defs>
    </Svg>
    <View style={styles.gradientBorderContent}>
      {children}
    </View>
  </View>
);

const PostDetailScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [commentText, setCommentText] = useState('');
  const moreButtonRef = useRef(null);

  const handleMorePress = (event) => {
    event.stopPropagation();
    moreButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Use the right edge of the button for positioning
      setTooltipPosition({ x: pageX + width, y: pageY });
      setShowTooltip(true);
    });
  };

  const handleCloseTooltip = () => {
    setShowTooltip(false);
  };

  const handleReport = () => {
    console.log('Report post:', post.id);
    // You can add your report logic here
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.user.name.charAt(0)}</Text>
            </View>
            <View style={styles.userDetails}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{post.user.name}</Text>
                {post.user.isVerified && <AccountVerifyBadge width={16} height={17} />}
              </View>
              <Text style={styles.userLocation}>{post.user.location}</Text>
            </View>
          </View>
          <TouchableOpacity 
            ref={moreButtonRef}
            style={styles.moreButton}
            onPress={handleMorePress}
          >
            <HamburgerIcon width={20} height={22} />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          {post.text && (
            <Text style={styles.postText}>{post.text}</Text>
          )}
          {post.image && (
            <Image source={post.image} style={styles.postImage} resizeMode="cover" />
          )}
        </View>

        {/* Post Stats */}
        <View style={styles.postStats}>
          <Text style={styles.statsText}>{post.likes} likes</Text>
          <Text style={styles.statsText}>{post.comments} comments</Text>
        </View>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>❤️ Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>💬 Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>🔖 Save</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments</Text>
          
          {/* Sample Comments */}
          <View style={styles.comment}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>J</Text>
            </View>
            <View style={styles.commentContent}>
              <Text style={styles.commentUser}>John Doe</Text>
              <Text style={styles.commentText}>Amazing post! Love the energy 🔥</Text>
              <Text style={styles.commentTime}>1 hour ago</Text>
            </View>
          </View>

          <View style={styles.comment}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>A</Text>
            </View>
            <View style={styles.commentContent}>
              <Text style={styles.commentUser}>Alice Smith</Text>
              <Text style={styles.commentText}>This is so inspiring! Thank you for sharing ✨</Text>
              <Text style={styles.commentTime}>2 hours ago</Text>
            </View>
          </View>
        </View>

        {/* Add Comment */}
        <View style={styles.addCommentSection}>
          <GradientBorder style={styles.addCommentInput}>
            <TextInput
              style={styles.commentTextInput}
              placeholder="Add a comment..."
              placeholderTextColor="#B0B0B0"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
          </GradientBorder>
          <TouchableOpacity style={styles.postCommentButton}>
            <Text style={styles.postCommentText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tooltip */}
      <PostTooltip
        visible={showTooltip}
        onClose={handleCloseTooltip}
        onReport={handleReport}
        position={tooltipPosition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140034',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#140034',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#DD3562',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareButton: {
    padding: 8,
  },
  shareText: {
    color: '#DD3562',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
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
  },
  avatarText: {
    fontSize: 20,
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
    fontSize: 18,
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
  moreText: {
    fontSize: 24,
    color: '#B0B0B0',
    fontWeight: 'bold',
  },
  postContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  postText: {
    fontSize: 18,
    color: 'white',
    lineHeight: 26,
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statsText: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 16,
    color: '#B0B0B0',
    marginLeft: 4,
  },
  commentsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8354FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#888',
  },
  addCommentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  gradientBorderContainer: {
    position: 'relative',
    flex: 1,
    marginRight: 12,
  },
  gradientBorderContent: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    backgroundColor: 'rgba(42, 26, 74, 0.8)',
    borderRadius: 19,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addCommentInput: {
    height: 48,
  },
  commentTextInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    textAlignVertical: 'top',
  },
  postCommentButton: {
    backgroundColor: '#DD3562',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  postCommentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PostDetailScreen;
