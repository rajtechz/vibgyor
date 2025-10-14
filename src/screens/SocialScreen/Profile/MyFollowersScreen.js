// src/screens/Profile/MyFollowersScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';

// Sample followers data
const FOLLOWERS_DATA = [
    {
        id: 1,
        name: 'Sophia Turner',
        timeAgo: '6h',
        avatar: require('../../../assets/DatingProfileImage/Match1.png'),
    },
    {
        id: 2,
        name: 'David Lee',
        timeAgo: '1h',
        avatar: require('../../../assets/DatingProfileImage/Match2.png'),
    },
    {
        id: 3,
        name: 'Olivia White',
        timeAgo: '4h',
        avatar: require('../../../assets/DatingProfileImage/Match3.png'),
    },
    {
        id: 4,
        name: 'James Harris',
        timeAgo: '3h',
        avatar: require('../../../assets/DatingProfileImage/Match4.png'),
    },
    {
        id: 5,
        name: 'Maria Gonzalez',
        timeAgo: '2h',
        avatar: require('../../../assets/DatingProfileImage/Match5.png'),
    },
    {
        id: 6,
        name: 'Liam O\'Connor',
        timeAgo: '1h 30m',
        avatar: require('../../../assets/DatingProfileImage/Match6.png'),
    },
    {
        id: 7,
        name: 'Sophia Kim',
        timeAgo: '4h 15m',
        avatar: require('../../../assets/DatingProfileImage/Match1.png'),
    },
    {
        id: 8,
        name: 'Noah Patel',
        timeAgo: '5h',
        avatar: require('../../../assets/DatingProfileImage/Match2.png'),
    },
    {
        id: 9,
        name: 'Emma Thompson',
        timeAgo: '2h 45m',
        avatar: require('../../../assets/DatingProfileImage/Match3.png'),
    },
    {
        id: 10,
        name: 'Alexander Lee',
        timeAgo: '3h 30m',
        avatar: require('../../../assets/DatingProfileImage/Match4.png'),
    },
    {
        id: 11,
        name: 'Olivia Brown',
        timeAgo: '1h',
        avatar: require('../../../assets/DatingProfileImage/Match5.png'),
    },
    {
        id: 12,
        name: 'Ethan Wilson',
        timeAgo: '2h 15m',
        avatar: require('../../../assets/DatingProfileImage/Match6.png'),
    },
];

function MyFollowersScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [followers, setFollowers] = useState(FOLLOWERS_DATA);

    const handleRemove = (followerId) => {
        console.log('Remove follower:', followerId);
        setFollowers(prev => prev.filter(follower => follower.id !== followerId));
    };

    const handleBlock = (followerId) => {
        console.log('Block follower:', followerId);
        setFollowers(prev => prev.filter(follower => follower.id !== followerId));
    };

    const renderFollowerItem = ({ item }) => (
        <View style={styles.followerItem}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.followerInfo}>
                <Text style={styles.followerName}>{item.name}</Text>
                <Text style={styles.followerTime}>{item.timeAgo}</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemove(item.id)}
                >
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.blockButton}
                    onPress={() => handleBlock(item.id)}
                >
                    <Text style={styles.blockButtonText}>Block</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <CommonBackground>
            <StatusBar barStyle="light-content" backgroundColor="#140034" />
            
            {/* Header */}
            <ModeSwitchHeader customTitle="Followers" style={{ paddingTop: insets.top }} />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <FlatList
                    data={followers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderFollowerItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            </ScrollView>
        </CommonBackground>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingVertical: 20,
    },
    followerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    followerInfo: {
        flex: 1,
    },
    followerName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    followerTime: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    removeButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    removeButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    blockButton: {
        borderWidth: 1,
        borderColor: '#FF3B30',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    blockButtonText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default MyFollowersScreen;
