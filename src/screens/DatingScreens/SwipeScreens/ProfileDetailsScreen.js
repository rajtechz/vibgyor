import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon, HeartIcon, LocationIcon, DetailMessageIcon, DislikeButtonIcon, LikeButtonIcon, ChatIcon, NextIcon } from '../../../components/icons/SvgIcons';
import MusicIcon from '../../../components/interestIcons/MusicIcon';
import CookingIcon from '../../../components/interestIcons/CookingIcon';
import SwimIcon from '../../../components/interestIcons/SwimIcon';
import TravellingIcon from '../../../components/interestIcons/TravellingIcon';
import MaskedView from '@react-native-masked-view/masked-view';
import { setProfileDetailsScreenActive } from '../../../redux/slices/uiSlice';

import CommonBackground from '../../../components/common/CommonBackground';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ProfileDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { profile } = route.params || {};

  const [activeTab, setActiveTab] = useState('Pictures');

  const tabs = ['Pictures', 'Videos', 'Belle\'s Bio', 'More'];

  const interests = [
    { name: 'Music', icon: MusicIcon },
    { name: 'Cooking', icon: CookingIcon },
    { name: 'Swimming', icon: SwimIcon },
    { name: 'Travelling', icon: TravellingIcon },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLike = () => {
    console.log('Like pressed');
    // Navigate to CelebrationMatchScreen when like button is pressed
    navigation.navigate('CelebrationMatch');
  };

  const handleDislike = () => {
    console.log('Dislike pressed');
  };

  const handleMessage = () => {
    console.log('Message pressed');
  };

  // Handle tab bar visibility
  useFocusEffect(
    React.useCallback(() => {
      // Hide tab bar when screen is focused
      dispatch(setProfileDetailsScreenActive(true));
      
      return () => {
        // Show tab bar when screen is unfocused
        dispatch(setProfileDetailsScreenActive(false));
      };
    }, [dispatch])
  );

  return (
    <CommonBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
     
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon width={24} height={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Details</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Main Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image
              source={profile?.image || require('../../../assets/DatingProfileImage/Match1.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
            
            {/* Message Button Overlay */}
            <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
              <DetailMessageIcon width={50} height={50} />
            </TouchableOpacity>
          </View>

          {/* Profile Information */}
          <View style={styles.profileInfoContainer}>
            <View style={styles.profileInfo}>
              <View style={styles.nameAndActions}>
                <View style={styles.nameAndDetails}>
                  <Text style={styles.profileName}>
                    {profile?.name || 'Belle Benson'}
                  </Text>
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <LocationIcon width={16} height={16} color="#B0B0B0" />
                      <Text style={styles.detailText}>
                        {profile?.distance || '1.5 km away'}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.detailItem} onPress={handleLike}>
                      <HeartIcon width={16} height={16} color="#B0B0B0" />
                      <Text style={styles.detailText}>2.7k</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <LikeButtonIcon width={70} height={70} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={handleDislike}>
                    <DislikeButtonIcon width={70} height={70} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bio Section */}
              <View style={styles.bioSection}>
                <Text style={styles.bioGreeting}>Hello Friends!</Text>
                <Text style={styles.bioText}>
                  Love music, cooking, swimming, going out, travelling etc. Wanna be friends??
                </Text>
              </View>

              {/* Interests Section */}
              <View style={styles.interestsSection}>
                <Text style={styles.interestsTitle}>Interests</Text>
                <View style={styles.interestsList}>
                  {interests.map((interest, index) => {
                    const IconComponent = interest.icon;
                    return (
                      <View key={index} style={styles.interestItem}>
                        <View style={styles.interestIconContainer}>
                          <IconComponent width={16} height={16} fill="#B783EB" />
                        </View>
                        <Text style={styles.interestText}>{interest.name}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
       

          {/* Tabs */}
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
                {activeTab === tab && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

           {/* Content based on active tab */}
           {activeTab === 'Pictures' && (
             <View style={styles.gallerySection}>
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
             </View>
           )}

           {/* Videos Tab Content */}
           {activeTab === 'Videos' && (
             <View style={styles.gallerySection}>
               {/* First row - 2 large video placeholders */}
               <View style={styles.firstRow}>
                 <LinearGradient
                   colors={['#DD3562', '#8354FF']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 0 }}
                   style={styles.largeVideoGradientBorder}
                 >
                   <View style={styles.largeVideoContainer}>
                     <View style={styles.playButtonContainer}>
                       <LinearGradient
                         colors={['#DD3562', '#8354FF']}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={styles.playButtonGradient}
                       >
                         <View style={styles.playButton}>
                           <View style={styles.playTriangle} />
                         </View>
                       </LinearGradient>
                     </View>
                   </View>
                 </LinearGradient>
                 <LinearGradient
                   colors={['#DD3562', '#8354FF']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 0 }}
                   style={styles.largeVideoGradientBorder}
                 >
                   <View style={styles.largeVideoContainer}>
                     <View style={styles.playButtonContainer}>
                       <LinearGradient
                         colors={['#DD3562', '#8354FF']}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={styles.playButtonGradient}
                       >
                         <View style={styles.playButton}>
                           <View style={styles.playTriangle} />
                         </View>
                       </LinearGradient>
                     </View>
                   </View>
                 </LinearGradient>
               </View>
               
               {/* Second row - 3 small video placeholders */}
               <View style={styles.secondRow}>
                 <LinearGradient
                   colors={['#DD3562', '#8354FF']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 0 }}
                   style={styles.smallVideoGradientBorder}
                 >
                   <View style={styles.smallVideoContainer}>
                     <View style={styles.smallPlayButtonContainer}>
                       <LinearGradient
                         colors={['#DD3562', '#8354FF']}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={styles.smallPlayButtonGradient}
                       >
                         <View style={styles.smallPlayButton}>
                           <View style={styles.smallPlayTriangle} />
                         </View>
                       </LinearGradient>
                     </View>
                   </View>
                 </LinearGradient>
                 <LinearGradient
                   colors={['#DD3562', '#8354FF']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 0 }}
                   style={styles.smallVideoGradientBorder}
                 >
                   <View style={styles.smallVideoContainer}>
                     <View style={styles.smallPlayButtonContainer}>
                       <LinearGradient
                         colors={['#DD3562', '#8354FF']}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={styles.smallPlayButtonGradient}
                       >
                         <View style={styles.smallPlayButton}>
                           <View style={styles.smallPlayTriangle} />
                         </View>
                       </LinearGradient>
                     </View>
                   </View>
                 </LinearGradient>
                 <LinearGradient
                   colors={['#DD3562', '#8354FF']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 0 }}
                   style={styles.smallVideoGradientBorder}
                 >
                   <View style={styles.smallVideoContainer}>
                     <View style={styles.smallPlayButtonContainer}>
                       <LinearGradient
                         colors={['#DD3562', '#8354FF']}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={styles.smallPlayButtonGradient}
                       >
                         <View style={styles.smallPlayButton}>
                           <View style={styles.smallPlayTriangle} />
                         </View>
                       </LinearGradient>
                     </View>
                   </View>
                 </LinearGradient>
               </View>
               
               {/* See All Button - Below the videos */}
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
             </View>
           )}

           {/* Bio Tab Content */}
           {activeTab === 'Belle\'s Bio' && (
             <View style={styles.gallerySection}>
               <View style={styles.bioCard}>
                 <View style={styles.bioItem}>
                   <Text style={styles.bioLabel}>Name</Text>
                   <Text style={styles.bioSeparator}>-</Text>
                   <Text style={styles.bioValue}>Samantha John</Text>
                 </View>
                 
                 <View style={styles.bioItem}>
                   <Text style={styles.bioLabel}>Date Of Birth</Text>
                   <Text style={styles.bioSeparator}>-</Text>
                   <Text style={styles.bioValue}>DD/MM/YYYY</Text>
                 </View>
                 
                 <View style={styles.bioItem}>
                   <Text style={styles.bioLabel}>Phone No.</Text>
                   <Text style={styles.bioSeparator}>-</Text>
                   <Text style={styles.bioValue}>1234567891</Text>
                 </View>
                 
                 <View style={styles.bioItem}>
                   <Text style={styles.bioLabel}>Gender</Text>
                   <Text style={styles.bioSeparator}>-</Text>
                   <Text style={styles.bioValue}>Male</Text>
                 </View>
                 
                 <View style={styles.bioItem}>
                   <Text style={styles.bioLabel}>Country</Text>
                   <Text style={styles.bioSeparator}>-</Text>
                   <Text style={styles.bioValue}>India</Text>
                 </View>
                 
                 <View style={styles.bioItem}>
                   <Text style={styles.bioLabel}>Email ID</Text>
                   <Text style={styles.bioSeparator}>-</Text>
                   <Text style={styles.bioValue}>samantha@gmail.com</Text>
                 </View>
                 
                 <View style={styles.bioItem}>
                   <Text style={styles.bioLabel}>Marital Status</Text>
                   <Text style={styles.bioSeparator}>-</Text>
                   <Text style={styles.bioValue}>Single</Text>
                 </View>
               </View>
               
               {/* See All Button - Below the bio card */}
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
             </View>
           )}

           {/* Other tabs content */}
           {activeTab !== 'Pictures' && activeTab !== 'Videos' && activeTab !== 'Belle\'s Bio' && (
             <View style={styles.gallerySection}>
               <Text style={styles.contentPlaceholder}>
                 {activeTab} content will be displayed here
               </Text>
             </View>
           )}
        </ScrollView>

        {/* Start Chat Button */}
        <View style={styles.startChatContainer}>
          <LinearGradient
            colors={['#DD3562', '#8354FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startChatButton}
          >
            <TouchableOpacity style={styles.startChatButtonContent} onPress={handleMessage}>
              <View style={styles.chatIconContainer}>
                <ChatIcon width={24} height={20} color="#ffff" />
              </View>
              <Text style={styles.startChatText}>Start Chat</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </CommonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DD3562',
  },
  scrollView: {
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    height: SCREEN_HEIGHT * 0.4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  messageButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  profileInfoContainer: {
    padding: 20,
   
  
    borderRadius: 12,
  },
  profileInfo: {
    flex: 1,
  },
  nameAndActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  nameAndDetails: {
    flex: 1,
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
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 1,
  },
  bioSection: {
    marginBottom: 25,
  },
  bioGreeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  interestsSection: {
    marginBottom: 25,
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  interestIconContainer: {
    marginRight: 6,
  },
  interestText: {
    fontSize: 14,
    color: '#B783EB',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#DD3562',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: '#DD3562',
    borderRadius: 1.5,
  },
  gallerySection: {
    padding: 20,
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
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
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  seeAllGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  seeAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 5,
  },
  startChatContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  startChatButton: {
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startChatButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  chatIconContainer: {
    marginRight: 10,
  },
  startChatText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // Video styles
  largeVideoGradientBorder: {
    width: '48%',
    padding: 2,
    borderRadius: 14,
  },
  largeVideoContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: '#FFFFFF',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },
  smallVideoGradientBorder: {
    flex: 1,
    padding: 2,
    borderRadius: 14,
  },
  smallVideoContainer: {
    flex: 1,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPlayButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPlayButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 2,
  },
  smallPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPlayTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: '#FFFFFF',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  contentPlaceholder: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
  },
  // Bio card styles
  bioCard: {
    backgroundColor: '#2A1A4A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  bioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  bioLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  bioSeparator: {
    fontSize: 16,
    color: '#B0B0B0',
    marginHorizontal: 10,
  },
  bioValue: {
    fontSize: 16,
    color: '#B0B0B0',
    flex: 2,
    textAlign: 'right',
  },
});

export default ProfileDetailsScreen;
