// src/screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import CommonBackground from '../../components/common/CommonBackground';
import CustomButton from '../../components/common/CustomButton';

function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <CommonBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Please enter your valid phone number. We will send you a 4-digit code to verify.</Text>

          <View style={styles.inputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <Svg width="10" height="6" viewBox="0 0 10 6" style={styles.chevron}>
                <Path
                  d="M9 1L5 5L1 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.phoneInput}
              placeholder="331 623 8413"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
          </View>

          <CustomButton
            title="Submit"
            onPress={() => navigation.navigate('VerifyNumber')}
            style={styles.submitButton}
          />

          {/* <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <View style={styles.orCircle}>
              <Text style={styles.orText}></Text>
            </View>
            <View style={styles.orLine} />
          </View> */}
       

       
        </View>
      </SafeAreaView>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,

  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,

  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#8A52F3',
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  countryCode: {
    color: 'white',
    fontSize: 16,
    marginRight: 5,
  },
  chevron: {
    marginLeft: 5,
  },
  inputDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
    width: '70%',
    alignSelf: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3F1444',
  },
  orCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3F1444',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    zIndex: 1,
  },
  orText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  socialText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  socialButton: {
    width: 63,
    height: 63,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 63,
    height: 63,
  },
});

export default LoginScreen;
