import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Animated, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';

// Back Arrow Icon
const BackArrowIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
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

// Chat Item Component
const ChatItem = ({ name, lastMessage, time, unreadCount, isOnline, isRead, image, onPress }) => (
  <TouchableOpacity style={styles.chatItemWrapper} onPress={onPress}>
    <LinearGradient
      colors={['#501B41', '#3A062C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.chatItem}
    >
      <View style={styles.chatContent}>
        <View style={styles.avatarContainer}>
          <Image source={image} style={styles.avatar} />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.messageInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={[styles.lastMessage, !isRead && styles.unreadMessage]} numberOfLines={1}>
              {lastMessage}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const ArchiveMessage = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Smooth fade-in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGoBack = () => {
    console.log('Going back to Messages...');
    // Smooth fade-out animation before navigation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
    });
  };

  const handleChatPress = (user) => {
    navigation.navigate('Chat', { user });
  };

  // Archived messages data
  const archivedMessages = [
    {
      id: 1,
      name: 'Belle Benson',
      lastMessage: 'Hi, How are you? Nice to meet you? Free now, You?',
      time: '3:45 PM',
      unreadCount: 2,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message1.png')
    },
    {
      id: 2,
      name: 'Liam Johnson',
      lastMessage: 'Hey Belle! I\'m doing well, just wrapping up some work.',
      time: '4:15 PM',
      unreadCount: 3,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message2.png')
    },
    {
      id: 3,
      name: 'Sophie Parker',
      lastMessage: 'Hello! I just got back from a walk. What\'s up?',
      time: '4:30 PM',
      unreadCount: 1,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message3.png')
    },
    {
      id: 4,
      name: 'Ethan Smith',
      lastMessage: 'Hey! Just wanted to check in. How\'s your day going?',
      time: '5:00 PM',
      unreadCount: 4,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message4.png')
    },
    {
      id: 5,
      name: 'Olivia Brown',
      lastMessage: 'Hi team! I\'m all set for our meeting later, do you think?',
      time: '5:15 PM',
      unreadCount: 5,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message1.png')
    },
    {
      id: 6,
      name: 'Ava Wilson',
      lastMessage: 'Ready to dive into some projects, how about you?',
      time: '5:45 PM',
      unreadCount: 2,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message2.png')
    },
    {
      id: 7,
      name: 'Noah Davis',
      lastMessage: 'Let\'s get started on those tasks we discussed earlier!',
      time: '6:00 PM',
      unreadCount: 6,
      isOnline: true,
      isRead: false,
      image: require('../../../assets/messageUser/message3.png')
    },
    {
      id: 8,
      name: 'Mia Garcia',
      lastMessage: 'Just got some updates from the team, everything looks good!',
      time: '6:30 PM',
      unreadCount: 0,
      isOnline: true,
      isRead: true,
      image: require('../../../assets/messageUser/message4.png')
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      <CommonBackground>
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleGoBack}
            >
              <BackArrowIcon width={24} height={24} color="#D9D8F3" />
            </TouchableOpacity>
            <Text style={styles.title}>Archive</Text>
          </View>

          {/* Messages List */}
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.messagesSection}>
              <Text style={styles.sectionTitle}>Archived Messages</Text>
              <View style={styles.messagesList}>
                {archivedMessages.map((message) => (
                  <ChatItem
                    key={message.id}
                    name={message.name}
                    lastMessage={message.lastMessage}
                    time={message.time}
                    unreadCount={message.unreadCount}
                    isOnline={message.isOnline}
                    isRead={message.isRead}
                    image={message.image}
                    onPress={() => handleChatPress(message)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </CommonBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140034',
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: '#DD3562',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  messagesSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  messagesList: {
    gap: 12,
  },
  chatItemWrapper: {
    marginBottom: 8,
  },
  chatItem: {
    borderRadius: 12,
    padding: 16,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  messageInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  time: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
    marginRight: 8,
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
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ArchiveMessage;
