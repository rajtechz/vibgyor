// src/screens/Messages/MessagesScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '../../../redux/slices/roleSlice';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';
import { useNavigation } from '@react-navigation/native';
import DatingHeader from '../../../components/common/DatingHeader';

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

// Bucket Icon Component - 100% Perfect Circle
const BucketIcon = ({ width = 48, height = 48 }) => (
  <Svg width={width} height={height} viewBox="0 0 48 48" fill="none">
    <Path
      d="M24 1C11.317 1 1 11.317 1 24s10.317 23 23 23 23-10.317 23-23S36.683 1 24 1z"
      stroke="url(#paint0_linear_577_3315)"
      strokeWidth="1"
    />
    <Path
      d="M30.0136 32.25C31.6001 32.25 32.8125 30.8785 32.8125 29.2813V20.375H16.1875V29.2813C16.1875 30.8785 17.3999 32.25 18.9864 32.25H30.0136ZM21.5313 22.75H27.4688C27.6262 22.75 27.7773 22.8126 27.8886 22.9239C28 23.0353 28.0625 23.1863 28.0625 23.3438C28.0625 23.5012 28 23.6523 27.8886 23.7636C27.7773 23.875 27.6262 23.9375 27.4688 23.9375H21.5313C21.3738 23.9375 21.2228 23.875 21.1114 23.7636C21.0001 23.6523 20.9375 23.5012 20.9375 23.3438C20.9375 23.1863 21.0001 23.0353 21.1114 22.9239C21.2228 22.8126 21.3738 22.75 21.5313 22.75ZM15.95 15.625C15.698 15.625 15.4564 15.7251 15.2782 15.9032C15.1001 16.0814 15 16.323 15 16.575V18C15 18.252 15.1001 18.4936 15.2782 18.6718C15.4564 18.8499 15.698 18.95 15.95 18.95H33.05C33.302 18.95 33.5436 18.8499 33.7218 18.6718C33.8999 18.4936 34 18.252 34 18V16.575C34 16.323 33.8999 16.0814 33.7218 15.9032C33.5436 15.7251 33.302 15.625 33.05 15.625H15.95Z"
      fill="url(#paint1_linear_577_3315)"
    />
    <Defs>
      <SvgLinearGradient id="paint0_linear_577_3315" x1="4.26994" y1="48" x2="45.2025" y2="48" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#C53E8D" />
        <Stop offset="1" stopColor="#8A52F3" />
      </SvgLinearGradient>
      <SvgLinearGradient id="paint1_linear_577_3315" x1="16.199" y1="29.5296" x2="35.1583" y2="28.4249" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562" />
        <Stop offset="1" stopColor="#8354FF" />
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

// Message Icon Component
const MessageIcon = ({ width = 24, height = 24, color = '#B0B0B0' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Gradient Border Component - Using LinearGradient like LocationScreen
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

// Online Indicator Component
const OnlineIndicator = () => (
  <View style={styles.onlineIndicator} />
);

// Chat Item Component
const ChatItem = ({ name, lastMessage, time, unreadCount, isOnline, isRead, image, onPress }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress}>
    <LinearGradient
      colors={['#501B41', '#3A062C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.chatItemGradient}
    >
      <View style={styles.chatAvatar}>
        <Image source={image} style={styles.chatAvatarImage} />
        {isOnline && <OnlineIndicator />}
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{name}</Text>
          <Text style={styles.chatTime}>{time}</Text>
        </View>
        <View style={styles.chatMessageContainer}>
          <Text style={[styles.chatMessage, !isRead && styles.unreadMessage]} numberOfLines={1}>
            {lastMessage}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

// Search Bar Component
const SearchBar = ({ value, onChangeText }) => (
  <View style={styles.searchBar}>
    <MessageIcon width={20} height={20} color="#B0B0B0" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search conversations..."
      placeholderTextColor="#B0B0B0"
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

function DatingMessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { currentMode } = useSelector((state) => state.role);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const handleModeToggle = () => {
    dispatch(setMode(currentMode === 'social' ? 'dating' : 'social'));
  };

  const handleArchive = () => {
    console.log('Navigating to DatingArchive...');
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      navigation.navigate('DatingArchive');
    }, 50);
  };

  const handleChatPress = (user) => {
    navigation.navigate('DatingChat', { user });
  };

  const handleMenuPress = () => {
    // Handle menu press
    console.log('Menu pressed');
  };

  const handleNotificationPress = () => {
    // Handle notification press
    console.log('Notification pressed');
  };

  // Live profiles data with real images
  const liveProfiles = [
    { id: 1, name: 'Alex', image: require('../../../assets/liveUser/user.png') },
    { id: 2, name: 'Sarah', image: require('../../../assets/liveUser/user1.png') },
    { id: 3, name: 'Mike', image: require('../../../assets/liveUser/user3.png') },
    { id: 4, name: 'Emma', image: require('../../../assets/liveUser/user4.png') },
    { id: 5, name: 'David', image: require('../../../assets/liveUser/user5.png') },
  ];

  // Messages data with real user images
  const chats = [
    {
      name: 'Belle Benson',
      lastMessage: 'Hi, How are you? Nice to meet you? Free now, You?',
      time: '3:45 PM',
      unreadCount: 2,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message1.png'),
    },
    {
      name: 'Liam Johnson',
      lastMessage: 'Hey Belle! I\'m doing well, just wrapping up some work.',
      time: '4:15 PM',
      unreadCount: 3,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message2.png'),
    },
    {
      name: 'Sophie Parker',
      lastMessage: 'Hello! I just got back from a walk. What\'s up?',
      time: '4:30 PM',
      unreadCount: 1,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message3.png'),
    },
    {
      name: 'Emma Wilson',
      lastMessage: 'Hey everyone! Just finished my workout. How\'s your day going?',
      time: '5:00 PM',
      unreadCount: 4,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message4.png'),
    },
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />

      {/* Header */}
      <DatingHeader
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        showMessage={true}
      />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <GradientBorder style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for messages"
            placeholderTextColor="#B0B0B0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <SearchIcon width={20} height={20} color="#B0B0B0" />
        </GradientBorder>
        <TouchableOpacity style={styles.bucketIconButton} onPress={handleArchive}>
          <BucketIcon width={48} height={48} />
        </TouchableOpacity>
      </View>

      {/* Live Section - Sticky */}
      <View style={styles.liveSection}>
        <Text style={styles.sectionTitle}>Live</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.liveProfilesContainer}
        >
          {liveProfiles.map((profile) => (
            <TouchableOpacity key={profile.id} >
              <View style={styles.liveAvatar}>
                <Image source={profile.image} style={styles.liveAvatarImage} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* All Messages Section */}
        <View style={styles.messagesSection}>
          <Text style={styles.sectionTitle}>All Messages</Text>
          <View style={styles.messagesList}>
            {filteredChats.map((chat, index) => (
              <ChatItem
                key={index}
                name={chat.name}
                lastMessage={chat.lastMessage}
                time={chat.time}
                unreadCount={chat.unreadCount}
                isOnline={chat.isOnline}
                isRead={chat.isRead}
                image={chat.image}
                onPress={() => handleChatPress(chat)}
              />
            ))}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  searchInputGradient: {
    flex: 1,
    borderRadius: 30,
    padding: 2, // Border thickness
    marginRight: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  bucketIconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    // No additional styling needed - icon has its own gradient border
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  liveProfilesContainer: {
    paddingRight: 20,
  },
  liveSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 16,

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },


  liveAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  liveAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  messagesSection: {
    marginBottom: 24,
  },
  messagesList: {
    // Removed gap - using marginBottom on individual items
  },
  chatItem: {
    marginBottom: 12,
  },
  chatItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  chatAvatar: {
    position: 'relative',
    marginRight: 16,
  },
  chatAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#140034',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  chatTime: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  chatMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
  },
  unreadMessage: {
    color: 'white',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#DD3562',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DatingMessagesScreen;
