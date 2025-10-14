// src/screens/Profile/VerificationScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';
import Svg, { Path } from 'react-native-svg';

// Person Icon Component
const PersonIcon = ({ width = 24, height = 24, color = '#B783EB' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Arrow Right Icon Component
const ArrowRightIcon = ({ width = 16, height = 16, color = '#B783EB' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function VerificationScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleAadharVerification = () => {
    console.log('Aadhar Verification pressed');
    // Navigate to Aadhar verification screen
    // navigation.navigate('AadharVerification');
  };

  const handleOtherVerification = () => {
    console.log('Other Verification pressed');
    // Navigate to other verification screen
    // navigation.navigate('OtherVerification');
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19L5 12L12 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.container}>
        {/* Verification Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleAadharVerification}
            activeOpacity={0.7}
          >
            <PersonIcon width={24} height={24} color="#B783EB" />
            <Text style={styles.optionText}>Aadhar Verification</Text>
            <ArrowRightIcon width={16} height={16} color="#B783EB" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleOtherVerification}
            activeOpacity={0.7}
          >
            <PersonIcon width={24} height={24} color="#B783EB" />
            <Text style={styles.optionText}>Other Verification</Text>
            <ArrowRightIcon width={16} height={16} color="#B783EB" />
          </TouchableOpacity>
        </View>
      </View>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#140034',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DD3562',
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginLeft: 16,
  },
});

export default VerificationScreen;
