import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import CustomButton from '../../components/common/CustomButton';
import CommonBackground from '../../components/common/CommonBackground';

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

// Clock Icon Component
const ClockIcon = ({ width = 16, height = 16 }) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 1.33333C4.32 1.33333 1.33333 4.32 1.33333 8C1.33333 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33333 8 1.33333ZM8 13.3333C5.05333 13.3333 2.66667 10.9467 2.66667 8C2.66667 5.05333 5.05333 2.66667 8 2.66667C10.9467 2.66667 13.3333 5.05333 13.3333 8C13.3333 10.9467 10.9467 13.3333 8 13.3333ZM8.66667 4.66667H7.33333V8.66667L10.6667 10.6667L11.3333 9.66667L8.66667 8V4.66667Z"
      fill="url(#clockGradient)"
    />
    <Defs>
      <SvgLinearGradient id="clockGradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

// App Icon Component - Using complete icon as-is
const AppIcon = ({ width = 80, height = 80 }) => (
  <Svg width={width} height={height} viewBox="0 0 52 52" fill="none">
    <Rect width="52" height="52" rx="14" fill="url(#paint0_linear_63_1936)"/>
    <Path 
      d="M34.7191 15.4933L27.3858 12.7466C26.6258 12.4666 25.3858 12.4666 24.6258 12.7466L17.2924 15.4933C15.8791 16.0266 14.7324 17.68 14.7324 19.1866V29.9866C14.7324 31.0666 15.4391 32.4933 16.3058 33.1333L23.6391 38.6133C24.9324 39.5866 27.0524 39.5866 28.3458 38.6133L35.6791 33.1333C36.5458 32.48 37.2524 31.0666 37.2524 29.9866V19.1866C37.2658 17.68 36.1191 16.0266 34.7191 15.4933ZM30.6391 22.96L24.9058 28.6933C24.7058 28.8933 24.4524 28.9866 24.1991 28.9866C23.9458 28.9866 23.6924 28.8933 23.4924 28.6933L21.3591 26.5333C20.9724 26.1466 20.9724 25.5066 21.3591 25.12C21.7458 24.7333 22.3858 24.7333 22.7724 25.12L24.2124 26.56L29.2391 21.5333C29.6258 21.1466 30.2658 21.1466 30.6524 21.5333C31.0391 21.92 31.0391 22.5733 30.6391 22.96Z" 
      fill="#0D0D0D"
    />
    <Defs>
      <SvgLinearGradient id="paint0_linear_63_1936" x1="-11.5" y1="-3.90844e-06" x2="12.8629" y2="75.1132" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

// OTP Input Component with proper gradient border
const OTPInput = ({ value, onChangeText, onKeyPress, inputRef, isFilled }) => (
  <View style={styles.otpInputContainer}>
    <LinearGradient
      colors={['#8A2BE2', '#C53E8D']}
      style={styles.otpGradientBorder}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
    >
      <View style={styles.otpInputInner}>
        <TextInput
          ref={inputRef}
          style={[
            styles.otpInput,
            isFilled && styles.otpInputFilled
          ]}
          value={value}
          onChangeText={onChangeText}
          onKeyPress={onKeyPress}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
          returnKeyType="next"
        />
      </View>
    </LinearGradient>
  </View>
);

function VerifyNumberScreen({ navigation }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const inputRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    // Only allow single digit or empty string
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input when a digit is entered
    if (text && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 50); // Small delay for smoother transition
    }
    // Move to previous input when clearing
    else if (!text && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 50); // Small delay for smoother transition
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }, index) => {
    // Handle backspace for smooth navigation
    if (key === 'Backspace' && index > 0) {
      const newOtp = [...otp];
      // Clear current input if it has a value, otherwise move to previous
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleResendOtp = () => {
    if (!isTimerActive) {
      setTimer(45); // 45 seconds timer
      setIsTimerActive(true);
      // Here you can add your resend OTP logic
      console.log('Resending OTP...');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>
        
        {/* App Icon */}
        <View style={styles.appIconContainer}>
          <AppIcon width={50} height={50} />
        </View>
        
        <Text style={styles.title}>Verify Email OTP</Text>
        <Text style={styles.subtitle}>Please enter the 6-digit   sent to your Email</Text>
        
        <View style={styles.otpContainer}> 
          {otp.map((digit, index) => (
            <OTPInput
              key={index}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              inputRef={(ref) => (inputRefs.current[index] = ref)}
              isFilled={!!digit}
            />
          ))}
        </View>
        
        <CustomButton
          title="Submit"
          onPress={() => navigation.navigate('VerifySuccess')}
          style={styles.submitButton}
        />
        
        <TouchableOpacity 
          style={styles.resendButton}
          onPress={handleResendOtp}
          disabled={isTimerActive}
        >
          <View style={styles.resendContainer}>
            <MaskedView
              maskElement={
                <Text style={[styles.resendText, { backgroundColor: 'transparent' }]}>
                  Resend OTP
                </Text>
              }
            >
              <LinearGradient
                colors={['#DD3562', '#8354FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 30, width: 140 }}
              >
                <Text style={[styles.resendText, { opacity: 0 }]}>
                  Resend OTP 
                </Text>
              </LinearGradient>
            </MaskedView>
            
            {isTimerActive && (
              <View style={styles.timerContainer}>
                <MaskedView
                  maskElement={
                    <ClockIcon width={16} height={16} />
                  }
                >
                  <LinearGradient
                    colors={['#DD3562', '#8354FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 16, width: 16 }}
                  >
                    <View style={{ height: 16, width: 16 }} />
                  </LinearGradient>
                </MaskedView>
                <MaskedView
                  maskElement={
                    <Text style={[styles.timerText, { backgroundColor: 'transparent' }]}>
                      {formatTime(timer)}
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={['#DD3562', '#8354FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 20, width: 50 }}
                  >
                    <Text style={[styles.timerText, { opacity: 0 }]}>
                      {formatTime(timer)}
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  appIconContainer: {
    bottom:15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    bottom:5,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    // marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {

    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
    maxWidth: 280,
    flexWrap: 'wrap',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
    paddingHorizontal: 10,
  },
  otpInputContainer: {
    position: 'relative',
  },
  otpGradientBorder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    padding: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInputInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#01010D',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // This prevents any visual artifacts
  },
  otpInput: {
    width: 42,
    height: 42,
    borderRadius: 21,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
    borderWidth: 0, // Ensure no border
    outline: 'none', // For web compatibility
  },
  otpInputFilled: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  submitButton: {
    width: 212,
    marginBottom: 25,
  },
  resendButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  resendContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 22, 
    fontWeight: '600',
    textAlign: 'center',
    color: '#DD3562', 
    letterSpacing: 0.5,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
    color: '#DD3562', 
  },
  timerText: {
 bottom:2,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#DD3562',
    letterSpacing: 0.5,
  },
});

export default VerifyNumberScreen;