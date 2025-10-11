// src/components/icons/SimpleGreenLoveIcon.js
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const SimpleGreenLoveIcon = ({ width = 60, height = 60, style }) => (
  <Svg width={width} height={height} viewBox="0 0 80 80" style={style} fill="none">
    {/* Simple green circle */}
    <Circle cx="40" cy="40" r="30" fill="#34F07F" />
    
    {/* Simple white heart shape */}
    <Path 
      d="M40 25C35 20 25 20 25 30C25 40 40 55 40 55C40 55 55 40 55 30C55 20 45 20 40 25Z" 
      fill="white" 
    />
  </Svg>
);

export default SimpleGreenLoveIcon;
