import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Image, Animated, FlatList, RefreshControl, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { VerifiedBadge, AccountVerifyBadge, OptionsMenu, PostVibeText, PostVibeIcon, HamburgerIcon } from '../../../components/icons/SvgIcons';
import VerifyModal from '../../../components/common/VerifyModal';
import ModeSwitchHeader from '../../../components/common/ModeSwitchHeader';
import InstagramMediaPicker from '../../../components/common/InstagramMediaPicker';
import { clearAuthData } from '../../../utils/authUtils';
import { APP_CONFIG } from '../../../utils/appConfig';
import PostCard from '../../../components/common/PostCard';
import NotificationBar from '../../../components/common/NotificationBar';
import { setVerifyModalShown } from '../../../redux/slices/uiSlice';

// Dimensions and sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.68;
const CARD_HEIGHT = Math.min(CARD_WIDTH * 1.6, screenHeight * 0.55); // Increased height for better visibility
const SPACING = 20; // Space between cards
const SIDE_CARD_OFFSET = (screenWidth - CARD_WIDTH) / 2;

const DATA = [
    {
        id: 'addVibe',
        name: 'AddVibe',
        image: require('../../../assets/images/postvibe.png'),
        isAdd: true,
    },
    
    {
        id: 'story1',
        name: 'Emma Wilson',
        image: require('../../../assets/DatingProfileImage/Match1.png'),
        isAdd: false,
    },
    {
        id: 'story2',
        name: 'Alex Chen',
        image: require('../../../assets/DatingProfileImage/Match2.png'),
        isAdd: false,
    },
    {
        id: 'story3',
        name: 'Sarah Johnson',
        image: require('../../../assets/DatingProfileImage/Match3.png'),
        isAdd: false,
    },
    {
        id: 'story4',
        name: 'Mike Rodriguez',
        image: require('../../../assets/DatingProfileImage/Match4.png'),
        isAdd: false,
    },
    {
        id: 'story5',
        name: 'Lisa Anderson',
        image: require('../../../assets/DatingProfileImage/Match5.png'),
        isAdd: false,
    },
    {
        id: 'story6',
        name: 'David Kim',
        image: require('../../../assets/DatingProfileImage/Match6.png'),
        isAdd: false,
    },
];

// Sample Posts Data
const POSTS_DATA = [
    {
        id: '1',
        user: {
            name: 'Emma Wilson',
            location: 'Berlin',
            isVerified: true,
        },
        text: 'Just had an amazing day exploring the city! The architecture here is incredible. ',
        image: require('../../../assets/images/story1.png'),
        likes: 24,
        comments: 8,
        timeAgo: '2 hours ago',
    },
    {
        id: 'suggestions',
        type: 'suggestions',
        title: 'Suggestions',
        suggestions: [
            {
                id: 'sug1',
                name: 'Emma Wilson',
                image: require('../../../assets/DatingProfileImage/Match1.png'),
            },
            {
                id: 'sug2',
                name: 'Alex Chen',
                image: require('../../../assets/DatingProfileImage/Match2.png'),
            },
            {
                id: 'sug3',
                name: 'Sarah Johnson',
                image: require('../../../assets/DatingProfileImage/Match3.png'),
            },
            {
                id: 'sug4',
                name: 'Mike Rodriguez',
                image: require('../../../assets/DatingProfileImage/Match4.png'),
            },
        ]
    },
    {
        id: '2',
        user: {
            name: 'Alex Chen',
            location: 'Tokyo',
            isVerified: false,
        },
        text: 'Working on some new projects today. The creative energy in this city is unmatched! 🎨',
        image: require('../../../assets/images/story2.png'),
        likes: 15,
        comments: 3,
        timeAgo: '4 hours ago',
    },
    {
        id: '3',
        user: {
            name: 'Sarah Johnson',
            location: 'London',
            isVerified: true,
        },
        text: 'Beautiful sunset from my window today. Sometimes the simple moments are the most precious. 🌅',
        likes: 42,
        comments: 12,
        timeAgo: '6 hours ago',
    },
    {
        id: '4',
        user: {
            name: 'Mike Rodriguez',
            location: 'Barcelona',
            isVerified: false,
        },
        text: 'New coffee shop discovered! The atmosphere here is perfect for getting work done. ☕',
        likes: 18,
        comments: 5,
        timeAgo: '8 hours ago',
    },
];


// Card Component - no hooks inside
const CarouselCard = ({ item, animatedStyle, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Animated.View style={[styles.card, animatedStyle]}>
            <Image
                source={item.image}
                style={styles.carouselImage}
                resizeMode="cover"
                onError={(error) => {
                    console.log('Image load error for', item.id, ':', error);
                }}
                onLoad={() => {
                    console.log('Image loaded successfully:', item.id);
                }}
            />

            {/* User Info Overlay for story cards */}
            {!item.isAdd && (
                <View style={styles.userInfoOverlay}>
                    <View style={styles.userInfoRow}>
                        <Image 
                            source={item.image} 
                            style={styles.userAvatar} 
                            resizeMode="cover"
                        />
                        <View style={styles.userDetails}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userTime}>4h</Text>
                        </View>
                    </View>
                </View>
            )}

            {item.isAdd && (
                <View style={styles.addOverlay}>
                    <PostVibeText width={120} height={45} />
                    <View style={styles.iconContainer}>
                        <PostVibeIcon width={40} height={40} />
                    </View>
                </View>
            )}
        </Animated.View>
    </TouchableOpacity>
);

// Suggestions Card Component
const SuggestionsCard = ({ item }) => (
    <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>{item.title}</Text>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScrollContent}
        >
            {item.suggestions.map((suggestion) => (
                <TouchableOpacity 
                    key={suggestion.id} 
                    style={styles.suggestionCard}
                    activeOpacity={0.8}
                >
                    <Image 
                        source={suggestion.image} 
                        style={styles.suggestionImage}
                        resizeMode="cover"
                    />
                    <Text style={styles.suggestionName}>{suggestion.name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

export default function HomeScreen() {
    const flatListRef = useRef();
    const scrollX = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();
    const { currentMode } = useSelector((state) => state.role);
    const { hasShownVerifyModal } = useSelector((state) => state.ui);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // Modal state
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showInstagramPicker, setShowInstagramPicker] = useState(false);

    // Pull to refresh state
    const [refreshing, setRefreshing] = useState(false);

    const currentUser = {
        name: 'Brandon Aminoff',
        location: 'Hamburg'
    };


    const handleCloseModal = () => {
        setShowVerifyModal(false);
    };

  const handlePostPress = (post) => {
    console.log('Post pressed:', post.id);
    
    // Create user data mapping for all posts
    const userDataMap = {
      'Emma Wilson': {
        username: 'Emma_Wilson',
        fullName: 'Emma Wilson',
        gender: 'Female (She/her)',
        bio: 'Love music, cooking, swimming, going out, travelling etc. Wanna be friends??',
        following: '15K',
        followers: '200K',
        isVerified: true,
        avatar: require('../../../assets/DatingProfileImage/Match1.png'),
      },
      'Alex Chen': {
        username: 'Alex_Chen',
        fullName: 'Alex Chen',
        gender: 'Male (He/him)',
        bio: 'Creative developer & designer. Always exploring new ideas! 💻',
        following: '8K',
        followers: '45K',
        isVerified: false,
        avatar: require('../../../assets/DatingProfileImage/Match2.png'),
      },
      'Sarah Johnson': {
        username: 'Sarah_Johnson',
        fullName: 'Sarah Johnson',
        gender: 'Female (She/her)',
        bio: 'Photographer & Travel enthusiast. Love capturing moments! 📸',
        following: '12K',
        followers: '67K',
        isVerified: true,
        avatar: require('../../../assets/DatingProfileImage/Match3.png'),
      },
      'Mike Rodriguez': {
        username: 'Mike_Rodriguez',
        fullName: 'Mike Rodriguez',
        gender: 'Male (He/him)',
        bio: 'Coffee lover & Developer. Always coding something new! ☕',
        following: '6K',
        followers: '28K',
        isVerified: false,
        avatar: require('../../../assets/DatingProfileImage/Match4.png'),
      },
    };

    // Navigate to OtherUserProfile for any post
    const userData = userDataMap[post.user.name];
    if (userData) {
      console.log(`${post.user.name} post pressed - navigating to OtherUserProfile`);
      navigation.navigate('OtherUserProfile', { userData });
    }
  };

  const handleCreatePost = () => {
    console.log('Create Post pressed - navigating to PostCreation');
    navigation.navigate('PostCreation');
  };

    const handleCarouselCardPress = (item) => {
        console.log('Carousel card pressed:', item.id);
        
        // Handle AddVibe card - open Instagram-style media picker
        if (item.isAdd) {
            console.log('AddVibe card pressed - opening Instagram media picker');
            setShowInstagramPicker(true);
            return;
        }
        
        // Navigate to OtherUserProfile for Emma Wilson
        if (item.id === 'story1' && item.name === 'Emma Wilson') {
            console.log('Emma Wilson card pressed - navigating to OtherUserProfile');
            const userData = {
                username: 'Emma_Wilson',
                fullName: 'Emma Wilson',
                gender: 'Female (She/her)',
                bio: 'Love music, cooking, swimming, going out, travelling etc. Wanna be friends??',
                following: '15K',
                followers: '200K',
                isVerified: true,
                avatar: require('../../../assets/DatingProfileImage/Match1.png'),
            };
            navigation.navigate('OtherUserProfile', { userData });
            return;
        }
        
        // Navigate to story screen for other cards
        navigation.navigate('Story', { storyId: item.id });
    };

    // Handle media selection from Instagram picker
    const handleMediaSelected = (media) => {
        console.log('Media selected:', media);
        Alert.alert(
            'Media Selected',
            `Selected: ${media.fileName || 'Unknown'}`,
            [{ text: 'OK' }]
        );
        // Here you can navigate to a post creation screen
        // navigation.navigate('CreatePost', { media });
    };

    // Close Instagram picker
    const handleCloseInstagramPicker = () => {
        setShowInstagramPicker(false);
    };

    // Development helper function to reset app state
    const handleResetApp = () => {
        const configMessage = APP_CONFIG.ALWAYS_START_FRESH
            ? 'App is configured to always start fresh (no need to reset).'
            : 'This will clear all authentication data and restart the app flow.';

        Alert.alert(
            'Reset App State',
            `${configMessage} Are you sure?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAuthData();
                        console.log('App state reset. Restart the app to see the auth flow.');
                    },
                },
            ]
        );
    };

    // Pull to refresh handler
    const onRefresh = async () => {
        setRefreshing(true);

        try {
            // Simulate API call or data refresh
            await new Promise(resolve => setTimeout(resolve, 1500));

           

            console.log('Content refreshed successfully');

        } catch (error) {
            console.error('Error refreshing content:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Show modal after 1 second when component mounts (only once)
    useEffect(() => {
        let timer;
        
        // Only show modal if it hasn't been shown before in this session
        if (!hasShownVerifyModal) {
            timer = setTimeout(() => {
                setShowVerifyModal(true);
                dispatch(setVerifyModalShown(true));
            }, 1000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [hasShownVerifyModal, dispatch]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#140034" />
            
            {/* Sticky Header */}
            <View style={[styles.stickyHeader, { paddingTop: insets.top }]}>
                <ModeSwitchHeader />
            </View>
            
            <ScrollView
                style={styles.scrollContainer}
                bounces={true}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#DD3562"
                        colors={["#DD3562", "#8354FF"]}
                        progressBackgroundColor="#140034"
                        title="Pull to refresh"
                        titleColor="#B0B0B0"
                    />
                }
            >
                <View style={styles.mainContent}>
                    <Animated.FlatList
                        ref={flatListRef}
                        data={DATA}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: SIDE_CARD_OFFSET,
                            paddingVertical: 10
                        }}
                        snapToInterval={CARD_WIDTH + SPACING}
                        decelerationRate="fast"
                        bounces={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                        renderItem={({ item, index }) => {
                            const inputRange = [
                                (index - 1) * (CARD_WIDTH + SPACING),
                                index * (CARD_WIDTH + SPACING),
                                (index + 1) * (CARD_WIDTH + SPACING),
                            ];
                            const translateY = scrollX.interpolate({
                                inputRange,
                                outputRange: [10, 0, 10],
                                extrapolate: 'clamp'
                            });
                            const scale = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.9, 1.05, 0.9],
                                extrapolate: 'clamp'
                            });
                            const animatedStyle = {
                                transform: [
                                    { translateY },
                                    { scale }
                                ]
                            };
                            return (
                                <CarouselCard 
                                    item={item} 
                                    animatedStyle={animatedStyle} 
                                    onPress={() => handleCarouselCardPress(item)}
                                />
                            );
                        }}
                    />
                </View>

                {/* Posts Section */}
                <View style={styles.postsSection}>
                 
                    {POSTS_DATA.map((post) => {
                        if (post.type === 'suggestions') {
                            return (
                                <SuggestionsCard 
                                    key={post.id} 
                                    item={post} 
                                />
                            );
                        }
                        return (
                            <PostCard
                                key={post.id}
                                post={post}
                                onPress={() => handlePostPress(post)}
                            />
                        );
                    })}
                </View>
            </ScrollView>

            {/* Verify Modal */}
            <VerifyModal
                visible={showVerifyModal}
                onClose={handleCloseModal}
            />
            {/* Instagram Media Picker */}
            <InstagramMediaPicker
                visible={showInstagramPicker}
                onClose={handleCloseInstagramPicker}
                onMediaSelected={handleMediaSelected}
            />

            {/* Notification Bar */}
            <NotificationBar navigation={navigation} />
          
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#140034' },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#140034',
    },
    mainContent: { marginTop: 20 },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: SPACING,
        borderRadius: 30,
        backgroundColor: '#2A1A4A',
        shadowColor: '#421192',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 6,
        overflow: 'hidden',
        position: 'relative',
      
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    imageOverlay: {
        position: 'absolute', bottom: 20, left: 20, right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 10,
        alignItems: 'center', zIndex: 2,
    },
    imageText: {
        color: 'white', fontSize: 16, fontWeight: '600',
    },
    addOverlay: {
        position: 'absolute', bottom: 20, width: '100%', alignItems: 'center',
        zIndex: 2,
    },
    iconContainer: {
        marginTop: 10,
    },

    userProfileSection: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 20, borderRadius: 16, marginBottom: 16,
    },
    userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    userAvatar: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#DD3562',
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    userAvatarText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    userDetails: { flex: 1 },
    userNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    userName: { fontSize: 16, fontWeight: '600', color: 'white', marginRight: 6 },
    userLocation: { fontSize: 14, color: '#B0B0B0' },
    optionsButton: { padding: 8 },

    actionBar: {
        backgroundColor: 'rgba(221,53,98,0.2)',
        marginHorizontal: 20, paddingVertical: 16, paddingHorizontal: 20,
        borderRadius: 25, borderWidth: 1, borderColor: 'rgba(221,53,98,0.3)', marginBottom: 20,
    },
    actionBarText: { color: '#DD3562', fontSize: 16, textAlign: 'center', fontWeight: '500' },

    additionalContent: { padding: 20, marginBottom: 20 },
    additionalContentText: { color: '#B0B0B0', fontSize: 16, textAlign: 'center', fontStyle: 'italic' },

    postsSection: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    postsSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 20,
        marginBottom: 16,
    },

    scrollContainer: { 
        flex: 1,
        paddingTop: 100, // Add padding to account for sticky header height
    },
    
    // Suggestions styles
    suggestionsContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    suggestionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    suggestionsScrollContent: {
        paddingRight: 20,
    },
    suggestionCard: {
        alignItems: 'center',
        marginRight: 15,
        width: 80,
    },
    suggestionImage: {
        width: 80,
        height: 140,
        borderRadius: 20,
        marginBottom: 8,
    },
    suggestionName: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    
    // User Info Overlay styles
    userInfoOverlay: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        zIndex: 10,
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    userAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'white',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginBottom: 2,
    },
    userTime: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    
    // Floating Action Button styles
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        shadowColor: '#C53E8D',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
