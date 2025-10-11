import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const BackgroundContainer = ({ width, height }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 414 753" fill="none">
      <Circle
        opacity="0.4"
        cx="206.676"
        cy="367.076"
        r="231.398"
        transform="rotate(32.0912 206.676 367.076)"
        stroke="url(#paint0_linear_190_2432)"
        strokeWidth="5.25785"
      />
      <Circle
        cx="204.039"
        cy="368.154"
        r="191.053"
        transform="rotate(32.0912 204.039 368.154)"
        stroke="url(#paint1_linear_190_2432)"
        strokeWidth="6.57232"
      />
      <Circle
        opacity="0.8"
        cx="203.912"
        cy="367.682"
        r="149.399"
        transform="rotate(32.0912 203.912 367.682)"
        stroke="url(#paint2_linear_190_2432)"
        strokeWidth="9.20124"
      />
      <Circle
        cx="203.946"
        cy="368.311"
        r="104.806"
        transform="rotate(32.0912 203.946 368.311)"
        fill="url(#paint3_linear_190_2432)"
        stroke="url(#paint4_linear_190_2432)"
        strokeWidth="11.8302"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_190_2432"
          x1="206.676"
          y1="133.05"
          x2="206.676"
          y2="601.103"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#BD355A" />
          <Stop offset="0.305825" stopColor="#070218" stopOpacity="0" />
          <Stop offset="0.791262" stopColor="#09011E" stopOpacity="0" />
          <Stop offset="1" stopColor="#3228CC" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_190_2432"
          x1="204.039"
          y1="173.815"
          x2="204.039"
          y2="562.494"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#BD355A" />
          <Stop offset="0.305825" stopColor="#070218" stopOpacity="0" />
          <Stop offset="0.791262" stopColor="#09011E" stopOpacity="0" />
          <Stop offset="1" stopColor="#3228CC" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_190_2432"
          x1="203.912"
          y1="213.682"
          x2="203.912"
          y2="521.681"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#BD355A" />
          <Stop offset="0.305825" stopColor="#070218" stopOpacity="0" />
          <Stop offset="0.791262" stopColor="#09011E" stopOpacity="0" />
          <Stop offset="1" stopColor="#3228CC" />
        </LinearGradient>
        <LinearGradient
          id="paint3_linear_190_2432"
          x1="203.946"
          y1="257.589"
          x2="203.946"
          y2="479.032"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#270D59" />
          <Stop offset="1" stopColor="#07011A" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint4_linear_190_2432"
          x1="203.946"
          y1="257.589"
          x2="203.946"
          y2="479.032"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#BD355A" />
          <Stop offset="1" stopColor="#3228CC" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export { BackgroundContainer };
