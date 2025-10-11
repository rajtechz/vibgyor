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
import { AccountVerifyBadge, HamburgerIcon, LikeIcon, ShareIcon } from '../../../components/icons/SvgIcons';

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

export default function StoryScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { storyId } = route.params;

    const [currentStory, setCurrentStory] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const timerRef = useRef(null);
    const pauseTimeoutRef = useRef(null);

    const currentStoryData = currentStory?.stories?.[currentImageIndex];

    const startTimer = () => {
        console.log('⏰ Starting timer for story index:', currentImageIndex);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
            if (!isPaused) {
                setProgress(prev => {
                    const newProgress = prev + (100 / 30); // 30 seconds
                    if (newProgress >= 100) {
                        console.log('⏰ Timer completed, calling nextImage()');
                        // Use setTimeout to avoid calling nextImage during render
                        setTimeout(() => {
                            nextImage();
                        }, 0);
                        return 0;
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
        
        if (currentStory && currentImageIndex < currentStory.stories.length - 1) {
            const newIndex = currentImageIndex + 1;
            console.log('📖 Moving to next story:', newIndex);
            setCurrentImageIndex(newIndex);
            
            // Use setTimeout to avoid state updates during render
            setTimeout(() => {
                setProgress(0);
                // Restart timer for the new story
                startTimer();
            }, 0);
        } else {
            console.log('📖 All stories finished, navigating back');
            // Story finished, navigate back to HomeScreen
            stopTimer();
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
            setCurrentImageIndex(prev => prev - 1);
            
            // Use setTimeout to avoid state updates during render
            setTimeout(() => {
                setProgress(0);
                // Restart timer for the previous story
                startTimer();
            }, 0);
        }
        // Do nothing if it's the first image (no user switch)
    };

    // Tap gestures (left/right)
    const handleTap = (event) => {
        const { locationX } = event.nativeEvent;
        const screenWidth = Dimensions.get('window').width;

        if (locationX < screenWidth / 2) {
            prevImage();
        } else {
            nextImage();
        }
    };

    // Long press pause/resume
    const handleLongPress = () => {
        setIsPaused(true);
        stopTimer();
    };

    const handlePressOut = () => {
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }

        pauseTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
            startTimer();
        }, 100);
    };

    useEffect(() => {
        console.log('📱 StoryScreen mounted with storyId:', storyId);
        dispatch(setStoryScreenActive(true));

        const story = STORY_DATA[storyId];
        if (story) {
            console.log('📱 Story found:', story.user.name, 'with', story.stories.length, 'stories');
            setCurrentStory(story);
            
            // Use setTimeout to avoid state updates during render
            setTimeout(() => {
                setCurrentImageIndex(0);
                setProgress(0);
                startTimer();
            }, 0);

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
        } else {
            console.log('❌ Story not found for storyId:', storyId);
            Alert.alert('Error', 'Story not found');
            navigation.goBack();
        }

        return () => {
            console.log('📱 StoryScreen unmounting');
            dispatch(setStoryScreenActive(false));
            stopTimer();
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }
        };
    }, [storyId, dispatch]);

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
            // Use setTimeout to avoid state updates during render
            setTimeout(() => {
                setProgress(0);
                progressAnim.setValue(0);
            }, 0);
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
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <HamburgerIcon width={20} height={20} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.storyContent}>
                        <Text style={styles.storyText}>{currentStoryData.text}</Text>
                    </View>

                    <View style={styles.bottomActionBar}>
                        <View style={styles.inputRow}>
                            <View style={styles.commentContainer}>
                                <TouchableOpacity style={styles.emojiButton}>
                                    <Text style={styles.emojiIcon}>😊</Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.commentInput}
                                    placeholder="Type Somethings..."
                                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    multiline={false}
                                />
                                <TouchableOpacity onPress={handleSendComment} style={styles.sendButton}>
                                    <ShareIcon width={20} height={20} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                                <LikeIcon width={24} height={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </SafeAreaView>
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
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        flex: 1,
        marginRight: 15,
    },
    likeButton: {
        padding: 8,
    },
    emojiButton: {
        marginRight: 10,
    },
    emojiIcon: {
        fontSize: 18,
    },
    commentInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        paddingVertical: 5,
    },
    sendButton: {
        marginLeft: 10,
        padding: 5,
    },
    sendIcon: {
        fontSize: 18,
        color: 'white',
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
});
