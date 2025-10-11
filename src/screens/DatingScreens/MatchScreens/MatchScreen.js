// src/screens/DatingScreens/MatchScreen.js
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';
import { colors, gradients } from '../../../styles/colors';
import { fonts } from '../../../styles/typography';
import { FilterIconDating } from '../../../components/icons/SvgIcons';
import DatingHeader from '../../../components/common/DatingHeader';
import CommonBackground from '../../../components/common/CommonBackground';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// Category Icons
const AllIcon = ({ width = 20, height = 20, color = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" stroke={color} strokeWidth="2"/>
    <Rect x="14" y="3" width="7" height="7" stroke={color} strokeWidth="2"/>
    <Rect x="14" y="14" width="7" height="7" stroke={color} strokeWidth="2"/>
    <Rect x="3" y="14" width="7" height="7" stroke={color} strokeWidth="2"/>
  </Svg>
);

const LikedYouIcon = ({ width = 20, height = 20, color = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={color} strokeWidth="2"/>
  </Svg>
);

const NewDaterIcon = ({ width = 20, height = 20, color = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2"/>
  </Svg>
);

const NearMeIcon = ({ width = 20, height = 20, color = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="2"/>
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
  </Svg>
);

const SameInterestIcon = ({ width = 20, height = 20, color = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
  </Svg>
);

// Search Icon Component
const SearchIcon = ({ width = 24, height = 24, color = '#B0B0B0' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Gradient Border Component
const GradientBorder = ({ children, style }) => (
  <LinearGradient
    colors={['#DD3562', '#8354FF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[styles.searchInputGradient, style]}
  >
    <View style={styles.searchInputWrapper}>
      {children}
    </View>
  </LinearGradient>
);

// Gradient Border for Filter Icon
const FilterGradientBorder = ({ children, style }) => (
  <LinearGradient
    colors={['#DD3562', '#8354FF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[styles.filterGradientBorder, style]}
  >
    <View style={styles.filterIconWrapper}>
      {children}
    </View>
  </LinearGradient>
);

// Gradient Border for Profile Cards
const ProfileCardGradientBorder = ({ children, style }) => (
  <LinearGradient
    colors={['#DD3562', '#8354FF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.profileCardGradientBorder, style]}
  >
    <View style={styles.profileCardWrapper}>
      {children}
    </View>
  </LinearGradient>
);

const MatchScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const handleFilterPress = () => {
    navigation.navigate('FilterOptions');
  };

  // Sample data for Near You section
  const nearYouProfiles = [
    { id: 1, name: 'Alice Johnson', image: require('../../../assets/DatingProfileImage/Match1.png'), online: true },
    { id: 2, name: 'James Wilson', image: require('../../../assets/DatingProfileImage/Match2.png'), online: true },
    { id: 3, name: 'Sophia Brown', image: require('../../../assets/DatingProfileImage/Match3.png'), online: true },
    { id: 4, name: 'Michael Sm', image: require('../../../assets/DatingProfileImage/Match4.png'), online: true },
  ];

  // Sample data for main profile grid
  const mainProfiles = [
    {
      id: 1,
      name: 'Sarah',
      age: 25,
      location: 'HILLCREST',
      distance: '2.5 km away',
      matchPercentage: 95,
      image: require('../../../assets/DatingProfileImage/Match5.png'),
      online: true,
    },
    {
      id: 2,
      name: 'Sarah',
      age: 25,
      location: 'HILLCREST',
      distance: '2.5 km away',
      matchPercentage: 95,
      image: require('../../../assets/DatingProfileImage/Match6.png'),
      online: true,
    },
    {
      id: 3,
      name: 'James',
      age: 28,
      location: 'DOWNTOWN',
      distance: '1.2 km away',
      matchPercentage: 90,
      image: require('../../../assets/DatingProfileImage/Match1.png'),
      online: false,
    },
    {
      id: 4,
      name: 'Emma',
      age: 23,
      location: 'UPTOWN',
      distance: '3.1 km away',
      matchPercentage: 90,
      image: require('../../../assets/DatingProfileImage/Match2.png'),
      online: true,
    },
  ];

  const filterButtons = [
    { id: 'All', label: 'All', icon: AllIcon },
    { id: 'Liked You', label: 'Liked You', icon: LikedYouIcon },
    { id: 'New Dater', label: 'New Dater', icon: NewDaterIcon },
    { id: 'Nearby', label: 'Nearby', icon: NearMeIcon },
    { id: 'Same Interest', label: 'Same Interest', icon: SameInterestIcon },
  ];

  const renderNearYouProfile = ({ item: profile }) => (
    <TouchableOpacity style={styles.nearYouCard}>
      <View style={styles.nearYouImageContainer}>
        <Image source={profile.image} style={styles.nearYouImage} />
        {profile.online && <View style={styles.onlineDot} />}
        <View style={styles.nameOverlay}>
          <Text style={styles.nearYouName}>{profile.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMainProfileCard = ({ item: profile }) => (
    <TouchableOpacity style={styles.profileCard}>
      <ProfileCardGradientBorder>
        <View style={styles.matchBadge}>
          <LinearGradient
            colors={['#DD3562', '#8354FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.matchBadgeGradient}
          >
            <Text style={styles.matchPercentage}>{profile.matchPercentage}% Match</Text>
          </LinearGradient>
        </View>
        <Image source={profile.image} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.distance}>{profile.distance}</Text>
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
            {profile.online && <View style={styles.onlineIndicator} />}
          </View>
          <Text style={styles.location}>{profile.location}</Text>
        </View>
      </ProfileCardGradientBorder>
    </TouchableOpacity>
  );

  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <DatingHeader showDiscover={true} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <GradientBorder style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search here"
              placeholderTextColor="#B0B0B0"
              value={searchText}
              onChangeText={setSearchText}
            />
            <SearchIcon width={20} height={20} color="#B0B0B0" />
          </GradientBorder>
          <TouchableOpacity style={styles.filterIconButton} onPress={handleFilterPress}>
            <FilterGradientBorder>
              <FilterIconDating width={34} height={34} />
            </FilterGradientBorder>
          </TouchableOpacity>
        </View>

        {/* Near You Section */}
        <View style={styles.nearYouSection}>
          <Text style={styles.sectionTitle}>Near You</Text>
          <FlatList
            data={nearYouProfiles}
            renderItem={renderNearYouProfile}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.nearYouScroll}
          />
        </View>

        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollContainer}
          contentContainerStyle={styles.filterContainer}
        >
          {filterButtons.map((filter) => {
            const IconComponent = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  isActive && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                {isActive ? (
                  <LinearGradient
                    colors={['#DD3562','#8354FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.activeButtonGradient}
                  >
                    <IconComponent 
                      width={14} 
                      height={14} 
                      color="white" 
                    />
                    <Text style={styles.activeFilterButtonText}>
                      {filter.label}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveButtonContainer}>
                    <IconComponent 
                      width={14} 
                      height={14} 
                      color="white" 
                    />
                    <Text style={styles.filterButtonText}>
                      {filter.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Main Profile Grid */}
        <View style={styles.profileGrid}>
          <FlatList
            data={mainProfiles}
            renderItem={renderMainProfileCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.profileRow}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
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
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 100 : 120,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  searchInputGradient: {
    flex: 1,
    borderRadius: 30,
    padding: 2,
    marginRight: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#03000C',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchBar: {
    flex: 1,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.primary,
    marginRight: 10,
  },
  filterIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterGradientBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2, // Border thickness
  },
  filterIconWrapper: {
    flex: 1,
    backgroundColor: '#03000C',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearYouSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    marginBottom: 15,
    fontFamily: fonts.primary,
  },
  nearYouScroll: {
    paddingLeft: 20,
  },
  nearYouCard: {
    marginRight: 15,
    width: 100,
    height: 120,
  },
  nearYouImageContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  nearYouImage: {
    width: '100%',
    height: '100%',
  },
  onlineDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    backgroundColor: '#00FF00',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.background,
    zIndex: 999,
    elevation: 10,
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  nearYouName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: fonts.primary,
  },
  filterScrollContainer: {
    marginBottom: 30,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  filterButton: {
    borderRadius: 20,
    marginRight: 10,
    overflow: 'hidden',
  },
  activeFilterButton: {
    // No background needed as gradient handles it
  },
  activeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inactiveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'transparent',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fonts.primary,
    marginLeft: 6,
  },
  activeFilterButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fonts.primary,
    marginLeft: 6,
  },
  profileGrid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  profileCard: {
    width: (screenWidth - 50) / 2,
    height: 230,
    borderRadius: 15,
    position: 'relative',
  },
  profileCardGradientBorder: {
    flex: 1,
    borderRadius: 15,
    padding: 2,
  },
  profileCardWrapper: {
    flex: 1,
    backgroundColor: '#281849',
    borderRadius: 13,
    overflow: 'hidden',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  matchBadge: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  matchBadgeGradient: {
    paddingHorizontal: 20,
    paddingVertical: 2,
    borderBottomLeftRadius:12,
    borderBottomRightRadius:12,
  },
  matchPercentage: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: fonts.primary,
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    padding: 5,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  distance: {
    color: 'white',
    fontSize: 11,
    
    fontFamily: fonts.primary,
    fontWeight: '500',
    textAlign: 'center',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.primary,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#00FF00',
    borderRadius: 4,
    marginLeft: 8,
  },
  location: {
    color: 'white',
    fontSize: 14,
    fontFamily: fonts.primary,
  },
});

export default MatchScreen;
