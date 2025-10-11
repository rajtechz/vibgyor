import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import { AccountVerifyBadge, HamburgerIcon, LikeIcon, CommentIcon, ShareIcon, TrashIcon } from '../icons/SvgIcons';

const { width: screenWidth } = Dimensions.get('window');

const PostCard = ({ post, onPress }) => {
  const [showReportTooltip, setShowReportTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const moreButtonRef = useRef(null);

  const handleMorePress = (event) => {
    event.stopPropagation(); // Prevent triggering the post press
    
    if (moreButtonRef.current) {
      moreButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setTooltipPosition({
          x: pageX - 80, // Position tooltip to the left of the button
          y: pageY + 5 // Position tooltip slightly below the button
        });
        setShowReportTooltip(true);
      });
    }
  };

  const handleReportPress = () => {
    setShowReportTooltip(false);
    // Handle report functionality here
    console.log('Report pressed for post:', post.id);
  };

  const handleCloseTooltip = () => {
    setShowReportTooltip(false);
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
          <View style={styles.actionItem}>
            <LikeIcon width={20} height={20} />
            <Text style={styles.actionCount}>{post.likes}+</Text>
          </View>
          <View style={styles.actionItem}>
            <CommentIcon width={20} height={20} />
            <Text style={styles.actionCount}>{post.comments}+</Text>
          </View>
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

     

      {/* Post Footer */}
      <View style={styles.postFooter}>
        <View style={styles.footerLine} />
      </View>

      {/* Report Tooltip Modal */}
      <Modal
        visible={showReportTooltip}
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
              styles.reportTooltip,
              {
                left: tooltipPosition.x,
                top: tooltipPosition.y,
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.reportButton}
              onPress={handleReportPress}
              activeOpacity={0.8}
            >
              <View style={styles.reportIcon}>
                <TrashIcon width={16} height={16} color="white" />
              </View>
              <Text style={styles.reportText}>Report</Text>
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
  reportTooltip: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  reportButton: {
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
  reportIcon: {
    marginRight: 8,
  },
  reportText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PostCard;
