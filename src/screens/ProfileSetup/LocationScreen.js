

// src/screens/ProfileSetup/LocationScreen.js
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Platform, Alert, PermissionsAndroid, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Geolocation from '@react-native-community/geolocation';
import CustomButton from '../../components/common/CustomButton';
import ErrorModal from '../../components/common/ErrorModal';
import { authAPI } from '../../api/authAPI';
import { useSelector } from 'react-redux';

     
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

// Location Pin Icon (using the custom SVG)
const LocationPinIcon = ({ width = 23, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 23 24" fill="none">
    <Path d="M0 11.5H23V13.5H0V11.5Z" fill={color}/>
    <Path d="M11.5 0V24H13.5V0H11.5Z" fill={color}/>
    <Path d="M11.5 4.5C15.6421 4.5 19 7.85786 19 12C19 16.1421 15.6421 19.5 11.5 19.5C7.35786 19.5 4 16.1421 4 12C4 7.85786 7.35786 4.5 11.5 4.5Z" fill="#03000C" stroke={color} strokeWidth="2"/>
    <Path d="M11.5 9.5C12.3284 9.5 13 10.1716 13 11C13 11.8284 12.3284 12.5 11.5 12.5C10.6716 12.5 10 11.8284 10 11C10 10.1716 10.6716 9.5 11.5 9.5Z" fill={color}/>
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
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState({
    city: '',
    country: '',
    lat: 0,
    lng: 0
  });
  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: 'Error'
  });

  // Get access token from Redux
  const authState = useSelector((state) => state.auth);

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
            
            // Show error alert when both high accuracy and fallback fail
            Alert.alert(
              'Location Error',
              'Unable to get your current location. Please check your GPS settings and try again, or search manually.',
              [
                { text: 'Try Again', onPress: () => getCurrentLocation() },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
            setIsGettingLocation(false);
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
      
      // Extract and store location data for API
      const city = data.address?.city || data.address?.town || data.address?.village || '';
      const country = data.address?.country || '';
      
      setLocationData({
        city: city,
        country: country,
        lat: latitude,
        lng: longitude
      });
      
      console.log('📍 Location Data for API:', {
        city: city,
        country: country,
        lat: latitude,
        lng: longitude
      });
      
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


  const handleContinue = async () => {
    console.log('🚀 ===== LOCATION UPDATE API TEST START =====');
    console.log('📍 DEBUG: handleContinue called');
    console.log('📍 DEBUG: Current Location:', currentLocation);
    console.log('📍 DEBUG: Location Data:', locationData);
    console.log('📍 DEBUG: Auth State:', {
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

    // Validate location data
    if (!currentLocation || !locationData.city || !locationData.country) {
      console.log('❌ DEBUG: Missing location data');
      showError('Please set your location first', 'Location Required');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📍 DEBUG: Starting location profile update...');
      
      // Prepare profile data with location information
      const profileData = {
        location: {
          city: locationData.city,
          country: locationData.country,
          lat: locationData.lat,
          lng: locationData.lng
        }
      };
      
      console.log('📍 DEBUG: Location Profile Data:', JSON.stringify(profileData, null, 2));
      
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
        console.log('✅ DEBUG: Location profile updated successfully');
        
        // Navigate to SwitchProfiles screen after location
        console.log('📊 DEBUG: Navigating to SwitchProfiles screen');
        navigation.navigate('SwitchProfiles');
      } else {
        console.log('❌ DEBUG: Location profile update failed');
        console.log('❌ DEBUG: Error:', result.error);
        console.log('❌ DEBUG: Full Error Response:', JSON.stringify(result, null, 2));
        showError(result.error || 'Failed to update location', 'Profile Update Error');
      }
    } catch (error) {
      console.error('💥 DEBUG: Exception in handleContinue:', error);
      console.error('💥 DEBUG: Error type:', typeof error);
      console.error('💥 DEBUG: Error message:', error.message);
      console.error('💥 DEBUG: Error stack:', error.stack);
      showError(error.message || 'Failed to update location', 'Profile Update Error');
    } finally {
      setIsLoading(false);
      console.log('🚀 ===== LOCATION UPDATE API TEST END =====');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0033" />
      
      {/* Background Image */}
      <Image 
        source={require('../../assets/images/Location.jpeg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />

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
                  <Text style={styles.locationText}>
                    {isGettingLocation ? 'Getting location...' : currentLocation}
                  </Text>
                  <LocationPinIcon width={23} height={24} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
          </View>

          <View style={styles.searchContainer}>

           
          </View>

        
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120, // Extra padding to account for the bottom button
    zIndex: 1,
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
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
    fontFamily: 'Lexend-SemiBold',
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
    fontFamily: 'Lexend-Regular',
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
    fontFamily: 'Lexend-SemiBold',
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
    flex: 1,
    fontFamily: 'Lexend-Regular',
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
    fontFamily: 'Lexend-Regular',
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
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 2,
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

export default LocationScreen;
