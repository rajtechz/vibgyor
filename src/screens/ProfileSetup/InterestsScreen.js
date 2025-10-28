
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import CustomButton from '../../components/common/CustomButton';
import CommonBackground from '../../components/common/CommonBackground';
import ErrorModal from '../../components/common/ErrorModal';
import { authAPI } from '../../api/authAPI';
import { useSelector } from 'react-redux';
// Inline SVG Icon Components
const CameraIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 16" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.62524 0.520997C5.75935 0.252793 6.03347 0.083374 6.33333 0.083374H11.0833C11.3832 0.083374 11.6573 0.252793 11.7914 0.520997L12.7601 2.45837H15.4375C16.5306 2.45837 17.4167 3.34448 17.4167 4.43754V13.9375C17.4167 15.0306 16.5306 15.9167 15.4375 15.9167H1.97917C0.886103 15.9167 0 15.0306 0 13.9375V4.43754C0 3.34448 0.886103 2.45837 1.97917 2.45837H4.65656L5.62524 0.520997ZM6.42678 2.45837H10.9899L10.5941 1.66671H6.82261L6.42678 2.45837ZM1.97917 4.04171C1.76055 4.04171 1.58333 4.21893 1.58333 4.43754V13.9375C1.58333 14.1562 1.76055 14.3334 1.97917 14.3334H15.4375C15.6561 14.3334 15.8333 14.1562 15.8333 13.9375V4.43754C15.8333 4.21893 15.6561 4.04171 15.4375 4.04171H1.97917ZM4.75 9.18754C4.75 7.00141 6.5222 5.22921 8.70833 5.22921C10.8945 5.22921 12.6667 7.00141 12.6667 9.18754C12.6667 11.3737 10.8945 13.1459 8.70833 13.1459C6.5222 13.1459 4.75 11.3737 4.75 9.18754ZM8.70833 6.81254C7.39665 6.81254 6.33333 7.87586 6.33333 9.18754C6.33333 10.4992 7.39665 11.5625 8.70833 11.5625C10.02 11.5625 11.0833 10.4992 11.0833 9.18754C11.0833 7.87586 10.02 6.81254 8.70833 6.81254Z"
      fill={fill}
    />
  </Svg>
);

const CookingIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.3975 0.909684C17.4935 1.33625 17.2255 1.75985 16.799 1.85582L12.6668 2.78555V8.20846H16.6252C17.0624 8.20846 17.4168 8.5629 17.4168 9.00013C17.4168 11.3411 16.7094 13.5262 15.2283 15.1344C13.7374 16.7532 11.5346 17.7085 8.7085 17.7085C5.88239 17.7085 3.67962 16.7532 2.18869 15.1344C0.707566 13.5262 0.000171543 11.3411 0.000171543 9.00013C0.000171543 8.5629 0.354613 8.20846 0.791838 8.20846H1.5835V5.2793L0.965619 5.41832C0.539057 5.5143 0.115457 5.24631 0.0194805 4.81974C-0.0764958 4.39318 0.191496 3.96958 0.618058 3.87361L1.5835 3.65638V3.45846C1.5835 3.02124 1.93795 2.6668 2.37517 2.6668C2.75938 2.6668 3.07966 2.94049 3.15169 3.30354L4.75017 2.94388V2.6668C4.75017 2.22957 5.10461 1.87513 5.54184 1.87513C5.95264 1.87513 6.29036 2.18802 6.32968 2.58849L7.91684 2.23138V1.87513C7.91684 1.43791 8.27128 1.08346 8.7085 1.08346C9.14573 1.08346 9.50017 1.43791 9.50017 1.87513L11.0835 1.51888V1.08346C11.0835 0.646239 11.4379 0.291798 11.8752 0.291798C12.3124 0.291798 12.6668 0.646239 12.6668 1.08346V1.16263L16.4514 0.311106C16.878 0.21513 17.3016 0.483122 17.3975 0.909684ZM11.0835 3.1418L9.50017 3.49805V8.20846H11.0835V3.1418ZM1.61546 9.7918C1.75491 11.4914 2.34865 12.9709 3.35333 14.0617C4.50129 15.3082 6.25686 16.1251 8.7085 16.1251C11.1602 16.1251 12.9157 15.3082 14.0637 14.0617C15.0684 12.9709 15.6621 11.4914 15.8016 9.7918H1.61546ZM3.16684 8.20846H4.75017V4.5668L3.16684 4.92305V8.20846ZM6.3335 4.21055V8.20846H7.91684V3.8543L6.3335 4.21055Z"
      fill={fill}
    />
  </Svg>
);

const GameIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <Path
      d="M5.54167 9.39583C5.97889 9.39583 6.33333 9.75027 6.33333 10.1875V10.9792H7.125C7.56222 10.9792 7.91667 11.3336 7.91667 11.7708C7.91667 12.2081 7.56222 12.5625 7.125 12.5625H6.33333V13.3542C6.33333 13.7914 5.97889 14.1458 5.54167 14.1458C5.10444 14.1458 4.75 13.7914 4.75 13.3542V12.5625H3.95833C3.52111 12.5625 3.16667 12.2081 3.16667 11.7708C3.16667 11.3336 3.52111 10.9792 3.95833 10.9792H4.75V10.1875C4.75 9.75027 5.10444 9.39583 5.54167 9.39583Z"
      fill={fill}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.875 9.39583C10.5633 9.39583 9.5 10.4592 9.5 11.7708C9.5 13.0825 10.5633 14.1458 11.875 14.1458C13.1867 14.1458 14.25 13.0825 14.25 11.7708C14.25 10.4592 13.1867 9.39583 11.875 9.39583ZM11.0833 11.7708C11.0833 11.3336 11.4378 10.9792 11.875 10.9792C12.3122 10.9792 12.6667 11.3336 12.6667 11.7708C12.6667 12.2081 12.3122 12.5625 11.875 12.5625C11.4378 12.5625 11.0833 12.2081 11.0833 11.7708Z"
      fill={fill}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.875 0.6875C12.3122 0.6875 12.6667 1.04194 12.6667 1.47917V3.74107C12.6667 4.1783 12.3122 4.53274 11.875 4.53274H9.5V6.22917H11.875C14.9356 6.22917 17.4167 8.71026 17.4167 11.7708C17.4167 14.8314 14.9356 17.3125 11.875 17.3125H5.54167C2.48109 17.3125 0 14.8314 0 11.7708C0 8.71026 2.48109 6.22917 5.54167 6.22917H7.91667V3.74107C7.91667 3.30385 8.27111 2.9494 8.70833 2.9494H11.0833V1.47917C11.0833 1.04194 11.4378 0.6875 11.875 0.6875ZM5.54167 7.8125C3.35554 7.8125 1.58333 9.58471 1.58333 11.7708C1.58333 13.957 3.35554 15.7292 5.54167 15.7292H11.875C14.0611 15.7292 15.8333 13.957 15.8333 11.7708C15.8333 9.58471 14.0611 7.8125 11.875 7.8125H5.54167Z"
      fill={fill}
    />
  </Svg>
);

const MusicIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 16 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.136 0.857483C15.3264 1.0076 15.4375 1.2367 15.4375 1.47917V4.67918C15.4377 4.69042 15.4377 4.70162 15.4375 4.7128V13.5125C15.4375 14.7367 14.4451 15.7292 13.2208 15.7292H11.6771C10.4747 15.7292 9.5 14.7545 9.5 13.5521C9.5 12.3497 10.4747 11.375 11.6771 11.375H13.8542V5.69631L5.54167 7.66438V15.0958C5.54167 16.3201 4.54922 17.3125 3.325 17.3125H2.17708C0.974712 17.3125 0 16.3378 0 15.1354C0 13.9331 0.974712 12.9583 2.17708 12.9583H3.95833V7.05438C3.95809 7.04316 3.95809 7.03196 3.95833 7.0208V3.85417C3.95833 3.48812 4.2093 3.1698 4.56525 3.08437L14.4611 0.709367C14.6969 0.652781 14.9456 0.707363 15.136 0.857483ZM5.54167 6.03727L13.8542 4.0692V2.48332L5.54167 4.47832V6.03727ZM3.95833 14.5417H2.17708C1.84916 14.5417 1.58333 14.8075 1.58333 15.1354C1.58333 15.4633 1.84916 15.7292 2.17708 15.7292H3.325C3.67477 15.7292 3.95833 15.4456 3.95833 15.0958V14.5417ZM13.8542 12.9583H11.6771C11.3492 12.9583 11.0833 13.2242 11.0833 13.5521C11.0833 13.88 11.3492 14.1458 11.6771 14.1458H13.2208C13.5706 14.1458 13.8542 13.8623 13.8542 13.5125V12.9583Z"
      fill={fill}
    />
  </Svg>
);

const TravellingIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.8542 2.27083C13.1983 2.27083 12.6667 2.8025 12.6667 3.45833C12.6667 4.11417 13.1983 4.64583 13.8542 4.64583C14.51 4.64583 15.0417 4.11417 15.0417 3.45833C15.0417 2.8025 14.51 2.27083 13.8542 2.27083ZM11.0833 3.45833C11.0833 1.92804 12.3239 0.6875 13.8542 0.6875C15.3845 0.6875 16.625 1.92804 16.625 3.45833C16.625 4.98862 15.3845 6.22917 13.8542 6.22917C12.3239 6.22917 11.0833 4.98862 11.0833 3.45833ZM6.34031 3.06253C6.65736 3.06532 6.94216 3.25701 7.06411 3.54968L10.2092 11.098L11.124 8.35382C11.2217 8.06052 11.4813 7.85096 11.7886 7.81723C12.0959 7.78349 12.3948 7.93175 12.5539 8.19686L17.3039 16.1135C17.4506 16.3581 17.4544 16.6627 17.3139 16.9109C17.1734 17.1591 16.9102 17.3125 16.625 17.3125H0.791669C0.524501 17.3125 0.275354 17.1777 0.12912 16.9542C-0.0171148 16.7306 -0.0407083 16.4483 0.066378 16.2035L5.60804 3.53685C5.73513 3.24637 6.02326 3.05974 6.34031 3.06253ZM2.00214 15.7292H15.2268L12.0817 10.4874L11.0427 13.6045C10.9383 13.9177 10.6505 14.1333 10.3206 14.1453C9.99065 14.1574 9.68788 13.9634 9.5609 13.6587L6.31558 5.86988L2.00214 15.7292Z"
      fill={fill}
    />
  </Svg>
);

const CartIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 15 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.125 1.87502C6.03193 1.87502 5.14583 2.76112 5.14583 3.85419V4.25002H9.10417V3.85419C9.10417 2.76112 8.21807 1.87502 7.125 1.87502ZM10.6875 4.25002V3.85419C10.6875 1.88667 9.09252 0.291687 7.125 0.291687C5.15748 0.291687 3.5625 1.88667 3.5625 3.85419V4.25002H1.58333C0.708882 4.25002 0 4.9589 0 5.83335V16.125C0 16.9995 0.708883 17.7084 1.58333 17.7084H12.6667C13.5411 17.7084 14.25 16.9995 14.25 16.125V5.83335C14.25 4.9589 13.5411 4.25002 12.6667 4.25002H10.6875ZM9.10417 5.83335V6.62502C9.10417 7.06225 9.45861 7.41669 9.89583 7.41669C10.3331 7.41669 10.6875 7.06225 10.6875 6.62502V5.83335H12.6667V16.125H1.58333V5.83335H3.5625V6.62502C3.5625 7.06225 3.91694 7.41669 4.35417 7.41669C4.79139 7.41669 5.14583 7.06225 5.14583 6.62502V5.83335H9.10417Z"
      fill={fill}
    />
  </Svg>
);

const MicIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 14 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.16667 3.85419C3.16667 1.88667 4.76165 0.291687 6.72917 0.291687C8.69669 0.291687 10.2917 1.88667 10.2917 3.85419V9.00002C10.2917 10.9675 8.69668 12.5625 6.72917 12.5625C4.76165 12.5625 3.16667 10.9675 3.16667 9.00002V3.85419ZM6.72917 1.87502C5.6361 1.87502 4.75 2.76112 4.75 3.85419V9.00002C4.75 10.0931 5.6361 10.9792 6.72917 10.9792C7.82223 10.9792 8.70833 10.0931 8.70833 9.00002V3.85419C8.70833 2.76112 7.82223 1.87502 6.72917 1.87502ZM0.791667 7.81252C1.22889 7.81252 1.58333 8.16696 1.58333 8.60419C1.58333 11.4462 3.88719 13.75 6.72917 13.75C9.57114 13.75 11.875 11.4462 11.875 8.60419C11.875 8.16696 12.2294 7.81252 12.6667 7.81252C13.1039 7.81252 13.4583 8.16696 13.4583 8.60419C13.4583 12.0528 10.8642 14.8955 7.52083 15.2873V16.9167C7.52083 17.3539 7.16639 17.7084 6.72917 17.7084C6.29194 17.7084 5.9375 17.3539 5.9375 16.9167V15.2873C2.59415 14.8955 0 12.0528 0 8.60419C0 8.16696 0.354441 7.81252 0.791667 7.81252Z"
      fill={fill}
    />
  </Svg>
);

const ArtIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 9.00002C0 4.19054 3.89885 0.291687 8.70833 0.291687C13.5178 0.291687 17.4167 4.19054 17.4167 9.00002C17.4167 9.86678 16.9178 10.4302 16.33 10.7708C15.7871 11.0853 15.0969 11.2579 14.4858 11.3902C14.2908 11.4324 14.1021 11.4709 13.9191 11.5083C13.481 11.5977 13.075 11.6806 12.6924 11.7918C12.1436 11.9514 11.829 12.123 11.6759 12.2958L11.0833 11.7709L11.6759 12.2958C11.4496 12.5513 11.3045 12.9159 11.2099 13.4135C11.1424 13.7684 11.1108 14.1175 11.0766 14.4961C11.0608 14.671 11.0444 14.8522 11.0237 15.0432C10.9655 15.579 10.8686 16.2362 10.5435 16.7602C10.369 17.0414 10.1262 17.2909 9.79539 17.4641C9.469 17.635 9.10136 17.7084 8.70833 17.7084C3.89885 17.7084 0 13.8095 0 9.00002ZM8.70833 1.87502C4.7733 1.87502 1.58333 5.06499 1.58333 9.00002C1.58333 12.9351 4.7733 16.125 8.70833 16.125C8.90511 16.125 9.00872 16.0888 9.0611 16.0613C9.10905 16.0362 9.15255 15.9988 9.19803 15.9255C9.31282 15.7405 9.39028 15.4182 9.44961 14.8722C9.46387 14.741 9.47715 14.5947 9.49128 14.439C9.52856 14.0282 9.57175 13.5523 9.6544 13.1177C9.77244 12.4969 9.99188 11.809 10.4908 11.2459C10.9564 10.7203 11.6439 10.4478 12.2502 10.2715C12.6992 10.1409 13.2052 10.0376 13.6676 9.94324C13.836 9.90886 13.9987 9.87565 14.1507 9.84274C14.7703 9.7086 15.2335 9.57621 15.5363 9.40077C15.7941 9.25136 15.8333 9.13978 15.8333 9.00002C15.8333 5.06499 12.6434 1.87502 8.70833 1.87502ZM8.3125 5.04169C8.3125 3.94861 9.19858 3.06252 10.2917 3.06252C11.3847 3.06252 12.2708 3.94861 12.2708 5.04169C12.2708 6.13477 11.3847 7.02085 10.2917 7.02085C9.19858 7.02085 8.3125 6.13477 8.3125 5.04169ZM10.2917 4.64585C10.073 4.64585 9.89583 4.82306 9.89583 5.04169C9.89583 5.26032 10.073 5.43752 10.2917 5.43752C10.5103 5.43752 10.6875 5.26032 10.6875 5.04169C10.6875 4.82306 10.5103 4.64585 10.2917 4.64585ZM3.5625 6.62502C3.5625 5.53194 4.44858 4.64585 5.54167 4.64585C6.63475 4.64585 7.52083 5.53194 7.52083 6.62502C7.52083 7.7181 6.63475 8.60419 5.54167 8.60419C4.44858 8.60419 3.5625 7.7181 3.5625 6.62502ZM5.54167 6.22919C5.32304 6.22919 5.14583 6.40639 5.14583 6.62502C5.14583 6.84365 5.32304 7.02085 5.54167 7.02085C5.7603 7.02085 5.9375 6.84365 5.9375 6.62502C5.9375 6.40639 5.7603 6.22919 5.54167 6.22919ZM3.95833 11.7709C3.95833 10.6778 4.84442 9.79169 5.9375 9.79169C7.03058 9.79169 7.91667 10.6778 7.91667 11.7709C7.91667 12.8639 7.03058 13.75 5.9375 13.75C4.84442 13.75 3.95833 12.8639 3.95833 11.7709ZM5.9375 11.375C5.71887 11.375 5.54167 11.5522 5.54167 11.7709C5.54167 11.9895 5.71887 12.1667 5.9375 12.1667C6.15613 12.1667 6.33333 11.9895 6.33333 11.7709C6.33333 11.5522 6.15613 11.375 5.9375 11.375Z"
      fill={fill}
    />
  </Svg>
);

const SwimIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 14" fill="none">
    <Path
      d="M4.75012 9.77081C5.80067 9.77081 6.60508 9.96401 7.83446 10.4854L8.2871 10.6833L8.78159 10.9098L9.5088 11.2497L9.92754 11.4383C9.99402 11.4675 10.0589 11.4957 10.1224 11.5229L10.4864 11.6736C11.3574 12.0202 11.9525 12.1458 12.6668 12.1458C13.4175 12.1458 14.2521 11.9455 15.0941 11.6087C15.3944 11.4886 15.6735 11.3598 15.9229 11.2315L16.1356 11.1183L16.2178 11.0711C16.5927 10.8462 17.079 10.9678 17.304 11.3427C17.5289 11.7176 17.4073 12.2039 17.0324 12.4288L16.8178 12.5512L16.5512 12.6902C16.3085 12.8117 16.0155 12.9454 15.6822 13.0788C14.6687 13.4841 13.6479 13.7291 12.6668 13.7291C11.6162 13.7291 10.8118 13.536 9.58244 13.0145L9.1298 12.8166L8.63532 12.5902L7.9081 12.2503L7.48936 12.0617C7.42288 12.0324 7.35798 12.0042 7.29454 11.9771L6.93049 11.8264C6.05949 11.4798 5.46443 11.3541 4.75012 11.3541C3.99945 11.3541 3.16484 11.5545 2.32278 11.8913C2.02248 12.0114 1.7434 12.1402 1.49402 12.2685L1.28135 12.3817L1.1991 12.4288C0.824178 12.6538 0.337888 12.5322 0.112938 12.1573C-0.112013 11.7824 0.00955948 11.2961 0.384477 11.0711L0.599087 10.9488L0.865683 10.8097C1.10846 10.6883 1.40143 10.5545 1.73475 10.4212C2.74817 10.0158 3.76902 9.77081 4.75012 9.77081Z"
      fill={fill}
    />
    <Path
      d="M4.75012 5.02081C5.80067 5.02081 6.60508 5.214 7.83446 5.73544L8.2871 5.93333L8.78159 6.15979L9.5088 6.4997L9.92754 6.68828C9.99402 6.71754 10.0589 6.74573 10.1224 6.77289L10.4864 6.92356C11.3574 7.2702 11.9525 7.39581 12.6668 7.39581C13.4175 7.39581 14.2521 7.19551 15.0941 6.85869C15.3944 6.73856 15.6735 6.60976 15.9229 6.48151L16.1356 6.36826L16.2178 6.32113C16.5927 6.09618 17.079 6.21775 17.304 6.59267C17.5289 6.96759 17.4073 7.45388 17.0324 7.67883L16.8178 7.8012L16.5512 7.94024C16.3085 8.0617 16.0155 8.19545 15.6822 8.32877C14.6687 8.73414 13.6479 8.97915 12.6668 8.97915C11.6162 8.97915 10.8118 8.78596 9.58244 8.26452L9.1298 8.06663L8.63532 7.84017L7.9081 7.50026L7.48936 7.31168C7.42288 7.28242 7.35798 7.25423 7.29454 7.22707L6.93049 7.0764C6.05949 6.72976 5.46443 6.60415 4.75012 6.60415C3.99945 6.60415 3.16484 6.80445 2.32278 7.14127C2.02248 7.2614 1.7434 7.3902 1.49402 7.51845L1.28135 7.6317L1.1991 7.67883C0.824178 7.90378 0.337888 7.78221 0.112938 7.40729C-0.112013 7.03237 0.00955948 6.54608 0.384477 6.32113L0.599087 6.19876L0.865683 6.05972C1.10846 5.93826 1.40143 5.80451 1.73475 5.67119C2.74817 5.26582 3.76902 5.02081 4.75012 5.02081Z"
      fill={fill}
    />
    <Path
      d="M4.75012 0.270813C5.80067 0.270813 6.60508 0.464004 7.83446 0.98544L8.2871 1.18333L8.78159 1.40979L9.5088 1.7497L9.92754 1.93828C9.99402 1.96754 10.0589 1.99573 10.1224 2.02289L10.4864 2.17356C11.3574 2.5202 11.9525 2.64581 12.6668 2.64581C13.4175 2.64581 14.2521 2.44551 15.0941 2.10869C15.3944 1.98856 15.6735 1.85976 15.9229 1.73151L16.1356 1.61826L16.2178 1.57113C16.5927 1.34618 17.079 1.46775 17.304 1.84267C17.5289 2.21759 17.4073 2.70388 17.0324 2.92883L16.8178 3.0512L16.5512 3.19024C16.3085 3.3117 16.0155 3.44545 15.6822 3.57877C14.6687 3.98414 13.6479 4.22915 12.6668 4.22915C11.6162 4.22915 10.8118 4.03596 9.58244 3.51452L9.1298 3.31663L8.63532 3.09017L7.9081 2.75026L7.48936 2.56168C7.42288 2.53242 7.35798 2.50423 7.29454 2.47707L6.93049 2.3264C6.05949 1.97976 5.46443 1.85415 4.75012 1.85415C3.99945 1.85415 3.16484 2.05445 2.32278 2.39127C2.02248 2.5114 1.7434 2.6402 1.49402 2.76845L1.28135 2.8817L1.1991 2.92883C0.824178 3.15378 0.337888 3.03221 0.112938 2.65729C-0.112013 2.28237 0.00955948 1.79608 0.384477 1.57113L0.599087 1.44876L0.865683 1.30972C1.10846 1.18826 1.40143 1.05451 1.73475 0.921186C2.74817 0.515819 3.76902 0.270813 4.75012 0.270813Z"
      fill={fill}
    />
  </Svg>
);

const WineIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 12 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.73475 0.617713C1.88373 0.412877 2.12172 0.291687 2.375 0.291687H8.70833C8.96162 0.291687 9.19961 0.412879 9.34858 0.617719C8.66897 1.11198 8.70201 1.08795 9.34858 0.617719L9.35049 0.620349L9.35344 0.624443L9.36238 0.636975C9.36965 0.647244 9.37954 0.661325 9.39179 0.679086C9.41629 0.714597 9.45028 0.764878 9.49184 0.828855C9.57488 0.956701 9.68853 1.13988 9.81713 1.36977C10.0734 1.82795 10.3939 2.4802 10.6481 3.25622C10.8943 4.00739 11.0833 4.88971 11.0833 5.83335C11.0833 6.60962 10.9179 7.35455 10.6207 8.03142C9.86944 9.74305 8.2661 11.0366 6.33333 11.3179V16.125H9.5C9.93723 16.125 10.2917 16.4795 10.2917 16.9167C10.2917 17.3539 9.93723 17.7084 9.5 17.7084H1.58333C1.14611 17.7084 0.791667 17.3539 0.791667 16.9167C0.791667 16.4795 1.14611 16.125 1.58333 16.125H4.75V11.3189C2.90133 11.0544 1.34802 9.87755 0.559211 8.2618C0.200812 7.52757 0 6.70275 0 5.83335C0 4.77842 0.236303 3.79936 0.525434 2.99318C0.77751 2.29037 1.07518 1.70385 1.30994 1.29233C1.42768 1.08594 1.53058 0.921871 1.60553 0.807331C1.64303 0.750017 1.67362 0.704974 1.69568 0.673102C1.70671 0.657161 1.71561 0.644502 1.72219 0.635237L1.73029 0.623892L1.73299 0.620152L1.73399 0.618769L1.73475 0.617713ZM2.80404 1.87502C2.76763 1.93495 2.72771 2.00242 2.68522 2.07691C2.48431 2.42908 2.22979 2.93111 2.01582 3.52769M2.80404 1.87502H8.27929C8.32615 1.95216 8.37882 2.04178 8.4353 2.14275C8.65551 2.53641 8.92879 3.09384 9.14352 3.74921C9.29923 4.22443 9.42136 4.74272 9.47309 5.28148C9.22247 5.35684 8.89861 5.43934 8.53538 5.49669C7.66838 5.63358 6.70424 5.60766 5.94898 5.1545C4.72507 4.42016 3.31421 4.44608 2.30101 4.60606C2.08288 4.6405 1.87726 4.68209 1.68849 4.72628C1.76652 4.30376 1.88223 3.90018 2.01582 3.52769M1.98204 7.56717C1.80317 7.20071 1.67913 6.8023 1.62096 6.38201L1.98204 7.56717ZM1.62096 6.38201C1.87006 6.30753 2.18988 6.22656 2.54795 6.17002C3.41495 6.03312 4.37909 6.05904 5.13436 6.5122C6.35826 7.24654 7.76912 7.22062 8.78232 7.06064C8.97713 7.02988 9.16197 6.99343 9.33374 6.95451C9.28819 7.10491 9.23373 7.25195 9.17094 7.39499C8.55611 8.79574 7.15573 9.79169 5.54167 9.79169C3.97876 9.79169 2.62588 8.88593 1.98204 7.56717"
      fill={fill}
    />
  </Svg>
);

const ExtremIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 9.00002C0 4.19054 3.89885 0.291687 8.70833 0.291687C13.5178 0.291687 17.4167 4.19054 17.4167 9.00002C17.4167 9.20998 17.3333 9.41135 17.1848 9.55981L9.26813 17.4765C8.95896 17.7856 8.4577 17.7856 8.14854 17.4765L0.231874 9.55981C0.0834075 9.41135 0 9.20998 0 9.00002ZM1.79313 7.27678C1.81832 7.2619 1.84337 7.24735 1.86827 7.23311C2.33178 6.96825 2.82606 6.76896 3.31061 6.76896C3.79515 6.76896 4.28943 6.96825 4.75294 7.23311C5.07875 7.41929 5.42879 7.66106 5.8017 7.95291C6.70161 7.20311 7.67216 6.76896 8.70833 6.76896C9.74451 6.76896 10.7151 7.20311 11.615 7.95291C11.9879 7.66106 12.3379 7.41929 12.6637 7.23311C13.1272 6.96825 13.6215 6.76896 14.1061 6.76896C14.5906 6.76896 15.0849 6.96825 15.5484 7.23311C15.5733 7.24735 15.5983 7.26191 15.6235 7.27679C14.8529 4.17433 12.0492 1.87502 8.70833 1.87502C5.36751 1.87502 2.56372 4.17433 1.79313 7.27678ZM15.4426 9.06283C15.1887 8.8725 14.9623 8.72183 14.7628 8.60783C14.3867 8.3929 14.1813 8.35229 14.1061 8.35229C14.0308 8.35229 13.8254 8.3929 13.4493 8.60783C13.1247 8.79331 12.7291 9.07584 12.2592 9.46832L10.6718 13.8336L15.4426 9.06283ZM8.70833 14.6001L10.664 9.22196C9.93872 8.5989 9.28865 8.35229 8.70833 8.35229C8.12801 8.35229 7.47795 8.5989 6.75264 9.22196L8.70833 14.6001ZM5.15745 9.46832C4.6876 9.07584 4.29196 8.79331 3.96739 8.60783C3.59125 8.3929 3.38582 8.35229 3.31061 8.35229C3.23539 8.35229 3.02996 8.3929 2.65382 8.60783C2.45433 8.72183 2.22798 8.8725 1.97406 9.06283L6.74482 13.8336L5.15745 9.46832Z"
      fill={fill}
    />
  </Svg>
);

const FitnessIcon = ({ width = 20, height = 20, fill = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.6861 3.26076C10.6861 1.73047 11.9266 0.489929 13.4569 0.489929C14.9872 0.489929 16.2278 1.73047 16.2278 3.26076C16.2278 4.79104 14.9872 6.0316 13.4569 6.0316C11.9266 6.0316 10.6861 4.79104 10.6861 3.26076ZM13.4569 2.07326C12.8011 2.07326 12.2694 2.60493 12.2694 3.26076C12.2694 3.91659 12.8011 4.44826 13.4569 4.44826C14.1128 4.44826 14.6444 3.91659 14.6444 3.26076C14.6444 2.60493 14.1128 2.07326 13.4569 2.07326ZM6.86579 4.09521C7.06245 4.02712 7.278 4.0392 7.46582 4.12884L11.8188 6.20641C12.0691 6.32589 12.2386 6.56765 12.2657 6.8437C12.2927 7.11975 12.1733 7.38982 11.9509 7.55559L8.50344 10.1255L11.9131 12.37C12.0955 12.4901 12.2202 12.6803 12.2577 12.8955C12.2952 13.1107 12.242 13.3318 12.1109 13.5065L9.34336 17.1936C9.08088 17.5432 8.58464 17.6139 8.23496 17.3514C7.88528 17.089 7.81459 16.5927 8.07707 16.2431L10.3391 13.2295L6.68952 10.827C6.4739 10.6851 6.34103 10.4469 6.33349 10.1889C6.32595 9.93083 6.4447 9.68533 6.65167 9.53104L9.95278 7.07024L7.07694 5.69766L4.21596 6.68829C3.8028 6.83135 3.35189 6.61239 3.20884 6.19923C3.06578 5.78607 3.28474 5.33516 3.6979 5.19211L6.86579 4.09521ZM17.2005 5.67388C17.4999 5.99252 17.4842 6.49353 17.1656 6.79292L14.7913 9.02384C14.5422 9.25783 14.1712 9.30563 13.871 9.14237L12.8095 8.56508C12.4254 8.3562 12.2833 7.87548 12.4922 7.49138C12.7011 7.10729 13.1818 6.96525 13.5659 7.17413L14.1244 7.47786L16.0814 5.63903C16.4001 5.33964 16.9011 5.35524 17.2005 5.67388ZM6.35501 11.1586C6.70326 11.423 6.77124 11.9196 6.50687 12.2678L5.33136 13.8163C5.26567 13.9028 5.18286 13.9749 5.0881 14.028L1.1791 16.2206C0.797763 16.4345 0.315236 16.2988 0.101342 15.9175C-0.112552 15.5361 0.0231851 15.0536 0.404519 14.8397L4.16987 12.7277L5.24577 11.3105C5.51015 10.9622 6.00677 10.8942 6.35501 11.1586Z"
      fill={fill}
    />
  </Svg>
);

// Back Icon Component
const BackIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.375 5.25L8.625 12L15.375 18.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Interest Icons
const InterestIcon = ({ name, size = 20, color = 'white' }) => {
  const iconMap = {
    // Original icons
    Photography: CameraIcon,
    Cooking: CookingIcon,
    'VDO Games': GameIcon,
    Music: MusicIcon,
    Travelling: TravellingIcon,
    Shopping: CartIcon,
    Speeches: MicIcon,
    'Art & Crafts': ArtIcon,
    Swimming: SwimIcon,
    Drinking: WineIcon,
    'Extreme': ExtremIcon,
    Fitness: FitnessIcon,
    
    // New API interests with icon mappings
    Travel: TravellingIcon,
    Sports: FitnessIcon,
    Art: ArtIcon,
    Technology: GameIcon,
    Reading: ArtIcon,
    Gaming: GameIcon,
    Movies: ArtIcon,
    Dancing: MusicIcon,
    Writing: ArtIcon,
    Gardening: ArtIcon,
    Fashion: ArtIcon,
    Business: ArtIcon,
    Education: ArtIcon,
    Health: FitnessIcon,
    Nature: ArtIcon,
    Food: CookingIcon,
  };

  const IconComponent = iconMap[name];

  if (!IconComponent || typeof IconComponent !== 'function') {
    console.warn(`Invalid icon for interest: ${name}, got type: ${typeof IconComponent}`);
    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color, fontSize: size * 0.6 }}>-</Text>
      </View>
    );
  }

  return <IconComponent width={size} height={size} fill={color} />;
};

function InterestsScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interestOptions, setInterestOptions] = useState([]);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: 'Error'
  });

  // Get access token from Redux
  const authState = useSelector((state) => state.auth);

  // Fetch interests options from catalog API on component mount
  useEffect(() => {
    const fetchInterestsOptions = async () => {
      try {
        console.log('🎯 DEBUG: Fetching interests options from catalog...');
        const result = await authAPI.getCatalog(authState.accessToken);
        
        if (result.success && result.data?.data?.interests) {
          console.log('✅ DEBUG: Interests options retrieved:', result.data.data.interests);
          setInterestOptions(result.data.data.interests);
        } else {
          console.log('❌ DEBUG: Failed to get interests options, using fallback');
          // Fallback to hardcoded options if API fails
          setInterestOptions([
            'Photography',
            'Music',
            'Travel',
            'Cooking',
            'Sports',
            'Art',
            'Technology',
            'Reading',
            'Gaming',
            'Fitness',
            'Movies',
            'Dancing',
            'Writing',
            'Gardening',
            'Fashion',
            'Business',
            'Education',
            'Health',
            'Nature',
            'Food'
          ]);
        }
      } catch (error) {
        console.error('💥 DEBUG: Exception getting interests options:', error);
        // Fallback to hardcoded options if API fails
        setInterestOptions([
          'Photography',
          'Music',
          'Travel',
          'Cooking',
          'Sports',
          'Art',
          'Technology',
          'Reading',
          'Gaming',
          'Fitness',
          'Movies',
          'Dancing',
          'Writing',
          'Gardening',
          'Fashion',
          'Business',
          'Education',
          'Health',
          'Nature',
          'Food'
        ]);
      }
    };

    // Only fetch if user is authenticated
    if (authState.isAuthenticated && authState.accessToken) {
      fetchInterestsOptions();
    } else {
      // Fallback to hardcoded options if not authenticated
      setInterestOptions([
        'Photography',
        'Music',
        'Travel',
        'Cooking',
        'Sports',
        'Art',
        'Technology',
        'Reading',
        'Gaming',
        'Fitness',
        'Movies',
        'Dancing',
        'Writing',
        'Gardening',
        'Fashion',
        'Business',
        'Education',
        'Health',
        'Nature',
        'Food'
      ]);
    }
  }, [authState.isAuthenticated, authState.accessToken]);

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const showError = (message, title = 'Error') => {
    setErrorModal({
      visible: true,
      message,
      title
    });
  };

  const hideError = () => {
    setErrorModal({
      visible: false,
      message: '',
      title: 'Error'
    });
  };

  const handleContinue = async () => {
    console.log('🚀 ===== INTERESTS UPDATE API TEST START =====');
    console.log('🎯 DEBUG: handleContinue called');
    console.log('🎯 DEBUG: Selected Interests:', selectedInterests);
    console.log('🎯 DEBUG: Auth State:', {
      isAuthenticated: authState.isAuthenticated,
      accessToken: authState.accessToken ? 'Present' : 'Missing',
      accessTokenLength: authState.accessToken?.length || 0
    });

    // Check if user is authenticated
    if (!authState.isAuthenticated || !authState.accessToken) {
      console.log('❌ DEBUG: User not authenticated or token missing');
      showError('Please login first to update profile', 'Authentication Required');
      return;
    }

    // If no interests selected, just navigate to next screen
    if (selectedInterests.length === 0) {
      console.log('🎯 DEBUG: No interests selected, navigating to next screen');
      navigation.navigate('UploadID');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🎯 DEBUG: Starting interests profile update...');
      
      // Prepare profile data with selected interests
      const profileData = {
        likes: selectedInterests, // Selected interests from UI
        interests: selectedInterests, // Same as likes for now
        preferences: {
          hereFor: '', // Will be filled in Preferences screen
          primaryLanguage: '', // Will be filled in Preferences screen
          secondaryLanguage: '' // Will be filled in Preferences screen
        },
        location: {
          city: '', // Will be filled in Location screen
          country: '', // Will be filled in Location screen
          lat: 0, // Will be filled in Location screen
          lng: 0 // Will be filled in Location screen
        }
      };
      
      console.log('🎯 DEBUG: Interests Profile Data:', JSON.stringify(profileData, null, 2));
      
      console.log('🌐 DEBUG: About to call authAPI.updateUserProfile');
      console.log('🌐 DEBUG: Parameters:', {
        profileData: profileData,
        token: authState.accessToken ? 'Present' : 'Missing'
      });
      
      // Call update profile API with token
      const result = await authAPI.updateUserProfile(profileData, authState.accessToken);
      
      console.log('📊 DEBUG: Update Profile API Response:', result);
      console.log('📊 DEBUG: Response Success:', result.success);
      console.log('📊 DEBUG: Response Data:', result.data);
      console.log('📊 DEBUG: Response Error:', result.error);
      
      if (result.success && result.data?.success) {
        console.log('✅ DEBUG: Interests profile updated successfully');
        
        // Check next step from response
        const nextStep = result.data?.data?.nextStep || result.data?.data?.profileCompletionStep;
        console.log('📊 DEBUG: Next step:', nextStep);
        
        // Navigate to appropriate next screen based on nextStep
        if (nextStep === 'preferences') {
          navigation.navigate('Preferences');
        } else if (nextStep === 'location') {
          navigation.navigate('Location');
        } else if (nextStep === 'upload_id') {
          navigation.navigate('UploadID');
        } else {
          // Default to UploadID screen if no specific next step
          console.log('📊 DEBUG: No specific next step, navigating to UploadID');
          navigation.navigate('UploadID');
        }
      } else {
        console.log('❌ DEBUG: Interests profile update failed');
        console.log('❌ DEBUG: Error:', result.error);
        console.log('❌ DEBUG: Full Error Response:', JSON.stringify(result, null, 2));
        showError(result.error || 'Failed to update interests', 'Profile Update Error');
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in handleContinue:', error);
      console.error('💥 DEBUG: Error type:', typeof error);
      console.error('💥 DEBUG: Error message:', error.message);
      console.error('💥 DEBUG: Error stack:', error.stack);
      showError(error.message || 'Failed to update interests', 'Profile Update Error');
    } finally {
      setIsLoading(false);
      console.log('🚀 ===== INTERESTS UPDATE API TEST END =====');
    }
  };

  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackIcon width={24} height={24} color="#D9D8F3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('UploadID')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Likes, Interests</Text>
        <Text style={styles.subtitle}>Share your likes & passion with others</Text>

        <View style={styles.interestsGrid}>
          {interestOptions.map((interest, index) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleInterestToggle(interest)}
                style={styles.interestItem}
                activeOpacity={1}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['#C53E8D', '#8A52F3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBorder}
                  >
                    <View style={styles.optionContainerInner}>
                      <InterestIcon name={interest} size={16} color="white" />
                      <Text style={styles.optionText} numberOfLines={1} ellipsizeMode="tail">{interest}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.optionContainer}>
                    <InterestIcon name={interest} size={16} color="#B58FDB" />
                    <Text style={[styles.optionText, styles.unselectedText]} numberOfLines={1} ellipsizeMode="tail">{interest}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title={isLoading ? "Updating..." : "Continue"}
            onPress={handleContinue}
            style={[styles.continueButton, isLoading && styles.disabledButton]}
            disabled={isLoading}
          />
        </View>
      </ScrollView>

      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        onClose={hideError}
      />
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
    fontFamily: 'Lexend-Medium',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
    fontFamily: 'Lexend-SemiBold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Lexend-Regular',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  interestItem: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 35,
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 35,
  },
  optionContainerInner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
    backgroundColor: '#03000C',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  optionContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'left',
    marginLeft: 1,
    flex: 1,
    fontFamily: 'Lexend-SemiBold',
  },
  unselectedText: {
    color: '#B58FDB',
    fontFamily: 'Lexend-SemiBold',
  },
  buttonContainer: {
    marginTop: 20,
  },
  continueButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 35,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default InterestsScreen;
