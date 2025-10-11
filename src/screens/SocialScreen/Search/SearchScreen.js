// src/screens/Search/SearchScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';
import { colors, gradients } from '../../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const imageWidth = width / 3; // Images will touch edges with no spacing

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

function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Latest');
  const dispatch = useDispatch();
  const { currentMode } = useSelector((state) => state.role);
  const insets = useSafeAreaInsets();

  const filterTabs = ['Latest', 'People', 'Tags', 'Live', 'Co'];

  // Sample data for different tabs using DatingProfileImage assets
  const sampleData = {
    Latest: [
      { id: 1, image: require('../../../assets/DatingProfileImage/Match1.png'), title: 'Abstract Art Collection' },
      { id: 2, image: require('../../../assets/DatingProfileImage/Match2.png'), title: 'Modern Design' },
      { id: 3, image: require('../../../assets/DatingProfileImage/Match3.png'), title: 'Creative Expression' },
      { id: 4, image: require('../../../assets/DatingProfileImage/Match4.png'), title: 'Artistic Vision' },
      { id: 5, image: require('../../../assets/DatingProfileImage/Match5.png'), title: 'Visual Story' },
      { id: 6, image: require('../../../assets/DatingProfileImage/Match6.png'), title: 'Creative Flow' },
      { id: 7, image: require('../../../assets/DatingProfileImage/Match1.png'), title: 'Abstract Art Collection' },
      { id: 8, image: require('../../../assets/DatingProfileImage/Match2.png'), title: 'Modern Design' },
      { id: 9, image: require('../../../assets/DatingProfileImage/Match3.png'), title: 'Creative Expression' },
    ],
    People: [
      { id: 1, name: 'Sarah Johnson', age: 25, location: 'New York', isOnline: true, mutualFriends: 12, image: require('../../../assets/DatingProfileImage/Match1.png') },
      { id: 2, name: 'Mike Chen', age: 28, location: 'Los Angeles', isOnline: false, mutualFriends: 8, image: require('../../../assets/DatingProfileImage/Match2.png') },
      { id: 3, name: 'Emma Wilson', age: 23, location: 'Chicago', isOnline: true, mutualFriends: 15, image: require('../../../assets/DatingProfileImage/Match3.png') },
      { id: 4, name: 'David Brown', age: 30, location: 'Miami', isOnline: true, mutualFriends: 5, image: require('../../../assets/DatingProfileImage/Match4.png') },
    ],
    Tags: [
      { id: 1, image: require('../../../assets/DatingProfileImage/Match1.png'), tag: '#photography', posts: 1250, isTrending: true },
      { id: 2, image: require('../../../assets/DatingProfileImage/Match2.png'), tag: '#travel', posts: 890, isTrending: false },
      { id: 3, image: require('../../../assets/DatingProfileImage/Match3.png'), tag: '#food', posts: 2100, isTrending: true },
      { id: 4, image: require('../../../assets/DatingProfileImage/Match4.png'), tag: '#art', posts: 650, isTrending: false },
      { id: 5, image: require('../../../assets/DatingProfileImage/Match5.png'), tag: '#design', posts: 980, isTrending: true },
      { id: 6, image: require('../../../assets/DatingProfileImage/Match6.png'), tag: '#nature', posts: 750, isTrending: false },
    ],
    Live: [
      { id: 1, image: require('../../../assets/DatingProfileImage/Match1.png'), title: 'Cooking with Sarah', viewers: 125, author: 'Sarah Johnson' },
      { id: 2, image: require('../../../assets/DatingProfileImage/Match2.png'), title: 'Art session live', viewers: 89, author: 'Mike Chen' },
      { id: 3, image: require('../../../assets/DatingProfileImage/Match3.png'), title: 'Travel vlog', viewers: 203, author: 'Emma Wilson' },
      { id: 4, image: require('../../../assets/DatingProfileImage/Match4.png'), title: 'Music session', viewers: 156, author: 'David Brown' },
      { id: 5, image: require('../../../assets/DatingProfileImage/Match5.png'), title: 'Fitness live', viewers: 98, author: 'Lisa Green' },
      { id: 6, image: require('../../../assets/DatingProfileImage/Match6.png'), title: 'Gaming stream', viewers: 234, author: 'Alex Kim' },
    ],
    Co: [
      { id: 1, image: require('../../../assets/DatingProfileImage/Match1.png'), title: 'Photography Workshop', members: 45, location: 'New York' },
      { id: 2, image: require('../../../assets/DatingProfileImage/Match2.png'), title: 'Food Lovers Club', members: 120, location: 'Los Angeles' },
      { id: 3, image: require('../../../assets/DatingProfileImage/Match3.png'), title: 'Art & Design Group', members: 78, location: 'Chicago' },
      { id: 4, image: require('../../../assets/DatingProfileImage/Match4.png'), title: 'Music Community', members: 92, location: 'Miami' },
      { id: 5, image: require('../../../assets/DatingProfileImage/Match5.png'), title: 'Fitness Group', members: 67, location: 'Seattle' },
      { id: 6, image: require('../../../assets/DatingProfileImage/Match6.png'), title: 'Tech Enthusiasts', members: 134, location: 'San Francisco' },
    ]
  };

  // Content renderers
  const renderLatestContent = () => (
    <View style={styles.imageGrid}>
      {sampleData.Latest.map((item) => (
        <TouchableOpacity key={item.id} style={styles.imageCard}>
          <Image source={item.image} style={styles.gridImage} resizeMode="cover" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPeopleContent = () => (
    <View style={styles.imageGrid}>
      {sampleData.People.map((person) => (
        <TouchableOpacity key={person.id} style={styles.imageCard}>
          <Image source={person.image} style={styles.gridImage} resizeMode="cover" />
          <View style={styles.peopleOverlay}>
            <Text style={styles.peopleName}>{person.name}, {person.age}</Text>
            <Text style={styles.peopleLocation}>📍 {person.location}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTagsContent = () => (
    <View style={styles.imageGrid}>
      {sampleData.Tags.map((tag) => (
        <TouchableOpacity key={tag.id} style={styles.imageCard}>
          <Image source={tag.image} style={styles.gridImage} resizeMode="cover" />
          <View style={styles.tagOverlay}>
            <Text style={styles.tagText}>{tag.tag}</Text>
            <Text style={styles.tagPosts}>{tag.posts} posts</Text>
            {tag.isTrending && <Text style={styles.trendingBadge}>🔥 Trending</Text>}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderLiveContent = () => (
    <View style={styles.imageGrid}>
      {sampleData.Live.map((live) => (
        <TouchableOpacity key={live.id} style={styles.imageCard}>
          <Image source={live.image} style={styles.gridImage} resizeMode="cover" />
          <View style={styles.liveOverlay}>
            <View style={styles.liveHeader}>
              <View style={styles.liveIndicator}>
                <Text style={styles.liveText}>🔴 LIVE</Text>
              </View>
              <Text style={styles.liveViewers}>{live.viewers} viewers</Text>
            </View>
            <Text style={styles.liveTitle}>{live.title}</Text>
            <Text style={styles.liveAuthor}>by {live.author}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCoContent = () => (
    <View style={styles.imageGrid}>
      {sampleData.Co.map((community) => (
        <TouchableOpacity key={community.id} style={styles.imageCard}>
          <Image source={community.image} style={styles.gridImage} resizeMode="cover" />
          <View style={styles.communityOverlay}>
            <Text style={styles.communityTitle}>{community.title}</Text>
            <Text style={styles.communityLocation}>📍 {community.location}</Text>
            <Text style={styles.communityMembers}>{community.members} members</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Latest':
        return renderLatestContent();
      case 'People':
        return renderPeopleContent();
      case 'Tags':
        return renderTagsContent();
      case 'Live':
        return renderLiveContent();
      case 'Co':
        return renderCoContent();
      default:
        return renderLatestContent();
    }
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />


      {/* Header */}

      <ModeSwitchHeader customTitle="Search" style={{ paddingTop: insets.top }} />


      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#B0B0B0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <SearchIcon width={20} height={20} color="#B0B0B0" />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabWrapper}
            >
              {activeTab === tab ? (
                <LinearGradient
                  colors={gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.activeTab}
                >
                  <Text style={styles.activeTabText}>
                    {tab}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveTab}>
                  <Text style={styles.inactiveTabText}>
                    {tab}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.contentArea} // NO paddingTop/marginTop
        contentContainerStyle={{ paddingVertical: 0 }} // Ensure vertical padding is zero
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageGrid}>
          {renderContent()}
        </View>
      </ScrollView>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 26, 74, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  tabsContainer: {
    paddingHorizontal: 20,
  },
  tabsScrollContent: {
    paddingRight: 20,
  },
  tabWrapper: {
    marginRight: 12,
  },
  activeTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTab: {
    backgroundColor: 'rgba(42, 26, 74, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTabText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#B0B0B0',
    fontSize: 14,
    fontWeight: '500',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 0, // Remove horizontal padding to touch edges
    marginTop: 20,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageCard: {
    width: imageWidth,
    height: imageWidth,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  peopleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  peopleName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  peopleLocation: {
    color: '#B0B0B0',
    fontSize: 10,
  },
  tagOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  liveOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  communityOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  trendingBadge: {
    color: '#DD3562',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 2,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveIndicator: {
    backgroundColor: '#DD3562',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  liveViewers: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  liveTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  liveAuthor: {
    color: '#B0B0B0',
    fontSize: 10,
  },
  communityTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  communityLocation: {
    color: '#B0B0B0',
    fontSize: 10,
    marginBottom: 2,
  },
  communityMembers: {
    color: '#DD3562',
    fontSize: 10,
    fontWeight: '500',
  },
});

export default SearchScreen;
