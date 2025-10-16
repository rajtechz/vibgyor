import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackground from '../../components/common/CommonBackground';
import CustomButton from '../../components/common/CustomButton';

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

// Dropdown Arrow Icon
const DropdownArrow = ({ width = 20, height = 20, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M5 7.5L10 12.5L15 7.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function PreferencesScreen({ navigation }) {
  const [hereFor, setHereFor] = useState('Serious Relationship');
  const [primaryLanguage, setPrimaryLanguage] = useState('English');
  const [secondaryLanguage, setSecondaryLanguage] = useState('Secondary Language');

  const handleContinue = () => {
    console.log('Continue pressed from Preferences');
    navigation.navigate('SwitchProfiles');
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#1a0033" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Preferences</Text>

        {/* Description */}
        <Text style={styles.description}>
          Manage and set your preferences to find the best matches for you, keep enjoying!
        </Text>

        {/* Here For Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Here For</Text>
          <LinearGradient
            colors={['#C53E8D', '#8A52F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <TouchableOpacity style={styles.dropdownContainer}>
              <Text style={styles.dropdownText}>{hereFor}</Text>
              <DropdownArrow width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Your Language Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Your Language</Text>
          
          {/* Primary Language */}
          <LinearGradient
            colors={['#C53E8D', '#8A52F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <TouchableOpacity style={styles.dropdownContainer}>
              <Text style={styles.dropdownText}>{primaryLanguage}</Text>
              <DropdownArrow width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Secondary Language */}
          <View style={styles.secondaryLanguageContainer}>
          <LinearGradient
            colors={['#C53E8D', '#8A52F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <TouchableOpacity style={styles.secondaryDropdownContainer}>
              <Text style={styles.secondaryDropdownText}>{secondaryLanguage}</Text>
              <DropdownArrow width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>
          </View>
        </View>

        {/* Continue Button */}
        <CustomButton
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </ScrollView>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    fontFamily: 'Lexend-SemiBold',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF80',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
    fontFamily: 'Lexend-Regular',
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DA489E',
    marginBottom: 12,
  },
  gradientBorder: {
    borderRadius: 30,
    padding: 2,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#03000C',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    height: 48,
  },
  dropdownText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  secondaryDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#03000C',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    height: 48,
  },
  secondaryDropdownText: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  secondaryLanguageContainer: {
    marginTop: 12,
  },
  continueButton: {
    marginTop: 100,
    alignSelf: 'center',
    width: '80%',
    maxWidth: 300,
  },
});

export default PreferencesScreen;
