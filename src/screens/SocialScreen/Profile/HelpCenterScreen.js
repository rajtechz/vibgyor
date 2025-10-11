import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Alert,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackIcon, HelpIcon, SearchIcon, ArrowRightIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';

export default function HelpCenterScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItems, setExpandedItems] = useState({});

    const helpCategories = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: '🚀',
            items: [
                {
                    id: 'create-account',
                    question: 'How do I create an account?',
                    answer: 'Download the app and tap "Sign Up". Enter your email, create a password, and verify your email address.'
                },
                {
                    id: 'profile-setup',
                    question: 'How do I set up my profile?',
                    answer: 'Go to Profile > Edit Profile. Add photos, write a bio, and select your interests to get better matches.'
                },
                {
                    id: 'first-match',
                    question: 'How do I get my first match?',
                    answer: 'Complete your profile, add good photos, and start swiping! The more active you are, the more matches you\'ll get.'
                }
            ]
        },
        {
            id: 'matching',
            title: 'Matching & Dating',
            icon: '💕',
            items: [
                {
                    id: 'how-matching-works',
                    question: 'How does matching work?',
                    answer: 'When you and someone else both swipe right on each other, it\'s a match! You can then start chatting.'
                },
                {
                    id: 'super-likes',
                    question: 'What are Super Likes?',
                    answer: 'Super Likes let someone know you\'re really interested. You get 5 free Super Likes per day.'
                },
                {
                    id: 'boost',
                    question: 'What is Boost?',
                    answer: 'Boost makes your profile appear first in the swipe queue for 30 minutes, increasing your chances of getting matches.'
                }
            ]
        },
        {
            id: 'messaging',
            title: 'Messaging',
            icon: '💬',
            items: [
                {
                    id: 'start-conversation',
                    question: 'How do I start a conversation?',
                    answer: 'After matching, tap on the match to open the chat. Send a message to start the conversation!'
                },
                {
                    id: 'message-tips',
                    question: 'Any messaging tips?',
                    answer: 'Be genuine, ask questions, and keep the conversation light and fun. Avoid generic openers.'
                },
                {
                    id: 'unmatch',
                    question: 'How do I unmatch someone?',
                    answer: 'Go to the chat, tap the three dots, and select "Unmatch". This will remove the match and conversation.'
                }
            ]
        },
        {
            id: 'account',
            title: 'Account & Settings',
            icon: '⚙️',
            items: [
                {
                    id: 'change-password',
                    question: 'How do I change my password?',
                    answer: 'Go to Settings > Account > Change Password. Enter your current password and create a new one.'
                },
                {
                    id: 'delete-account',
                    question: 'How do I delete my account?',
                    answer: 'Go to Settings > Account > Delete Account. Follow the prompts to permanently delete your account.'
                },
                {
                    id: 'privacy-settings',
                    question: 'How do I adjust privacy settings?',
                    answer: 'Go to Settings > Privacy Options to control who can see your profile and message you.'
                }
            ]
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            icon: '🔧',
            items: [
                {
                    id: 'app-crashes',
                    question: 'The app keeps crashing',
                    answer: 'Try closing and reopening the app. If the problem persists, try restarting your device or reinstalling the app.'
                },
                {
                    id: 'notifications',
                    question: 'I\'m not receiving notifications',
                    answer: 'Check your device notification settings and make sure notifications are enabled for the app in Settings.'
                },
                {
                    id: 'login-issues',
                    question: 'I can\'t log in',
                    answer: 'Make sure you\'re using the correct email and password. Try resetting your password if needed.'
                }
            ]
        }
    ];

    const filteredCategories = helpCategories.map(category => ({
        ...category,
        items: category.items.filter(item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.items.length > 0);

    const toggleExpanded = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleContactSupport = () => {
        navigation.navigate('ChatSupport');
    };

    const renderHelpItem = (item) => (
        <TouchableOpacity
            key={item.id}
            style={styles.helpItem}
            onPress={() => toggleExpanded(item.id)}
        >
            <View style={styles.helpItemHeader}>
                <Text style={styles.helpQuestion}>{item.question}</Text>
                <Text style={[
                    styles.expandIcon,
                    expandedItems[item.id] && styles.expandedIcon
                ]}>
                    ▼
                </Text>
            </View>
            {expandedItems[item.id] && (
                <View style={styles.helpAnswer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderCategory = (category) => (
        <View key={category.id} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>
            <View style={styles.categoryItems}>
                {category.items.map(renderHelpItem)}
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
                <Text style={styles.headerTitle}>Help Center</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <HelpIcon width={24} height={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <SearchIcon width={20} height={20} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search help articles..."
                            placeholderTextColor="#B0B0B0"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Quick Help */}
                <View style={styles.quickHelpContainer}>
                    <Text style={styles.quickHelpTitle}>Quick Help</Text>
                    <View style={styles.quickHelpButtons}>
                        <TouchableOpacity style={styles.quickHelpButton}>
                            <Text style={styles.quickHelpButtonText}>Report a Problem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickHelpButton}>
                            <Text style={styles.quickHelpButtonText}>Request Feature</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Help Categories */}
                {filteredCategories.length > 0 ? (
                    filteredCategories.map(renderCategory)
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsTitle}>No results found</Text>
                        <Text style={styles.noResultsText}>
                            Try searching with different keywords or browse the categories below.
                        </Text>
                    </View>
                )}

                {/* Contact Support */}
                <View style={styles.contactSupportContainer}>
                    <Text style={styles.contactSupportTitle}>Still need help?</Text>
                    <Text style={styles.contactSupportText}>
                        Can't find what you're looking for? Our support team is here to help!
                    </Text>
                    <TouchableOpacity
                        style={styles.contactSupportButton}
                        onPress={handleContactSupport}
                    >
                        <Text style={styles.contactSupportButtonText}>Contact Support</Text>
                        <ArrowRightIcon width={20} height={20} />
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <View style={styles.appInfoContainer}>
                    <Text style={styles.appInfoTitle}>App Information</Text>
                    <View style={styles.appInfoItem}>
                        <Text style={styles.appInfoLabel}>Version:</Text>
                        <Text style={styles.appInfoValue}>1.0.0</Text>
                    </View>
                    <View style={styles.appInfoItem}>
                        <Text style={styles.appInfoLabel}>Last Updated:</Text>
                        <Text style={styles.appInfoValue}>January 2024</Text>
                    </View>
                </View>
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
    menuButton: {
        padding: 8,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    searchContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: 'white',
    },
    quickHelpContainer: {
        marginBottom: 30,
    },
    quickHelpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 15,
    },
    quickHelpButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    quickHelpButton: {
        flex: 1,
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DD3562',
    },
    quickHelpButtonText: {
        color: '#DD3562',
        fontSize: 14,
        fontWeight: '500',
    },
    categoryContainer: {
        marginBottom: 30,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    categoryIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    categoryItems: {
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        overflow: 'hidden',
    },
    helpItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3A',
    },
    helpItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
    },
    helpQuestion: {
        flex: 1,
        fontSize: 14,
        color: 'white',
        marginRight: 10,
    },
    expandIcon: {
        fontSize: 12,
        color: '#DD3562',
        transform: [{ rotate: '0deg' }],
    },
    expandedIcon: {
        transform: [{ rotate: '180deg' }],
    },
    helpAnswer: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    answerText: {
        fontSize: 14,
        color: '#B0B0B0',
        lineHeight: 20,
    },
    noResultsContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noResultsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 10,
    },
    noResultsText: {
        fontSize: 14,
        color: '#B0B0B0',
        textAlign: 'center',
        lineHeight: 20,
    },
    contactSupportContainer: {
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    contactSupportTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 10,
    },
    contactSupportText: {
        fontSize: 14,
        color: '#B0B0B0',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    contactSupportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DD3562',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    contactSupportButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    appInfoContainer: {
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
    },
    appInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 15,
    },
    appInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    appInfoLabel: {
        fontSize: 14,
        color: '#B0B0B0',
    },
    appInfoValue: {
        fontSize: 14,
        color: 'white',
    },
});
