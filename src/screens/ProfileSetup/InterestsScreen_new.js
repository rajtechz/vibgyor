import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import CustomButton from '../../components/common/CustomButton';
// Import icon components
import CameraIcon from '../../components/interestIcons/CameraIcon';
import CookingIcon from '../../components/interestIcons/CookingIcon';
import GameIcon from '../../components/interestIcons/GameIcon';
import MusicIcon from '../../components/interestIcons/MusicIcon';
import TravellingIcon from '../../components/interestIcons/TravellingIcon';
import CartIcon from '../../components/interestIcons/CartIcon';
import MicIcon from '../../components/interestIcons/MicIcon';
import ArtIcon from '../../components/interestIcons/ArtIcon';
import SwimIcon from '../../components/interestIcons/SwimIcon';
import WineIcon from '../../components/interestIcons/WineIcon';
import ExtremIcon from '../../components/interestIcons/ExtremIcon';
import FitnessIcon from '../../components/interestIcons/FitnessIcon';

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

  const interestOptions = [
    'Photography',
    'Cooking',
    'VDO Games',
    'Music',
    'Travelling',
    'Shopping',
    'Speeches',
    'Art & Crafts',
    'Swimming',
    'Drinking',
    'Extreme',
    'Fitness',
  ];

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleContinue = () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }
    navigation.navigate('UploadID');
  };

  return (
    <LinearGradient
      colors={['#1a0033', '#0d001a']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a0033" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon width={24} height={24} color="#D9D8F3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Interests</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>What are your interests?</Text>
          <Text style={styles.subtitle}>
            Select all that apply to help us find better matches for you
          </Text>

          {/* Interest Options */}
          <View style={styles.interestsContainer}>
            {interestOptions.map((interest, index) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.interestItem}
                  onPress={() => handleInterestToggle(interest)}
                  activeOpacity={0.7}
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
                      <Text style={styles.optionText} numberOfLines={1} ellipsizeMode="tail">{interest}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const { width } = require('react-native').Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  interestItem: {
    width: (width - 60) / 2,
    marginBottom: 12,
  },
  gradientBorder: {
    borderRadius: 35,
    padding: 1,
  },
  optionContainerInner: {
    backgroundColor: 'transparent',
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  optionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 1,
    flex: 1,
    textAlign: 'left',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#8A52F3',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InterestsScreen;
