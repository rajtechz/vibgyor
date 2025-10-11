// src/screens/Post/PostScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';
import { colors, gradients } from '../../../styles/colors';

const { width } = Dimensions.get('window');
const imageWidth = width / 3; // 3 columns with no spacing

// Camera Icon Component
const CameraIcon = ({ width = 24, height = 24, color = '#B0B0B0' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Image Icon Component
const ImageIcon = ({ width = 24, height = 24, color = '#B0B0B0' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 15L16 10L5 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Hamburger Menu Icon
const HamburgerIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <Path
      d="M28 6.66634C28 5.92996 27.403 5.33301 26.6667 5.33301H5.33333C4.59695 5.33301 4 5.92996 4 6.66634C4 7.40272 4.59695 7.99967 5.33333 7.99967H26.6667C27.403 7.99967 28 7.40272 28 6.66634ZM28 15.9997C28 15.2633 27.403 14.6663 26.6667 14.6663H13.3333C12.597 14.6663 12 15.2633 12 15.9997C12 16.7361 12.597 17.333 13.3333 17.333H26.6667C27.403 17.333 28 16.7361 28 15.9997ZM28 25.333C28 24.5966 27.403 23.9997 26.6667 23.9997H5.33333C4.59695 23.9997 4 24.5966 4 25.333C4 26.0694 4.59695 26.6663 5.33333 26.6663H26.6667C27.403 26.6663 28 26.0694 28 25.333Z"
      fill="white"
    />
  </Svg>
);

// Chevron Down Icon
const ChevronDownIcon = ({ width = 16, height = 16, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Post Card Component
const PostCard = ({ author, time, content, likes, comments }) => (
  <View style={styles.postCard}>
    <View style={styles.postHeader}>
      <View style={styles.authorInfo}>
        <View style={styles.authorAvatar}>
          <Text style={styles.authorInitial}>{author.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.authorName}>{author}</Text>
          <Text style={styles.postTime}>{time}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.postContent}>{content}</Text>
    <View style={styles.postActions}>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>❤️ {likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>💬 {comments}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>📤 Share</Text>
      </TouchableOpacity>
    </View>
  </View>
);

function PostScreen() {
  const [activeTab, setActiveTab] = useState('Vibes');
  const insets = useSafeAreaInsets();

  const filterTabs = ['Thought', 'Images', 'Vibes', 'Videos', 'Sticker'];

  // Sample upload data using DatingProfileImage assets
  const uploadData = [
    { id: 1, type: 'add', isAddButton: true },
    { id: 2, image: require('../../../assets/DatingProfileImage/Match1.png'), type: 'image' },
    { id: 3, image: require('../../../assets/DatingProfileImage/Match2.png'), type: 'image' },
    { id: 4, image: require('../../../assets/DatingProfileImage/Match3.png'), type: 'image' },
    { id: 5, image: require('../../../assets/DatingProfileImage/Match4.png'), type: 'image' },
    { id: 6, image: require('../../../assets/DatingProfileImage/Match5.png'), type: 'image' },
    { id: 7, image: require('../../../assets/DatingProfileImage/Match6.png'), type: 'image' },
    { id: 8, image: require('../../../assets/DatingProfileImage/Match1.png'), type: 'image' },
    { id: 9, image: require('../../../assets/DatingProfileImage/Match2.png'), type: 'image' },
    { id: 10, image: require('../../../assets/DatingProfileImage/Match3.png'), type: 'image' },
    { id: 11, image: require('../../../assets/DatingProfileImage/Match4.png'), type: 'image' },
    { id: 12, image: require('../../../assets/DatingProfileImage/Match5.png'), type: 'image' },
    { id: 13, image: require('../../../assets/DatingProfileImage/Match6.png'), type: 'image' },
    { id: 14, image: require('../../../assets/DatingProfileImage/Match1.png'), type: 'image' },
    { id: 15, image: require('../../../assets/DatingProfileImage/Match2.png'), type: 'image' },
    { id: 16, image: require('../../../assets/DatingProfileImage/Match3.png'), type: 'image' },
    { id: 17, image: require('../../../assets/DatingProfileImage/Match4.png'), type: 'image' },
    { id: 18, image: require('../../../assets/DatingProfileImage/Match5.png'), type: 'image' },
    { id: 19, image: require('../../../assets/DatingProfileImage/Match6.png'), type: 'image' },
    { id: 20, image: require('../../../assets/DatingProfileImage/Match1.png'), type: 'image' },
  ];

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />

      {/* Header */}
      <ModeSwitchHeader customTitle="Uploads" style={{ paddingTop: insets.top }} />

      {/* Sub Header */}
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.recentButton}>
          <Text style={styles.recentText}>Recent</Text>
          <ChevronDownIcon width={16} height={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <HamburgerIcon width={24} height={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Upload Grid (Scrollable) */}
      <ScrollView
        style={styles.uploadScroll}
        contentContainerStyle={styles.uploadGrid}
        showsVerticalScrollIndicator={false}
      >
        {uploadData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.uploadCard}>
            {item.isAddButton ? (
              <View style={styles.addButton}>
                <CameraIcon width={32} height={32} color="white" />
              </View>
            ) : (
              <Image source={item.image} style={styles.uploadImage} resizeMode="cover" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {filterTabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                activeOpacity={1}
                style={styles.tabButton}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {isActive ? (
                    <LinearGradient
                      colors={gradients.primary}
                      start={{ x: 0.3, y: 0 }}
                      end={{ x: 0.7, y: 1 }}
                      style={styles.pillTab}
                    >
                      <Text style={styles.pillTabText}>{tab}</Text>
                      <Svg
                        width="100%"
                        height={8}
                        style={styles.pillCurveSvg}
                        viewBox="0 0 90 8"
                        preserveAspectRatio="none"
                      >
                        <Path
                          d="M0 8 Q45 -6 90 8"
                          fill="none"
                          stroke="#B34AFF"
                          strokeWidth="1.5"
                        />
                      </Svg>
                    </LinearGradient>
                  ) : (
                    <Text style={styles.inactiveTabText}>{tab}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View> */}

    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#140034',
  },
  recentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  menuButton: {
    padding: 4,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 0,
  },
  uploadScroll: {
    flex: 1,
  },
  uploadCard: {
    width: imageWidth,
    height: imageWidth,
    overflow: 'hidden',
    position: 'relative',
  },
  addButton: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadImage: {
    width: '100%',
    height: '100%',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#140034',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabsScrollContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  tabWrapper: {
    marginHorizontal: 6,
    alignItems: 'center',
  },
  activeTab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#DD3562',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  inactiveTab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeTabText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
 
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: '#DD3562',
    borderRadius: 2,
  },
  activeTabPill: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24, // Large value for full pill shape
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DD3562',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
    position: 'relative',
    zIndex: 2,
    // Optionally: raise the pill above others for "lift" effect
    marginTop: -14, // Lifts the pill visually above the bar
    marginBottom: -8, // Allows pill to overlap tab bar
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)', // Matches subtle Figma border
  },
  
  tabsWrapper: {
    paddingTop: 10,
    backgroundColor: '#140034',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    zIndex: 10,
  },
  tabBarContent: {
    minHeight: 48,
    alignItems: 'flex-end',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  tabButton: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
    paddingBottom: 0,
  },

  /** ACTIVE TAB (PILL) **/
  pillTab: {
    paddingHorizontal: 22,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 18,
    backgroundColor: undefined, // LinearGradient takes over the bg
    shadowColor: '#8354FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 7,
    minWidth: 82,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    borderWidth: 1.5,
    borderColor: 'rgba(179,74,255,1)', // matches the glow edge in Figma
    overflow: 'visible',
    marginTop: -10,
  },
  pillTabText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
    zIndex: 2,
    paddingHorizontal: 3,
    paddingBottom: 0,
  },
  pillCurveSvg: {
    position: 'absolute',
    width: '100%',
    height: 8,
    bottom: -8,
    left: 0,
    right: 0,
    zIndex: 0,
    // This creates the little up curve effect under the pill (fine-tune color to Figma)
  },

  /** INACTIVE TAB **/
  inactiveTabText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
    height: 38,
    textAlignVertical: 'bottom',
    textAlign: 'center',
  },
});

export default PostScreen;
