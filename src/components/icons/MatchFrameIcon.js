// src/components/icons/MatchFrameIcon.js
import React from 'react';
import Svg, { 
  Circle, 
  Path, 
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

const MatchFrameIcon = ({ width = 350, height = 470, style }) => (
  <Svg width={width} height={height} viewBox="0 0 469 666" style={style} fill="none">
    {/* Outer circles with gradient strokes */}
    <Circle opacity="0.4" cx="234.676" cy="317.744" r="231.398" transform="rotate(32.0912 234.676 317.744)" fill="none" stroke="url(#paint0_linear_3425_2078)" strokeWidth="5.25785"/>
    <Circle cx="232.039" cy="318.821" r="191.053" transform="rotate(32.0912 232.039 318.821)" fill="none" stroke="url(#paint1_linear_3425_2078)" strokeWidth="6.57232"/>
    <Circle opacity="0.8" cx="231.912" cy="318.349" r="149.399" transform="rotate(32.0912 231.912 318.349)" fill="none" stroke="url(#paint2_linear_3425_2078)" strokeWidth="9.20124"/>
    <Circle cx="231.946" cy="318.977" r="104.806" transform="rotate(32.0912 231.946 318.977)" fill="url(#paint3_linear_3425_2078)" stroke="url(#paint4_linear_3425_2078)" strokeWidth="11.8302"/>
    
    {/* Small colorful dots */}
    <Circle cx="400.779" cy="418.137" r="6" transform="rotate(89.0945 400.779 418.137)" fill="#FFC635"/>
    <Circle cx="383.932" cy="456.052" r="7" transform="rotate(89.0945 383.932 456.052)" fill="#2180D9"/>
    <Circle cx="353.943" cy="477.568" r="4" transform="rotate(89.0945 353.943 477.568)" fill="#FF34D2"/>
    <Circle cx="68.6609" cy="227.797" r="6" transform="rotate(-102.686 68.6609 227.797)" fill="#EF35FF"/>
    <Circle cx="79.1996" cy="201.504" r="4.53727" transform="rotate(-102.686 79.1996 201.504)" fill="#EA6126"/>
    <Circle cx="95.3109" cy="183.575" r="3.44945" transform="rotate(-102.686 95.3109 183.575)" fill="#2AD36E"/>
    
    {/* Green Heart with white heart icon */}
    <G filter="url(#filter0_d_3425_2078)">
      <Circle cx="165.999" cy="213" r="25" transform="rotate(-13.3729 165.999 213)" fill="url(#paint5_linear_3425_2078)"/>
    </G>
    <G filter="url(#filter1_di_3425_2078)">
      <Path d="M166.254 222.166C159.022 218.289 154.868 216.236 154.125 212.173C153.537 208.955 155.764 206.821 155.811 206.764C159.326 203.147 163.568 205.169 164.608 205.928C165.26 204.778 168.325 201.076 172.82 202.664C173.475 202.893 175.667 203.852 176.406 206.469C177.676 211.006 173.427 215.95 169.232 221.469C168.88 221.938 168.377 222.238 167.84 222.366C167.314 222.491 166.751 222.432 166.254 222.166Z" fill="url(#paint6_linear_3425_2078)"/>
    </G>
    
    {/* Large Red Heart with white checkmark */}
    <G filter="url(#filter2_di_3425_2078)">
      <Path d="M259.198 450.789C235.876 436.286 222.442 428.534 220.832 414.804C219.559 403.929 227.455 397.277 227.625 397.099C240.144 385.773 253.877 393.436 257.189 396.194C259.613 392.494 270.646 380.787 285.321 387.056C287.458 387.961 294.576 391.638 296.482 400.537C299.749 415.964 284.493 431.567 269.297 449.102C268.018 450.59 266.274 451.485 264.452 451.797C262.669 452.101 260.803 451.785 259.198 450.789Z" fill="url(#paint7_linear_3425_2078)"/>
    </G>
    <G filter="url(#filter3_di_3425_2078)">
      <Path d="M248.868 417.242L256.147 423.739L267.725 408.57" stroke="url(#paint8_linear_3425_2078)" strokeWidth="5.54713" strokeLinecap="round"/>
    </G>
    <G filter="url(#filter4_f_3425_2078)">
      <Circle cx="240.374" cy="409.8" r="7.45697" transform="rotate(-10.4187 240.374 409.8)" fill="#FFA9B7"/>
    </G>
    
    {/* Two Lillit Hearts (smaller red hearts) */}
    <G filter="url(#filter5_di_3425_2078)">
      <Path d="M310.237 439.194C304.411 435.571 301.055 433.635 300.653 430.205C300.335 427.488 302.307 425.827 302.35 425.782C305.477 422.953 308.907 424.867 309.735 425.556C310.34 424.632 313.096 421.707 316.762 423.274C317.296 423.5 319.074 424.418 319.55 426.641C320.366 430.495 316.555 434.392 312.759 438.772C312.44 439.144 312.004 439.368 311.549 439.445C311.103 439.522 310.638 439.443 310.237 439.194Z" fill="url(#paint9_linear_3425_2078)"/>
    </G>
    <G filter="url(#filter6_di_3425_2078)">
      <Path d="M299.56 461.018C295.826 458.696 293.676 457.456 293.418 455.258C293.215 453.517 294.478 452.452 294.506 452.424C296.51 450.611 298.708 451.837 299.238 452.279C299.626 451.686 301.392 449.812 303.741 450.816C304.083 450.961 305.223 451.549 305.528 452.974C306.051 455.443 303.609 457.941 301.176 460.748C300.972 460.986 300.692 461.129 300.401 461.179C300.115 461.228 299.817 461.177 299.56 461.018Z" fill="url(#paint10_linear_3425_2078)"/>
    </G>
    
    {/* All Definitions - Filters and Gradients */}
    <Defs>
      {/* Filters */}
      <Filter id="filter0_d_3425_2078" x="129.992" y="180.994" width="80.0117" height="80.0115" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="4" dy="8"/>
        <FeGaussianBlur stdDeviation="7.5"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.231373 0 0 0 0 0.94902 0 0 0 0 0.432314 0 0 0 0.2 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2078"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2078" result="shape"/>
      </Filter>
      <Filter id="filter1_di_3425_2078" x="152.027" y="195.274" width="46.6055" height="44.1545" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="10" dy="5"/>
        <FeGaussianBlur stdDeviation="6"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2078"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2078" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-1" dy="-2"/>
        <FeGaussianBlur stdDeviation="1"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 0.1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2078"/>
      </Filter>
      <Filter id="filter2_di_3425_2078" x="204.642" y="364.855" width="138.682" height="129.116" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="15.1726" dy="10.8376"/>
        <FeGaussianBlur stdDeviation="15.6128"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.192157 0 0 0 0 0.0784314 0 0 0 0 0.105726 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2078"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2078" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-15.6854" dy="-15.6854"/>
        <FeGaussianBlur stdDeviation="14.1169"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2078"/>
      </Filter>
      <Filter id="filter3_di_3425_2078" x="241.094" y="399.796" width="44.4062" height="42.0068" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="5" dy="4"/>
        <FeGaussianBlur stdDeviation="5"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.366667 0 0 0 0 0.0595833 0 0 0 0 0.0839254 0 0 0 0.8 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2078"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2078" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-0.886846" dy="-1.77369"/>
        <FeGaussianBlur stdDeviation="0.886846"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 0.1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2078"/>
      </Filter>
      <Filter id="filter4_f_3425_2078" x="218.751" y="388.179" width="43.2448" height="43.2433" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <FeGaussianBlur stdDeviation="7.08171" result="effect1_foregroundBlur_3425_2078"/>
      </Filter>
      <Filter id="filter5_di_3425_2078" x="296.607" y="417.728" width="34.6431" height="32.2527" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="3.79007" dy="2.70719"/>
        <FeGaussianBlur stdDeviation="3.90003"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.192157 0 0 0 0 0.0784314 0 0 0 0 0.105726 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2078"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2078" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-3.91818" dy="-3.91818"/>
        <FeGaussianBlur stdDeviation="3.52636"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2078"/>
      </Filter>
      <Filter id="filter6_di_3425_2078" x="290.825" y="447.262" width="22.1998" height="20.6679" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="2.42872" dy="1.7348"/>
        <FeGaussianBlur stdDeviation="2.49918"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.192157 0 0 0 0 0.0784314 0 0 0 0 0.105726 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3425_2078"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3425_2078" result="shape"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dx="-2.51081" dy="-2.51081"/>
        <FeGaussianBlur stdDeviation="2.25973"/>
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.708333 0 0 0 0 0.0619792 0 0 0 0 0.108921 0 0 0 1 0"/>
        <FeBlend mode="normal" in2="shape" result="effect2_innerShadow_3425_2078"/>
      </Filter>
      
      {/* Gradients */}
      <SvgLinearGradient id="paint0_linear_3425_2078" x1="234.675" y1="83.7167" x2="234.675" y2="551.77" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#BD355A"/>
        <Stop offset="0.305825" stopColor="#070218" stopOpacity="0"/>
        <Stop offset="0.791262" stopColor="#09011E" stopOpacity="0"/>
        <Stop offset="1" stopColor="#3228CC"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint1_linear_3425_2078" x1="232.039" y1="124.482" x2="232.039" y2="513.16" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#BD355A"/>
        <Stop offset="0.305825" stopColor="#070218" stopOpacity="0"/>
        <Stop offset="0.791262" stopColor="#09011E" stopOpacity="0"/>
        <Stop offset="1" stopColor="#3228CC"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint2_linear_3425_2078" x1="231.912" y1="164.349" x2="231.912" y2="472.348" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#BD355A"/>
        <Stop offset="0.305825" stopColor="#070218" stopOpacity="0"/>
        <Stop offset="0.791262" stopColor="#09011E" stopOpacity="0"/>
        <Stop offset="1" stopColor="#3228CC"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint3_linear_3425_2078" x1="231.946" y1="208.256" x2="231.946" y2="429.699" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#270D59"/>
        <Stop offset="1" stopColor="#07011A" stopOpacity="0"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint4_linear_3425_2078" x1="231.946" y1="208.256" x2="231.946" y2="429.699" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#BD355A"/>
        <Stop offset="1" stopColor="#3228CC"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint5_linear_3425_2078" x1="161.059" y1="197.188" x2="176.63" y2="224.949" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#34F07F"/>
        <Stop offset="1" stopColor="#10AA7C"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint6_linear_3425_2078" x1="162.622" y1="207.603" x2="170.336" y2="217.993" gradientUnits="userSpaceOnUse">
        <Stop stopColor="white"/>
        <Stop offset="1" stopColor="#FFEBED"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint7_linear_3425_2078" x1="250.194" y1="401.362" x2="273.629" y2="435.779" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F64A69"/>
        <Stop offset="1" stopColor="#EF3349"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint8_linear_3425_2078" x1="259.232" y1="407.182" x2="256.516" y2="423.8" gradientUnits="userSpaceOnUse">
        <Stop stopColor="white"/>
        <Stop offset="1" stopColor="#D9FFE1"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint9_linear_3425_2078" x1="307.987" y1="426.847" x2="313.841" y2="435.444" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F64A69"/>
        <Stop offset="1" stopColor="#EF3349"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint10_linear_3425_2078" x1="298.118" y1="453.106" x2="301.87" y2="458.615" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F64A69"/>
        <Stop offset="1" stopColor="#EF3349"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

export default MatchFrameIcon;
