import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, gradients } from '../../../styles/colors';
import { fonts } from '../../../styles/typography';
import { BackIcon } from '../../../components/icons/SvgIcons';
import { RefreshIcon } from '../../../components/icons/chatIcons';
import CustomButton from '../../../components/common/CustomButton';
import CommonBackground from '../../../components/common/CommonBackground';

const { width: screenWidth } = Dimensions.get('window');



// Dropdown Arrow Icon
const DropdownIcon = ({ width = 16, height = 16, color = '#B0B0B0' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Location Pin Icon
const LocationIcon = ({ width = 16, height = 16, color = '#B0B0B0' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

// Gradient Border Component for Input Fields
const InputGradientBorder = ({ children, style }) => (
  <LinearGradient
    colors={['#DD3562', '#8354FF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[styles.inputGradientBorder, style]}
  >
    <View style={styles.inputWrapper}>
      {children}
    </View>
  </LinearGradient>
);

const FilterOptionsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [filters, setFilters] = useState({
    hereTo: 'Make New Friends',
    wantToMeet: 'Woman',
    ageRange: '20 - 35',
    languages: 'English, French, Bengali',
    location: 'Florida, US',
    distanceRange: '0 - 10 km',
  });

  const handleReset = () => {
    setFilters({
      hereTo: 'Make New Friends',
      wantToMeet: 'Woman',
      ageRange: '20 - 35',
      languages: 'English, French, Bengali',
      location: 'Florida, US',
      distanceRange: '0 - 10 km',
    });
  };

  const handleApply = () => {
    // Apply filters logic here
    navigation.goBack();
  };

  const FilterInput = ({ label, value, icon, onPress }) => (
    <View style={styles.filterItem}>
      <Text style={styles.filterLabel}>{label}</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <InputGradientBorder>
          <Text style={styles.filterValue}>{value}</Text>
          {icon}
        </InputGradientBorder>
      </TouchableOpacity>
    </View>
  );

  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <RefreshIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Section - Now inside ScrollView */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Filter Options</Text>
          <Text style={styles.description}>
            Manage and set your preferences to find the best matches for you, keep enjoying!
          </Text>
        </View>
        <View style={styles.filtersContainer}>
          <FilterInput
            label="Here to"
            value={filters.hereTo}
            icon={<DropdownIcon width={16} height={16} />}
            onPress={() => {/* Handle dropdown */}}
          />
          
          <FilterInput
            label="Want to Meet"
            value={filters.wantToMeet}
            icon={<DropdownIcon width={16} height={16} />}
            onPress={() => {/* Handle dropdown */}}
          />
          
          <FilterInput
            label="Preferred Age Range"
            value={filters.ageRange}
            icon={<DropdownIcon width={16} height={16} />}
            onPress={() => {/* Handle dropdown */}}
          />
          
          <FilterInput
            label="Preferred Language(s)"
            value={filters.languages}
            icon={<DropdownIcon width={16} height={16} />}
            onPress={() => {/* Handle dropdown */}}
          />
          
          <FilterInput
            label="Location"
            value={filters.location}
            icon={<LocationIcon width={16} height={16} />}
            onPress={() => {/* Handle location picker */}}
          />
          
          <FilterInput
            label="Distance Range"
            value={filters.distanceRange}
            icon={<DropdownIcon width={16} height={16} />}
            onPress={() => {/* Handle dropdown */}}
          />
        </View>

        {/* Apply Button - Now inside ScrollView */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Apply Filters"
            onPress={handleApply}
            gradient="button"
          />
        </View>
      </ScrollView>
    </CommonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  resetButton: {
    padding: 8,
  },
  titleSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    fontFamily: fonts.primary,
  },
  description: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
    fontFamily: fonts.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filtersContainer: {
    paddingBottom: 20,
  },
  filterItem: {
    marginBottom: 25,
  },
  filterLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    fontFamily: fonts.primary,
    fontWeight: '500',
  },
  inputGradientBorder: {
    borderRadius: 30,
    padding: 1.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#03000C',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  filterValue: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.primary,
  },
  buttonContainer: {
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    marginBottom: 20,
  },
});

export default FilterOptionsScreen;
