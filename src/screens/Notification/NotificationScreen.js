import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import CommonBackground from '../../components/common/CommonBackground';

// Back Icon Component
const BackIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M15.375 5.25L8.625 12L15.375 18.75" 
      stroke="#D9D8F3" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Gradient Divider Component
const GradientDivider = ({ width = '100%', height = 1 }) => (
  <Svg width={width} height={height} viewBox="0 0 100 1" preserveAspectRatio="none">
    <Rect width="100" height="1" fill="url(#dividerGradient)"/>
    <Defs>
      <SvgLinearGradient id="dividerGradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562" stopOpacity="0.8"/>
        <Stop offset="0.5" stopColor="#DD3562" stopOpacity="0.4"/>
        <Stop offset="1" stopColor="#8354FF" stopOpacity="0.8"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

const NotificationScreen = ({ navigation }) => {
  // Sample notification data matching the Figma design
  const notifications = [
    {
      id: '1',
      title: 'Olivia Smith sent you a message',
      description: 'Hey Mathew, it\'s Olivia! Looking forward to our conversation!',
      avatar: require('../../assets/images/user.png'), // You can replace with actual avatar
      timestamp: null, // Recent message, no timestamp
      type: 'message'
    },
    {
      id: '2',
      title: 'Limited Time Deal!',
      description: 'Join our exclusive webinar, register now and expand your skills.',
      avatar: require('../../assets/images/user.png'),
      timestamp: '12:45 PM | 30.04.2021',
      type: 'deal'
    },
    {
      id: '3',
      title: 'Jake Taylor liked your post',
      description: 'Hi Mathew, I appreciate the support! Let\'s connect more soon..',
      avatar: require('../../assets/images/user.png'),
      timestamp: '03:15 PM | 29.04.2021',
      type: 'like'
    },
    {
      id: '4',
      title: 'You liked Zoe',
      description: 'You liked Zoe, check her interests, start a fun chat..',
      avatar: require('../../assets/images/user.png'),
      timestamp: '01:30 PM | 29.04.2021',
      type: 'match'
    },
    {
      id: '5',
      title: 'Event invitation from Mark Lee',
      description: 'Mark invites you to a networking event next Saturday evening.',
      avatar: require('../../assets/images/user.png'),
      timestamp: '05:00 PM | 29.04.2021',
      type: 'event'
    }
  ];

  const handleNotificationPress = (notification) => {
    console.log('Notification pressed:', notification.id);
    // Add navigation logic based on notification type
    switch (notification.type) {
      case 'message':
        // Navigate to chat
        break;
      case 'like':
        // Navigate to post
        break;
      case 'match':
        // Navigate to profile
        break;
      case 'event':
        // Navigate to event details
        break;
      default:
        break;
    }
  };

  const renderNotificationItem = (notification, index) => (
    <View key={notification.id}>
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={() => handleNotificationPress(notification)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image source={notification.avatar} style={styles.avatar} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationDescription}>{notification.description}</Text>
          {notification.timestamp && (
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
          )}
        </View>
      </TouchableOpacity>
      {/* Add gradient divider after each item except the last one */}
      {index < notifications.length - 1 && (
        <View style={styles.dividerContainer}>
          <GradientDivider width="100%" height={1} />
        </View>
      )}
    </View>
  );

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Notification</Text>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.map((notification, index) => renderNotificationItem(notification, index))}
      </ScrollView>
    </CommonBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    flex: 1,
  },
  headerTitle: {
    color: '#DD3562',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dividerContainer: {
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DD3562', // Fallback color
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 22,
  },
  notificationDescription: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    color: '#B0B0B0',
    fontSize: 12,
    marginTop: 4,
  },
});

export default NotificationScreen;
