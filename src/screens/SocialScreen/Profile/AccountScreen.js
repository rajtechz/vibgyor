import React, { useRef,useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CommonBackground from '../../../components/common/CommonBackground';
import ProfileImageUpload from '../../../components/common/ProfileImageUpload';
import { 
    BackIcon, 
    NextIcon, 
    PersonalDetailsIcon, 
    GenderIcon, 
    PronounsIcon, 
    LikesIcon, 
    UploadIDIcon, 
    LocationIconAccount 
} from '../../../components/icons/SvgIcons';



export default function AccountScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    // Animation for back button
    const backButtonScale = useRef(new Animated.Value(1)).current;
    
    const [profileImage, setProfileImage] = useState(null);

    // Account options data
    const accountOptions = [
        {
            id: 1,
            title: 'Personal Details',
            icon: <PersonalDetailsIcon width={20} height={20} />,
            onPress: () => navigation.navigate('PersonalDetails'),
        },
        {
            id: 2,
            title: 'Gender',
            icon: <GenderIcon width={20} height={20} />,
            onPress: () => navigation.navigate('Gender'),
        },
        {
            id: 3,
            title: 'Pronouns',
            icon: <PronounsIcon width={20} height={20} />,
            onPress: () => navigation.navigate('Pronouns'),
        },
        {
            id: 4,
            title: 'Likes & Interests',
            icon: <LikesIcon width={20} height={20} />,
            onPress: () => navigation.navigate('LikesInterests'),
        },
        {
            id: 5,
            title: 'Upload ID',
            icon: <UploadIDIcon width={20} height={20} />,
            onPress: () => navigation.navigate('UploadID'),
        },
        {
            id: 6,
            title: 'Location',
            icon: <LocationIconAccount width={20} height={20} />,
            onPress: () => navigation.navigate('Location'),
        },
    ];

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

    const handleImageSelected = (image) => {
        setProfileImage(image);
    };

    return (
        <CommonBackground>
            <StatusBar barStyle="light-content" backgroundColor="#140034" />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <BackIcon width={24} height={24} color="#D9D8F3" />
                </TouchableOpacity>
                </Animated.View>
                <Text style={styles.headerTitle}>Account</Text>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Profile Image Section */}
                    <View style={styles.profileImageContainer}>
                    <ProfileImageUpload
                        onImageSelected={handleImageSelected}
                        currentImage={profileImage}
                        size={120}
                    />
                </View>

                {/* Account Options */}
                <View style={styles.optionsContainer}>
                    {accountOptions.map((option) => (
                            <TouchableOpacity 
                            key={option.id}
                            style={styles.optionItem}
                            onPress={option.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.optionLeft}>
                                <View style={styles.iconContainer}>
                                    {option.icon}
                        </View>
                                <Text style={styles.optionText}>{option.title}</Text>
                    </View>
                            <NextIcon width={8} height={14} color="#FFFFFF" />
                            </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </CommonBackground>
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
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#DD3562',
        marginLeft: 16,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    optionsContainer: {
        paddingBottom: 40,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
        fontWeight: '500',
        color: 'white',
    },
});
