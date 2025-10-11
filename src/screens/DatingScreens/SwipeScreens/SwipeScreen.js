import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, Animated, Dimensions, TouchableOpacity, Easing, Platform, TextInput, Modal } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import DatingHeader from '../../../components/common/DatingHeader';
import { DislikeButtonIcon, InfoButtonIcon, LikeButtonIcon, HeartIcon, CommentIcon, SendIcon } from '../../../components/icons/SvgIcons';
import EmojiIcon from '../../../components/icons/chatIcons/EmojiIcon';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { showTabBar, setCurrentScreen } from '../../../redux/slices/uiSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

const profiles = [
  { id: 1, name: 'Ravi Kumar', distance: '1.5 km away', image: require('../../../assets/DatingProfileImage/Match1.png'), profileImage: require('../../../assets/messageUser/message1.png') },
  { id: 2, name: 'Sarah Wilson', distance: '2.3 km away', image: require('../../../assets/DatingProfileImage/Match2.png'), profileImage: require('../../../assets/messageUser/message2.png') },
  { id: 3, name: 'Mike Johnson', distance: '0.8 km away', image: require('../../../assets/DatingProfileImage/Match3.png'), profileImage: require('../../../assets/messageUser/message3.png') },
  { id: 4, name: 'Emma Davis', distance: '1.2 km away', image: require('../../../assets/DatingProfileImage/Match4.png'), profileImage: require('../../../assets/messageUser/message4.png') },
  { id: 5, name: 'Alex Chen', distance: '3.1 km away', image: require('../../../assets/DatingProfileImage/Match5.png'), profileImage: require('../../../assets/messageUser/test_match2.png') },
  { id: 6, name: 'Lisa Brown', distance: '0.5 km away', image: require('../../../assets/DatingProfileImage/Match6.png'), profileImage: require('../../../assets/messageUser/message1.png') },
];

const TILT_VALUES = ['-12deg', '12deg', '-8deg'];

// Close Icon Component
const CloseIcon = ({ width = 20, height = 20, color = '#FFFFFF' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SwipeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isMessageDrawerVisible, setIsMessageDrawerVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Animation values for message drawer
  const drawerTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  
  // Lazy animation values for background cards
  const secondCardTranslateY = useRef(new Animated.Value(-20)).current;
  const thirdCardTranslateY = useRef(new Animated.Value(-40)).current;
  const secondCardOpacity = useRef(new Animated.Value(0.9)).current;
  const thirdCardOpacity = useRef(new Animated.Value(0.6)).current;

  const rotate = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const opacity = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, -SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD, SCREEN_WIDTH],
    outputRange: [0.3, 0.7, 1, 0.7, 0.3],
    extrapolate: 'clamp',
  });

  const scale = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [0.85, 1, 0.85],
    extrapolate: 'clamp',
  });

  // Lazy animation function for background cards
  const animateBackgroundCards = () => {
    Animated.parallel([
      Animated.timing(secondCardTranslateY, {
        toValue: -20,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(thirdCardTranslateY, {
        toValue: -40,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(secondCardOpacity, {
        toValue: 0.9,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(thirdCardOpacity, {
        toValue: 0.6,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Initialize background card positions on mount
  useEffect(() => {
    animateBackgroundCards();
  }, []);

  // Ensure tab bar is visible when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      dispatch(showTabBar());
      dispatch(setCurrentScreen('SwipeMain'));
    }, [dispatch])
  );

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      if (isSwiping) return;
      setIsSwiping(true);
    } else if (event.nativeEvent.state === State.END) {
      if (isSwiping) {
        const { translationX, velocityX } = event.nativeEvent;
        let swiped = false;
        let finalX = 0;
        let direction = '';

        if (translationX > SWIPE_THRESHOLD || velocityX > 1000) {
          swiped = true;
          finalX = SCREEN_WIDTH * 1.5;
          direction = 'right';
        } else if (translationX < -SWIPE_THRESHOLD || velocityX < -1000) {
          swiped = true;
          finalX = -SCREEN_WIDTH * 1.5;
          direction = 'left';
        }

        if (swiped) {
          // Simplified animation sequence to prevent conflicts
          Animated.timing(translateX, {
            toValue: finalX,
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start(() => {
            // Reset values immediately
            translateX.setValue(0);
            translateY.setValue(0);
            
            // Update index
            if (direction === 'right') {
              setCurrentIndex((prev) => (prev + 1) % profiles.length);
            } else if (direction === 'left') {
              setCurrentIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
            }
            
            // Trigger lazy animation for background cards
            setTimeout(() => {
              animateBackgroundCards();
            }, 50);
            
            setIsSwiping(false);
          });
        } else {
          // Simple spring back
          Animated.spring(translateX, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start(() => {
            setIsSwiping(false);
          });
        }
      }
    }
  };

  const manualSwipe = (direction) => {
    if (isSwiping) return;

    setIsSwiping(true);
    let toValue = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

    // Simplified animation to prevent flickering
    Animated.timing(translateX, {
      toValue: toValue,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // Reset values immediately
      translateX.setValue(0);
      translateY.setValue(0);
      
      // Handle like action - navigate to LikeResultScreen
      if (direction === 'right') {
        // Navigate to LikeResultScreen after a short delay
        setTimeout(() => {
          navigation.navigate('LikeResult');
        }, 300);
        return;
      } else if (direction === 'left') {
        setCurrentIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
      }
      
      // Trigger lazy animation for background cards
      setTimeout(() => {
        animateBackgroundCards();
      }, 50);
      
      setIsSwiping(false);
    });
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleProfilePress = (profile) => {
    navigation.navigate('ProfileDetails', { profile });
  };

  // Message drawer functions
  const showMessageDrawer = () => {
    setIsMessageDrawerVisible(true);
    Animated.parallel([
      Animated.timing(drawerTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideMessageDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMessageDrawerVisible(false);
    });
  };

  const handleInfoPress = () => {
    showMessageDrawer();
  };

  const handleLike = () => {
    console.log('Like pressed');
    // Add like functionality here
  };

  const handleDislike = () => {
    console.log('Dislike pressed');
    // Add dislike functionality here
  };

  const handleComment = () => {
    console.log('Comment pressed');
    // Add comment functionality here
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log('Sending comment:', commentText);
      setCommentText('');
      // Add send comment functionality here
    }
  };

  // Render cards with stable keys and fixed opacity to prevent flickering
  const renderCards = () => {
    return [0, 1, 2].map((i) => {
      const profileIndex = (currentIndex + i) % profiles.length;
      const profile = profiles[profileIndex];
      const isTopCard = i === 0;
      const isSecondCard = i === 1;
      
      if (isTopCard) {
        return (
          <PanGestureHandler
            key={`top-${profile.id}`}
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.card,
                {
                  zIndex: 30,
                  opacity,
                  transform: [{ translateX }, { translateY }, { rotate }, { scale }],
                },
              ]}
            >
              <ProfileCard profile={profile} onProfilePress={handleProfilePress} />
            </Animated.View>
          </PanGestureHandler>
        );
      } else if (isSecondCard) {
        // Second card with lazy animation to prevent flickering
        return (
          <Animated.View
            key={`second-${profile.id}`}
            style={[
              styles.card,
              {
                position: 'absolute',
                zIndex: 30 - i,
                opacity: secondCardOpacity,
                transform: [
                  { scale: 0.92 }, 
                  { rotate: TILT_VALUES[i] || '0deg' }, 
                  { translateY: secondCardTranslateY }
                ],
              },
            ]}
          >
            <ProfileCard profile={profile} onProfilePress={handleProfilePress} />
          </Animated.View>
        );
      } else {
        // Third card with lazy animation
        return (
          <Animated.View
            key={`third-${profile.id}`}
            style={[
              styles.card,
              {
                position: 'absolute',
                zIndex: 30 - i,
                opacity: thirdCardOpacity,
                transform: [
                  { scale: 0.88 }, 
                  { rotate: TILT_VALUES[i] || '0deg' }, 
                  { translateY: thirdCardTranslateY }
                ],
              },
            ]}
          >
            <ProfileCard profile={profile} onProfilePress={handleProfilePress} />
          </Animated.View>
        );
      }
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      <DatingHeader onMenuPress={handleMenuPress} onNotificationPress={handleNotificationPress} />
      <View style={styles.mainContent}>{renderCards()}</View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => manualSwipe('right')}>
            <LikeButtonIcon width={70} height={70} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => manualSwipe('left')}>
            <DislikeButtonIcon width={70} height={70} />
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.actionButton} onPress={handleInfoPress}>
            <InfoButtonIcon width={70} height={70} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Message Drawer */}
      <Modal
        visible={isMessageDrawerVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideMessageDrawer}
      >
        <View style={styles.modalContainer}>
          {/* Backdrop */}
          <Animated.View 
            style={[
              styles.backdrop,
              { opacity: backdropOpacity }
            ]}
          >
            <TouchableOpacity 
              style={styles.backdropTouchable}
              onPress={hideMessageDrawer}
              activeOpacity={1}
            />
          </Animated.View>

          {/* Drawer */}
          <Animated.View 
            style={[
              styles.messageDrawer,
              { transform: [{ translateY: drawerTranslateY }] }
            ]}
          >
            <LinearGradient
              colors={['#000000', '#1A0F2E', '#2A1A4A']}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.drawerGradient}
            >
              {/* Close Button */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={hideMessageDrawer}
              >
                <CloseIcon width={24} height={24} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Comment Input */}
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write your Comment"
                  placeholderTextColor="#B0B0B0"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline={false}
                />
                
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendComment}
                  disabled={!commentText.trim()}
                >
                  <SendIcon width={20} height={20} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.emojiButton}>
                  <EmojiIcon width={20} height={21} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const ProfileCard = React.memo(({ profile, onProfilePress }) => (
  <View style={styles.cardInner}>
    <TouchableOpacity 
      style={styles.imageContainer}
      onPress={() => onProfilePress(profile)}
      activeOpacity={0.9}
    >
      <Image 
        source={profile.image} 
        style={styles.cardImage} 
        resizeMode="cover"
        shouldRasterizeIOS={true}
        renderToHardwareTextureAndroid={true}
        fadeDuration={0}
      />
    </TouchableOpacity>
    <View style={styles.cardDetails}>
      <Image 
        source={profile.profileImage} 
        style={styles.profileImage} 
        resizeMode="cover"
        shouldRasterizeIOS={true}
        renderToHardwareTextureAndroid={true}
        fadeDuration={0}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.cardName}>{profile.name}</Text>
        <Text style={styles.cardDistance}>{profile.distance}</Text>
        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140034',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 100,
    },
    
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.55,
    borderRadius: 22,
    backgroundColor: '#281849',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    // Performance optimizations to prevent flickering
    shouldRasterizeIOS: true,
    renderToHardwareTextureAndroid: true,
    backfaceVisibility: 'hidden',
  },
  cardInner: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  paginationDots: {
    flexDirection: 'row',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginRight: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  cardName: {
    color: 'white',
    fontSize: 31,
    fontWeight: '700',
  },
  cardDistance: {
    color: 'white',
    fontSize: 16,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  cardDetailsInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Message Drawer Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  messageDrawer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
  },
  drawerGradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingHorizontal: 20,
    minHeight: 200,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C53E8D',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  drawerActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 40,
  },
  drawerActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dislikeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#8A52F3',
  },
  commentInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 0,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
   
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  emojiButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
   
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default SwipeScreen;
