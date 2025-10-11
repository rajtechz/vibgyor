// src/components/icons/RedLoveIcon.js
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

const RedLoveIcon = ({ width = 140, height = 130, style }) => (
  <Svg width={width} height={height} viewBox="0 0 140 130" style={style} fill="none">
    <G filter="url(#filter0_di_3425_2100)">
      <Path d="M55.1982 86.7893C31.8757 72.2861 18.4416 64.5344 16.8323 50.8039C15.5593 39.9291 23.4545 33.2771 23.6251 33.0986C36.1445 21.7726 49.8774 29.436 53.1885 32.1943C55.6125 28.4937 66.6463 16.7865 81.3215 23.0565C83.4579 23.9613 90.5756 27.638 92.4816 36.5373C95.7493 51.9639 80.4935 67.5668 65.2975 85.1016C64.0185 86.5899 62.2737 87.4855 60.4522 87.7966C58.6686 88.1013 56.8034 87.785 55.1982 86.7893Z" fill="url(#paint0_linear_3425_2100)"/>
    </G>
    <G filter="url(#filter1_di_3425_2100)">
      <Path d="M44.8677 53.2419L52.1471 59.7394L63.7253 44.5699" stroke="url(#paint1_linear_3425_2100)" strokeWidth="5.54713" strokeLinecap="round"/>
    </G>
    <G filter="url(#filter2_f_3425_2100)">
      <Circle cx="36.3739" cy="45.8002" r="7.45697" transform="rotate(-10.4187 36.3739 45.8002)" fill="#FFA9B7"/>
    </G>
    <G filter="url(#filter3_di_3425_2100)">
      <Path d="M106.237 75.1938C100.411 71.571 97.0548 69.6346 96.6529 66.2048C96.3349 63.4883 98.3071 61.8266 98.3497 61.782C101.477 58.9528 104.907 60.8671 105.735 61.5561C106.34 60.6317 109.096 57.7073 112.762 59.2735C113.296 59.4996 115.074 60.418 115.55 62.641C116.366 66.4945 112.555 70.3921 108.759 74.7722C108.44 75.144 108.004 75.3677 107.549 75.4454C107.103 75.5216 106.638 75.4425 106.237 75.1938Z" fill="url(#paint2_linear_3425_2100)"/>
    </G>
    <G filter="url(#filter4_di_3425_2100)">
      <Path d="M95.5597 97.018C91.8264 94.6964 89.676 93.4556 89.4184 91.2577C89.2146 89.5169 90.4784 88.4521 90.5057 88.4235C92.5097 86.6106 94.708 87.8373 95.238 88.2788C95.626 87.6864 97.3922 85.8124 99.7413 86.8161C100.083 86.9609 101.223 87.5495 101.528 88.974C102.051 91.4434 99.6088 93.941 97.1763 96.7478C96.9716 96.986 96.6923 97.1294 96.4007 97.1792C96.1152 97.228 95.8166 97.1773 95.5597 97.018Z" fill="url(#paint3_linear_3425_2100)"/>
    </G>
    
    <Defs>
      <Filter id="filter0_di_3425_2100" x="0.642329" y="0.855157" width="138.682" height="129.116" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="15.1726" dy="10.8376"/>
        <FeGaussianBlur stdDeviation="15.6128"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.192157 0 0 0 0 0.0784314 0 0 0 0 0.105726 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2100"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2100" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-15.6854" dy="-15.6854"/>
        <FeGaussianBlur stdDeviation="14.1169"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2100"/>
      </Filter>
      <Filter id="filter1_di_3425_2100" x="37.0938" y="35.7961" width="44.4062" height="42.0068" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="5" dy="4"/>
        <FeGaussianBlur stdDeviation="5"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.366667 0 0 0 0 0.0595833 0 0 0 0 0.0839254 0 0 0 0.8 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2100"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2100" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-0.886846" dy="-1.77369"/>
        <FeGaussianBlur stdDeviation="0.886846"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 0.1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2100"/>
      </Filter>
      <Filter id="filter2_f_3425_2100" x="14.7507" y="24.1786" width="43.2448" height="43.2433" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <FeGaussianBlur stdDeviation="7.08171" result="effect1_foregroundBlur_3425_2100"/>
      </Filter>
      <Filter id="filter3_di_3425_2100" x="92.6072" y="53.7277" width="34.6431" height="32.2527" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="3.79007" dy="2.70719"/>
        <FeGaussianBlur stdDeviation="3.90003"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.192157 0 0 0 0 0.0784314 0 0 0 0 0.105726 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2100"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2100" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-3.91818" dy="-3.91818"/>
        <FeGaussianBlur stdDeviation="3.52636"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2100"/>
      </Filter>
      <Filter id="filter4_di_3425_2100" x="86.8249" y="83.2623" width="22.1998" height="20.6679" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="2.42872" dy="1.7348"/>
        <FeGaussianBlur stdDeviation="2.49918"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.192157 0 0 0 0 0.0784314 0 0 0 0 0.105726 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2100"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2100" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-2.51081" dy="-2.51081"/>
        <FeGaussianBlur stdDeviation="2.25973"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2100"/>
      </Filter>
      <SvgLinearGradient id="paint0_linear_3425_2100" x1="46.1938" y1="37.3623" x2="69.6293" y2="71.7793" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F64A69"/>
        <Stop offset="1" stopColor="#EF3349"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint1_linear_3425_2100" x1="55.2318" y1="43.1821" x2="52.5164" y2="59.7998" gradientUnits="userSpaceOnUse">
        <Stop stopColor="white"/>
        <Stop offset="1" stopColor="#D9FFE1"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint2_linear_3425_2100" x1="103.987" y1="62.8471" x2="109.841" y2="71.4444" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F64A69"/>
        <Stop offset="1" stopColor="#EF3349"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint3_linear_3425_2100" x1="94.1183" y1="89.106" x2="97.8697" y2="94.6153" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F64A69"/>
        <Stop offset="1" stopColor="#EF3349"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

export default RedLoveIcon;
