import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { BackIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 60) / 2; // 2 columns with margins

// Filter Icons from MatchScreen.js
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

// Online Status Dot Component
const OnlineDot = ({ size = 8 }) => (
  <View style={[styles.onlineDot, { width: size, height: size }]} />
);

// Gradient Border for Profile Cards (same as MatchScreen)
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

// Match Card Component (same as MatchScreen)
const MatchCard = ({ match, onPress }) => (
  <TouchableOpacity style={styles.profileCard} onPress={onPress}>
    <ProfileCardGradientBorder>
      <View style={styles.matchBadge}>
        <LinearGradient
          colors={['#DD3562', '#8354FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.matchBadgeGradient}
        >
          <Text style={styles.matchPercentage}>{match.percentage}% Match</Text>
        </LinearGradient>
      </View>
      <Image source={match.image} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.distance}>{match.distance} km away</Text>
        <View style={styles.nameRow}>
          <Text style={styles.profileName}>{match.name}, {match.age}</Text>
          <OnlineDot />
        </View>
        <Text style={styles.location}>{match.location}</Text>
      </View>
    </ProfileCardGradientBorder>
  </TouchableOpacity>
);

const DatingManageMatchesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('Near By');

  const filterTabs = [
    { id: 'New Dater', title: 'New Dater', icon: NewDaterIcon },
    { id: 'Near By', title: 'Near By', icon: NearMeIcon },
    { id: 'Same Interests', title: 'Same Interests', icon: SameInterestIcon },
  ];

  const matches = [
    {
      id: 1,
      name: 'Sarah',
      age: 25,
      location: 'HILLCREST',
      distance: '2.5',
      percentage: 95,
      image: require('../../../assets/DatingProfileImage/Match1.png'),
    },
    {
      id: 2,
      name: 'Michael',
      age: 22,
      location: 'PARKSIDE',
      distance: '3.1',
      percentage: 90,
      image: require('../../../assets/DatingProfileImage/Match2.png'),
    },
    {
      id: 3,
      name: 'Emma',
      age: 28,
      location: 'RIVERVIEW',
      distance: '4.0',
      percentage: 85,
      image: require('../../../assets/DatingProfileImage/Match3.png'),
    },
    {
      id: 4,
      name: 'James',
      age: 26,
      location: 'DOWNTOWN',
      distance: '1.8',
      percentage: 88,
      image: require('../../../assets/DatingProfileImage/Match4.png'),
    },
    {
      id: 5,
      name: 'Sophia',
      age: 24,
      location: 'UPTON',
      distance: '5.2',
      percentage: 92,
      image: require('../../../assets/DatingProfileImage/Match5.png'),
    },
    {
      id: 6,
      name: 'Alex',
      age: 27,
      location: 'WESTFIELD',
      distance: '3.7',
      percentage: 87,
      image: require('../../../assets/DatingProfileImage/Match6.png'),
    },
  ];

  const handleMatchPress = (match) => {
    console.log('Match pressed:', match.name);
    // Navigate to match details or chat
  };

  const renderMatchCard = ({ item }) => (
    <MatchCard match={item} onPress={() => handleMatchPress(item)} />
  );

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Matches</Text>
      
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterTab,
                activeFilter === tab.id && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(tab.id)}
            >
              <View style={styles.filterTabContent}>
                <tab.icon width={20} height={20} color="#FFFFFF" />
                <Text style={[
                  styles.filterTabText,
                  activeFilter === tab.id && styles.activeFilterTabText
                ]}>
                  {tab.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Matches Grid */}
      <View style={[styles.matchesContainer, { paddingBottom: 0 + insets.bottom }]}>
        <FlatList
          data={matches}
          renderItem={renderMatchCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
        />
      </View>
    </CommonBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#DD3562',
  },
  headerSpacer: {
    width: 40,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterScroll: {
    paddingRight: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFilterTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  matchesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gridContent: {
    paddingBottom: 0, // Increased padding to ensure all content is visible
  },
  row: {
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
    borderRadius: 14,
    padding: 1,
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
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  matchPercentage: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  },
  onlineDot: {
    width: 8,
    height: 8,
    backgroundColor: '#00FF00',
    borderRadius: 4,
    marginLeft: 8,
  },
  location: {
    color: 'white',
    fontSize: 14,
  },
});

export default DatingManageMatchesScreen;
