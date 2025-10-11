import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
    ScrollView,
  TouchableOpacity,
  StatusBar,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';
import GradientDivider from '../../../components/common/GradientDivider';

// Import images - using fallback approach for now
// Note: React Native has issues with spaces in filenames, so we'll use existing images
const ProfilePicture1 = require('../../../assets/images/notificationUser/user1.png');
const ProfilePicture2 = require('../../../assets/images/notificationUser/user2.png');
const StrokeBg1 = require('../../../assets/images/notificationUser/user3.png');
const StrokeBg2 = require('../../../assets/images/notificationUser/user4.png');
const StrokeBg3 = require('../../../assets/images/notificationUser/user5.png');

export default function DatingNotificationsScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    // Sample notification data matching the Figma design
    const notifications = [
        {
            id: '1',
            title: 'Myley Corbyn liked you',
            description: 'Hi Mathew, Myley here. Would you like to chat? waiting..',
            timestamp: '03:42 PM | 30.04.2021',
            avatar: ProfilePicture1,
            type: 'like'
        },
        {
            id: '2',
            title: 'Big Discount, Hurry!',
            description: 'Season\'s discount, only for you, put yourself in spotlight, enjoy dating.',
            timestamp: '09:32 AM | 30.04.2021',
            avatar: StrokeBg1,
            type: 'promotion'
        },
        {
            id: '3',
            title: 'Sara Christin liked you back',
            description: 'Hi Mathew, Thanks for your interest. Would love to hear you bak..',
            timestamp: '11:13 AM | 29.04.2021',
            avatar: StrokeBg2,
            type: 'like'
        },
        {
            id: '4',
            title: 'You liked Ruby',
            description: 'You liked Ruby, check out what\'s her response, keep dating..',
            timestamp: '09:57 AM | 29.04.2021',
            avatar: ProfilePicture2,
            type: 'like'
        },
        {
            id: '5',
            title: 'New proposal from Sansa Ben',
            description: 'Sansa has proposed you for going out to a nearest event on this weeke...',
            timestamp: '10:57 AM | 29.04.2021',
            avatar: StrokeBg3,
            type: 'proposal'
        }
    ];

    const handleNotificationPress = (notification) => {
        // Handle notification press
        console.log('Notification pressed:', notification.title);
    };

    const renderNotificationItem = (notification, index) => (
        <View key={notification.id}>
            <TouchableOpacity 
                style={styles.notificationItem}
                onPress={() => handleNotificationPress(notification)}
            >
                <View style={styles.avatarContainer}>
                    <Image source={notification.avatar} style={styles.avatar} />
                </View>
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationDescription}>{notification.description}</Text>
                    <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                </View>
            </TouchableOpacity>
            
            {/* Gradient divider after each notification */}
            <View style={styles.divider}>
                <GradientDivider 
                    height={1} 
                    gradient="primary" 
                    opacity={0.6}
                />
            </View>
  </View>
);

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
        {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <BackIcon width={24} height={24} color="#D9D8F3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
             
                
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
    paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2A1A4A',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    color: '#DD3562',
  },
  headerSpacer: {
    width: 40,
  },
    scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
    scrollContent: {
        paddingBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    notificationContent: {
    flex: 1,
  },
    notificationTitle: {
        fontSize: 16,
    fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    notificationDescription: {
        fontSize: 14,
        color: 'white',
        marginBottom: 4,
        lineHeight: 20,
    },
    notificationTime: {
        fontSize: 12,
    color: '#B0B0B0',
    },
    divider: {
        marginVertical: 5,
  },
});
