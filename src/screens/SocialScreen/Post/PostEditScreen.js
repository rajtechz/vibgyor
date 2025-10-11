import React, { useState } from 'react';
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
    // Handle upload functionality
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Vibes</Text>
      </View>

      {/* Main Image Display */}
      <View style={styles.imageContainer}>
        {croppedImage ? (
          <Image 
            source={{ uri: croppedImage.uri }} 
            style={styles.mainImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image Selected</Text>
          </View>
        )}
      </View>

      {/* Horizontal Scrollable Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Filters</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterItem,
                filter.isSelected && styles.selectedFilterItem
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

      {/* Bottom Action Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadVibes}>
          <LinearGradient
            colors={['#DD3562', '#8354FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.uploadGradient}
          >
            <Text style={styles.uploadButtonText}>Upload Vibes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width
    paddingVertical: screenHeight * 0.02, // 2% of screen height
    backgroundColor: '#1a0033',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: screenWidth * 0.02, // 2% of screen width
  },
  backIcon: {
    color: '#fff',
    fontSize: screenWidth * 0.06, // 6% of screen width
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: screenWidth * 0.045, // 4.5% of screen width
    fontWeight: 'bold',
  },
  imageContainer: {
    height: screenHeight * 0.4, // 40% of screen height
    marginHorizontal: screenWidth * 0.05, // 5% of screen width
    marginVertical: screenHeight * 0.02, // 2% of screen height
    borderRadius: screenWidth * 0.02, // 2% of screen width
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#666',
    fontSize: screenWidth * 0.04, // 4% of screen width
  },
  filtersContainer: {
    backgroundColor: '#000',
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width
    paddingVertical: screenHeight * 0.015, // 1.5% of screen height
    flex: 1,
  },
  filtersTitle: {
    color: '#fff',
    fontSize: screenWidth * 0.045, // 4.5% of screen width
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.015, // 1.5% of screen height
  },
  filtersList: {
    paddingBottom: screenHeight * 0.01, // 1% of screen height
  },
  filterItem: {
    alignItems: 'center',
    marginRight: screenWidth * 0.04, // 4% of screen width
    padding: screenWidth * 0.025, // 2.5% of screen width
    borderRadius: screenWidth * 0.03, // 3% of screen width
    backgroundColor: '#2a2a2a',
    borderWidth: 2,
    borderColor: 'transparent',
    width: screenWidth * 0.25, // 25% of screen width
    minHeight: screenHeight * 0.12, // 12% of screen height
  },
  selectedFilterItem: {
    borderColor: '#DD3562',
    backgroundColor: 'rgba(221, 53, 98, 0.1)',
  },
  filterImage: {
    width: screenWidth * 0.15, // 15% of screen width
    height: screenWidth * 0.15, // 15% of screen width
    borderRadius: screenWidth * 0.02, // 2% of screen width
    marginBottom: screenHeight * 0.01, // 1% of screen height
  },
  filterName: {
    color: '#B0B0B0',
    fontSize: screenWidth * 0.03, // 3% of screen width
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedFilterName: {
    color: '#DD3562',
    fontWeight: 'bold',
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width
    paddingVertical: screenHeight * 0.025, // 2.5% of screen height
    backgroundColor: '#000',
    gap: screenWidth * 0.03, // 3% of screen width
  },
  addButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    paddingVertical: screenHeight * 0.02, // 2% of screen height
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width
    borderRadius: screenWidth * 0.06, // 6% of screen width
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  addButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04, // 4% of screen width
    fontWeight: '600',
  },
  uploadButton: {
    flex: 2,
    borderRadius: screenWidth * 0.06, // 6% of screen width
    overflow: 'hidden',
  },
  uploadGradient: {
    paddingVertical: screenHeight * 0.02, // 2% of screen height
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04, // 4% of screen width
    fontWeight: 'bold',
  },
});

export default PostEditScreen;
