import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Switch
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackIcon, PrivacyIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground';
import LinearGradient from 'react-native-linear-gradient';


export default function PrivacyPolicyScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const [privacySettings, setPrivacySettings] = useState({
        makeAccountPrivate: true,
        likesVisibility: true,
        commenting: true
    });

    const handleToggle = (setting) => {
        setPrivacySettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const renderPrivacyOption = (title, description, settingKey) => (
        <View style={styles.optionContainer}>
            <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{title}</Text>
                {description && (
                    <Text style={styles.optionDescription}>{description}</Text>
                )}
            </View>
            <View style={styles.switchContainer}>
                <Switch
                    value={privacySettings[settingKey]}
                    onValueChange={() => handleToggle(settingKey)}
                    trackColor={{ false: '#3A3A3A', true: '#DD3562' }}
                    thumbColor={privacySettings[settingKey] ? '#FFFFFF' : '#B0B0B0'}
                    ios_backgroundColor="#3A3A3A"
                />
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
                <Text style={styles.headerTitle}>Privacy Options</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Privacy Options */}
                <View style={styles.optionsContainer}>
                    {renderPrivacyOption(
                        "Make Your Account Private",
                        "This will make you data visible, Only for you followers and for you following",
                        "makeAccountPrivate"
                    )}
                    
                    {renderPrivacyOption(
                        "Likes Visibility",
                        null,
                        "likesVisibility"
                    )}
                    
                    {renderPrivacyOption(
                        "Commenting",
                        null,
                        "commenting"
                    )}
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
        backgroundColor: '#2A1A4A',
        borderRadius: 12,
        marginBottom: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    optionContent: {
        flex: 1,
        marginRight: 15,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 5,
    },
    optionDescription: {
        fontSize: 14,
        color: '#B0B0B0',
        lineHeight: 18,
    },
    switchContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
