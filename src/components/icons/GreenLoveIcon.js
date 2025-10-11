// src/components/icons/GreenLoveIcon.js
import React from 'react';
import Svg, { 
  Path, 
  Circle, 
  G, 
  Defs, 
  Filter, 
  FeFlood, 
  FeColorMatrix, 
  FeOffset, 
  FeGaussianBlur, 
  FeBlend, 
  FeComposite, 
  LinearGradient as SvgLinearGradient, 
  Stop 
} from 'react-native-svg';

const GreenLoveIcon = ({ width = 80, height = 80, style }) => (
  <Svg width={width} height={height} viewBox="0 0 80 80" style={style} fill="none">
    <G filter="url(#filter0_d_3425_2097)">
      <Circle cx="35.9989" cy="31.9999" r="25" transform="rotate(-13.3729 35.9989 31.9999)" fill="url(#paint0_linear_3425_2097)"/>
    </G>
    <G filter="url(#filter1_di_3425_2097)">
      <Path d="M36.2538 41.1663C29.0222 37.2894 24.8683 35.2358 24.1253 31.1731C23.5372 27.9552 25.7636 25.8206 25.811 25.7641C29.3265 22.1473 33.5678 24.1688 34.6078 24.9277C35.2596 23.7779 38.3248 20.0759 42.8203 21.6639C43.4746 21.8927 45.6672 22.8524 46.4061 25.4692C47.6761 30.0058 43.4268 34.9502 39.2324 40.4695C38.8797 40.9377 38.3766 41.2382 37.8395 41.3659C37.3136 41.4909 36.7514 41.4324 36.2538 41.1663Z" fill="url(#paint1_linear_3425_2097)"/>
    </G>
    
    <Defs>
      <Filter id="filter0_d_3425_2097" x="-0.0078125" y="-0.00585938" width="80.0117" height="80.0115" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="4" dy="8"/>
        <FeGaussianBlur stdDeviation="7.5"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.231373 0 0 0 0 0.94902 0 0 0 0 0.432314 0 0 0 0.2 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2097"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2097" result="shape"/>
      </Filter>
      <Filter id="filter1_di_3425_2097" x="22.0273" y="14.2742" width="46.6055" height="44.1545" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="10" dy="5"/>
        <FeGaussianBlur stdDeviation="6"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2097"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2097" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-1" dy="-2"/>
        <FeGaussianBlur stdDeviation="1"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 0.1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2097"/>
      </Filter>
      <SvgLinearGradient id="paint0_linear_3425_2097" x1="31.0593" y1="16.1883" x2="46.63" y2="43.9494" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#34F07F"/>
        <Stop offset="1" stopColor="#10AA7C"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint1_linear_3425_2097" x1="32.6215" y1="26.6026" x2="40.336" y2="36.9929" gradientUnits="userSpaceOnUse">
        <Stop stopColor="white"/>
        <Stop offset="1" stopColor="#FFEBED"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

export default GreenLoveIcon;
