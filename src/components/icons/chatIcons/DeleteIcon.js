import React from 'react';
import Svg, { Path } from 'react-native-svg';

const DeleteIcon = ({ width = 15, height = 15, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
    <Path
      d="M1.5 4.5H13.5V14.25C13.5 14.4489 13.421 14.6397 13.2803 14.7803C13.1397 14.921 12.9489 15 12.75 15H2.25C2.05109 15 1.86032 14.921 1.71967 14.7803C1.57902 14.6397 1.5 14.4489 1.5 14.25V4.5ZM3.75 2.25V0.75C3.75 0.551088 3.82902 0.360322 3.96967 0.21967C4.11032 0.0790176 4.30109 0 4.5 0H10.5C10.6989 0 10.8897 0.0790176 11.0303 0.21967C11.171 0.360322 11.25 0.551088 11.25 0.75V2.25H15V3.75H0V2.25H3.75ZM5.25 1.5V2.25H9.75V1.5H5.25ZM5.25 7.5V12H6.75V7.5H5.25ZM8.25 7.5V12H9.75V7.5H8.25Z"
      fill={color}
    />
  </Svg>
);

export default DeleteIcon;
