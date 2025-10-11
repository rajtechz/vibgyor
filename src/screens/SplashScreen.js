// src/screens/SplashScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Image,
    Animated,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Path } from 'react-native-svg';
import GradientBackground from '../components/common/GradientBackground';
import { colors, gradients } from '../styles/colors';
import { fonts } from '../styles/typography';

// Next Icon Component
const NextIcon = ({ size = 8, color = 'white' }) => (
    <Svg width={size} height={size * 1.75} viewBox="0 0 8 14" fill="none">
        <Path
            d="M0.982534 2.11054C0.689562 1.81756 0.689673 1.34253 0.982783 1.0497C1.27566 0.757092 1.75024 0.757163 2.04303 1.04985L7.29199 6.29699C7.38514 6.38956 7.45907 6.49963 7.50952 6.62088C7.55997 6.74213 7.58594 6.87216 7.58594 7.00349C7.58594 7.13482 7.55997 7.26485 7.50952 7.3861C7.45907 7.50735 7.38514 7.61742 7.29199 7.70999L2.04299 12.9599C1.75028 13.2527 1.27567 13.2527 0.98294 12.9599C0.690247 12.6673 0.690225 12.1927 0.982891 11.9L5.17001 7.7121C5.56047 7.32156 5.56044 6.68845 5.16995 6.29795L0.982534 2.11054Z"
            fill={color}
        />
    </Svg>
);

function SplashScreen({ navigation = {} }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(20)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const [showMainContent, setShowMainContent] = useState(false);

    useEffect(() => {
        // First animation - show logo.png
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // After 1 second, switch to MainContent.png
        const switchTimer = setTimeout(() => {
            setShowMainContent(true);
            // Scale animation for MainContent
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 30,
                friction: 2,
                useNativeDriver: true,
            }).start();
        }, 1000);

        return () => {
            clearTimeout(switchTimer);
        };
    }, [navigation]);

    return (
        <GradientBackground gradient="background">

            {showMainContent && (
                <Animated.View
                    style={[
                        styles.backgroundImageContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Image
                        source={require('../assets/images/MainContent.png')}
                        style={styles.backgroundImage}
                        resizeMode="contain"
                    />
                </Animated.View>
            )}


            {/* Splash Logo - always visible on top */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: translateYAnim }],
                    },
                ]}
            >
                <Image
                    source={require('../assets/icons/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Get Started Button */}
            <Animated.View
                style={[
                    styles.getStartedContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: translateYAnim }],
                    },
                ]}
            >
                <TouchableOpacity 
                    style={styles.resendButton}
                    onPress={() => {
                        if (navigation && navigation.replace) {
                            navigation.replace('Intro');
                        } else if (navigation && navigation.navigate) {
                            navigation.navigate('Intro');
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <MaskedView
                        maskElement={
                            <View style={styles.gradientButtonContent}>
                                <Text style={[styles.resendText, { backgroundColor: 'transparent' }]}>
                                    Get Started
                                </Text>
                                <View style={styles.arrowContainer}>
                                    <NextIcon size={12} color="white" />
                                </View>
                            </View>
                        }
                    >
                        <LinearGradient
                            colors={['#DD3562', '#8354FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ height: 30, width: 200 }} // Adjusted for text + arrow
                        >
                            <View style={styles.gradientButtonContent}>
                                <Text style={[styles.resendText, { opacity: 0 }]}>
                                    Get Started
                                </Text>
                                <View style={styles.arrowContainer}>
                                    <NextIcon size={12} color="white" />
                                </View>
                            </View>
                        </LinearGradient>
                    </MaskedView>
                </TouchableOpacity>
            </Animated.View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImageContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    backgroundImage: {
        width: 450,
        height: 450,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        zIndex: 2,
    },
    logo: {
        width: 120,
        height: 80,
    },
    getStartedContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 3,
        backgroundColor: 'transparent',
    },
    getStartedButton: {
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    getStartedGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingVertical: 15,
        minWidth: 200,
    },
    getStartedText: {
        fontSize: fonts.sizes.large,
        fontWeight: fonts.weights.semibold,
        color: colors.white,
        fontFamily: fonts.primary,
        letterSpacing: 0.5,
    },
    arrowContainer: {
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendButton: {
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    resendText: {
        fontSize: fonts.sizes.large,
        fontWeight: fonts.weights.semibold,
        fontFamily: fonts.primary,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    gradientButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
});


export default SplashScreen;
