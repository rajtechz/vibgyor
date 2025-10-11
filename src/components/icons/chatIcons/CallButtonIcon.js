import React from 'react';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeBlend, G } from 'react-native-svg';

const CallButtonIcon = ({ width = 91, height = 91 }) => (
  <Svg width={width} height={height} viewBox="0 0 91 91" fill="none">
    <Circle cx="45.5" cy="45.5" r="37.5" fill="url(#paint0_linear_577_3791)"/>
    <Circle cx="45.5" cy="45.5" r="41.5" stroke="#A42072" strokeOpacity="0.17" strokeWidth="8"/>
    <G filter="url(#filter0_d_577_3791)">
      <Path d="M58.3556 52.3403V57.8127C58.3558 58.2045 58.2073 58.5818 57.9402 58.8685C57.6731 59.1552 57.3072 59.3298 56.9164 59.3572C56.2401 59.4037 55.6876 59.4284 55.2605 59.4284C41.585 59.4284 30.5 48.3428 30.5 34.6665C30.5 34.2394 30.5232 33.6869 30.5712 33.0106C30.5986 32.6197 30.7733 32.2538 31.0599 31.9867C31.3465 31.7196 31.7238 31.5711 32.1156 31.5713H37.5877C37.7797 31.5711 37.9648 31.6423 38.1073 31.771C38.2497 31.8997 38.3392 32.0767 38.3584 32.2677C38.394 32.6237 38.4265 32.9069 38.4574 33.122C38.765 35.2684 39.3952 37.356 40.3268 39.314C40.4739 39.6236 40.3779 39.9934 40.0993 40.1915L36.7598 42.578C38.8017 47.336 42.5933 51.1278 47.3511 53.1699L49.7343 49.8363C49.8317 49.7001 49.9738 49.6024 50.1359 49.5603C50.2979 49.5181 50.4696 49.5342 50.621 49.6057C52.5787 50.5356 54.6656 51.1643 56.8112 51.4706C57.0263 51.5015 57.3095 51.5356 57.6623 51.5696C57.853 51.5892 58.0297 51.6788 58.1581 51.8212C58.2864 51.9636 58.3574 52.1486 58.3571 52.3403H58.3556Z" fill="url(#paint1_linear_577_3791)"/>
    </G>
    <Defs>
      <Filter id="filter0_d_577_3791" x="21.5" y="23.5713" width="51.8574" height="51.8574" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="3" dy="4"/>
        <FeGaussianBlur stdDeviation="6"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.5 0 0 0 0 0.0916667 0 0 0 0 0.433689 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_577_3791"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_577_3791" result="shape"/>
      </Filter>
      <SvgLinearGradient id="paint0_linear_577_3791" x1="28.5414" y1="-16.6019" x2="-9.69807" y2="61.8087" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#C9234F"/>
        <Stop offset="1" stopColor="#7E1D96"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint1_linear_577_3791" x1="41.6765" y1="36.6905" x2="50.292" y2="53.0701" gradientUnits="userSpaceOnUse">
        <Stop stopColor="white"/>
        <Stop offset="1" stopColor="#FFEBED"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

export default CallButtonIcon;
