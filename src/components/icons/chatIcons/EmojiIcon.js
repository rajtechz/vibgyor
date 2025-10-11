import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

const EmojiIcon = ({ width = 22, height = 22, color = '#D9D8F3' }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <G opacity="0.4">
      <Path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8.17642 9.7962C8.82614 9.7962 9.35285 9.2695 9.35285 8.61978C9.35285 7.97006 8.82614 7.44336 8.17642 7.44336C7.5267 7.44336 7 7.97006 7 8.61978C7 9.2695 7.5267 9.7962 8.17642 9.7962Z" fill={color}/>
      <Path d="M13.8229 9.7962C14.4726 9.7962 14.9993 9.2695 14.9993 8.61978C14.9993 7.97006 14.4726 7.44336 13.8229 7.44336C13.1732 7.44336 12.6465 7.97006 12.6465 8.61978C12.6465 9.2695 13.1732 9.7962 13.8229 9.7962Z" fill={color}/>
      <Path d="M14.2604 13.0908C13.93 13.6631 13.4548 14.1382 12.8825 14.4686C12.3103 14.799 11.6611 14.9729 11.0003 14.9729C10.3396 14.9729 9.69041 14.799 9.11814 14.4686C8.54588 14.1382 8.07066 13.6631 7.74023 13.0908" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </G>
  </Svg>
);

export default EmojiIcon;
