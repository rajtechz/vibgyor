import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackIcon, ArrowRightIcon, AccountIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';

export default function GetVerifiedScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const verificationOptions = [
        {
            id: '1',
            title: 'Aadhar Verification',
            type: 'aadhar'
        },
        {
            id: '2',
            title: 'Other Verification',
            type: 'other'
        }
    ];

    const handleOptionPress = (option) => {
        Alert.alert(
            option.title,
            `You selected ${option.title}. This will open the verification process.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Continue',
                    onPress: () => {
                        Alert.alert(
                            'Verification Started',
                            `Starting ${option.title} process...`
                        );
                    }
                }
            ]
        );
    };

    const renderVerificationOption = (option) => (
        <TouchableOpacity
            key={option.id}
            style={styles.optionContainer}
            onPress={() => handleOptionPress(option)}
        >
            <View style={styles.optionLeft}>
            <View style={styles.iconContainer}>
                <AccountIcon width={24} height={24} />
            </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
            </View>
            <ArrowRightIcon width={16} height={16} color="#D9D8F3" />
        </TouchableOpacity>
    );

    return (
        <CommonBackground>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackIcon width={24} height={24} color="#D9D8F3" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verification</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.optionsContainer}>
                    {verificationOptions.map(renderVerificationOption)}
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
    headerSpacer: {
        width: 40,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    optionsContainer: {
        paddingTop: 20,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
        flex: 1,
    },
});
