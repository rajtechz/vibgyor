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
    Image,
    FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackIcon, MatchesIcon, SendIcon } from '../../../components/icons/SvgIcons';

export default function ChatSupportScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: 'Hello! How can I help you today?',
            isUser: false,
            timestamp: '10:30 AM',
            avatar: require('../../../assets/images/Profile.png')
        }
    ]);

    const quickReplies = [
        'Account Issues',
        'Payment Problems',
        'Technical Support',
        'Report a Bug',
        'Feature Request',
        'General Question'
    ];

    const faqItems = [
        {
            id: '1',
            question: 'How do I reset my password?',
            answer: 'Go to Settings > Account > Change Password. Enter your current password and create a new one.'
        },
        {
            id: '2',
            question: 'How do I delete my account?',
            answer: 'Go to Settings > Account > Delete Account. Follow the prompts to permanently delete your account.'
        },
        {
            id: '3',
            question: 'How do I report inappropriate behavior?',
            answer: 'Tap the three dots on any profile or message, then select "Report" and choose the reason.'
        },
        {
            id: '4',
            question: 'How do I get verified?',
            answer: 'Go to Settings > Get Verified and follow the verification process with your government ID.'
        },
        {
            id: '5',
            question: 'How do I change my location?',
            answer: 'Go to Settings > Privacy > Location and update your location preferences.'
        }
    ];

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: message.trim(),
                isUser: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: require('../../../assets/images/Profile.png')
            };
            
            setMessages(prev => [...prev, newMessage]);
            setMessage('');
            
            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    id: (Date.now() + 1).toString(),
                    text: 'Thank you for your message. Our support team will get back to you within 24 hours.',
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: require('../../../assets/images/Profile.png')
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    const handleQuickReply = (reply) => {
        setMessage(reply);
    };

    const handleFaqPress = (item) => {
        Alert.alert(item.question, item.answer, [{ text: 'OK' }]);
    };

    const renderMessage = ({ item }) => (
        <View style={[
            styles.messageContainer,
            item.isUser ? styles.userMessage : styles.botMessage
        ]}>
            {!item.isUser && (
                <Image source={item.avatar} style={styles.messageAvatar} />
            )}
            <View style={[
                styles.messageBubble,
                item.isUser ? styles.userBubble : styles.botBubble
            ]}>
                <Text style={[
                    styles.messageText,
                    item.isUser ? styles.userMessageText : styles.botMessageText
                ]}>
                    {item.text}
                </Text>
                <Text style={[
                    styles.messageTime,
                    item.isUser ? styles.userMessageTime : styles.botMessageTime
                ]}>
                    {item.timestamp}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#140034" />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackIcon width={24} height={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chat Support</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <MatchesIcon width={24} height={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Quick Replies */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Replies</Text>
                    <View style={styles.quickRepliesContainer}>
                        {quickReplies.map((reply, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.quickReplyButton}
                                onPress={() => handleQuickReply(reply)}
                            >
                                <Text style={styles.quickReplyText}>{reply}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    {faqItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.faqItem}
                            onPress={() => handleFaqPress(item)}
                        >
                            <Text style={styles.faqQuestion}>{item.question}</Text>
                            <Text style={styles.faqArrow}>›</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Contact Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Other Ways to Contact Us</Text>
                    <View style={styles.contactInfoContainer}>
                        <View style={styles.contactItem}>
                            <Text style={styles.contactLabel}>Email:</Text>
                            <Text style={styles.contactValue}>support@vibgyor.com</Text>
                        </View>
                        <View style={styles.contactItem}>
                            <Text style={styles.contactLabel}>Phone:</Text>
                            <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
                        </View>
                        <View style={styles.contactItem}>
                            <Text style={styles.contactLabel}>Hours:</Text>
                            <Text style={styles.contactValue}>24/7 Support</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Chat Messages */}
            <View style={styles.chatContainer}>
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    style={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Message Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.messageInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message..."
                    placeholderTextColor="#B0B0B0"
                    multiline
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                    disabled={!message.trim()}
                >
                    <SendIcon width={20} height={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#140034',
    },
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
        color: 'white',
    },
    menuButton: {
        padding: 8,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 15,
    },
    quickRepliesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    quickReplyButton: {
        backgroundColor: '#2A1A4A',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#DD3562',
    },
    quickReplyText: {
        color: '#DD3562',
        fontSize: 14,
        fontWeight: '500',
    },
    faqItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    faqQuestion: {
        flex: 1,
        fontSize: 14,
        color: 'white',
        marginRight: 10,
    },
    faqArrow: {
        fontSize: 18,
        color: '#DD3562',
    },
    contactInfoContainer: {
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 20,
    },
    contactItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    contactLabel: {
        fontSize: 14,
        color: '#B0B0B0',
        width: 60,
    },
    contactValue: {
        fontSize: 14,
        color: 'white',
        flex: 1,
    },
    chatContainer: {
        maxHeight: 200,
        backgroundColor: '#2A1A4A',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 12,
        padding: 10,
    },
    messagesList: {
        flex: 1,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-end',
    },
    userMessage: {
        justifyContent: 'flex-end',
    },
    botMessage: {
        justifyContent: 'flex-start',
    },
    messageAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    userBubble: {
        backgroundColor: '#DD3562',
    },
    botBubble: {
        backgroundColor: '#3A3A3A',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 18,
    },
    userMessageText: {
        color: 'white',
    },
    botMessageText: {
        color: 'white',
    },
    messageTime: {
        fontSize: 10,
        marginTop: 4,
    },
    userMessageTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    botMessageTime: {
        color: '#B0B0B0',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#2A1A4A',
        borderTopWidth: 1,
        borderTopColor: '#3A3A3A',
    },
    messageInput: {
        flex: 1,
        backgroundColor: '#3A3A3A',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: 'white',
        maxHeight: 100,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#DD3562',
        borderRadius: 20,
        padding: 10,
        opacity: 0.7,
    },
});
