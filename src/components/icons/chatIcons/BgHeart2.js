// src/components/icons/chatIcons/BgHeart2.js
import React from 'react';
import Svg, { Path, Defs, G, ClipPath, Rect } from 'react-native-svg';

const BgHeart2 = ({ width = 82, height = 78, style }) => (
  <Svg width={width} height={height} viewBox="0 0 82 78" fill="none" style={style}>
    <G opacity="0.05" clipPath="url(#clip0_2911_2011)">
      <Path d="M8.3167 38.7471C10.6801 53.9921 27.3919 63.7956 46.6357 72.2497L41.1946 28.0142C30.5132 11.4086 5.50524 20.8365 8.3167 38.7471Z" fill="#ED1C24"/>
      <Path d="M41.1938 28.0139L46.6349 72.2493C63.2567 59.3844 77.0974 45.8262 75.6936 30.4619C74.0811 12.401 47.5369 9.31497 41.1938 28.0139Z" fill="#F05A8E"/>
    </G>
    <Defs>
      <ClipPath id="clip0_2911_2011">
        <Rect width="64.8519" height="58.6323" fill="white" transform="translate(20.3555) rotate(20.3143)"/>
      </ClipPath>
    </Defs>
  </Svg>
);

export default BgHeart2;
