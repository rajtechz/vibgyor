// src/components/icons/chatIcons/BgHeart5.js
import React from 'react';
import Svg, { Path, Defs, G, ClipPath, Rect } from 'react-native-svg';

const BgHeart5 = ({ width = 15, height = 16, style }) => (
  <Svg width={width} height={height} viewBox="0 0 15 16" fill="none" style={style}>
    <G opacity="0.2" clipPath="url(#clip0_2911_2007)">
      <Path d="M3.51761 2.8966C1.55824 5.08151 2.12886 8.72286 3.20322 12.5744L9.05926 6.44311C10.2166 2.86982 5.81536 0.324548 3.51761 2.8966Z" fill="#ED1C24"/>
      <Path d="M9.05855 6.44353L3.20251 12.5748C7.09919 13.4714 10.7628 13.8751 12.8554 11.817C15.3197 9.40339 12.5755 5.12408 9.05855 6.44353Z" fill="#F05A8E"/>
    </G>
    <Defs>
      <ClipPath id="clip0_2911_2007">
        <Rect width="12.3371" height="11.1539" fill="white" transform="translate(10.6719) rotate(71.0115)"/>
      </ClipPath>
    </Defs>
  </Svg>
);

export default BgHeart5;
