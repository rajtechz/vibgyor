import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Notification Icon Component
const NotificationIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

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

const NotificationBar = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current; // Start with bar collapsed (sticky to edge)
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  console.log('NotificationBar component is rendering');

  const handleToggle = () => {
    if (isExpanded) {
      // Collapse the bar
      console.log('Collapsing notification bar');
      setIsExpanded(false);
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Expand the bar
      console.log('Expanding notification bar');
      setIsExpanded(true);
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
    if (navigation) {
      navigation.navigate('Notification');
    }
  };

  const handleClose = () => {
    console.log('Closing notification bar - collapsing to edge');
    // Instead of hiding completely, just collapse to edge
    setIsExpanded(false);
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  console.log('NotificationBar is rendering, isExpanded:', isExpanded);

  const translateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 0], // Collapsed: mostly hidden, Expanded: fully visible
  });

  return (
    <View style={styles.container}>
    
      <TouchableOpacity 
        style={styles.touchArea}
        onPress={handleToggle}
        activeOpacity={0.8}
      />
      
      <Animated.View
        style={[
          styles.bar,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Bar Content */}
        <View style={styles.barContent}>
          <View style={styles.barLine} />
          <View style={styles.barHandle} />
        </View>

        {/* Notification Button */}
        <Animated.View
          style={[
            styles.notificationButton,
            {
              opacity: buttonOpacity,
            },
          ]}
        >
          <View style={styles.notificationContainer}>
            <TouchableOpacity
              style={styles.notificationButtonInner}
              onPress={handleNotificationPress}
              activeOpacity={0.8}
            >
              <NotificationIcon width={20} height={20} />
              <Text style={styles.notificationText}>Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <CloseIcon width={16} height={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

       
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 2000,
    pointerEvents: 'box-none',
  },
  debugContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 5,
    height: '100%',
    
    zIndex: 999,
  },
  testBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 50,
    height: 200,
   
    zIndex: 2001,
  },
  touchArea: {
    position: 'absolute',
    left: 0,
    top: '20%',
    width: 20,
    height: 60,
    backgroundColor: 'transparent',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 2001,
    pointerEvents: 'auto',
    // Add a subtle indicator
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: '20%',
    width: 200,
    height: 60,
    backgroundColor: 'rgba(42, 26, 74, 0.95)',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    pointerEvents: 'auto',
  },
  barContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barLine: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  barHandle: {
    position: 'absolute',
    left: -2,
    top: '50%',
    transform: [{ translateY: -4 }],
    width: 8,
    height: 8,
    backgroundColor: '#DD3562',
    borderRadius: 4,
  },
  notificationButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(221, 53, 98, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(221, 53, 98, 0.3)',
    gap: 2,
  },
  notificationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationCloseButton: {
    position: 'absolute',
    right: -8,
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  closeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotificationBar;
