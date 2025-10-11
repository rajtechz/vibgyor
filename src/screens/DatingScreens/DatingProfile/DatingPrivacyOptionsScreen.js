import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import CommonBackground from '../../../components/common/CommonBackground';
import { colors } from '../../../styles/colors';
import { fonts } from '../../../styles/typography';

const { width: screenWidth } = Dimensions.get('window');

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

// Custom Toggle Switch Component
const ToggleSwitch = ({ isOn, onToggle, disabled = false }) => {
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      style={[styles.toggleContainer, disabled && styles.toggleDisabled]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={isOn ? ['#DD3562', '#8354FF'] : ['#2A2A2A', '#1A1A1A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.toggleTrack}
      >
        <Animated.View
          style={[
            styles.toggleThumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Privacy Option Component
const PrivacyOption = ({ title, description, isEnabled, onToggle, disabled = false }) => (
  <View style={styles.privacyOption}>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      {description && <Text style={styles.optionDescription}>{description}</Text>}
    </View>
    <ToggleSwitch
      isOn={isEnabled}
      onToggle={onToggle}
      disabled={disabled}
    />
  </View>
);

const DatingPrivacyOptionsScreen = () => {
  const navigation = useNavigation();
  
  const [privacySettings, setPrivacySettings] = useState({
    makeAccountPrivate: true,
    likesVisibility: true,
    commenting: true,
  });

  const handleToggle = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const privacyOptions = [
    {
      id: 'makeAccountPrivate',
      title: 'Make Your Account Private',
      description: 'This will make you data visible, Only for you followers and for you following',
      isEnabled: privacySettings.makeAccountPrivate,
      onToggle: () => handleToggle('makeAccountPrivate'),
    },
    {
      id: 'likesVisibility',
      title: 'Likes Visibility',
      description: null,
      isEnabled: privacySettings.likesVisibility,
      onToggle: () => handleToggle('likesVisibility'),
    },
    {
      id: 'commenting',
      title: 'Commenting',
      description: null,
      isEnabled: privacySettings.commenting,
      onToggle: () => handleToggle('commenting'),
    },
  ];

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon width={24} height={24} color="#D9D8F3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Options</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Privacy Options */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsContainer}>
            {privacyOptions.map((option) => (
              <PrivacyOption
                key={option.id}
                title={option.title}
                description={option.description}
                isEnabled={option.isEnabled}
                onToggle={option.onToggle}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </CommonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#DD3562',
    fontFamily: fonts.primary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginTop: 20,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(52, 52, 74, 0.3)',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(183, 131, 235, 0.2)',
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: fonts.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    fontFamily: fonts.primary,
    lineHeight: 20,
  },
  toggleContainer: {
    width: 50,
    height: 30,
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
export default DatingPrivacyOptionsScreen;

