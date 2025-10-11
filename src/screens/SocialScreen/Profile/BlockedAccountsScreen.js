import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackIcon, BlockedIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';

export default function BlockedAccountsScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const [blockedUsers, setBlockedUsers] = useState([
        {
            id: '1',
            name: 'Belle Benson',
            username: '@bellebenson',
            avatar: require('../../../assets/DatingProfileImage/Match1.png'),
            blockedDate: '2024-01-15',
            reason: 'Inappropriate messages'
        },
        {
            id: '2',
            name: 'John Doe',
            username: '@johndoe',
            avatar: require('../../../assets/DatingProfileImage/Match2.png'),
            blockedDate: '2024-01-10',
            reason: 'Spam'
        },
        {
            id: '3',
            name: 'Jane Smith',
            username: '@janesmith',
            avatar: require('../../../assets/DatingProfileImage/Match3.png'),
            blockedDate: '2024-01-05',
            reason: 'Harassment'
        },
        {
            id: '4',
            name: 'Mike Johnson',
            username: '@mikej',
            avatar: require('../../../assets/DatingProfileImage/Match4.png'),
            blockedDate: '2023-12-28',
            reason: 'Fake profile'
        }
    ]);

    // Removed search functionality to match Figma design

    const handleUnblock = (userId) => {
        Alert.alert(
            'Unblock User',
            'Are you sure you want to unblock this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unblock',
                    style: 'destructive',
                    onPress: () => {
                        setBlockedUsers(prev => prev.filter(user => user.id !== userId));
                        Alert.alert('Success', 'User has been unblocked');
                    }
                }
            ]
        );
    };

    const handleBlockNewUser = () => {
        Alert.alert('Block User', 'To block a user, go to their profile and tap the block option.');
    };

    const renderBlockedUser = (user) => (
        <View key={user.id} style={styles.userContainer}>
            <Image source={user.avatar} style={styles.avatar} />
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.blockedStatus}>Blocked</Text>
            </View>
            <TouchableOpacity
                style={styles.unblockButton}
                onPress={() => handleUnblock(user.id)}
            >
                <Text style={styles.unblockButtonText}>Unblock</Text>
            </TouchableOpacity>
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
                <Text style={styles.headerTitle}>Blocked Accounts</Text>
              
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {blockedUsers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <BlockedIcon width={80} height={80} />
                        <Text style={styles.emptyTitle}>No blocked users</Text>
                        <Text style={styles.emptyDescription}>
                            Users you block will appear here
                        </Text>
                    </View>
                ) : (
                    <View style={styles.usersList}>
                        {blockedUsers.map(renderBlockedUser)}
                    </View>
                )}
            </ScrollView>
        </CommonBackground>
    );
}

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
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    usersList: {
        paddingTop: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#34344A4D',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    blockedStatus: {
        fontSize: 14,
        color: '#B0B0B0',
    },
    unblockButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'transparent',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'white',
    },
    unblockButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginTop: 20,
        marginBottom: 10,
    },
    emptyDescription: {
        fontSize: 14,
        color: '#B0B0B0',
        textAlign: 'center',
        lineHeight: 20,
    },
});
