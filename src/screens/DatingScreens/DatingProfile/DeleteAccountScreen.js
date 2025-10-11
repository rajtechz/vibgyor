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
import { BackIcon, DeleteIcon, WarningIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';


export default function DeleteAccountScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = () => {
        if (confirmationText.toLowerCase() !== 'delete') {
            Alert.alert('Invalid Input', 'Please type "DELETE" to confirm account deletion.');
            return;
        }

        Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setIsDeleting(true);
                        // Simulate API call
                        setTimeout(() => {
                            setIsDeleting(false);
                            Alert.alert(
                                'Account Deleted',
                                'Your account has been permanently deleted.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            // Navigate to login screen
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Auth' }],
                                            });
                                        },
                                    },
                                ]
                            );
                        }, 2000);
                    },
                },
            ]
        );
    };

    return (
        <CommonBackground>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackIcon width={24} height={24} color="#D9D8F3" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Delete Account</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <WarningIcon width={24} height={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Warning Section */}
                <View style={styles.warningSection}>
                    <View style={styles.warningIconContainer}>
                        <WarningIcon width={48} height={48} color="#FF6B6B" />
                    </View>
                    <Text style={styles.warningTitle}>Delete Your Account</Text>
                    <Text style={styles.warningDescription}>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </Text>
                </View>

                {/* What happens when you delete */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>What happens when you delete your account:</Text>
                    <View style={styles.infoList}>
                        <Text style={styles.infoItem}>• All your profile information will be deleted</Text>
                        <Text style={styles.infoItem}>• All your matches and conversations will be lost</Text>
                        <Text style={styles.infoItem}>• You will not be able to recover any data</Text>
                        <Text style={styles.infoItem}>• You can create a new account anytime</Text>
                    </View>
                </View>

                {/* Confirmation Input */}
                <View style={styles.confirmationSection}>
                    <Text style={styles.confirmationLabel}>
                        Type "DELETE" to confirm:
                    </Text>
                    <TextInput
                        style={styles.confirmationInput}
                        value={confirmationText}
                        onChangeText={setConfirmationText}
                        placeholder="Type DELETE here"
                        placeholderTextColor="#B0B0B0"
                        autoCapitalize="characters"
                    />
                </View>

                {/* Delete Button */}
                <View style={styles.deleteButtonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.deleteButton,
                            confirmationText.toLowerCase() !== 'delete' && styles.deleteButtonDisabled
                        ]}
                        onPress={handleDeleteAccount}
                        disabled={confirmationText.toLowerCase() !== 'delete' || isDeleting}
                        activeOpacity={0.8}
                    >
                        <DeleteIcon width={20} height={20} color="#FFFFFF" />
                        <Text style={styles.deleteButtonText}>
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </Text>
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
    warningSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 20,
    },
    warningIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF6B6B20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    warningTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FF6B6B',
        marginBottom: 12,
        textAlign: 'center',
    },
    warningDescription: {
        fontSize: 14,
        color: '#B0B0B0',
        textAlign: 'center',
        lineHeight: 20,
    },
    infoSection: {
        marginBottom: 30,
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 15,
    },
    infoList: {
        paddingLeft: 8,
    },
    infoItem: {
        fontSize: 14,
        color: '#B0B0B0',
        marginBottom: 8,
        lineHeight: 20,
    },
    confirmationSection: {
        marginBottom: 30,
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 20,
    },
    confirmationLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 12,
    },
    confirmationInput: {
        backgroundColor: '#3A3A3A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: 'white',
        borderWidth: 1,
        borderColor: '#DD3562',
    },
    deleteButtonContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        paddingHorizontal: 30,
        paddingVertical: 12,
        justifyContent: 'center',
    },
    deleteButtonDisabled: {
        backgroundColor: '#48485E40',
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginLeft: 8,
    },
});
