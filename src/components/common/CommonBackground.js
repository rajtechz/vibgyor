import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const CommonBackground = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 414 896"
        style={styles.background}
        preserveAspectRatio="xMidYMid slice"
      >
        <Rect width="414" height="896" fill="url(#paint0_linear_2506_2063)"/>
        <Defs>
          <SvgLinearGradient id="paint0_linear_2506_2063" x1="207" y1="0" x2="207" y2="896" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#140034"/>
            <Stop offset="1" stopColor="#01010D"/>
          </SvgLinearGradient>
        </Defs>
      </Svg>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default CommonBackground;
