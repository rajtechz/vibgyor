import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import CommonBackground from '../../../components/common/CommonBackground';
import ProfileImageUpload from '../../../components/common/ProfileImageUpload';
import CustomButton from '../../../components/common/CustomButton';
import { BackIcon, CalendarIcon } from '../../../components/icons/SvgIcons';
import { hideTabBar, showTabBar, setCurrentScreen } from '../../../redux/slices/uiSlice';
import { authAPI } from '../../../api/authAPI';

function ViewPersonalDetailsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { user, accessToken } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    bio: '',
    profileImage: null,
  });
  const [editableData, setEditableData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollViewRef = useRef(null);

  // Initialize selectedDate when profileData.dob changes
  useEffect(() => {
    if (profileData.dob) {
      try {
        const dateObj = new Date(profileData.dob);
        if (!isNaN(dateObj.getTime())) {
          setSelectedDate(dateObj);
        }
      } catch (e) {
        // Invalid date, keep default
      }
    }
  }, [profileData.dob]);

  // Redux-based tab bar hiding when ViewPersonalDetailsScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('👤 ViewPersonalDetailsScreen Focused - Hiding TabBar');
      dispatch(setCurrentScreen('ViewPersonalDetails'));
      dispatch(hideTabBar());

      return () => {
        console.log('👤 ViewPersonalDetailsScreen Unfocused - Showing TabBar');
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [dispatch])
  );

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        // Try to get profile from Redux first
        if (user && user.fullName) {
          const nameParts = user.fullName.split(' ');
          const newData = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            dob: user.dob || '',
            bio: user.bio || '',
            profileImage: user.profileImage || null,
          };
          setProfileData(newData);
          setEditableData({
            firstName: newData.firstName,
            lastName: newData.lastName,
            email: newData.email,
            dob: newData.dob,
            bio: newData.bio,
          });
          setIsLoading(false);
          return;
        }

        // If not in Redux, fetch from API
        if (!accessToken) {
          setIsLoading(false);
          return;
        }
        const response = await authAPI.getUserProfile(accessToken);
        if (response && response.success) {
          const data = response.data?.data || response.data || {};
          const nameParts = (data.fullName || data.name || '').split(' ');
          const newData = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: data.email || '',
            dob: data.dob || data.dateOfBirth || '',
            bio: data.bio || '',
            profileImage: data.profileImage || null,
          };
          setProfileData(newData);
          setEditableData({
            firstName: newData.firstName,
            lastName: newData.lastName,
            email: newData.email,
            dob: newData.dob,
            bio: newData.bio,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const formatDate = (date) => {
    if (!date) return '';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return date;
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 18;
    try {
      const today = new Date();
      const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 18;
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = formatDate(selectedDate);
      handleInputChange('dob', formattedDate);
    }
  };

  const scrollToEndOnFocus = () => {
    setTimeout(() => {
      if (scrollViewRef.current?.scrollToEnd) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      } else if (scrollViewRef.current?.scrollTo) {
        scrollViewRef.current.scrollTo({ y: 10000, animated: true });
      }
    }, 100);
  };

  const handleEditPress = () => {
    setIsEditMode(true);
    // Copy current data to editable state
    setEditableData({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      dob: profileData.dob,
      bio: profileData.bio,
    });
    // Update selectedDate if dob exists
    if (profileData.dob) {
      try {
        const dateObj = new Date(profileData.dob);
        if (!isNaN(dateObj.getTime())) {
          setSelectedDate(dateObj);
        }
      } catch (e) {
        // Invalid date, keep default
      }
    }
  };

  const handleCancelPress = () => {
    setIsEditMode(false);
    // Reset editable data to original
    setEditableData({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      dob: profileData.dob,
      bio: profileData.bio,
    });
  };

  const handleSavePress = async () => {
    try {
      setIsSaving(true);
      
      // Prepare update data
      const updateData = {
        fullName: `${editableData.firstName} ${editableData.lastName}`.trim(),
        email: editableData.email,
        dob: editableData.dob,
        bio: editableData.bio,
      };

      // Call API to update profile
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      const response = await authAPI.updateUserProfile(updateData, accessToken);
      
      if (response && response.success) {
        // Update local state
        setProfileData(prev => ({
          ...prev,
          firstName: editableData.firstName,
          lastName: editableData.lastName,
          email: editableData.email,
          dob: editableData.dob,
          bio: editableData.bio,
        }));
        setIsEditMode(false);
      } else {
        console.error('Failed to update profile:', response?.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon width={24} height={24} color="#D9D8F3" />
          </TouchableOpacity>

          <Text style={styles.title}>Profile Details</Text>
          <Text style={styles.description}>View and edit your personal information</Text>
          
          {/* Profile Image Section */}
          <View style={styles.profileImageContainer}>
            <ProfileImageUpload
              onImageSelected={(image) => {
                if (isEditMode) {
                  setProfileData(prev => ({ ...prev, profileImage: image }));
                }
              }}
              currentImage={profileData.profileImage}
            />
          </View>

          <View style={styles.formContainer}>
            {/* First Name / Full Name */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#C53E8D', '#8A52F3']}
                  style={styles.inputGradientBorder}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  {isEditMode ? (
                    <TextInput
                      style={styles.input}
                      value={editableData.firstName}
                      onChangeText={(text) => handleInputChange('firstName', text)}
                      placeholder="Full Name"
                      placeholderTextColor="white"
                      onFocus={scrollToEndOnFocus}
                    />
                  ) : (
                    <Text style={styles.inputReadonly}>
                      {profileData.firstName || 'Not set'}
                    </Text>
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Last Name / Username */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#C53E8D', '#8A52F3']}
                  style={styles.inputGradientBorder}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  {isEditMode ? (
                    <TextInput
                      style={styles.input}
                      value={editableData.lastName}
                      onChangeText={(text) => handleInputChange('lastName', text)}
                      placeholder="User Name"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      autoCapitalize="none"
                      onFocus={scrollToEndOnFocus}
                    />
                  ) : (
                    <Text style={styles.inputReadonly}>
                      {profileData.lastName || 'Not set'}
                    </Text>
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#C53E8D', '#8A52F3']}
                  style={styles.inputGradientBorder}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  {isEditMode ? (
                    <TextInput
                      style={styles.input}
                      value={editableData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      placeholder="E-mail"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={scrollToEndOnFocus}
                    />
                  ) : (
                    <Text style={styles.inputReadonly}>
                      {profileData.email || 'Not set'}
                    </Text>
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <View style={styles.dobContainer}>
                <View style={styles.dobInputContainer}>
                  <LinearGradient
                    colors={['#C53E8D', '#8A52F3']}
                    style={styles.dobGradientBorder}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  >
                    {isEditMode ? (
                      <TouchableOpacity
                        style={styles.dobInputField}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.dobPlaceholder}>
                          {editableData.dob || 'DOB'}
                        </Text>
                        <CalendarIcon width={21} height={22} />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.dobInputField}>
                        <Text style={styles.dobPlaceholder}>
                          {profileData.dob ? formatDate(profileData.dob) : 'DOB'}
                        </Text>
                      </View>
                    )}
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
                        {profileData.dob ? calculateAge(profileData.dob) : '18'}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Bio */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#C53E8D', '#8A52F3']}
                  style={styles.inputGradientBorder}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  {isEditMode ? (
                    <TextInput
                      style={styles.input}
                      value={editableData.bio}
                      onChangeText={(text) => handleInputChange('bio', text)}
                      placeholder="Bio"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      multiline
                      numberOfLines={1}
                      textAlignVertical="center"
                      onFocus={scrollToEndOnFocus}
                    />
                  ) : (
                    <Text style={styles.inputReadonly}>
                      {profileData.bio || 'No bio added'}
                    </Text>
                  )}
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {isEditMode ? (
              <>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelPress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <CustomButton
                  title={isSaving ? "Saving..." : "Save Changes"}
                  onPress={handleSavePress}
                  style={styles.continueButton}
                  disabled={isSaving}
                />
              </>
            ) : (
              <CustomButton
                title="Save"
                onPress={handleEditPress}
                style={styles.continueButton}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
    fontFamily: 'Lexend-Bold',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Lexend-Regular',
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
    position: 'relative',
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
    fontFamily: 'Lexend-Regular',
  },
  inputReadonly: {
    backgroundColor: '#1a0033',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: 'white',
    fontFamily: 'Lexend-Regular',
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
    fontFamily: 'Lexend-Regular',
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
    fontFamily: 'Lexend-SemiBold',
  },
  buttonContainer: {
    marginTop: 5,
    gap: 12,
  },
  continueButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 35,
  },
  cancelButton: {
    width: '70%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cancelButtonText: {
    color: '#DD3562',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Lexend-SemiBold',
    textAlign: 'center',
  },
});

export default ViewPersonalDetailsScreen;

