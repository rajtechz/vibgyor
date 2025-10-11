import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackIcon, TermsIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';


export default function HelpCenterScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState({});

    const helpSections = [
        {
            id: 'getting-started',
            title: '1. Getting Started',
            content: `Welcome to our dating application! To get started, create your profile by adding photos, writing a bio, and setting your preferences. The more complete your profile, the better matches you'll receive.`
        },
        {
            id: 'account-profile',
            title: '2. Account & Profile',
            content: `Manage your account settings, update your profile information, and control your privacy. You can edit your photos, bio, interests, and personal details at any time through the Profile section.`
        },
        {
            id: 'matching-messaging',
            title: '3. Matching & Messaging',
            content: `Our matching system uses your preferences and location to suggest compatible profiles. Swipe right to like or left to pass. When you match with someone, you can start messaging them immediately.`
        },
        {
            id: 'safety-privacy',
            title: '4. Safety & Privacy',
            content: `Your safety is our priority. Report inappropriate behavior, block users, and control who can see your profile. We have strict community guidelines and a dedicated safety team.`
        },
        {
            id: 'billing-subscriptions',
            title: '5. Billing & Subscriptions',
            content: `Manage your subscription, update payment methods, and view billing history. Premium features include unlimited likes, advanced filters, and seeing who liked you.`
        },
        {
            id: 'technical-support',
            title: '6. Technical Support',
            content: `Having technical issues? Check our troubleshooting guide, contact support, or report bugs. We're here to help you have the best experience possible.`
        },
        {
            id: 'reporting',
            title: '7. Reporting & Blocking',
            content: `Report users for inappropriate behavior, harassment, or fake profiles. You can also block users to prevent them from contacting you. All reports are reviewed by our team.`
        },
        {
            id: 'verification',
            title: '8. Account Verification',
            content: `Get verified to increase your trust score and visibility. Upload a government ID and take a selfie to verify your identity. This helps create a safer community.`
        },
        {
            id: 'location-settings',
            title: '9. Location Settings',
            content: `Control your location visibility and search radius. You can hide your exact location while still showing your general area to potential matches.`
        },
        {
            id: 'notifications',
            title: '10. Notifications',
            content: `Customize your notification preferences. Choose what types of notifications you want to receive and how often you want to be notified about new matches and messages.`
        },
        {
            id: 'data-privacy',
            title: '11. Data Privacy',
            content: `Learn about how we protect your personal information, what data we collect, and how you can control your privacy settings. Your data is encrypted and secure.`
        },
        {
            id: 'contact-support',
            title: '12. Contact Support',
            content: `Need help? Contact our support team through the app, email, or live chat. We're available 24/7 to assist you with any questions or issues.`
        }
    ];

    const filteredSections = helpSections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpanded = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleContactSupport = () => {
        Alert.alert(
            'Contact Support',
            'You can reach our support team through the app or email us at support@vibgyor.com',
            [{ text: 'OK' }]
        );
    };

    const renderSection = (section) => (
        <View key={section.id} style={styles.sectionContainer}>
            <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleExpanded(section.id)}
            >
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={[
                    styles.expandIcon,
                    expandedSections[section.id] && styles.expandedIcon
                ]}>
                    ▼
                </Text>
            </TouchableOpacity>
            {expandedSections[section.id] && (
                <View style={styles.sectionContent}>
                    <Text style={styles.sectionText}>{section.content}</Text>
                </View>
            )}
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
                    <TermsIcon width={24} height={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search help articles..."
                        placeholderTextColor="#B0B0B0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Last Updated */}
                <View style={styles.updateInfoContainer}>
                    <Text style={styles.updateInfoText}>
                        Last updated: January 15, 2024
                    </Text>
                </View>

                {/* Introduction */}
                <View style={styles.introContainer}>
                    <Text style={styles.introTitle}>Welcome to Help Center</Text>
                    <Text style={styles.introText}>
                        Find answers to common questions and get help with using our dating application. Search for specific topics or browse through our help sections below.
                    </Text>
                </View>

                {/* Help Sections */}
                {filteredSections.length > 0 ? (
                    filteredSections.map(renderSection)
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsTitle}>No results found</Text>
                        <Text style={styles.noResultsText}>
                            Try searching with different keywords.
                        </Text>
                    </View>
                )}

                {/* Contact Support */}
                <View style={styles.contactContainer}>
                    <Text style={styles.contactTitle}>Still need help?</Text>
                    <Text style={styles.contactText}>
                        If you can't find what you're looking for, contact our support team for personalized assistance.
                    </Text>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={handleContactSupport}
                    >
                        <Text style={styles.contactButtonText}>Contact Support</Text>
                    </TouchableOpacity>
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
    searchInput: {
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: 'white',
    },
    updateInfoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    updateInfoText: {
        fontSize: 12,
        color: '#B0B0B0',
    },
    introContainer: {
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
    },
    introTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        marginBottom: 10,
    },
    introText: {
        fontSize: 14,
        color: '#B0B0B0',
        lineHeight: 20,
    },
    sectionContainer: {
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
    },
    sectionTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
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
    sectionContent: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    sectionText: {
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
    },
    contactContainer: {
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 10,
    },
    contactText: {
        fontSize: 14,
        color: '#B0B0B0',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    contactButton: {
        backgroundColor: '#DD3562',
        borderRadius: 12,
        paddingHorizontal: 30,
        paddingVertical: 12,
    },
    contactButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
