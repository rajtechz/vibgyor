// src/screens/Dating/DatingProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '../../../styles/colors';
import { fonts } from '../../../styles/typography';
import {
  AccountVerifyBadge,
  LikeIcon,
  CommentIcon,
  SettingsIconContainer,
  HeartIcon,
  NextIcon
} from '../../../components/icons/SvgIcons';
import { 
  MusicIcon, 
  CookingIcon, 
  SwimIcon, 
  TravellingIcon,
  ArtIcon,
  CameraIcon,
  CartIcon,
  ExtremIcon,
  FitnessIcon,
  GameIcon,
  MicIcon,
  WineIcon
} from '../../../components/icons/interestIcons';
import DatingHeader from '../../../components/common/DatingHeader';
import CommonBackground from '../../../components/common/CommonBackground';

const { width, height } = Dimensions.get('window');

function DatingProfileScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Pictures');

  const tabs = ['Pictures', 'Videos', 'Belle\'s Bio', 'More'];
  const interests = [
    { name: 'Music', icon: MusicIcon },
    { name: 'Cooking', icon: CookingIcon },
    { name: 'Swimming', icon: SwimIcon },
    { name: 'Travelling', icon: TravellingIcon },
    { name: 'Art', icon: ArtIcon },
    { name: 'Camera', icon: CameraIcon },
    { name: 'Shopping', icon: CartIcon },
    { name: 'Extreme', icon: ExtremIcon },
    { name: 'Fitness', icon: FitnessIcon },
    { name: 'Gaming', icon: GameIcon },
    { name: 'Music', icon: MicIcon },
    { name: 'Wine', icon: WineIcon }
  ];

  const handleMenuPress = () => {
    // Handle menu press
    console.log('Menu pressed');
  };

  const handleNotificationPress = () => {
    // Handle notification press
    console.log('Notification pressed');
  };

  return (
    <CommonBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#140034" />

        {/* Header */}
        <DatingHeader
          onMenuPress={handleMenuPress}
          onNotificationPress={handleNotificationPress}
          showProfile={true}
        />
        

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Picture and Stats Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../../../assets/DatingProfileImage/Match3.png')}
              style={styles.profileImage}
            />
          </View>



          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statItemContainer}>

                <HeartIcon width={20} height={20} />
                <Text style={styles.statText}>3.5k</Text>
              </View>

              <View style={styles.itemDivider} />
            </View>
            <View style={styles.statItem}>
              <View style={styles.statItemContainer}>

                <CommentIcon width={20} height={20} />
                <Text style={styles.statText}>2.3k</Text>
              </View>
              <View style={styles.itemDivider} />
            </View>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => navigation.navigate('DatingSettings')}
            >
              <View style={styles.settingsDividerLeft} />
              <SettingsIconContainer width={50} height={50} />
              <View style={styles.settingsDividerRight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Get Verified Badge Button */}
        <View style={styles.verifyButtonContainer}>
          <LinearGradient
            colors={['#DD3562', '#8354FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.verifyButtonGradient}
          >
            <TouchableOpacity style={styles.verifyButton} activeOpacity={0.8}>
              <MaskedView
                maskElement={
                  <Text style={[styles.verifyButtonText, { backgroundColor: 'transparent' }]}>
                    Get Verified Badge
                  </Text>
                }
                style={styles.maskedViewContainer}
              >
                <LinearGradient
                  colors={['#DD3562', '#8354FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientTextContainer}
                >
                  <Text style={[styles.verifyButtonText, { opacity: 0 }]}>
                    Get Verified Badge
                  </Text>
                </LinearGradient>
              </MaskedView>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* User Information */}
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.fullName}>Mathew Ben</Text>
            <AccountVerifyBadge width={20} height={20} />
          </View>
          <Text style={styles.username}>Mathew_ben</Text>
          <Text style={styles.gender}>Female(she/her)</Text>
        </View>

        {/* Short Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>Short Bio</Text>
          <Text style={styles.bioText}>
            Love music, cooking, swimming, going out, travellig etc. Wanna be friends??
          </Text>
        </View>

        {/* Interests */}
        <View style={styles.interestsSection}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {interests.map((interest, index) => {
              const IconComponent = interest.icon;
              return (
                <View key={index} style={styles.interestItem}>
                  <View style={styles.interestIconContainer}>
                    <IconComponent width={18} height={18} color="#B783EB" />
                  </View>
                  <Text style={styles.interestText}>{interest.name}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Content Navigation Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
              {activeTab === tab && (
                <LinearGradient
                  colors={['#DD3562', '#8354FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabUnderline}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {activeTab === 'Pictures' && (
            <View style={styles.picturesGrid}>
              {/* First row - 2 large images */}
              <View style={styles.firstRow}>
                <LinearGradient
                  colors={['#DD3562', '#8354FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.largeImageGradientBorder}
                >
                  <View style={styles.largeImageContainer}>
                    <Image
                      source={require('../../../assets/DatingProfileImage/Match1.png')}
                      style={styles.largeImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      style={styles.imageGradient}
                    />
                  </View>
                </LinearGradient>
                <LinearGradient
                  colors={['#DD3562', '#8354FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.largeImageGradientBorder}
                >
                  <View style={styles.largeImageContainer}>
                    <Image
                      source={require('../../../assets/DatingProfileImage/Match2.png')}
                      style={styles.largeImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      style={styles.imageGradient}
                    />
                  </View>
                </LinearGradient>
              </View>
              
              {/* Second row - 3 small images */}
              <View style={styles.secondRow}>
                <LinearGradient
                  colors={['#DD3562', '#8354FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.smallImageGradientBorder}
                >
                  <View style={styles.smallImageContainer}>
                    <Image
                      source={require('../../../assets/DatingProfileImage/Match3.png')}
                      style={styles.smallImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      style={styles.imageGradient}
                    />
                  </View>
                </LinearGradient>
                <LinearGradient
                  colors={['#DD3562', '#8354FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.smallImageGradientBorder}
                >
                  <View style={styles.smallImageContainer}>
                    <Image
                      source={require('../../../assets/DatingProfileImage/Match4.png')}
                      style={styles.smallImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      style={styles.imageGradient}
                    />
                  </View>
                </LinearGradient>
                <LinearGradient
                  colors={['#DD3562', '#8354FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.smallImageGradientBorder}
                >
                  <View style={styles.smallImageContainer}>
                    <Image
                      source={require('../../../assets/DatingProfileImage/Match5.png')}
                      style={styles.smallImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      style={styles.imageGradient}
                    />
                  </View>
                </LinearGradient>
              </View>
              
              {/* See All Button - Below the images */}
              <TouchableOpacity style={styles.seeAllContainer}>
                <MaskedView
                  maskElement={
                    <View style={styles.seeAllMaskContainer}>
                      <Text style={[styles.seeAllText, { backgroundColor: 'transparent' }]}>
                        See All
                      </Text>
                      <NextIcon width={8} height={14} color="black" />
                    </View>
                  }
                >
                  <LinearGradient
                    colors={['#DD3562', '#8354FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.seeAllGradient}
                  >
                    <View style={styles.seeAllMaskContainer}>
                      <Text style={[styles.seeAllText, { opacity: 0 }]}>
                        See All
                      </Text>
                      <NextIcon width={8} height={14} color="black" />
                    </View>
                  </LinearGradient>
                </MaskedView>
              </TouchableOpacity>
              
              {/* Edit Profile Button */}
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => navigation.navigate('DatingEditProfile')}
              >
                <LinearGradient
                  colors={['#DD3562', '#8354FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.editProfileGradient}
                >
                  <View style={styles.editProfileInner}>
                  
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          
          {activeTab !== 'Pictures' && (
            <Text style={styles.contentPlaceholder}>
              {activeTab} content will be displayed here
            </Text>
          )}
        </View>
        </ScrollView>
      </SafeAreaView>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: '60%',
  },
  profileImage: {
    width: '100%',
    height: width * 0.6,
    resizeMode: 'cover',
  },
  divider: {
    width: 30,
    backgroundColor: '#612DA6',
    marginTop: 20,
    marginBottom: 20,
  },
  statsContainer: {
    width: '40%',
    justifyContent: 'flex-start',
    
    paddingTop: 20,
  },
  statItemContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',

  },
  itemDivider: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#612DA6',
  },
  settingsDividerLeft: {
    flex: 1,
    height: 2,
    backgroundColor: '#612DA6',
    // marginRight: 10,
  },
  settingsDividerRight: {
    flex: 1,
    height: 2,
    backgroundColor: '#612DA6',
  },
  statText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  verifyButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  verifyButtonGradient: {
    borderRadius: 10,
    padding: 2,
  },
  verifyButton: {
    backgroundColor: '#140034',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskedViewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  userInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  gender: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  bioSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  interestsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 8,
    marginRight: 20,
    marginBottom: 10,
  },
  interestIconContainer: {
    marginRight: 8,
  },
  interestText: {
    color: '#B783EB',
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    position: 'relative',
  },
  tabText: {
    color: '#B0B0B0',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#DD3562',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 1.5,
  },
  contentArea: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  picturesGrid: {
    flex: 1,
  },
  firstRow: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 15,
  },
  largeImageGradientBorder: {
    width: '48%',
    padding: 2,
    borderRadius: 14,
  },
  largeImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#140034',
  },
  largeImage: {
    width: '100%',
    height: '100%',
  },
  smallImageGradientBorder: {
    flex: 1,
    padding: 2,
    borderRadius: 14,
  },
  smallImageContainer: {
    flex: 1,
    height: 110,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#140034',
  },
  smallImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  seeAllContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  seeAllMaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllGradient: {
    height: 30,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
   
  },
  editProfileButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  editProfileGradient: {
    padding: 2,
  },
  editProfileInner: {
    backgroundColor: '#140034',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  editProfileIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  editProfileText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contentPlaceholder: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
  },
});

export default DatingProfileScreen;
