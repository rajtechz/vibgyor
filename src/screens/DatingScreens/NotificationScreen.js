import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { NotificationBellIcon } from '../../components/icons/SvgIcons';

const { width: screenWidth } = Dimensions.get('window');

// Back Icon Component
const BackIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18l-6-6 6-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


const NotificationScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState({
    today: [
      {
        id: 1,
        title: "John Liked Your Profile",
        timestamp: "25 Oct 2024 - 11:31 AM",
        description: null,
        isRead: false,
      },
      {
        id: 2,
        title: "3 more days until WJNC #9 starts!",
        timestamp: "15 Oct 2024 - 9:30 AM",
        description: null,
        isRead: false,
      },
      {
        id: 3,
        title: "Event Review Request",
        timestamp: "10 Oct 2024 - 09:43 AM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et...",
        isRead: false,
      },
      {
        id: 4,
        title: "Event Booked Successfully",
        timestamp: "9 Oct 2024 - 10:10 AM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et...",
        isRead: false,
      },
    ],
    yesterday: [
      {
        id: 5,
        title: "Event Review Request",
        timestamp: "10 Oct 2024 - 09:43 AM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et...",
        isRead: false,
      },
      {
        id: 6,
        title: "Event Booked Successfully",
        timestamp: "9 Oct 2024 - 10:10 AM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et...",
        isRead: false,
      },
    ],
  });

  const markAllAsRead = (section) => {
    setNotifications(prev => ({
      ...prev,
      [section]: prev[section].map(notification => ({
        ...notification,
        isRead: true,
      })),
    }));
  };

  const NotificationItem = ({ notification, isLast = false }) => (
    <TouchableOpacity style={styles.notificationItem} activeOpacity={0.7}>
      <View style={styles.notificationContent}>
        <LinearGradient
          colors={['#DD3562', '#8354FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.notificationIconGradient}
        >
          <View style={styles.notificationIconInner}>
            <NotificationBellIcon width={20} height={20} color="#DD3562" />
          </View>
        </LinearGradient>
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          {notification.description && (
            <Text style={styles.notificationDescription}>{notification.description}</Text>
          )}
          <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
        </View>
      </View>
      {!isLast && <View style={styles.separator} />}
    </TouchableOpacity>
  );

  const NotificationSection = ({ title, notifications, onMarkAllAsRead }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => onMarkAllAsRead(title.toLowerCase())}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isLast={index === notifications.length - 1}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Notification</Text>
      </View>

      {/* Notifications */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <NotificationSection
          title="TODAY"
          notifications={notifications.today}
          onMarkAllAsRead={markAllAsRead}
        />
        
        <NotificationSection
          title="YESTERDAY"
          notifications={notifications.yesterday}
          onMarkAllAsRead={markAllAsRead}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140034',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DD3562',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B0B0B0',
  },
  markAllText: {
    fontSize: 14,
    color: '#DD3562',
    fontWeight: '500',
  },
  notificationItem: {
    marginBottom: 8,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  notificationIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 1.5,
    marginRight: 12,
  },
  notificationIconInner: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  separator: {
    height: 1,
    backgroundColor: '#2A1A4A',
    marginLeft: 52,
  },
});

export default NotificationScreen;
