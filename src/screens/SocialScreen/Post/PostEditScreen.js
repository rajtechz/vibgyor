import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Import filter images from assets
const FILTERS = [
  {
    id: 'default',
    name: 'Default',
    image: require('../../../assets/images/filter1.png'),
    isSelected: true,
  },
  {
    id: 'filter1',
    name: 'Vintage',
    image: require('../../../assets/images/filter2.png'),
    isSelected: false,
  },
  {
    id: 'filter2',
    name: 'Black & White',
    image: require('../../../assets/images/filter3.png'),
    isSelected: false,
  },
  {
    id: 'filter3',
    name: 'Warm',
    image: require('../../../assets/images/filter4.png'),
    isSelected: false,
  },
  {
    id: 'filter4',
    name: 'Cool',
    image: require('../../../assets/images/filter5.png'),
    isSelected: false,
  },
  {
    id: 'filter5',
    name: 'Dramatic',
    image: require('../../../assets/images/filter6.png'),
    isSelected: false,
  },
];

const PostEditScreen = ({ route, navigation }) => {
  const { croppedImage } = route.params || {};
  const [selectedFilter, setSelectedFilter] = useState('default');
  const [filters, setFilters] = useState(FILTERS);

  // Hide bottom tab bar when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Hide tab bar
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' }
      });

      // Show tab bar when leaving this screen
      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'flex' }
        });
      };
    }, [navigation])
  );

  // Also hide tab bar on component mount
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });
  }, [navigation]);

  const handleFilterSelect = (filterId) => {
    setSelectedFilter(filterId);
    setFilters(prev => 
      prev.map(filter => ({
        ...filter,
        isSelected: filter.id === filterId
      }))
    );
  };

  const handleAdd = () => {
    console.log('Add button pressed');
    // Handle add functionality
  };

  const handleUploadVibes = () => {
    console.log('Upload Vibes button pressed');
    // Create multiple images array for dynamic story
    const multipleImages = [
      croppedImage,
      { uri: 'https://picsum.photos/400/600?random=1' },
      { uri: 'https://picsum.photos/400/600?random=2' },
      { uri: 'https://picsum.photos/400/600?random=3' },
      { uri: 'https://picsum.photos/400/600?random=4' }
    ].filter(Boolean); // Remove any null/undefined images
    
    // Navigate to SelfStory page
    navigation.navigate('SelfStory', { 
      croppedImage: croppedImage,
      selectedFilter: selectedFilter,
      multipleImages: multipleImages
    });
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Full Screen Image */}
      <View style={styles.fullScreenImageContainer}>
        {croppedImage ? (
          <Image 
            source={{ uri: croppedImage.uri }} 
            style={styles.fullScreenImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image Selected</Text>
          </View>
        )}
      </View>

      {/* Overlay Header */}
      <View style={styles.overlayHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Vibes</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filters Section - Bottom Position */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          style={styles.filtersScrollView}
        >
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterItem,
                filter.isSelected && styles.selectedFilterItem,
              ]}
              onPress={() => handleFilterSelect(filter.id)}
            >
              <Image source={filter.image} style={styles.filterImage} />
              <Text style={[
                styles.filterName,
                filter.isSelected && styles.selectedFilterName
              ]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Overlay Bottom Action Buttons */}
      <View style={styles.overlayBottomContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#281A62',
        },
  // Full Screen Image
  fullScreenImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
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
    fontSize: screenWidth * 0.04,
  },
  // Overlay Header
  overlayHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.06, // Account for status bar
    paddingBottom: screenHeight * 0.02,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  backButton: {
    padding: screenWidth * 0.02,
  },
  backIcon: {
    color: '#fff',
    fontSize: screenWidth * 0.06,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
  },
  placeholder: {
    width: screenWidth * 0.1, // Same width as back button for centering
  },
  // Filters Section - Bottom Position
  filtersSection: {
    position: 'absolute',
    bottom: screenHeight * 0.15, // Above the action buttons
    left: 0,
    right: 0,
    height: screenHeight * 0.12,
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    zIndex: 10,
  },
  filtersScrollView: {
    flex: 1,
  },
  filtersList: {
    paddingHorizontal: screenWidth * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterItem: {
    alignItems: 'center',
    marginHorizontal: screenWidth * 0.015,
    padding: screenWidth * 0.02,
    borderRadius: screenWidth * 0.03,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
    width: screenWidth * 0.18,
    height: screenHeight * 0.08,
    justifyContent: 'center',
  },
  selectedFilterItem: {
    borderColor: '#DD3562',
    backgroundColor: 'rgba(221, 53, 98, 0.3)',
  },
  filterImage: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.015,
    marginBottom: screenHeight * 0.005,
  },
  filterName: {
    color: '#fff',
    fontSize: screenWidth * 0.025,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedFilterName: {
    color: '#DD3562',
    fontWeight: 'bold',
  },
  // Overlay Bottom Buttons
  overlayBottomContainer: {
    position: 'absolute',
    bottom: screenHeight * 0.05,
    left: screenWidth * 0.05,
    right: screenWidth * 0.05,
    flexDirection: 'row',
    gap: screenWidth * 0.03,
    zIndex: 10,
  },
  addButton: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    paddingVertical: screenHeight * 0.012,
    paddingHorizontal: screenWidth * 0.05,
    borderRadius: screenWidth * 0.08,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(68, 68, 68, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  addButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04,
    fontWeight: '600',
  },
  uploadButton: {
    flex: 2,
    borderRadius: screenWidth * 0.08,
    overflow: 'hidden',
  },
        uploadGradient: {
          paddingVertical: screenHeight * 0.012,
          paddingHorizontal: screenWidth * 0.05,
          alignItems: 'center',
        },
  uploadButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
  },
});

export default PostEditScreen;
