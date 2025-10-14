import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Animated,
    SafeAreaView,
    Alert,
    TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setStoryScreenActive } from '../../../redux/slices/uiSlice';
import { AccountVerifyBadge, HamburgerIcon, LikeIcon, ShareIcon, TrashIcon, EyeIcon } from '../../../components/icons/SvgIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const STORY_DATA = {
    'story1': {
        id: 'story1',
        user: {
            name: 'Emma Wilson',
            location: 'Berlin',
            isVerified: true,
            avatar: require('../../../assets/DatingProfileImage/Match1.png'),
        },
        stories: [
            {
                id: 'story1_1',
                image: require('../../../assets/DatingProfileImage/Match1.png'),
                text: 'Just had an amazing day exploring the city! The architecture here is incredible.',
                timeAgo: '2 hours ago',
            },
            {
                id: 'story1_2',
                image: require('../../../assets/DatingProfileImage/Match2.png'),
                text: 'Found this beautiful cafe with the most amazing coffee! ☕',
                timeAgo: '2 hours ago',
            }
        ],
        likes: 24,
        comments: 8,
    },
    'story2': {
        id: 'story2',
        user: {
            name: 'Alex Chen',
            location: 'Tokyo',
            isVerified: false,
            avatar: require('../../../assets/DatingProfileImage/Match2.png'),
        },
        stories: [
            {
                id: 'story2_1',
                image: require('../../../assets/DatingProfileImage/Match2.png'),
                text: 'Working on some new projects today. The creative energy in this city is unmatched! 🎨',
                timeAgo: '4 hours ago',
            },
            {
                id: 'story2_2',
                image: require('../../../assets/DatingProfileImage/Match3.png'),
                text: 'Team lunch at the best ramen place in the neighborhood! 🍜',
                timeAgo: '4 hours ago',
            }
        ],
        likes: 15,
        comments: 3,
    },
    'story3': {
        id: 'story3',
        user: {
            name: 'Sarah Johnson',
            location: 'London',
            isVerified: true,
            avatar: require('../../../assets/DatingProfileImage/Match3.png'),
        },
        stories: [
            {
                id: 'story3_1',
                image: require('../../../assets/DatingProfileImage/Match3.png'),
                text: 'Beautiful sunset from my window today. Sometimes the simple moments are the most precious. 🌅',
                timeAgo: '6 hours ago',
            },
            {
                id: 'story3_2',
                image: require('../../../assets/DatingProfileImage/Match4.png'),
                text: 'Morning walk through Hyde Park - nature is so healing! 🌿',
                timeAgo: '6 hours ago',
            }
        ],
        likes: 42,
        comments: 12,
    },
    'story4': {
        id: 'story4',
        user: {
            name: 'Mike Rodriguez',
            location: 'Barcelona',
            isVerified: false,
            avatar: require('../../../assets/DatingProfileImage/Match4.png'),
        },
        stories: [
            {
                id: 'story4_1',
                image: require('../../../assets/DatingProfileImage/Match4.png'),
                text: 'New coffee shop discovered! The atmosphere here is perfect for getting work done. ☕',
                timeAgo: '8 hours ago',
            },
            {
                id: 'story4_2',
                image: require('../../../assets/DatingProfileImage/Match5.png'),
                text: 'Sagrada Familia never gets old - such incredible architecture! ⛪',
                timeAgo: '8 hours ago',
            }
        ],
        likes: 18,
        comments: 5,
    },
    'story5': {
        id: 'story5',
        user: {
            name: 'Lisa Anderson',
            location: 'Paris',
            isVerified: true,
            avatar: require('../../../assets/DatingProfileImage/Match5.png'),
        },
        stories: [
            {
                id: 'story5_1',
                image: require('../../../assets/DatingProfileImage/Match5.png'),
                text: 'Art gallery opening tonight! The creativity in this city never ceases to amaze me. 🎨',
                timeAgo: '3 hours ago',
            },
            {
                id: 'story5_2',
                image: require('../../../assets/DatingProfileImage/Match6.png'),
                text: 'Croissant and coffee by the Seine - perfect morning routine! ☕',
                timeAgo: '3 hours ago',
            }
        ],
        likes: 31,
        comments: 7,
    },
    'story6': {
        id: 'story6',
        user: {
            name: 'David Kim',
            location: 'Seoul',
            isVerified: false,
            avatar: require('../../../assets/DatingProfileImage/Match6.png'),
        },
        stories: [
            {
                id: 'story6_1',
                image: require('../../../assets/DatingProfileImage/Match6.png'),
                text: 'K-pop concert was absolutely incredible! The energy was electric! 🎵',
                timeAgo: '5 hours ago',
            },
            {
                id: 'story6_2',
                image: require('../../../assets/DatingProfileImage/Match1.png'),
                text: 'Late night street food adventure - Korean BBQ never disappoints! 🍖',
                timeAgo: '5 hours ago',
            }
        ],
        likes: 28,
        comments: 9,
    },
};

export default function SelfStoryScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { storyId, croppedImage, selectedFilter, multipleImages } = route.params || {};

    const [currentStory, setCurrentStory] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const timerRef = useRef(null);
    const pauseTimeoutRef = useRef(null);

    const currentStoryData = currentStory?.stories?.[currentImageIndex];

    // Sample likes data
    const likesData = [
        { id: 1, name: 'Sophia Turner', timeAgo: '6h', avatar: require('../../../assets/DatingProfileImage/Match1.png') },
        { id: 2, name: 'David Lee', timeAgo: '1h', avatar: require('../../../assets/DatingProfileImage/Match2.png') },
        { id: 3, name: 'Olivia White', timeAgo: '4h', avatar: require('../../../assets/DatingProfileImage/Match3.png') },
        { id: 4, name: 'James Harris', timeAgo: '3h', avatar: require('../../../assets/DatingProfileImage/Match4.png') },
        { id: 5, name: 'Emma Wilson', timeAgo: '2h', avatar: require('../../../assets/DatingProfileImage/Match5.png') },
        { id: 6, name: 'Alex Chen', timeAgo: '5h', avatar: require('../../../assets/DatingProfileImage/Match6.png') },
    ];

    const startTimer = () => {
        console.log('⏰ Starting timer for story index:', currentImageIndex);
        
        // Clear any existing timer first
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        
        // Reset progress to 0 when starting new timer
        setProgress(0);
        progressAnim.setValue(0);
        
        timerRef.current = setInterval(() => {
            if (!isPaused) {
                setProgress(prev => {
                    const newProgress = prev + (100 / 30); // 30 seconds
                    console.log('⏰ Progress for index', currentImageIndex, ':', newProgress.toFixed(1) + '%');
                    
                    if (newProgress >= 100) {
                        console.log('⏰ Timer completed for index', currentImageIndex, ', calling nextImage()');
                        // Clear the current timer first
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                            timerRef.current = null;
                        }
                        // Use setTimeout to avoid calling nextImage during render
                        setTimeout(() => {
                            nextImage();
                        }, 100);
                        return 100; // Keep at 100% until next image loads
                    }
                    return newProgress;
                });
            }
        }, 100);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const nextImage = () => {
        console.log('📖 Next image called. Current index:', currentImageIndex, 'Total stories:', currentStory?.stories?.length);
        
        // Stop current timer first
        stopTimer();
        
        if (currentStory && currentImageIndex < currentStory.stories.length - 1) {
            const newIndex = currentImageIndex + 1;
            console.log('📖 Moving to next story from', currentImageIndex, 'to', newIndex);
            
            // Update image index
            setCurrentImageIndex(newIndex);
            
            // Reset progress immediately
            setProgress(0);
            progressAnim.setValue(0);
            
            // Start new timer after a short delay to ensure state is updated
            setTimeout(() => {
                console.log('📖 Starting timer for new story at index:', newIndex);
                startTimer();
            }, 300);
        } else {
            console.log('📖 All stories finished, navigating back');
            // Story finished, navigate back to HomeScreen
            dispatch(setStoryScreenActive(false));
            
            // Use a more reliable navigation method
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                // Fallback: navigate to HomeMain screen
                navigation.navigate('HomeMain');
            }
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            console.log('📖 Moving to previous story from index:', currentImageIndex);
            
            // Stop current timer first
            stopTimer();
            
            const newIndex = currentImageIndex - 1;
            setCurrentImageIndex(newIndex);
            
            // Reset progress immediately
            setProgress(0);
            progressAnim.setValue(0);
            
            // Start new timer after a short delay to ensure state is updated
            setTimeout(() => {
                console.log('📖 Starting timer for previous story at index:', newIndex);
                startTimer();
            }, 300);
        } else {
            console.log('📖 Already at first story, cannot go back');
        }
    };

    // Tap gestures (left/right)
    const handleTap = (event) => {
        const { locationX } = event.nativeEvent;
        const screenWidth = Dimensions.get('window').width;

        console.log('🎯 Tap detected at locationX:', locationX, 'Screen width:', screenWidth);

        if (locationX < screenWidth / 2) {
            console.log('👈 Left tap - going to previous image');
            prevImage();
        } else {
            console.log('👉 Right tap - going to next image');
            nextImage();
        }
    };

    // Long press pause/resume
    const handleLongPress = () => {
        console.log('⏸️ Long press - pausing story');
        setIsPaused(true);
        stopTimer();
    };

    const handlePressOut = () => {
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }

        pauseTimeoutRef.current = setTimeout(() => {
            console.log('▶️ Press out - resuming story');
            setIsPaused(false);
            // Only start timer if we're not already at 100% progress
            if (progress < 100) {
                startTimer();
            }
        }, 100);
    };

    useEffect(() => {
        console.log('📱 SelfStoryScreen mounted with storyId:', storyId);
        dispatch(setStoryScreenActive(true));

        // If we have multipleImages from PostEditScreen, create a custom story with dynamic images
        if (multipleImages && multipleImages.length > 0) {
            const dynamicStories = multipleImages.map((image, index) => ({
                id: `selfStory_${index + 1}`,
                image: { uri: image.uri },
                text: `Story ${index + 1}`,
                timeAgo: 'now',
            }));

            const customStory = {
                id: 'selfStory',
                user: {
                    name: 'John Smith',
                    location: 'Your Location',
                    isVerified: true,
                    avatar: require('../../../assets/DatingProfileImage/Match1.png'),
                },
                stories: dynamicStories,
                likes: 0,
                comments: 0,
            };
            setCurrentStory(customStory);
        }
        // If we have single croppedImage from PostEditScreen, create a custom story with multiple images
        else if (croppedImage) {
            const customStory = {
                id: 'selfStory',
                user: {
                    name: 'John Smith',
                    location: 'Your Location',
                    isVerified: true,
                    avatar: require('../../../assets/DatingProfileImage/Match1.png'),
                },
                stories: [
                    {
                        id: 'selfStory_1',
                        image: { uri: croppedImage.uri },
                        text: 'My new story!',
                        timeAgo: 'now',
                    },
                    {
                        id: 'selfStory_2',
                        image: require('../../../assets/DatingProfileImage/Match2.png'),
                        text: 'Another amazing moment!',
                        timeAgo: 'now',
                    },
                    {
                        id: 'selfStory_3',
                        image: require('../../../assets/DatingProfileImage/Match3.png'),
                        text: 'Life is beautiful!',
                        timeAgo: 'now',
                    }
                ],
                likes: 0,
                comments: 0,
            };
            setCurrentStory(customStory);
        }
        // Use existing story data
        else if (storyId) {
            const story = STORY_DATA[storyId];
            if (story) {
                console.log('📱 Story found:', story.user.name, 'with', story.stories.length, 'stories');
                setCurrentStory(story);
            } else {
                console.log('❌ Story not found for storyId:', storyId);
                Alert.alert('Error', 'Story not found');
                navigation.goBack();
            }
        }

        return () => {
            console.log('📱 SelfStoryScreen unmounting');
            dispatch(setStoryScreenActive(false));
            stopTimer();
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }
        };
    }, [storyId, dispatch, croppedImage, multipleImages]);

    // Separate useEffect for initializing timer when story is set
    useEffect(() => {
        if (currentStory) {
            console.log('📖 Story set, initializing timer for', currentStory.stories.length, 'stories');
            // Stop any existing timer first
            stopTimer();
            
            // Reset all states
            setCurrentImageIndex(0);
            setProgress(0);
            progressAnim.setValue(0);
            
            // Start timer after animation completes
            setTimeout(() => {
                console.log('📖 Initializing timer for story at index 0');
                startTimer();
            }, 500); // Wait for animation to complete

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [currentStory]);

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    // Reset progress animation when image index changes
    useEffect(() => {
        if (currentStory && currentStory.stories[currentImageIndex]) {
            console.log('🔄 Image index changed to:', currentImageIndex, 'Total stories:', currentStory.stories.length);
            console.log('🔄 Current story data:', currentStory.stories[currentImageIndex]?.text);
            // Progress reset is now handled in nextImage/prevImage functions
            // No need to start timer here as it's handled in the functions
        }
    }, [currentImageIndex, currentStory]);

    // Handle case when story data is not found
    useEffect(() => {
        if (currentStory && !currentStoryData) {
            // If story exists but current story data doesn't, navigate back
            const timer = setTimeout(() => {
                navigation.goBack();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStory, currentStoryData, navigation]);

    const handleClose = () => {
        dispatch(setStoryScreenActive(false));
        stopTimer();

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Use the same reliable navigation method
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('HomeMain');
            }
        });
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        if (isDisliked) setIsDisliked(false);
    };

    const handleDislike = () => {
        setIsDisliked(!isDisliked);
        if (isLiked) setIsLiked(false);
    };

    const handleComment = () => {};

    const handleSendComment = () => {
        if (commentText.trim()) setCommentText('');
    };

    const handleShare = () => {};

    const handleViewLikes = () => {
        console.log('👁️ Eye icon clicked - opening likes modal');
        setShowLikesModal(true);
        setLikesCount(likesData.length);
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Story',
            'Are you sure you want to delete this story?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {
                    // Handle delete logic here
                    console.log('Story deleted');
                    navigation.goBack();
                }}
            ]
        );
    };

    if (!currentStory) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!currentStoryData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Story not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <Image
                source={currentStoryData.image}
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            <View style={styles.overlay} />

            <TouchableOpacity
                style={styles.leftTapArea}
                onPress={handleTap}
                onLongPress={handleLongPress}
                onPressOut={handlePressOut}
                activeOpacity={1}
            />
            <TouchableOpacity
                style={styles.rightTapArea}
                onPress={handleTap}
                onLongPress={handleLongPress}
                onPressOut={handlePressOut}
                activeOpacity={1}
            />

            <SafeAreaView style={styles.safeArea}>
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            {currentStory.stories.map((_, index) => (
                                <View key={index} style={styles.progressSegment}>
                                    <Animated.View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: index === currentImageIndex
                                                    ? progressAnim.interpolate({
                                                        inputRange: [0, 100],
                                                        outputRange: ['0%', '100%'],
                                                        extrapolate: 'clamp',
                                                    })
                                                    : index < currentImageIndex
                                                        ? '100%'
                                                        : '0%'
                                            }
                                        ]}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.header}>
                        <View style={styles.userInfo}>
                            <Image
                                source={currentStory.user.avatar}
                                style={styles.avatar}
                            />
                            <View style={styles.userDetails}>
                                <View style={styles.userNameRow}>
                                    <Text style={styles.userName}>{currentStory.user.name}</Text>
                                    {currentStory.user.isVerified && <AccountVerifyBadge width={16} height={16} />}
                                </View>
                                <Text style={styles.userLocation}>{currentStoryData.timeAgo}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleDelete} style={styles.closeButton}>
                            <TrashIcon width={20} height={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.storyContent}>
                        <Text style={styles.storyText}>{currentStoryData.text}</Text>
                    </View>

                    <View style={styles.bottomActionBar}>
                        <View style={styles.actionRow}>
                            <TouchableOpacity onPress={handleViewLikes} style={styles.eyeButton}>
                                <EyeIcon width={24} height={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </SafeAreaView>

            {/* Likes Modal */}
            {showLikesModal && (
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.modalOverlayTouchable}
                        activeOpacity={1}
                        onPress={() => setShowLikesModal(false)}
                    />
                    <View style={styles.likesModal}>
                        <View style={styles.modalHeader}>
                            <View style={styles.dragHandle} />
                            <Text style={styles.modalTitle}>Likes</Text>
                        </View>
                        <View style={styles.likesList}>
                            {likesData.map((like) => (
                                <View key={like.id} style={styles.likeItem}>
                                    <Image source={like.avatar} style={styles.likeAvatar} />
                                    <View style={styles.likeInfo}>
                                        <Text style={styles.likeName}>{like.name}</Text>
                                        <Text style={styles.likeTime}>{like.timeAgo}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.likeOptions}>
                                        <Text style={styles.optionsIcon}>⋯</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity 
                            style={styles.closeModalButton}
                            onPress={() => setShowLikesModal(false)}
                        >
                            <Text style={styles.closeModalText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: screenWidth,
        height: screenHeight,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    // Progress Bar Styles
    progressContainer: {
        paddingHorizontal: 20,
        paddingTop: 50, // Increased to avoid notch
        paddingBottom: 20,
    },
    progressBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressSegment: {
        flex: 1,
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 2,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 2,
    },
    // Tap Areas
    leftTapArea: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '50%',
        height: '100%',
        zIndex: 10,
    },
    rightTapArea: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: '50%',
        height: '100%',
        zIndex: 10,
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginRight: 6,
    },
    userLocation: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    closeButton: {
        padding: 8,
    },
    // Story Content
    storyContent: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    storyText: {
        fontSize: 18,
        color: 'white',
        lineHeight: 24,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    // Bottom Action Bar
    bottomActionBar: {
        paddingHorizontal: 20,
        paddingBottom: 40, // Increased to avoid home indicator
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    eyeButton: {
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        minWidth: 50,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 20,
        padding: 8,
    },
    actionIcon: {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    actionIconActive: {
        color: '#FF6B6B',
    },
    // Likes Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalOverlayTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    likesModal: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingBottom: 40,
        maxHeight: screenHeight * 0.7,
    },
    modalHeader: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    likesList: {
        paddingHorizontal: 20,
    },
    likeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    likeAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    likeInfo: {
        flex: 1,
    },
    likeName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 2,
    },
    likeTime: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    likeOptions: {
        padding: 8,
    },
    optionsIcon: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    closeModalButton: {
        marginTop: 20,
        marginHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeModalText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
