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

export default function TermsConditionsScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState({});

    const termsSections = [
        {
            id: 'acceptance',
            title: '1. Acceptance of Terms',
            content: `By accessing and using the Vibgyor mobile application ("App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
        },
        {
            id: 'description',
            title: '2. Description of Service',
            content: `Vibgyor is a social networking and dating application that allows users to create profiles, connect with other users, and engage in various social activities. The service is provided "as is" and we reserve the right to modify or discontinue the service at any time.`
        },
        {
            id: 'user-accounts',
            title: '3. User Accounts',
            content: `To use our service, you must create an account. You are responsible for maintaining the confidentiality of your account and password. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.`
        },
        {
            id: 'user-conduct',
            title: '4. User Conduct',
            content: `You agree not to use the service to:
• Post, upload, or transmit any content that is illegal, harmful, threatening, abusive, or otherwise objectionable
• Impersonate any person or entity or misrepresent your affiliation with a person or entity
• Harass, abuse, or harm other users
• Use the service for any commercial purpose without our express written consent
• Attempt to gain unauthorized access to any part of the service`
        },
        {
            id: 'content-ownership',
            title: '5. Content Ownership',
            content: `You retain ownership of any content you post, upload, or share on the service. However, by posting content, you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute such content in connection with the service.`
        },
        {
            id: 'privacy',
            title: '6. Privacy',
            content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.`
        },
        {
            id: 'prohibited-uses',
            title: '7. Prohibited Uses',
            content: `You may not use our service:
• For any unlawful purpose or to solicit others to perform unlawful acts
• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
• To infringe upon or violate our intellectual property rights or the intellectual property rights of others
• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
• To submit false or misleading information`
        },
        {
            id: 'termination',
            title: '8. Termination',
            content: `We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.`
        },
        {
            id: 'disclaimers',
            title: '9. Disclaimers',
            content: `The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our service and the use of this service.`
        },
        {
            id: 'limitation-liability',
            title: '10. Limitation of Liability',
            content: `In no event shall Vibgyor, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.`
        },
        {
            id: 'governing-law',
            title: '11. Governing Law',
            content: `These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.`
        },
        {
            id: 'changes',
            title: '12. Changes to Terms',
            content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.`
        },
        {
            id: 'contact',
            title: '13. Contact Information',
            content: `If you have any questions about these Terms and Conditions, please contact us at:
Email: legal@vibgyor.com
Address: 123 Tech Street, San Francisco, CA 94105
Phone: +1 (555) 123-4567`
        }
    ];

    const filteredSections = termsSections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpanded = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleAcceptTerms = () => {
        Alert.alert(
            'Terms Accepted',
            'You have accepted the Terms and Conditions. This action will be recorded in your account.',
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
                <Text style={styles.headerTitle}>Terms & Conditions</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <TermsIcon width={24} height={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search terms..."
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
                    <Text style={styles.introTitle}>Welcome to Vibgyor</Text>
                    <Text style={styles.introText}>
                        These Terms and Conditions ("Terms") govern your use of the Vibgyor mobile application and services. Please read these terms carefully before using our service.
                    </Text>
                </View>

                {/* Terms Sections */}
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

                {/* Acceptance Section */}
                <View style={styles.acceptanceContainer}>
                    <Text style={styles.acceptanceTitle}>Acceptance</Text>
                    <Text style={styles.acceptanceText}>
                        By continuing to use our service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                    </Text>
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={handleAcceptTerms}
                    >
                        <Text style={styles.acceptButtonText}>I Accept These Terms</Text>
                    </TouchableOpacity>
                </View>

                {/* Contact Info */}
                <View style={styles.contactContainer}>
                    <Text style={styles.contactTitle}>Questions?</Text>
                    <Text style={styles.contactText}>
                        If you have any questions about these Terms and Conditions, please contact our legal team.
                    </Text>
                    <TouchableOpacity style={styles.contactButton}>
                        <Text style={styles.contactButtonText}>Contact Legal Team</Text>
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
    acceptanceContainer: {
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    acceptanceTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 10,
    },
    acceptanceText: {
        fontSize: 14,
        color: '#B0B0B0',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    acceptButton: {
        backgroundColor: '#DD3562',
        borderRadius: 12,
        paddingHorizontal: 30,
        paddingVertical: 12,
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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
        backgroundColor: '#3A3A3A',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#DD3562',
    },
    contactButtonText: {
        color: '#DD3562',
        fontSize: 14,
        fontWeight: '500',
    },
});
