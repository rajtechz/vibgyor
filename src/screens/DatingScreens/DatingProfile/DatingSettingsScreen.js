import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackground from '../../../components/common/CommonBackground';
import { colors } from '../../../styles/colors';
import { fonts } from '../../../styles/typography';
import MaskedView from '@react-native-masked-view/masked-view';
import { clearAuthData } from '../../../utils/authUtils';
import { setSettingsScreenActive } from '../../../redux/slices/uiSlice';
import {
    BackIcon,
    ArrowRightIcon,
    AccountIcon,
    ManageMatchesIcon,
    PrivacyIcon,
    BlockedIcon,
    SettingsNotificationIcon as NotificationIcon,
    DeleteIcon,
    ChatSupportIcon,
    HelpIcon,
    TermsIcon,
    PrivacyPolicyIcon,
} from '../../../components/icons/SvgIcons';

const { width: screenWidth } = Dimensions.get('window');

function DatingSettingsScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // Hide tab bar when screen mounts, show when unmounts
    useEffect(() => {
        // Hide tab bar when screen is focused
        dispatch(setSettingsScreenActive(true));
        
        // Show tab bar when screen is unfocused/unmounted
        return () => {
            dispatch(setSettingsScreenActive(false));
        };
    }, [dispatch]);

    const handleLogOut = async () => {
        try {
            await clearAuthData();
            // Navigate to login screen or reset navigation stack
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
            onPress: () => {
                console.log('Account button pressed, navigating to DatingAccount');
                navigation.navigate('DatingAccount');
            },
        },
        {
            id: 2,
            title: 'Manage Matches',
            icon: <ManageMatchesIcon width={16} height={16} />,
            onPress: () => {
                console.log('Manage Matches button pressed, navigating to DatingManageMatches');
                navigation.navigate('DatingManageMatches');
            },
        },
        {
            id: 3,
            title: 'Privacy Options',
            icon: <PrivacyIcon width={13} height={16} />,
            onPress: () => {
                console.log('Privacy Options button pressed, navigating to DatingPrivacyOptions');
                navigation.navigate('DatingPrivacyOptions');
            },
        },
        {
            id: 4,
            title: 'Blocked Accounts',
            icon: <BlockedIcon width={16} height={16} />,
            onPress: () => {
                console.log('Blocked Accounts button pressed, navigating to DatingBlockedAccounts');
                navigation.navigate('DatingBlockedAccounts');
            },
        },
        {
            id: 5,
            title: 'Notifications',
            icon: <NotificationIcon width={15} height={18} />,
            onPress: () => {
                console.log('Notifications button pressed, navigating to DatingNotifications');
                navigation.navigate('DatingNotifications');
            },
        },
        {
            id: 6,
            title: 'Delete Account',
            icon: <DeleteIcon width={15} height={16} />,
            onPress: () => {
                console.log('Delete Account pressed, navigating to DeleteAccount');
                navigation.navigate('DeleteAccount');
            },
        },
        {
            id: 7,
            title: 'Chat Support',
            icon: <ChatSupportIcon width={16} height={16} />,
            onPress: () => {
                console.log('Chat Support pressed, navigating to ChatSupport');
                navigation.navigate('ChatSupport');
            },
        },
        {
            id: 8,
            title: 'Help Center',
            icon: <HelpIcon width={15} height={16} />,
            onPress: () => {
                console.log('Help Center pressed, navigating to HelpCenter');
                navigation.navigate('HelpCenter');
            },
        },
        {
            id: 9,
            title: 'Terms & Conditions',
            icon: <TermsIcon width={14} height={16} />,
            onPress: () => {
                console.log('Terms & Conditions pressed, navigating to TermsConditions');
                navigation.navigate('TermsConditions');
            },
        },
        {
            id: 10,
            title: 'Privacy Policy',
            icon: <PrivacyPolicyIcon width={14} height={18} />,
            onPress: () => {
                console.log('Privacy Policy pressed, navigating to PrivacyPolicy');
                navigation.navigate('PrivacyPolicy');
            },
        },
    ];

    return (
        <CommonBackground>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <BackIcon width={24} height={24} color="#D9D8F3" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>

                {/* Settings Options */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {settingsOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={styles.optionItem}
                            onPress={option.onPress}
                        >
                            <View style={styles.optionLeft}>
                                <View style={styles.iconContainer}>
                                    {option.icon}
                                </View>
                                <Text style={styles.optionText}>{option.title}</Text>
                            </View>
                            <ArrowRightIcon width={16} height={16} color="#D9D8F3" />
                        </TouchableOpacity>
                    ))}

                    {/* App Version */}
                    <Text style={styles.versionText}>App version 1.0.0.1</Text>

                    {/* Logout Button */}
                    <View style={styles.logoutButtonContainer}>
                        <LinearGradient
                            colors={['#DD3562', '#8354FF']}
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
                                        colors={['#DD3562', '#8354FF']}
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
        backgroundColor: '#140034',
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

export default DatingSettingsScreen;
