// src/components/common/DatingTabIcons.js
import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

// Dating Swipe Icon (overlapping cards from swipe.svg)
export const DatingSwipeIcon = ({ size = 24, focused = false }) => (
  <Svg width={size} height={size} viewBox="0 0 38 32" fill="none">
    <Defs>
      <SvgLinearGradient id={`datingSwipeGradient1-${size}`} x1="17.7478" y1="6.48474" x2="30.343" y2="35.0982" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
      <SvgLinearGradient id={`datingSwipeGradient2-${size}`} x1="-1.71667" y1="8.77136" x2="12.1666" y2="39.6851" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
    </Defs>
    <Rect 
      x="21.2344" 
      y="6.48474" 
      width="15.7655" 
      height="21.3961" 
      rx="2" 
      fill={focused ? `url(#datingSwipeGradient1-${size})` : "none"}
      stroke={focused ? "#15022F" : "#6A47AE"}
      strokeWidth="1.5"
    />
    <Rect 
      x="0.687039" 
      y="8.24588" 
      width="18.8058" 
      height="25.2696" 
      rx="3" 
      transform="rotate(-23.1873 0.687039 8.24588)" 
      fill={focused ? `url(#datingSwipeGradient2-${size})` : "none"}
      stroke={focused ? "#15022F" : "#6A47AE"}
      strokeWidth="1.5"
    />
  </Svg>
);

// Dating Chat Icon (speech bubble with lines from chat.svg)
export const DatingChatIcon = ({ size = 24, focused = false }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Defs>
      <SvgLinearGradient id={`datingChatGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#DD3562" />
        <Stop offset="100%" stopColor="#8354FF" />
      </SvgLinearGradient>
    </Defs>
    <Path 
      d="M16.082 1.25C24.2284 1.25 30.832 7.85359 30.832 16C30.832 24.1464 24.2284 30.749 16.082 30.749C13.7534 30.7523 11.4596 30.2014 9.3877 29.1445L2.24512 30.7324L1.09375 30.9883L1.34961 29.8369L2.93652 22.6934C1.87991 20.6214 1.32855 18.3275 1.33203 15.999C1.33255 7.85306 7.93595 1.25 16.082 1.25Z" 
      stroke={focused ? `url(#datingChatGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5"
      fill="none"
    />
    <Path 
      x1="10.3711" 
      y1="10.9423" 
      x2="19.6403" 
      y2="10.9423" 
      stroke={focused ? `url(#datingChatGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    <Path 
      x1="10.3711" 
      y1="16.3269" 
      x2="21.7942" 
      y2="16.3269" 
      stroke={focused ? `url(#datingChatGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    <Path 
      x1="10.3711" 
      y1="21.7115" 
      x2="15.3326" 
      y2="21.7115" 
      stroke={focused ? `url(#datingChatGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
  </Svg>
);

// Dating Profile Icon (person outline from user.svg)
export const DatingProfileIcon = ({ size = 24, focused = false }) => (
  <Svg width={size} height={size} viewBox="0 0 26 30" fill="none">
    <Defs>
      <SvgLinearGradient id={`datingProfileGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#DD3562" />
        <Stop offset="100%" stopColor="#8354FF" />
      </SvgLinearGradient>
    </Defs>
    <Circle 
      cx="13.0006" 
      cy="7.28571" 
      r="6.28571" 
      stroke={focused ? `url(#datingProfileGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path 
      d="M1 27.5471V28.4288H25V27.5471C25 24.2554 25 22.6096 24.4187 21.3523C23.9074 20.2463 23.0915 19.3472 22.0879 18.7836C20.9471 18.1431 19.4536 18.1431 16.4667 18.1431H9.53333C6.5464 18.1431 5.05293 18.1431 3.91207 18.7836C2.90852 19.3472 2.09262 20.2463 1.5813 21.3523C1 22.6096 1 24.2554 1 27.5471Z" 
      stroke={focused ? `url(#datingProfileGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Dating Grid Icon (2x2 grid from post.svg)
export const DatingGridIcon = ({ size = 24, focused = false }) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Defs>
      <SvgLinearGradient id={`datingGridGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#DD3562" />
        <Stop offset="100%" stopColor="#8354FF" />
      </SvgLinearGradient>
    </Defs>
    <Circle 
      cx="23.207" 
      cy="23.125" 
      r="5.625" 
      stroke={focused ? `url(#datingGridGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5"
    />
    <Circle 
      cx="6.875" 
      cy="23.125" 
      r="5.625" 
      stroke={focused ? `url(#datingGridGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5"
    />
    <Circle 
      cx="6.875" 
      cy="6.875" 
      r="5.625" 
      stroke={focused ? `url(#datingGridGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5"
    />
    <Circle 
      cx="23.207" 
      cy="6.875" 
      r="5.625" 
      stroke={focused ? `url(#datingGridGradient-${size})` : "#6A47AE"} 
      strokeWidth="1.5"
    />
  </Svg>
);
