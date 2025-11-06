import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import { setCurrentScreen, hideTabBar, showTabBar } from '../../../redux/slices/uiSlice';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Back Arrow Icon
const BackIcon = ({ width = 24, height = 24, color = 'white' }) => (
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

// Instagram-like filters with overlay colors
const FILTERS = [
  {
    id: 'default',
    name: 'Default',
    overlayColor: null,
    opacity: 0,
  },
  {
    id: 'brightness',
    name: 'Bright',
    overlayColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.15,
  },
  {
    id: 'contrast',
    name: 'Contrast',
    overlayColor: 'rgba(0, 0, 0, 0.2)',
    opacity: 0.3,
  },
  {
    id: 'sepia',
    name: 'Vintage',
    overlayColor: 'rgba(255, 220, 177, 0.4)',
    opacity: 0.5,
  },
  {
    id: 'grayscale',
    name: 'Mono',
    overlayColor: 'rgba(128, 128, 128, 0.5)',
    opacity: 0.6,
  },
  {
    id: 'warm',
    name: 'Warm',
    overlayColor: 'rgba(255, 200, 150, 0.3)',
    opacity: 0.35,
  },
  {
    id: 'cool',
    name: 'Cool',
    overlayColor: 'rgba(150, 200, 255, 0.3)',
    opacity: 0.35,
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    overlayColor: 'rgba(255, 100, 100, 0.2)',
    opacity: 0.25,
  },
];

function UploadVibesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const { imageUri, mediaType = 'image' } = route.params || {};
  const [selectedFilter, setSelectedFilter] = useState('default');
  const [isLoading, setIsLoading] = useState(false);

  // Redux-based tab bar hiding when UploadVibesScreen is focused
  useFocusEffect(
    useCallback(() => {
      console.log('📤 UploadVibesScreen Focused - Hiding TabBar');
      dispatch(setCurrentScreen('UploadVibes'));
      dispatch(hideTabBar());

      return () => {
        console.log('📤 UploadVibesScreen Unfocused - Showing TabBar');
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [dispatch])
  );

  useEffect(() => {
    if (imageUri) {
      setIsLoading(false);
    }
  }, [imageUri]);

  const handleFilterSelect = (filterId) => {
    setSelectedFilter(filterId);
    setIsLoading(true);
    // Simulate filter processing
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  const handleBack = () => {
    dispatch(showTabBar());
    dispatch(setCurrentScreen(null));
    navigation.goBack();
  };

  const handleAdd = () => {
    console.log('➕ Add button pressed');
    // Navigate back to media picker or allow adding more media
    navigation.goBack();
  };

  const handleUploadVibes = () => {
    console.log('📤 Upload Vibes button pressed');
    const filteredMedia = {
      uri: imageUri,
      type: mediaType,
      selectedFilter: selectedFilter,
    };
    
    // Navigate to PostEdit or final upload screen
    navigation.navigate('PostEdit', {
      croppedImage: filteredMedia,
      selectedFilter: selectedFilter,
    });
  };

  const renderFilteredImage = () => {
    if (!imageUri) {
      return (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image Selected</Text>
        </View>
      );
    }

    const selectedFilterConfig = FILTERS.find((f) => f.id === selectedFilter);

    return (
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={styles.fullScreenImage}
          resizeMode="cover"
        />
        {selectedFilterConfig && selectedFilterConfig.overlayColor && (
          <View
            style={[
              styles.filterOverlay,
              {
                backgroundColor: selectedFilterConfig.overlayColor,
                opacity: selectedFilterConfig.opacity || 0.5,
              },
            ]}
          />
        )}
      </View>
    );
  };

  const renderFilterThumbnail = (filter) => {
    const isSelected = filter.id === selectedFilter;

    if (!imageUri) {
      return (
        <View style={[styles.filterThumbnail, isSelected && styles.selectedFilterThumbnail]}>
          <View style={styles.filterThumbnailPlaceholder}>
            <Text style={styles.filterThumbnailText}>{filter.name}</Text>
          </View>
          <Text
            style={[
              styles.filterName,
              isSelected && styles.selectedFilterName,
            ]}
          >
            {filter.name}
          </Text>
        </View>
      );
    }

    if (filter.id === 'default') {
      return (
        <TouchableOpacity
          style={[
            styles.filterThumbnail,
            isSelected && styles.selectedFilterThumbnail,
          ]}
          onPress={() => handleFilterSelect(filter.id)}
        >
          <View style={styles.defaultFilterContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.filterThumbnailImage}
              resizeMode="cover"
            />
            <View style={styles.defaultFilterOverlay}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M12 7V12L15 15"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </View>
          <Text
            style={[
              styles.filterName,
              isSelected && styles.selectedFilterName,
            ]}
          >
            {filter.name}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.filterThumbnail,
          isSelected && styles.selectedFilterThumbnail,
        ]}
        onPress={() => handleFilterSelect(filter.id)}
      >
        <View style={styles.filterThumbnailWrapper}>
          <Image
            source={{ uri: imageUri }}
            style={styles.filterThumbnailImage}
            resizeMode="cover"
          />
          {filter.overlayColor && (
            <View
              style={[
                styles.filterThumbnailOverlay,
                {
                  backgroundColor: filter.overlayColor,
                  opacity: filter.opacity || 0.5,
                },
              ]}
            />
          )}
        </View>
        <Text
          style={[
            styles.filterName,
            isSelected && styles.selectedFilterName,
          ]}
        >
          {filter.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Full Screen Image Container */}
      <View style={styles.imageContainer}>
        {renderFilteredImage()}

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Applying filter...</Text>
            </View>
          </View>
        )}
      </View>

      {/* Header - Overlay on top */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon width={24} height={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Upload Vibes</Text>
          </View>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      {/* Filters Section - Horizontal Scroll */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          style={styles.filtersScrollView}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => handleFilterSelect(filter.id)}
              style={styles.filterItemWrapper}
            >
              {renderFilterThumbnail(filter)}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Action Buttons */}
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadVibes}>
            <LinearGradient
              colors={['#F44363', '#9C27B0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadGradient}
            >
              <Text style={styles.uploadButtonText}>Upload Vibes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033', // Dark purple like screenshot
    width: SCREEN_WIDTH,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 30,
    backgroundColor: '#1a0033', // Dark purple header
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#F44363', // Pink text like screenshot
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  filtersSection: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.15,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.12,
    zIndex: 10,
  },
  filtersScrollView: {
    flex: 1,
  },
  filtersList: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  filterItemWrapper: {
    marginRight: 12,
  },
  filterThumbnail: {
    width: SCREEN_WIDTH * 0.18,
    height: SCREEN_HEIGHT * 0.08,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  selectedFilterThumbnail: {
    borderColor: '#F44363', // Pink border when selected
    borderWidth: 3,
    backgroundColor: 'rgba(244, 67, 99, 0.3)',
  },
  filterThumbnailWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  filterThumbnailImage: {
    width: '100%',
    height: '100%',
  },
  filterThumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterThumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterThumbnailText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  defaultFilterContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  defaultFilterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
  selectedFilterName: {
    color: '#F44363', // Pink text when selected
    fontWeight: 'bold',
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
    backgroundColor: '#1a0033', // Dark purple background
  },
  addButton: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(68, 68, 68, 0.8)',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    flex: 2,
    borderRadius: 25,
    overflow: 'hidden',
  },
  uploadGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UploadVibesScreen;

