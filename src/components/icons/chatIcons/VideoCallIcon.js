// src/components/icons/chatIcons/VideoCallIcon.js
import React from 'react';
import Svg, { Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const VideoCallIcon = ({ width = 40, height = 40 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
    <Rect width="40" height="40" rx="20" fill="#331847"/>
    <Path
      d="M24.7594 17.875L29.5681 14.4531C29.6373 14.4039 29.7184 14.3748 29.8027 14.3692C29.8869 14.3636 29.9711 14.3816 30.046 14.4212C30.1209 14.4609 30.1836 14.5207 30.2274 14.5941C30.2711 14.6675 30.2942 14.7517 30.2941 14.8375V26.1625C30.2942 26.2483 30.2711 26.3325 30.2274 26.4059C30.1836 26.4793 30.1209 26.5391 30.046 26.5788C29.9711 26.6184 29.8869 26.6364 29.8027 26.6308C29.7184 26.6252 29.6373 26.5961 29.5681 26.5469L24.7594 23.125V27.0625C24.7594 27.3111 24.6622 27.5496 24.4892 27.7254C24.3162 27.9012 24.0815 28 23.8369 28H10.9225C10.6778 28 10.4432 27.9012 10.2702 27.7254C10.0972 27.5496 10 27.3111 10 27.0625V13.9375C10 13.6889 10.0972 13.4504 10.2702 13.2746C10.4432 13.0988 10.6778 13 10.9225 13H23.8369C24.0815 13 24.3162 13.0988 24.4892 13.2746C24.6622 13.4504 24.7594 13.6889 24.7594 13.9375V17.875ZM13.6898 16.75V18.625H15.5348V16.75H13.6898Z"
      fill="url(#paint0_linear_577_3519)"
    />
    <Defs>
      <SvgLinearGradient id="paint0_linear_577_3519" x1="20.1471" y1="13" x2="20.1471" y2="28" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FA809D"/>
        <Stop offset="1" stopColor="#B3205E"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

export default VideoCallIcon;
