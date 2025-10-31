import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackground from '../../../components/common/CommonBackground';
import CustomButton from '../../../components/common/CustomButton';
import { colors } from '../../../styles/colors';
import { fonts } from '../../../styles/typography';
import MaskedView from '@react-native-masked-view/masked-view';
import { clearAuth } from '../../../redux/slices/authSlice';
import { setSettingsScreenActive } from '../../../redux/slices/uiSlice';
import { 
    BackIcon, 
    ArrowRightIcon, 
    AccountIcon, 
    SettingsNotificationIcon, 
    PrivacyIcon, 
    BlockedIcon, 
    SafetyIcon, 
    DeleteIcon, 
    HelpIcon, 
    TermsIcon, 
    PrivacyPolicyIcon, 
    MatchesIcon 
} from '../../../components/icons/SvgIcons';

const { width: screenWidth } = Dimensions.get('window');

function SettingsScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    
    // Animation for back button
    const backButtonScale = useRef(new Animated.Value(1)).current;
    
    // Animation for settings options
    const optionScales = useRef({}).current;

    // Hide tab bar when screen mounts and show when unmounts
    useEffect(() => {
        console.log('🔄 SettingsScreen: Hiding tab bar');
        dispatch(setSettingsScreenActive(true));
        
        return () => {
            console.log('🔄 SettingsScreen: Showing tab bar');
            dispatch(setSettingsScreenActive(false));
        };
    }, [dispatch]);

    // Handle back button press with animation
    const handleBackPress = () => {
        // Animate button press
        Animated.sequence([
            Animated.timing(backButtonScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(backButtonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Navigate back after animation completes
            navigation.goBack();
        });
    };

    // Handle option press with animation
    const handleOptionPress = (option) => {
        const optionId = option.id;
        
        // Initialize scale value if not exists
        if (!optionScales[optionId]) {
            optionScales[optionId] = new Animated.Value(1);
        }
        
        // Animate option press
        Animated.sequence([
            Animated.timing(optionScales[optionId], {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(optionScales[optionId], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Navigate after animation completes
            option.onPress();
        });
    };

    const handleLogOut = async () => {
        try {
            // Clear Redux auth state and AsyncStorage via slice
            dispatch(clearAuth());
            // Reset navigation stack to Auth
            navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
            });
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const settingsOptions = [
        {
            id: 1,
            title: 'Account',
            icon: <AccountIcon width={15} height={18} />,
            onPress: () => navigation.navigate('Account'),
        },
        {
            id: 2,
            title: 'Notifications',
            icon: <SettingsNotificationIcon width={15} height={18} />,
            onPress: () => navigation.navigate('Notifications'),
        },
        {
            id: 3,
            title: 'Privacy Options',
            icon: <PrivacyIcon width={13} height={16} />,
            onPress: () => navigation.navigate('PrivacyOptions'),
        },
        {
            id: 4,
            title: 'Blocked Accounts',
            icon: <BlockedIcon width={16} height={16} />,
            onPress: () => navigation.navigate('BlockedAccounts'),
        },
        {
            id: 5,
            title: 'Get Verified Profile',
            icon: <SafetyIcon width={15} height={16} />,
            onPress: () => navigation.navigate('GetVerified'),
        },
        {
            id: 6,
            title: 'Delete Account',
            icon: <DeleteIcon width={15} height={16} />,
            onPress: () => navigation.navigate('DeleteAccount'),
        },
        {
            id: 7,
            title: 'Chat Support',
            icon: <MatchesIcon width={16} height={16} />,
            onPress: () => navigation.navigate('ChatSupport'),
        },
        {
            id: 8,
            title: 'Help Center',
            icon: <HelpIcon width={15} height={16} />,
            onPress: () => navigation.navigate('HelpCenter'),
        },
        {
            id: 9,
            title: 'Terms & Conditions',
            icon: <TermsIcon width={14} height={16} />,
            onPress: () => navigation.navigate('TermsConditions'),
        },
        {
            id: 10,
            title: 'Privacy Policy',
            icon: <PrivacyPolicyIcon width={14} height={18} />,
            onPress: () => navigation.navigate('PrivacyPolicy'),
        },
    ];

    return (
        <CommonBackground>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBackPress}
                        >
                            <BackIcon width={24} height={24} color="#D9D8F3" />
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={styles.headerTitle}>Settings </Text>
                </View>

                {/* Settings Options */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {settingsOptions.map((option) => {
                        // Initialize scale value if not exists
                        if (!optionScales[option.id]) {
                            optionScales[option.id] = new Animated.Value(1);
                        }
                        
                        return (
                            <Animated.View
                                key={option.id}
                                style={{ transform: [{ scale: optionScales[option.id] }] }}
                            >
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => handleOptionPress(option)}
                                >
                                    <View style={styles.optionLeft}>
                                        <View style={styles.iconContainer}>
                                            {option.icon}
                                        </View>
                                        <Text style={styles.optionText}>{option.title}</Text>
                                    </View>
                                    <ArrowRightIcon width={16} height={16} color="#D9D8F3" />
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}

                    {/* App Version */}
                    <Text style={styles.versionText}>App version 1.0.0.1</Text>

                    {/* Log Out Button */}


                    {/* Logout Button */}
                    <View style={styles.logoutButtonContainer}>
                        <LinearGradient
                            colors={['#FF6B9D', '#C53E8D', '#8A52F3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.logoutButtonGradient}
                        >
                            <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogOut}>
                                <MaskedView
                                    maskElement={
                                        <Text style={[styles.logoutButtonText, { backgroundColor: 'transparent' }]}>
                                            Log Out
                                        </Text>
                                    }
                                    style={styles.maskedViewContainer}
                                >
                                    <LinearGradient
                                        colors={['#FF6B9D', '#C53E8D', '#8A52F3']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.gradientTextContainer}
                                    >
                                        <Text style={[styles.logoutButtonText, { opacity: 0 }]}>
                                            Log Out
                                        </Text>
                                    </LinearGradient>
                                </MaskedView>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>



                </ScrollView>
            </View>
        </CommonBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#DD3562',
        fontFamily: fonts.primary,
        marginLeft: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,

    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "#34344A26",
        marginBottom: 12,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: fonts.primary,
        fontWeight: '400',
    },
    versionText: {
        fontSize: 14,
        color: '#48485E99',
        fontFamily: fonts.primary,
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 20,
    },
    logoutButtonContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
    },
    logoutButtonGradient: {
        borderRadius: 10,
        padding: 2,
    },
    logoutButton: {
        backgroundColor: '#030110',
        borderRadius: 8,
        paddingHorizontal: 40,
        paddingVertical: 12,
        minWidth: "90%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    maskedViewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientTextContainer: {
        height: 20,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SettingsScreen;
