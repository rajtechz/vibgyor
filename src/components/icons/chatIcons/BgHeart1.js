// src/components/icons/chatIcons/BgHeart1.js
import React from 'react';
import Svg, { Path, Defs, G, ClipPath, Rect } from 'react-native-svg';

const BgHeart1 = ({ width = 77, height = 81, style }) => (
  <Svg width={width} height={height} viewBox="0 0 77 81" fill="none" style={style}>
    <G opacity="0.05" clipPath="url(#clip0_2911_2004)">
      <Path d="M17.8334 15.239C7.53363 26.7244 10.5332 45.8658 16.1807 66.1118L46.964 33.8819C53.0478 15.0982 29.9119 1.71859 17.8334 15.239Z" fill="#ED1C24"/>
      <Path d="M46.9628 33.8818L16.1795 66.1117C36.663 70.8249 55.9215 72.947 66.9213 62.1286C79.8756 49.4408 65.45 26.9459 46.9628 33.8818Z" fill="#F05A8E"/>
    </G>
    <Defs>
      <ClipPath id="clip0_2911_2004">
        <Rect width="64.8519" height="58.6323" fill="white" transform="translate(55.4414 0.0117188) rotate(71.0115)"/>
      </ClipPath>
    </Defs>
  </Svg>
);

export default BgHeart1;
