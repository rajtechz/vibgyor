// src/components/common/GradientIcon.js
import React from 'react';
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

export const createGradientIcon = (IconComponent, gradientId) => {
  return ({ size = 24, isActive = false, ...props }) => {
    if (!isActive) {
      return <IconComponent size={size} color="#6A47AE" {...props} />;
    }

    return (
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Defs>
          <SvgLinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#DD3562" />
            <Stop offset="100%" stopColor="#8354FF" />
          </SvgLinearGradient>
        </Defs>
        <IconComponent size={size} color={`url(#${gradientId})`} {...props} />
      </Svg>
    );
  };
};
