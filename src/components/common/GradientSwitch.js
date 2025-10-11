// src/components/common/GradientSwitch.js
import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../styles/colors';

const GradientSwitch = ({ 
  value, 
  onValueChange, 
  width = 50, 
  height = 30,
  disabled = false 
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width - height + 2], // 2px margin on each side
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={[styles.container, { width, height }]}>
        {/* Track - Gradient when on, dark gray when off */}
        {value ? (
          <LinearGradient
            colors={['#DD3562', '#8354FF']} // Pink to purple gradient when on
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.track,
              {
                width,
                height,
                borderWidth: 0,
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.track,
              {
                width,
                height,
                backgroundColor: '#3A3A3A', // Dark gray when off
                borderWidth: 0,
              },
            ]}
          />
        )}
        
        {/* Thumb - Black */}
        <Animated.View
          style={[
            styles.thumbContainer,
            {
              transform: [{ translateX: thumbTranslateX }],
            },
          ]}
        >
          <View style={styles.thumb} />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  track: {
    borderRadius: 15,
    borderWidth: 0, // Remove border to match Figma
  },
  thumbContainer: {
    position: 'absolute',
    top: 2,
    left: 0,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'black',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default GradientSwitch;
