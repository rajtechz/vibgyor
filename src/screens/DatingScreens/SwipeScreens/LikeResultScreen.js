import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import CommonBackground from '../../../components/common/CommonBackground';
import { setCurrentScreen, hideTabBar, showTabBar } from '../../../redux/slices/uiSlice';

const { width, height } = Dimensions.get('window');

const LikeResultScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [titleOpacity] = useState(new Animated.Value(0));
  const [buttonOpacity] = useState(new Animated.Value(0));
  const [isNavigating, setIsNavigating] = useState(false);

  // Redux-based tab bar hiding
  useFocusEffect(
    React.useCallback(() => {
      dispatch(setCurrentScreen('LikeResult'));

      // Start entrance animations
      startAnimations();

      return () => {
        // Clean up animations before leaving
        fadeAnim.setValue(1);
        titleOpacity.setValue(1);
        buttonOpacity.setValue(1);
        
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [navigation, dispatch, fadeAnim, titleOpacity, buttonOpacity])
  );

  const startAnimations = () => {
    fadeAnim.setValue(0);
    titleOpacity.setValue(0);
    buttonOpacity.setValue(0);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinueSwiping = () => {
    // Prevent multiple rapid clicks
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);

    // Reset navigation stack to prevent page repetition
    // This will clear the stack and navigate directly to SwipeMain
    navigation.reset({
      index: 0,
      routes: [{ name: 'SwipeMain' }],
    });
    
    // Reset navigation state after a delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      <CommonBackground>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {/* Main Image */}
          <View style={styles.imageWrapper}>
            <Image 
              source={require('../../../assets/images/MainContent.png')} 
              style={styles.mainImage}
              resizeMode="contain"
            />
          </View>

          {/* Content: Title, Message and Button */}
          <Animated.View style={[styles.content, { opacity: titleOpacity }]}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Be Patient</Text>
            </View>
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
              Don't loose heart, keep browsing to find your best match
              </Text>
            </View>
            
            <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
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
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </CommonBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#140034',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#140034',
  },
  imageWrapper: {
    height: 700,
    width: 500,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 230,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
 
  title: {
    fontFamily: 'Lexend',
    fontSize: 45,
    fontWeight: '800',
    lineHeight: 45, // 100% of fontSize
    letterSpacing: 0.45, // 1% of fontSize
    color: 'white',
    textAlign: 'center',
    textTransform: 'capitalize', // Title case
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  messageContainer: {
    marginBottom: 0,
    paddingHorizontal: 10,
  },
  message: {
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27, // 150% of fontSize (18 * 1.5)
    letterSpacing: 0.18, // 1% of fontSize
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center', // Vertical alignment middle
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  continueButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 18, // 100% of fontSize
    letterSpacing: 0.18, // 1% of fontSize
    textAlign: 'center',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

});

export default LikeResultScreen;