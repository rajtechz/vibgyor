import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import CustomButton from '../../components/common/CustomButton';
import Video from 'react-native-video';
import Svg, { Path } from 'react-native-svg';
import { setProfileSetupStatus } from '../../utils/authUtils';
import CommonBackground from '../../components/common/CommonBackground';
import { fonts } from '../../styles/typography';

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

function SwitchProfilesScreen({ navigation }) {
  const handleGoToHome = async () => {
    // Don't set profile setup completion flag to always start fresh
    // await setProfileSetupStatus(true);
    
    // Navigate to main app
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#1a0033" />

      {/* Top Section: Back Icon, Title & Description */}
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>
        <Text style={styles.title}>Switch Profiles</Text>
        <Text style={styles.description}>
          Switch between your profiles effortlessly to access personalized features.
        </Text>
      </View>

      {/* Middle Section: Video */}
      <View style={styles.middleSection}>
        <Video
          source={require('../../assets/render.mp4')}
          style={styles.video}
          controls={false}
          repeat={true}
          muted={true}
          resizeMode="cover"
        />
      </View>

      {/* Bottom Section: Button */}
      <View style={styles.bottomSection}>
        <CustomButton
          title="Go to Home"
          onPress={handleGoToHome}
          style={styles.continueButton}
        />
      </View>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    padding: 8,
    zIndex: 2,
  },
  middleSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    marginVertical: 0,
  },
  video: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    marginVertical: 0,
    paddingVertical: 0,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.weights.regular,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
  },
  continueButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 35,
  },
});

export default SwitchProfilesScreen;
