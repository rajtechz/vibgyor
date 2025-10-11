import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CommonBackground from '../../../components/common/CommonBackground';
import { ChatIcon } from '../../../components/icons/SvgIcons';
import { setCurrentScreen, showTabBar, hideTabBar } from '../../../redux/slices/uiSlice';

const { width, height } = Dimensions.get('window');

// Simple tab bar management functions
const useTabBarManager = (dispatch) => {
  const hideTabBarAction = React.useCallback(() => {
    dispatch(hideTabBar());
    dispatch(setCurrentScreen('CelebrationMatch'));
  }, [dispatch]);
  
  const showTabBarAction = React.useCallback(() => {
    dispatch(showTabBar());
    dispatch(setCurrentScreen(null));
  }, [dispatch]);
  
  return { hideTabBarAction, showTabBarAction };
};

// Custom Gradient Text Component for "Keep Swiping"
const GradientText = ({ text, fontSize = 24, fontWeight = '600' }) => (
  <Svg height={fontSize * 1.4} width="100%">
    <Defs>
      <SvgLinearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#FF6B9D" />
        <Stop offset="100%" stopColor="#8B5CF6" />
      </SvgLinearGradient>
    </Defs>
    <SvgText
      x="50%"
      y={fontSize * 0.8}
      fontSize={fontSize}
      fontWeight={fontWeight}
      textAnchor="middle"
      fill="url(#textGradient)"
      fontFamily="Lexend"
    >
      {text}
    </SvgText>
  </Svg>
);

// Custom Gradient Chat Icon Component
const GradientChatIcon = ({ width = 40, height = 32 }) => (
  <Svg width={width} height={height} viewBox="0 0 31 25" fill="none">
    <Defs>
      <SvgLinearGradient id="gradient_chat" x1="12.5714" y1="4.5942" x2="19.6266" y2="19.5026" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#2285FA"/>
        <Stop offset="1" stopColor="#1B40C1"/>
      </SvgLinearGradient>
    </Defs>
    <Path d="M27.3135 0C28.9702 0.000136948 30.3135 1.34323 30.3135 3V18.2959C30.3135 19.9527 28.9702 21.2958 27.3135 21.2959H25.2207L23.3691 25L18.2764 21.2959H3.68359C2.02674 21.2959 0.683594 19.9528 0.683594 18.2959V3C0.683594 1.34315 2.02674 0 3.68359 0H27.3135ZM8.84082 12.3887C8.42673 12.3887 8.09093 12.7246 8.09082 13.1387C8.09082 13.5528 8.42666 13.8886 8.84082 13.8887H17.5264L17.6025 13.8848C17.9808 13.8464 18.2764 13.527 18.2764 13.1387C18.2763 12.7504 17.9807 12.4309 17.6025 12.3926L17.5264 12.3887H8.84082ZM8.84082 5.90723C8.42672 5.90729 8.09091 6.24313 8.09082 6.65723C8.09082 7.0714 8.42666 7.40716 8.84082 7.40723H21.2295C21.6437 7.40723 21.9795 7.07144 21.9795 6.65723C21.9794 6.24309 21.6437 5.90723 21.2295 5.90723H8.84082Z" fill="url(#gradient_chat)"/>
  </Svg>
);


const CelebrationMatchScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { matchedUser } = route.params || {};
  const [animationValue] = useState(() => new Animated.Value(0));
  const [showHearts, setShowHearts] = useState(false);
  
  // Animation values for button
  const [buttonOpacity] = useState(new Animated.Value(0));
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Use custom hook to manage tab bar
  const { hideTabBarAction, showTabBarAction } = useTabBarManager(dispatch);

  useEffect(() => {
    // Hide tab bar immediately when component mounts
    hideTabBarAction();
    
    // Start the celebration animation
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Show hearts after a delay
    const timer = setTimeout(() => {
      setShowHearts(true);
    }, 500);

    // Animate button in
    const buttonTimer = setTimeout(() => {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(buttonTimer);
      // Show tab bar when component unmounts
      showTabBarAction();
    };
  }, [animationValue, buttonOpacity, hideTabBarAction, showTabBarAction]);

  // Focus effect to ensure tab bar is hidden when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      hideTabBarAction();
      
      return () => {
        // Show tab bar when leaving this screen
        showTabBarAction();
      };
    }, [hideTabBarAction, showTabBarAction])
  );

  const scaleAnimation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const opacityAnimation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleContinueSwiping = () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // Show tab bar before navigating back
    showTabBarAction();
    
    // Navigate back to SwipeMain
    navigation.navigate('SwipeMain');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      <CommonBackground>
        <SafeAreaView style={styles.container}>
          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Match Frame using PNG image */}
            <View style={styles.matchFrameContainer}>
              <Image 
                source={require('../../../assets/images/MainContent.png')} 
                style={styles.matchFrameImage}
                resizeMode="contain"
              />
              
              
              {/* Profile Images positioned over the SVG */}
              <View style={styles.profilesOverlay}>
                {/* Left Profile */}
                <Animated.View 
                  style={[
                    styles.profileContainer, 
                    styles.leftProfile,
                    {
                      transform: [{ scale: scaleAnimation }],
                      opacity: opacityAnimation,
                    }
                  ]}
                >
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }}
                    style={styles.profileImage}
                  />
                </Animated.View>

                {/* Right Profile */}
                <Animated.View 
                  style={[
                    styles.profileContainer, 
                    styles.rightProfile,
                    {
                      transform: [{ scale: scaleAnimation }],
                      opacity: opacityAnimation,
                    }
                  ]}
                >
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }}
                    style={styles.profileImage}
                  />
                </Animated.View>
              </View>
            </View>

            {/* Match Text */}
             <View style={styles.matchTextContainer}>
               <Text style={styles.matchTitle}>Congrats!</Text>
               <Text style={styles.matchSubtitle}>
                 You and {matchedUser?.name || 'Alex'} have liked each other
               </Text>
               
               {/* Chat Icon */}
               <View style={styles.chatIconContainer}>
                 <GradientChatIcon width={40} height={32} />
               </View>
            </View>

            {/* Start Conversation Text */}
            <Text style={styles.startConversationText}>
              Start Conversation
            </Text>
            <TouchableOpacity 
                style={[styles.continueButton, isNavigating && styles.disabledButton]} 
                onPress={handleContinueSwiping}
                disabled={isNavigating}
              >
                <MaskedView
                  maskElement={
                    <Text style={[styles.continueButtonText, { backgroundColor: 'transparent' }]}>
                      Continue Swiping
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={['#FF6B9D', '#8B5CF6', '#6366F1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 25, width: 250 }}
                  >
                    <Text style={[styles.continueButtonText, { opacity: 0 }]}>
                      Continue Swiping
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </TouchableOpacity>

         
          </View>
        </SafeAreaView>
      </CommonBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  matchFrameContainer: {
    width: 450,
    height: 550,
    position: 'relative',
    marginTop: -50,
  },
  matchFrameImage: {
    width: '100%',
    height: '100%',
  },
  profilesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'none',
  },
  profileContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF6B6B',
    overflow: 'hidden',
  },
  leftProfile: {
    top: 120,
    left: 60,
  },
  rightProfile: {
    top: 120,
    right: 60,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  matchTextContainer: {
    alignItems: 'center',
    marginTop: -100,
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  
  },
  matchSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
  },
  chatIconContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  startConversationText: {
    fontFamily: 'Lexend',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25.2, // 140% of 18px
    letterSpacing: 0.18, // 1% of 18px
    textAlign: 'center',
    color: '#FFD335',
    marginTop: 20,
  },
  keepSwipingContainer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    alignItems: 'center',
   
  },
  continueButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Lexend',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.48,
    justifyContent: 'center',
  },
  keepSwipingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  keepSwipingText: {
    color: '#FF6B6B',
  },
});

export default CelebrationMatchScreen;