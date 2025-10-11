// src/components/icons/chatIcons/BgHeart3.js
import React from 'react';
import Svg, { Path, Defs, G, ClipPath, Rect } from 'react-native-svg';

const BgHeart3 = ({ width = 13, height = 12, style }) => (
  <Svg width={width} height={height} viewBox="0 0 13 12" fill="none" style={style}>
    <G opacity="0.2" clipPath="url(#clip0_2911_2001)">
      <Path d="M2.55925 8.75538C4.22467 10.4724 7.21772 10.2148 10.4102 9.55966L5.75701 4.45065C2.91726 3.30706 0.59824 6.74131 2.55925 8.75538Z" fill="#ED1C24"/>
      <Path d="M5.75739 4.45134L10.4106 9.56036C11.3605 6.44289 11.8964 3.48697 10.3417 1.66889C8.51895 -0.471646 4.88396 1.51703 5.75739 4.45134Z" fill="#F05A8E"/>
    </G>
    <Defs>
      <ClipPath id="clip0_2911_2001">
        <Rect width="10.0553" height="9.09099" fill="white" transform="translate(0.609375 2.77441) rotate(-15)"/>
      </ClipPath>
    </Defs>
  </Svg>
);

export default BgHeart3;
