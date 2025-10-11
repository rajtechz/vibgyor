import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

// Back Icon Component
const BackIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18l-6-6 6-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Refresh Icon Component
const RefreshIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 3v5h-5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 21v-5h5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

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

// Improved Range Slider Component
const RangeSlider = ({ value, onValueChange, min = 0, max = 50, step = 1 }) => {
  const sliderWidth = screenWidth - 80;
  const thumbSize = 24;
  const pan = useRef(new Animated.Value(0)).current;
  const [currentValue, setCurrentValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize thumb position
  React.useEffect(() => {
    const initialPosition = ((value - min) / (max - min)) * (sliderWidth - thumbSize);
    pan.setValue(initialPosition);
    setCurrentValue(value);
  }, [value, min, max, sliderWidth, thumbSize]);

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: pan } }],
    { useNativeDriver: false }
  );

  const handleGestureStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
    } else if (nativeEvent.state === State.ACTIVE) {
      const translationX = nativeEvent.translationX;
      const currentPosition = ((currentValue - min) / (max - min)) * (sliderWidth - thumbSize);
      const newPosition = Math.max(0, Math.min(sliderWidth - thumbSize, currentPosition + translationX));
      const newValue = Math.round((newPosition / (sliderWidth - thumbSize)) * (max - min) / step) * step + min;
      
      setCurrentValue(newValue);
      onValueChange(newValue);
    } else if (nativeEvent.state === State.END) {
      setIsDragging(false);
      const newPosition = ((currentValue - min) / (max - min)) * (sliderWidth - thumbSize);
      Animated.spring(pan, {
        toValue: newPosition,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }).start();
    }
  };

  const getProgressColors = () => {
    const progress = (currentValue - min) / (max - min);
    if (progress <= 0.25) {
      return ['#DD3562', '#FF6B6B']; // Red to Light Red
    } else if (progress <= 0.5) {
      return ['#FF6B6B', '#FFA500']; // Light Red to Orange
    } else if (progress <= 0.75) {
      return ['#FFA500', '#4A90E2']; // Orange to Blue
    } else {
      return ['#4A90E2', '#00D4AA']; // Blue to Teal
    }
  };

  return (
    <View style={styles.rangeSliderContainer}>
      <View style={[styles.rangeSliderTrack, { width: sliderWidth }]}>
        <LinearGradient
          colors={getProgressColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.rangeSliderActiveTrack,
            { width: ((currentValue - min) / (max - min)) * (sliderWidth - thumbSize) }
          ]}
        />
        <View style={[styles.rangeSliderInactiveTrack, { width: sliderWidth }]} />
      </View>
      
      <PanGestureHandler
        onGestureEvent={handleGesture}
        onHandlerStateChange={handleGestureStateChange}
        minDist={0}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View
          style={[
            styles.rangeSliderThumb,
            {
              transform: [{ translateX: pan }],
            }
          ]}
        >
          <LinearGradient
            colors={getProgressColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rangeSliderThumbGradient}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const FilterOptionsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [filters, setFilters] = useState({
    hereTo: 'Make New Friends',
    wantToMeet: 'Woman',
    ageRange: '20 - 35',
    languages: 'English, French, Bengali',
    location: 'Florida, US',
    distanceRange: 10,
  });

  const handleReset = () => {
    setFilters({
      hereTo: 'Make New Friends',
      wantToMeet: 'Woman',
      ageRange: '20 - 35',
      languages: 'English, French, Bengali',
      location: 'Florida, US',
      distanceRange: 10,
    });
  };

  const handleApply = () => {
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

  const DistanceRangeFilter = ({ label, value, onValueChange }) => (
    <View style={styles.filterItem}>
      <Text style={styles.filterLabel}>{label}</Text>
      <Text style={styles.distanceValue}>0 - {value} km</Text>
      <RangeSlider
        value={value}
        onValueChange={(newValue) => {
          onValueChange(newValue);
        }}
        min={0}
        max={50}
        step={1}
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
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
          {/* Title Section */}
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
            
            <DistanceRangeFilter
              label="Distance Range"
              value={filters.distanceRange}
              onValueChange={(value) => setFilters({...filters, distanceRange: value})}
            />
          </View>

          {/* Apply Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <LinearGradient
                colors={['#DD3562', '#8354FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140034',
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterItem: {
    marginBottom: 25,
  },
  filterLabel: {
    fontSize: 16,
    color: '#DD3562',
    marginBottom: 10,
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
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    marginBottom: 20,
  },
  applyButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  distanceValue: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '500',
  },
  rangeSliderContainer: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  rangeSliderTrack: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
  },
  rangeSliderActiveTrack: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  rangeSliderInactiveTrack: {
    height: 6,
    backgroundColor: '#2A1A4A',
    borderRadius: 3,
    position: 'absolute',
    top: 0,
  },
  rangeSliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: 9,
    shadowColor: '#DD3562',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  rangeSliderThumbGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DD3562',
  },
});

export default FilterOptionsScreen;