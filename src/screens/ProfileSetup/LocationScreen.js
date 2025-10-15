



// src/screens/ProfileSetup/LocationScreen.js
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Platform, Alert, PermissionsAndroid } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Geolocation from '@react-native-community/geolocation';
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

// Location Pin Icon
const LocationPinIcon = ({ width = 20, height = 20, color = '#8A2BE2' }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M17.5 8.33333C17.5 14.1667 10 19.1667 10 19.1667C10 19.1667 2.5 14.1667 2.5 8.33333C2.5 6.3442 3.29018 4.43655 4.6967 3.03003C6.10322 1.62351 8.01088 0.833333 10 0.833333C11.9891 0.833333 13.8968 1.62351 15.3033 3.03003C16.7098 4.43655 17.5 6.3442 17.5 8.33333Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 10.8333C11.3807 10.8333 12.5 9.71404 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71404 8.61929 10.8333 10 10.8333Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Search Icon
const SearchIcon = ({ width = 20, height = 20, color = '#8A2BE2' }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.5 17.5L13.875 13.875"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function LocationScreen({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState('Maple Green, Florida, US');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check if permission is already granted
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        console.log('Location permission already granted:', hasPermission);
        
        if (hasPermission) {
          return true;
        }

        console.log('Requesting location permission...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Vibgyor needs access to your location to provide personalized services and connect you with people nearby',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Location permission result:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Location permission error:', err);
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to get your current location. Please enable location permission in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => {
            // For Android, we can't directly open settings, but we can show a message
            Alert.alert(
              'Enable Location',
              'Please go to Settings > Apps > Vibgyor > Permissions > Location and enable location access.',
              [{ text: 'OK' }]
            );
          }}
        ]
      );
      setIsGettingLocation(false);
      return;
    }

    // Try high accuracy first
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('🎯 HIGH ACCURACY LOCATION SUCCESS:');
        console.log('📍 Full position object:', JSON.stringify(position, null, 2));
        console.log('📍 Coordinates:', position.coords);
        console.log('📍 Latitude:', position.coords.latitude);
        console.log('📍 Longitude:', position.coords.longitude);
        console.log('📍 Accuracy:', position.coords.accuracy, 'meters');
        console.log('📍 Timestamp:', new Date(position.timestamp));
        
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.log('High accuracy location error:', error);
        
        // Try with lower accuracy as fallback
        Geolocation.getCurrentPosition(
          (position) => {
            console.log('🎯 FALLBACK LOCATION SUCCESS:');
            console.log('📍 Full position object:', JSON.stringify(position, null, 2));
            console.log('📍 Coordinates:', position.coords);
            console.log('📍 Latitude:', position.coords.latitude);
            console.log('📍 Longitude:', position.coords.longitude);
            console.log('📍 Accuracy:', position.coords.accuracy, 'meters');
            
            const { latitude, longitude } = position.coords;
            reverseGeocode(latitude, longitude);
          },
          (fallbackError) => {
            console.log('Fallback location error:', fallbackError);
            
            // Try to get last known position
            Geolocation.getLastKnownPosition(
              (lastPosition) => {
                console.log('Last known position:', lastPosition);
                const { latitude, longitude } = lastPosition.coords;
                reverseGeocode(latitude, longitude);
              },
              (lastError) => {
                console.log('Last known position error:', lastError);
                Alert.alert(
                  'Location Error',
                  'Unable to get your current location. Please check your GPS settings and try again, or search manually.',
                  [
                    { text: 'Try Again', onPress: () => getCurrentLocation() },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
                setIsGettingLocation(false);
              }
            );
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute
      }
    );
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      console.log('🔍 DEBUGGING LOCATION ISSUE:');
      console.log('📍 Raw Coordinates:', { latitude, longitude });
      console.log('📍 Coordinates (rounded):', { 
        lat: latitude.toFixed(6), 
        lng: longitude.toFixed(6) 
      });
      
      // Check if coordinates are valid
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('❌ Invalid coordinates detected!');
        setCurrentLocation('Invalid coordinates');
        setIsGettingLocation(false);
        return;
      }
      
      console.log('🌐 Making API call to OpenStreetMap Nominatim...');
      
      // Using OpenStreetMap Nominatim API - more accurate for Indian locations
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'VibgyorApp/1.0',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🗺️ FULL API RESPONSE:', JSON.stringify(data, null, 2));
      
      // Debug specific fields
      console.log('🏙️ City:', data.address?.city || data.address?.town || data.address?.village);
      console.log('🏛️ State:', data.address?.state);
      console.log('🌍 Country:', data.address?.country);
      console.log('📍 Full Address:', data.display_name);
      console.log('🏠 House Number:', data.address?.house_number);
      console.log('🏠 House Name:', data.address?.house_name);
      console.log('🛣️ Road:', data.address?.road);
      console.log('🛣️ Street:', data.address?.street);
      console.log('🏘️ Suburb:', data.address?.suburb);
      console.log('🏘️ Neighbourhood:', data.address?.neighbourhood);
      console.log('🏘️ Quarter:', data.address?.quarter);
      console.log('🏘️ Hamlet:', data.address?.hamlet);
      console.log('🏘️ Village:', data.address?.village);
      console.log('🏘️ Town:', data.address?.town);
      console.log('🏘️ City District:', data.address?.city_district);
      console.log('🏘️ County:', data.address?.county);
      console.log('🏘️ State District:', data.address?.state_district);
      console.log('🏘️ Postcode:', data.address?.postcode);
      
      // Build detailed location string with more specific address components
      let locationString = '';
      
      if (data.address) {
        // Try to get the most detailed address possible
        const houseNumber = data.address.house_number || data.address.house_name;
        const road = data.address.road || data.address.street;
        const suburb = data.address.suburb || data.address.neighbourhood;
        const city = data.address.city || data.address.town || data.address.village;
        const state = data.address.state;
        const country = data.address.country;
        
        console.log('🏠 House Number:', houseNumber);
        console.log('🛣️ Road:', road);
        console.log('🏘️ Suburb:', suburb);
        console.log('🏙️ City:', city);
        console.log('🏛️ State:', state);
        
        // Build detailed address starting from most specific to general
        const addressParts = [];
        
        // Add house number if available
        if (houseNumber) {
          addressParts.push(houseNumber);
        }
        
        // Add road/street if available
        if (road) {
          addressParts.push(road);
        }
        
        // Add suburb/neighbourhood if available
        if (suburb) {
          addressParts.push(suburb);
        }
        
        // Add city if available
        if (city) {
          addressParts.push(city);
        }
        
        // Add state if available
        if (state) {
          addressParts.push(state);
        }
        
        // Add country if available
        if (country) {
          addressParts.push(country);
        }
        
        if (addressParts.length > 0) {
          locationString = addressParts.join(', ');
        } else {
          // Fallback to display_name if no specific address components
          locationString = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }
      } else {
        locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
      
      setCurrentLocation(locationString);
      console.log('✅ Location set to:', locationString);
      
    } catch (error) {
      console.log('❌ Reverse geocoding error:', error);
      
      // Try fallback API if Nominatim fails
      try {
        console.log('🔄 Trying fallback API (Google Geocoding)...');
        const fallbackResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('🗺️ FALLBACK API RESPONSE:', JSON.stringify(fallbackData, null, 2));
          
          if (fallbackData.results && fallbackData.results.length > 0) {
            const result = fallbackData.results[0];
            const locationString = result.formatted_address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setCurrentLocation(locationString);
            console.log('✅ Fallback location set to:', locationString);
          } else {
            setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            console.log('✅ Location set to coordinates (fallback):', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } else {
          setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          console.log('✅ Location set to coordinates (error fallback):', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch (fallbackError) {
        console.log('❌ Fallback API also failed:', fallbackError);
        setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        console.log('✅ Location set to coordinates (final fallback):', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    }
    setIsGettingLocation(false);
  };

  const handleLocationSearch = () => {
    if (searchQuery.trim()) {
      setCurrentLocation(searchQuery);
      setSearchQuery('');
    }
  };


  const handleContinue = () => {
    if (!currentLocation) {
      alert('Please set your location');
      return;
    }
    navigation.navigate('Preferences');
  };

  return (
     <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#1a0033" />

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

        <Text style={styles.title}>Location</Text>

        <View style={styles.contentContainer}>
          <Text style={styles.description}>
            We use your location to provide personalized services and connect you with people nearby.
          </Text>

          <View style={styles.currentLocationContainer}>
            <Text style={styles.label}>Current Location</Text>
            <TouchableOpacity
              onPress={getCurrentLocation}
              activeOpacity={0.8}
              disabled={isGettingLocation}
            >
              <LinearGradient
                colors={['#DD3562', '#8354FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.locationGradientBorder}
              >
                <View style={styles.locationDisplayInner}>
                  <LocationPinIcon width={20} height={20} color="#8A2BE2" />
                  <Text style={styles.locationText}>
                    {isGettingLocation ? 'Getting location...' : currentLocation}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
          </View>

          <View style={styles.searchContainer}>

            <LinearGradient
              colors={['#DD3562', '#8354FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.searchInputGradient}
            >
              <View style={styles.searchInputWrapper}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search New Location"
                  placeholderTextColor="#666"
                  onSubmitEditing={handleLocationSearch}
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleLocationSearch}
                >
                  <SearchIcon width={20} height={20} color="#8A2BE2" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

        
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  contentContainer: {
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  locationGradientBorder: {
    borderRadius: 30,
    padding: 2,
    
  },
  locationDisplayInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0033', 
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent', 
    
  },
  locationDisplayInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0033', // match your background
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent', // disables inner border, gradient shows as border
  },

  currentLocationContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DA489E',
    marginBottom: 12,

  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 12,
    flex: 1,
  },
  searchContainer: {
    marginBottom: 30,
  },
  searchInputGradient: {
    borderRadius: 30,
    padding: 2, // Border thickness
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 14,
  },
  searchButton: {
    padding: 8,
    marginLeft: 8,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  suggestionText: {
    fontSize: 14,
    color: 'white',
  },
  buttonContainer: {
    marginTop: -10,
  },
  continueButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 35,
  },
});

export default LocationScreen;
