// src/components/common/ActiveIndicator.js
import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

export const ActiveIndicator = ({ isActive }) => {
  if (!isActive) return null;
  
  return (
    <View
      style={{
        width: 32,
        height: 3,
        shadowColor: '#DD3562',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Svg width={32} height={3} viewBox="0 0 32 3">
        <Defs>
          <SvgLinearGradient id="indicatorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#DD3562" />
            <Stop offset="100%" stopColor="#8354FF" />
          </SvgLinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="32"
          height="3"
          rx="1.5"
          ry="1.5"
          fill="url(#indicatorGradient)"
        />
      </Svg>
    </View>
  );
};
