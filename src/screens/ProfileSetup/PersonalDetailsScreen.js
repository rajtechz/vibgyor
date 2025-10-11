// src/screens/ProfileSetup/PersonalDetailsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Platform, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../../components/common/CustomButton';
import ProfileImageUpload from '../../components/common/ProfileImageUpload';
import ErrorModal from '../../components/common/ErrorModal';
import CommonBackground from '../../components/common/CommonBackground';
import { BackIcon, CalendarIcon } from '../../components/icons/SvgIcons';

function PersonalDetailsScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    bio: '',
    profileImage: null
  });

  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: 'Error'
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [emailVerified, setEmailVerified] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        dob: formatDate(selectedDate)
      }));
    }
  };

  const handleEmailVerification = () => {
    if (!formData.email) {
      showError('Please enter your email address first', 'Email Required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Please enter a valid email address', 'Invalid Email');
      return;
    }

    // Simulate email verification process
    Alert.alert(
      'Verification Email Sent',
      'Please check your email and click the verification link to verify your email address.',
      [
        {
          text: 'OK',
          onPress: () => setEmailVerified(true)
        }
      ]
    );
  };

  const handleContinue = () => {
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showError('Please fill in all required fields', 'Missing Information');
      return;
    }

    if (!emailVerified) {
      showError('Please verify your email address before continuing', 'Email Verification Required');
      return;
    }

    navigation.navigate('Gender');
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
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // Navigate to Auth screen if no previous screen
              navigation.navigate('Auth');
            }
          }}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>

        <Text style={styles.title}>Profile Details  </Text>
        <Text style={styles.description}>Fill up the following details</Text>
        
        <View style={styles.profileImageContainer}>
          <ProfileImageUpload
            onImageSelected={(image) => handleInputChange('profileImage', image)}
            currentImage={formData.profileImage}
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
           
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(text) => handleInputChange('firstName', text)}
                  placeholder="First Name"
                  placeholderTextColor="white"
                />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.inputGroup}>
           
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(text) => handleInputChange('lastName', text)}
                  placeholder="Last Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.inputGroup}>
           
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <View style={styles.emailInputContainer}>
                  <TextInput
                    style={styles.emailInput}
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="E-mail"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={[styles.verifyButton, emailVerified && styles.verifyButtonVerified]}
                    onPress={handleEmailVerification}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={emailVerified ? ['#4CAF50', '#45A049'] : ['#C53E8D', '#8A52F3']}
                      style={styles.verifyButtonGradient}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                    >
                      <Text style={styles.verifyButtonText}>
                        {emailVerified ? 'Verified' : 'Verify'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.inputGroup}>
       
            <View style={styles.dobContainer}>
              <View style={styles.dobInputContainer}>
                <LinearGradient
                  colors={['#C53E8D', '#8A52F3']}
                  style={styles.dobGradientBorder}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <TouchableOpacity
                    style={styles.dobInputField}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dobPlaceholder}>
                      {formData.dob || 'DOB'}
                    </Text>
                    <CalendarIcon width={21} height={22} />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View style={styles.ageBadgeContainer}>
                <LinearGradient
                  colors={['#C53E8D', '#8A52F3']}
                  style={styles.ageBadgeGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <View style={styles.ageBadge}>
                    <Text style={styles.ageText}>
                      {formData.dob ? calculateAge(selectedDate) : '18'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
           
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#C53E8D', '#8A52F3']}
                style={styles.inputGradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <TextInput
                  style={styles.input}
                  value={formData.bio}
                  onChangeText={(text) => handleInputChange('bio', text)}
                  placeholder="Bio"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  multiline
                  numberOfLines={1}
                  textAlignVertical="center"
                />
              </LinearGradient>
            </View>
          </View>
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

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
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
    fontWeight: 600,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formContainer: {
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 0,
  },
  inputGradientBorder: {
    borderRadius: 30,
    padding: 2,
  },
  input: {
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 0,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    borderWidth: 0,
    // paddingRight: 10,
  },
  verifyButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  verifyButtonVerified: {
    opacity: 0.8,
  },
  verifyButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  verifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  dobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dobInputContainer: {
    flex: 1,
  },
  dobGradientBorder: {
    borderRadius: 30,
    padding: 2,
  },
  dobInputField: {
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dobPlaceholder: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  ageBadgeContainer: {
    width: 50,
    height: 50,
  },
  ageBadgeGradient: {
    borderRadius: 30,
    padding: 2,
    width: 50,
    height: 50,
  },
  ageBadge: {
    backgroundColor: '#1a0033',
    borderRadius: 28,
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 5,
  },
  continueButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 35,
  },
});

export default PersonalDetailsScreen;
