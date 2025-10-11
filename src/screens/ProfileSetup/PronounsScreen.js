// src/screens/ProfileSetup/PronounsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import CustomButton from '../../components/common/CustomButton';
import ErrorModal from '../../components/common/ErrorModal';
import CommonBackground from '../../components/common/CommonBackground';
import { fonts } from '../../styles/typography';

// Back Icon Component
const BackIcon = ({ width = 24, height = 24, color = '#D9D8F3' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.375 5.25L8.625 12L15.375 18.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function PronounsScreen({ navigation }) {
  const [selectedPronouns, setSelectedPronouns] = useState('');
  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: 'Error'
  });

  const pronounOptions = [
    'He/Him',
    'She/Her',
    'They/Them',
    'Xe/Xem',
    'Ze/Zir',
    'Fae/Faer',
    'Ey/Em'
  ];

  const handlePronounSelect = (pronouns) => {
    setSelectedPronouns(pronouns);
  };

  const showError = (message, title = 'Error') => {
    setErrorModal({
      visible: true,
      message,
      title
    });
  };

  const hideError = () => {
    setErrorModal({
      visible: false,
      message: '',
      title: 'Error'
    });
  };

  const handleContinue = () => {
    // if (!selectedPronouns) {
    //   showError('Please select your pronouns', 'Selection Required');
    //   return;
    // }
    navigation.navigate('Interests');
  };

  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>

        <Text style={styles.title}>Your Pronouns</Text>
        <Text style={styles.subtitle}>Choose Your Pronouns For Better Results</Text>
        
        <View style={styles.optionsContainer}>
          {pronounOptions.map((pronouns, index) => {
            const isSelected = selectedPronouns === pronouns;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handlePronounSelect(pronouns)}
                style={styles.pronounOption}
                activeOpacity={1}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['#C53E8D', '#8A52F3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBorder}
                  >
                    <View style={styles.optionContainerInner}>
                      <Text style={styles.optionText}>{pronouns}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.optionContainer}>
                    <Text style={styles.optionText}>{pronouns}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>

      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        onClose={hideError}
      />
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  pronounOption: {
    marginBottom: 12,
    borderRadius: 35,
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 2, // thickness of the gradient border
    borderRadius: 35,
  },
  optionContainerInner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
    backgroundColor: '#03000C', // inner background
    alignItems: 'center',
  },
  optionContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: fonts.primary,
    fontWeight: fonts.weights.semibold,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  continueButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 35,
  },
});

export default PronounsScreen;
