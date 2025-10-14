// src/screens/Profile/MyFollowingScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CommonBackground from '../../../components/common/CommonBackground';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';

// Sample following data
const FOLLOWING_DATA = [
    {
        id: 1,
        name: 'Liam Johnson',
        timeAgo: '5h',
        avatar: require('../../../assets/DatingProfileImage/Match1.png'),
    },
    {
        id: 2,
        name: 'Emma Davis',
        timeAgo: '8h',
        avatar: require('../../../assets/DatingProfileImage/Match2.png'),
    },
    {
        id: 3,
        name: 'Noah Wilson',
        timeAgo: '4h',
        avatar: require('../../../assets/DatingProfileImage/Match3.png'),
    },
    {
        id: 4,
        name: 'Olivia Brown',
        timeAgo: '2h',
        avatar: require('../../../assets/DatingProfileImage/Match4.png'),
    },
    {
        id: 5,
        name: 'Lucas Garcia',
        timeAgo: '6h',
        avatar: require('../../../assets/DatingProfileImage/Match5.png'),
    },
    {
        id: 6,
        name: 'Ava Martinez',
        timeAgo: '3h',
        avatar: require('../../../assets/DatingProfileImage/Match6.png'),
    },
    {
        id: 7,
        name: 'Mason Rodriguez',
        timeAgo: '7h',
        avatar: require('../../../assets/DatingProfileImage/Match1.png'),
    },
    {
        id: 8,
        name: 'Isabella Lee',
        timeAgo: '1h',
        avatar: require('../../../assets/DatingProfileImage/Match2.png'),
    },
    {
        id: 9,
        name: 'Ethan Hall',
        timeAgo: '9h',
        avatar: require('../../../assets/DatingProfileImage/Match3.png'),
    },
    {
        id: 10,
        name: 'Mia Young',
        timeAgo: '5h 30m',
        avatar: require('../../../assets/DatingProfileImage/Match4.png'),
    },
    {
        id: 11,
        name: 'Logan Hernandez',
        timeAgo: '2h 15m',
        avatar: require('../../../assets/DatingProfileImage/Match5.png'),
    },
    {
        id: 12,
        name: 'Aria Smith',
        timeAgo: '4h 45m',
        avatar: require('../../../assets/DatingProfileImage/Match6.png'),
    },
];

function MyFollowingScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [following, setFollowing] = useState(FOLLOWING_DATA);

    const handleUnfollow = (followingId) => {
        console.log('Unfollow user:', followingId);
        setFollowing(prev => prev.filter(user => user.id !== followingId));
    };

    const handleBlock = (followingId) => {
        console.log('Block user:', followingId);
        setFollowing(prev => prev.filter(user => user.id !== followingId));
    };

    const renderFollowingItem = ({ item }) => (
        <View style={styles.followingItem}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.followingInfo}>
                <Text style={styles.followingName}>{item.name}</Text>
                <Text style={styles.followingTime}>{item.timeAgo}</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity 
                    style={styles.unfollowButton}
                    onPress={() => handleUnfollow(item.id)}
                >
                    <Text style={styles.unfollowButtonText}>Unfollow</Text>
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
            <ModeSwitchHeader customTitle="Following" style={{ paddingTop: insets.top }} />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <FlatList
                    data={following}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderFollowingItem}
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
    followingItem: {
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
    followingInfo: {
        flex: 1,
    },
    followingName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    followingTime: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    unfollowButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    unfollowButtonText: {
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

export default MyFollowingScreen;
