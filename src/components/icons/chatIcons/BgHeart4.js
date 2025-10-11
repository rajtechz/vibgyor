// src/components/icons/chatIcons/BgHeart4.js
import React from 'react';
import Svg, { Path, Defs, G, ClipPath, Rect } from 'react-native-svg';

const BgHeart4 = ({ width = 157, height = 156, style }) => (
  <Svg width={width} height={height} viewBox="0 0 157 156" fill="none" style={style}>
    <G opacity="0.1" clipPath="url(#clip0_2911_1997)">
      <Path d="M24.4292 56.7264C18.4419 83.6679 39.9059 110.884 66.4677 137.5L86.2012 60.2479C79.2141 25.6238 31.4053 25.0517 24.4292 56.7264Z" fill="#ED1C24"/>
      <Path d="M86.2017 60.247L66.4681 137.499C102.541 126.884 134.431 113.303 142.095 86.7875C151.166 55.6431 108.945 33.2189 86.2017 60.247Z" fill="#F05A8E"/>
    </G>
    <Defs>
      <ClipPath id="clip0_2911_1997">
        <Rect width="116.018" height="104.891" fill="white" transform="translate(69.7168) rotate(41.656)"/>
      </ClipPath>
    </Defs>
  </Svg>
);

export default BgHeart4;
