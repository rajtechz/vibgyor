// src/components/icons/chatIcons/BackArrowIcon.js
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BackArrowIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.375 5.25L8.625 12L15.375 18.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BackArrowIcon;
