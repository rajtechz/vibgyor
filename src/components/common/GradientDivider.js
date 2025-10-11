// src/components/common/GradientDivider.js
import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors, gradients } from '../../styles/colors';

const GradientDivider = ({ 
  width = '100%', 
  height = 1, 
  direction = 'horizontal',
  gradient = 'primary',
  opacity = 1,
  style 
}) => {
  const isHorizontal = direction === 'horizontal';
  
  // Get gradient colors from colors.js
  const gradientColors = gradients[gradient] || gradients.primary;
  
  return (
    <View style={[{ width, height }, style]}>
      <Svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${isHorizontal ? '100' : '1'} ${isHorizontal ? '1' : '100'}`} 
        preserveAspectRatio="none"
      >
        <Rect 
          width={isHorizontal ? "100" : "1"} 
          height={isHorizontal ? "1" : "100"} 
          fill="url(#dividerGradient)"
        />
        <Defs>
          <SvgLinearGradient 
            id="dividerGradient" 
            x1={isHorizontal ? "0" : "0"} 
            y1={isHorizontal ? "0" : "0"} 
            x2={isHorizontal ? "100" : "0"} 
            y2={isHorizontal ? "0" : "100"} 
            gradientUnits="userSpaceOnUse"
          >
            <Stop 
              stopColor={gradientColors[0]} 
              stopOpacity={opacity}
            />
            <Stop 
              offset="0.5" 
              stopColor={gradientColors[0]} 
              stopOpacity={opacity * 0.6}
            />
            <Stop 
              offset="1" 
              stopColor={gradientColors[1]} 
              stopOpacity={opacity}
            />
          </SvgLinearGradient>
        </Defs>
      </Svg>
    </View>
  );
};

export default GradientDivider;
