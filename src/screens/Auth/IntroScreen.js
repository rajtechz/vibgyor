import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts } from '../../styles/typography';
import GradientBackground from '../../components/common/GradientBackground';
import CustomButton from '../../components/common/CustomButton';

const IntroScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Apply the same animation as SplashScreen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 30,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <GradientBackground gradient="background" direction="vertical" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Text style={styles.vibgyorText}>VIBGYOR</Text>
          <Text style={styles.findYourBestMatchText}>Find Your </Text>
          <Text style={styles.findYourBestMatchText}>Best Match </Text>
          <Text style={styles.subtitleText}>Wanna know how to connect</Text>
          <Text style={styles.tapButtonText}>Tap the button</Text>
        </View>
        <View style={styles.introImageContainer}>
          <Animated.View
            style={[
              styles.animatedImageContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={require('../../assets/images/IntroImage.png')}
              style={styles.introImage}
            />
          </Animated.View>
          <Image
            source={require('../../assets/images/swirlarrow.png')}
            style={styles.swirlArrow}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Continue " 
            onPress={() => navigation.navigate('Login')} 
            style={styles.customButtonStyle}
          />
        </View>

      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 60,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start', // keep content top-aligned
    marginBottom: 20, // space between text and image
  },
  vibgyorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF3A6A',
    textAlign: 'center',
    fontFamily: fonts.primary,
    letterSpacing: 2,

  },
  findYourBestMatchText: {
    fontSize: 45,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: fonts.primary
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: fonts.primary,
    marginTop: 10,

  },
  tapButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFD335',
    textAlign: 'center',
    fontFamily: fonts.primary,

  },
  swirlArrow: {
    position: 'absolute',
    top: -10,
    width: 180,
    height: 120,
    resizeMode: 'contain',
    zIndex: 10,
  },
  introImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  introImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: -10,  
  },
  animatedImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  customButtonStyle: {
    width: '80%',
    borderRadius: 35,
  },
});

export default IntroScreen;
