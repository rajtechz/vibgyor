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
import { BackIcon, HelpIcon, ArrowRightIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';

export default function DeleteAccountScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const accountOptions = [
        {
            id: '1',
            title: 'Deactivate Dating Account',
            type: 'deactivate'
        },
        {
            id: '2',
            title: 'Deactivate Social Account',
            type: 'deactivate'
        },
        {
            id: '3',
            title: 'Deactivate Vibgyor Accounts',
            type: 'deactivate'
        },
        {
            id: '4',
            title: 'Delete Dating Account',
            type: 'delete'
        },
        {
            id: '5',
            title: 'Delete Social Account',
            type: 'delete'
        },
        {
            id: '6',
            title: 'Delete Vibgyor Accounts',
            type: 'delete'
        }
    ];

    const handleOptionPress = (option) => {
        Alert.alert(
            option.title,
            `Are you sure you want to ${option.type} your ${option.title.toLowerCase()}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: option.type === 'delete' ? 'Delete' : 'Deactivate',
                    style: option.type === 'delete' ? 'destructive' : 'default',
                    onPress: () => {
                        Alert.alert(
                            'Success',
                            `Your ${option.title.toLowerCase()} has been ${option.type === 'delete' ? 'deleted' : 'deactivated'}.`
                        );
                    }
                }
            ]
        );
    };

    const renderAccountOption = (option) => (
        <TouchableOpacity
            key={option.id}
            style={styles.optionContainer}
            onPress={() => handleOptionPress(option)}
        >
            <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                    <HelpIcon width={15} height={16} />
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
                <Text style={styles.headerTitle}>Delete Account</Text>
               
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.optionsContainer}>
                    {accountOptions.map(renderAccountOption)}
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
        backgroundColor: '#34344A4D',
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
        borderRadius: 15,
       
        alignItems: 'center',
        justifyContent: 'center',
      
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
        flex: 1,
    },
});
