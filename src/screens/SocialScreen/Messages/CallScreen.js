import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Filter, FeFlood, FeBlend, FeGaussianBlur, Rect, Circle, G, FeOffset } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackground from '../../../components/common/CommonBackground';
import { setCallScreenActive, setCurrentScreen, hideTabBar, showTabBar } from '../../../redux/slices/uiSlice';
import { colors, gradients } from '../../../styles/colors';

// Icons
import { 
  BackArrowIcon, 
  EmojiIcon,
  HeartIcon,
  MuteIcon,
  VideoIcon,
  RefreshIcon,
  CallButtonIcon
} from '../../../components/icons/chatIcons';
// Remove BottomWaveIcon import

const { width, height } = Dimensions.get('window');

const CallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  // Monitor Redux state
  const { isTabBarVisible, isCallScreenActive, isChatScreenActive } = useSelector((state) => state.ui);
  console.log('📞 CallScreen Redux State:', { isTabBarVisible, isCallScreenActive, isChatScreenActive });
  
  // Get user data from route params
  const { user } = route.params || { user: { name: 'Sara Christin' } };
  
  // State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Drag state
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 120 });
  const dragX = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(120)).current;
  
  // Timer
  const timerRef = useRef(null);
  
  // Redux-based tab bar hiding when CallScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('📞 CallScreen Focused - Hiding TabBar');
      // Dispatch Redux actions to hide tab bar and set call screen as active
      dispatch(setCurrentScreen('Call'));
      dispatch(setCallScreenActive(true));
      dispatch(hideTabBar());
      
      // Smooth fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Show tab bar when screen is unfocused (only if not going back to ChatScreen)
      return () => {
        console.log('📞 CallScreen Unfocused - Checking if going back to ChatScreen');
        // Don't show tab bar if we're going back to ChatScreen
        // The ChatScreen will handle its own tab bar state
        dispatch(setCallScreenActive(false));
        dispatch(setCurrentScreen('Chat')); // Set to Chat instead of null
      };
    }, [navigation, dispatch])
  );

  // Additional backup using useLayoutEffect (same as ChatScreen)
  useLayoutEffect(() => {
    console.log('📞 CallScreen useLayoutEffect - Hiding TabBar');
    dispatch(setCurrentScreen('Call'));
    dispatch(setCallScreenActive(true));
    dispatch(hideTabBar());

    return () => {
      console.log('📞 CallScreen useLayoutEffect cleanup - Setting to ChatScreen');
      dispatch(setCallScreenActive(false));
      dispatch(setCurrentScreen('Chat')); // Set to Chat instead of null
    };
  }, [dispatch]);

  // Immediate tab bar hiding on mount
  useEffect(() => {
    console.log('📞 CallScreen useEffect - Immediate TabBar Hide');
    // Add small delay to ensure proper state update
    setTimeout(() => {
      dispatch(setCurrentScreen('Call'));
      dispatch(setCallScreenActive(true));
      dispatch(hideTabBar());
    }, 100);
  }, [dispatch]);

  // Force hide tab bar whenever CallScreen is active
  useEffect(() => {
    if (isCallScreenActive) {
      console.log('📞 CallScreen is active - Force hiding tab bar');
      dispatch(hideTabBar());
    }
  }, [isCallScreenActive, dispatch]);

  // Start call timer
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isCallActive]);
  
  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle call end
  const handleEndCall = () => {
    setIsCallActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Only reset call screen state, don't show tab bar since we're going back to ChatScreen
    dispatch(setCallScreenActive(false));
    dispatch(setCurrentScreen('Chat')); // Set back to Chat instead of null
    
    // Smooth fade-out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
    });
  };
  
  // Handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };
  
  // Handle video toggle
  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
  };
  
  // Handle drag gesture
  const handleDrag = (event) => {
    const { translationX, translationY, state } = event.nativeEvent;
    
    if (state === State.ACTIVE) {
      const newX = dragPosition.x + translationX;
      const newY = dragPosition.y + translationY;
      
      // Keep within screen bounds
      const boundedX = Math.max(0, Math.min(width - 200, newX)); // Assuming content width ~200
      const boundedY = Math.max(100, Math.min(height - 200, newY)); // Keep above bottom controls
      
      dragX.setValue(boundedX);
      dragY.setValue(boundedY);
    } else if (state === State.END) {
      const newX = dragPosition.x + translationX;
      const newY = dragPosition.y + translationY;
      
      const boundedX = Math.max(0, Math.min(width - 200, newX));
      const boundedY = Math.max(100, Math.min(height - 200, newY));
      
      setDragPosition({ x: boundedX, y: boundedY });
    }
  };
  
  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header with transparent bottom */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackArrowIcon width={18} height={18} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerRight}>
            <Text style={styles.matchedText}>Matched</Text>
            <HeartIcon width={20} height={19} color="#FF6B6B" />
          </View>
        </View>
        
        {/* Main Content - Draggable */}
        <PanGestureHandler onHandlerStateChange={handleDrag}>
          <Animated.View 
            style={[
              styles.mainContent,
              {
                transform: [
                  { translateX: dragX },
                  { translateY: dragY }
                ]
              }
            ]}
          >
            {/* User Name - Centered */}
            <Text style={styles.userName}>{user.name}</Text>
            
            {/* Call Duration Badge - Centered */}
            <View style={styles.durationContainer}>
              <View style={styles.durationDot} />
              <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
            </View>
          </Animated.View>
        </PanGestureHandler>
        
        {/* Bottom Wave Background - Using bottomWave.svg */}
        <View style={styles.waveContainer}>
          <Svg width={width + 40} height={260} viewBox="-20 -20 469 214" fill="none" style={styles.waveSvg}>
            <Defs>
              <Filter id="filter0_f_3126_1995" x="0" y="0" width="429" height="171" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
                <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <FeGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_3126_1995"/>
              </Filter>
              <SvgLinearGradient id="paint0_linear_3126_1995" x1="275.613" y1="-37.6359" x2="275.613" y2="134.856" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#140133" stopOpacity="0.95"/>
                <Stop offset="1" stopColor="#160229" stopOpacity="0.98"/>
              </SvgLinearGradient>
              <SvgLinearGradient id="paint1_linear_3126_1995" x1="269.032" y1="-2.29891" x2="269.032" y2="7.22516" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#140133" stopOpacity="0.95"/>
                <Stop offset="1" stopColor="#160229" stopOpacity="0.98"/>
              </SvgLinearGradient>
            </Defs>
            
            <Path 
              d="M61.4449 52.6472C21.1548 52.6472 6.36075 20.2157 4 4V167H425V8.78497C415.557 47.0647 382.507 53.4447 358.112 52.6472H296.733C275.589 52.6472 269.468 70.546 266.164 80.2064L266.043 80.5595C255.341 111.821 228.271 120.723 214.893 120.434C185.305 119.796 169.252 96.1904 166.105 83.7495C158.236 52.6472 142.497 52.6472 128.333 52.6472H61.4449Z" 
              fill="url(#paint0_linear_3126_1995)"
              stroke="#1F014B"
              strokeWidth="1"
            />
            
            <Path 
              d="M5 11.4463C7.27489 18.4749 11.3367 26.5838 17.7568 33.7012C26.9646 43.9088 41.0003 52.0498 61.4453 52.0498H128.333C135.458 52.0498 142.661 52.0713 149.082 55.7578C155.451 59.4147 161.239 66.8073 165.136 82.0195C166.762 88.3663 171.672 97.4324 179.907 104.996C188.164 112.579 199.8 118.684 214.872 119.005C228.588 119.297 256.115 110.319 266.988 78.9473L267.108 78.5986C268.766 73.8117 271.074 67.1717 275.532 61.7158C279.95 56.3096 286.493 52.0499 296.732 52.0498H358.08L359.237 52.082C371.265 52.3555 385.303 50.8675 397.607 44.7578C408.831 39.1846 418.562 29.7862 424 14.5117V173H5V11.4463Z" 
              stroke="#1F014B" 
              strokeWidth="2"
              fill="none"
            />
            
            <Rect 
              width="417" 
              height="9" 
              x="6" 
              y="163" 
              fill="url(#paint1_linear_3126_1995)"
            />
          </Svg>
        </View>
        
        {/* Control Buttons - Positioned absolutely */}
        <View style={styles.controlsContainer}>
          {/* Emoji Button - Left */}
          <TouchableOpacity style={[styles.controlButton, styles.emojiButton]}>
            <EmojiIcon width={22} height={22} color="#D9D8F3" />
          </TouchableOpacity>
          
          {/* Mute Button - Left Center */}
          <TouchableOpacity 
            style={[styles.controlButton, styles.muteButton]} 
            onPress={handleMuteToggle}
          >
            <MuteIcon width={24} height={24} color="white" />
          </TouchableOpacity>
          
          {/* End Call Button - Center */}
          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <CallButtonIcon width={75} height={75} />
          </TouchableOpacity>
          
          {/* Refresh Button - Right Center */}
          <TouchableOpacity style={[styles.controlButton, styles.refreshButton]}>
            <RefreshIcon width={24} height={24} color="white" />
          </TouchableOpacity>
          
          {/* Video Button - Right */}
          <TouchableOpacity 
            style={[styles.controlButton, styles.videoButton]} 
            onPress={handleVideoToggle}
          >
            <VideoIcon width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Home Indicator */}
        <View style={styles.homeIndicator} />
      </Animated.View>
    </CommonBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
    backgroundColor: 'rgba(20, 0, 52, 0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  mainContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 5,
    width: '100%',
    
  },
  userName: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  durationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 8,
  },
  durationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  waveSvg: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    right: -20,
    width: '100%',
    height: 260,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    
   
    justifyContent: 'center',
    alignItems: 'center',
   
   
  },
  emojiButton: {
    position: 'absolute',
    left: 20,
    bottom: 40,
  },
  muteButton: {
    position: 'absolute',
    left: 75,
    bottom: 40,
  },
  refreshButton: {
    position: 'absolute',
    right: 75,
    bottom: 40,
  },
  videoButton: {
    position: 'absolute',
    right: 20,
    bottom: 40,
  },
  endCallButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    marginLeft: -67,
    width: 134,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
});

export default CallScreen;
