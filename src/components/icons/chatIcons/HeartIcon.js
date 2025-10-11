import React from 'react';
import Svg, { G, Path, Circle, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeBlend, FeComposite, LinearGradient, Stop } from 'react-native-svg';

const HeartIcon = ({ width = 39, height = 37 }) => (
  <Svg width={width} height={height} viewBox="0 0 39 37" fill="none">
    <G filter="url(#filter0_di_595_3312)">
      <Path d="M15.8749 24.72C9.28444 20.6216 5.48821 18.4311 5.03346 14.5512C4.67373 11.4782 6.90477 9.59845 6.95297 9.548C10.4907 6.34748 14.3714 8.513 15.307 9.29246C15.992 8.24673 19.1099 4.93851 23.2569 6.71028C23.8606 6.96598 25.8719 8.00495 26.4105 10.5197C27.3339 14.879 23.0229 19.2881 18.7288 24.243C18.3674 24.6636 17.8743 24.9167 17.3596 25.0046C16.8556 25.0907 16.3285 25.0013 15.8749 24.72Z" fill="url(#paint0_linear_595_3312)"/>
    </G>
    <G filter="url(#filter1_f_595_3312)">
      <Circle cx="10.5551" cy="13.1377" r="2.1072" transform="rotate(-10.4187 10.5551 13.1377)" fill="#FFA9B7"/>
    </G>
    <Path d="M8.94799 10.2209C7.82989 10.7626 5.94583 12.4366 7.35437 14.799C7.4106 13.7804 7.80804 11.4388 8.94799 10.2209Z" fill="#FF748D"/>
    <Defs>
      <Filter id="filter0_di_595_3312" x="0.720566" y="0.770612" width="38.1685" height="35.4634" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="4.0392" dy="2.88514"/>
        <FeGaussianBlur stdDeviation="4.15639"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.192157 0 0 0 0 0.0784314 0 0 0 0 0.105726 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_595_3312"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_595_3312" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-4.17572" dy="-4.17572"/>
        <FeGaussianBlur stdDeviation="3.75815"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_595_3312"/>
      </Filter>
      <Filter id="filter1_f_595_3312" x="4.67673" y="7.25974" width="11.7559" height="11.7559" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <FeGaussianBlur stdDeviation="1.88527" result="effect1_foregroundBlur_595_3312"/>
      </Filter>
      <LinearGradient id="paint0_linear_595_3312" x1="13.3305" y1="10.7528" x2="19.9529" y2="20.4784" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F64A69"/>
        <Stop offset="1" stopColor="#EF3349"/>
      </LinearGradient>
    </Defs>
  </Svg>
);

export default HeartIcon;
