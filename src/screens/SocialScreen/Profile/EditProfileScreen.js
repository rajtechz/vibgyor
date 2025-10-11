import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,

  ScrollView,

  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { CameraIcon } from '../../../components/icons/SvgIcons';
import CommonBackground from '../../../components/common/CommonBackground'; // Fixed import path
import ProfileImageUpload from '../../../components/common/ProfileImageUpload';
import CustomButton from '../../../components/common/CustomButton';
import { colors } from '../../../styles/colors';
import { fonts } from '../../../styles/typography';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

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

// Edit Icon Component
const EditIcon = ({ width = 24, height = 24, color = '#B783EB' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16.475 5.40783L18.592 7.52483M17.836 3.54283L12.109 9.26983C11.8122 9.56467 11.6102 9.94144 11.529 10.3518L11 12.9998L13.648 12.4698C14.058 12.3878 14.434 12.1868 14.73 11.8908L20.457 6.16383C20.6291 5.99173 20.7656 5.78742 20.8588 5.56256C20.9519 5.33771 20.9998 5.09671 20.9998 4.85333C20.9998 4.60994 20.9519 4.36895 20.8588 4.14409C20.7656 3.91923 20.6291 3.71492 20.457 3.54283C20.2849 3.37073 20.0806 3.23421 19.8557 3.14108C19.6309 3.04794 19.3899 3 19.1465 3C18.9031 3 18.6621 3.04794 18.4373 3.14108C18.2124 3.23421 18.0081 3.37073 17.836 3.54283Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 15V18C19 18.5304 18.7893 19.0391 18.4142 19.4142C18.0391 19.7893 17.5304 20 17 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H9"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Interest Icon Components
const MusicIcon = ({ width = 16, height = 18, color = '#B783EB' }) => (
  <Svg width={width} height={height} viewBox="0 0 16 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.136 0.857483C15.3264 1.0076 15.4375 1.2367 15.4375 1.47917V4.67918C15.4377 4.69042 15.4377 4.70162 15.4375 4.7128V13.5125C15.4375 14.7367 14.4451 15.7292 13.2208 15.7292H11.6771C10.4747 15.7292 9.5 14.7545 9.5 13.5521C9.5 12.3497 10.4747 11.375 11.6771 11.375H13.8542V5.69631L5.54167 7.66438V15.0958C5.54167 16.3201 4.54922 17.3125 3.325 17.3125H2.17708C0.974712 17.3125 0 16.3378 0 15.1354C0 13.9331 0.974712 12.9583 2.17708 12.9583H3.95833V7.05438C3.95809 7.04316 3.95809 7.03196 3.95833 7.0208V3.85417C3.95833 3.48812 4.2093 3.1698 4.56525 3.08437L14.4611 0.709367C14.6969 0.652781 14.9456 0.707363 15.136 0.857483ZM5.54167 6.03727L13.8542 4.0692V2.48332L5.54167 4.47832V6.03727ZM3.95833 14.5417H2.17708C1.84916 14.5417 1.58333 14.8075 1.58333 15.1354C1.58333 15.4633 1.84916 15.7292 2.17708 15.7292H3.325C3.67477 15.7292 3.95833 15.4456 3.95833 15.0958V14.5417ZM13.8542 12.9583H11.6771C11.3492 12.9583 11.0833 13.2242 11.0833 13.5521C11.0833 13.88 11.3492 14.1458 11.6771 14.1458H13.2208C13.5706 14.1458 13.8542 13.8623 13.8542 13.5125V12.9583Z"
      fill={color}
    />
  </Svg>
);

const CookingIcon = ({ width = 18, height = 18, color = '#B783EB' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.3975 0.909684C17.4935 1.33625 17.2255 1.75985 16.799 1.85582L12.6668 2.78555V8.20846H16.6252C17.0624 8.20846 17.4168 8.5629 17.4168 9.00013C17.4168 11.3411 16.7094 13.5262 15.2283 15.1344C13.7374 16.7532 11.5346 17.7085 8.7085 17.7085C5.88239 17.7085 3.67962 16.7532 2.18869 15.1344C0.707566 13.5262 0.000171543 11.3411 0.000171543 9.00013C0.000171543 8.5629 0.354613 8.20846 0.791838 8.20846H1.5835V5.2793L0.965619 5.41832C0.539057 5.5143 0.115457 5.24631 0.0194805 4.81974C-0.0764958 4.39318 0.191496 3.96958 0.618058 3.87361L1.5835 3.65638V3.45846C1.5835 3.02124 1.93795 2.6668 2.37517 2.6668C2.75938 2.6668 3.07966 2.94049 3.15169 3.30354L4.75017 2.94388V2.6668C4.75017 2.22957 5.10461 1.87513 5.54184 1.87513C5.95264 1.87513 6.29036 2.18802 6.32968 2.58849L7.91684 2.23138V1.87513C7.91684 1.43791 8.27128 1.08346 8.7085 1.08346C9.14573 1.08346 9.50017 1.43791 9.50017 1.87513L11.0835 1.51888V1.08346C11.0835 0.646239 11.4379 0.291798 11.8752 0.291798C12.3124 0.291798 12.6668 0.646239 12.6668 1.08346V1.16263L16.4514 0.311106C16.878 0.21513 17.3016 0.483122 17.3975 0.909684ZM11.0835 3.1418L9.50017 3.49805V8.20846H11.0835V3.1418ZM1.61546 9.7918C1.75491 11.4914 2.34865 12.9709 3.35333 14.0617C4.50129 15.3082 6.25686 16.1251 8.7085 16.1251C11.1602 16.1251 12.9157 15.3082 14.0637 14.0617C15.0684 12.9709 15.6621 11.4914 15.8016 9.7918H1.61546ZM3.16684 8.20846H4.75017V4.5668L3.16684 4.92305V8.20846ZM6.3335 4.21055V8.20846H7.91684V3.8543L6.3335 4.21055Z"
      fill={color}
    />
  </Svg>
);

const SwimmingIcon = ({ width = 18, height = 14, color = '#B783EB' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 14" fill="none">
    <Path
      d="M4.75012 9.77081C5.80067 9.77081 6.60508 9.96401 7.83446 10.4854L8.2871 10.6833L8.78159 10.9098L9.5088 11.2497L9.92754 11.4383C9.99402 11.4675 10.0589 11.4957 10.1224 11.5229L10.4864 11.6736C11.3574 12.0202 11.9525 12.1458 12.6668 12.1458C13.4175 12.1458 14.2521 11.9455 15.0941 11.6087C15.3944 11.4886 15.6735 11.3598 15.9229 11.2315L16.1356 11.1183L16.2178 11.0711C16.5927 10.8462 17.079 10.9678 17.304 11.3427C17.5289 11.7176 17.4073 12.2039 17.0324 12.4288L16.8178 12.5512L16.5512 12.6902C16.3085 12.8117 16.0155 12.9454 15.6822 13.0788C14.6687 13.4841 13.6479 13.7291 12.6668 13.7291C11.6162 13.7291 10.8118 13.536 9.58244 13.0145L9.1298 12.8166L8.63532 12.5902L7.9081 12.2503L7.48936 12.0617C7.42288 12.0324 7.35798 12.0042 7.29454 11.9771L6.93049 11.8264C6.05949 11.4798 5.46443 11.3541 4.75012 11.3541C3.99945 11.3541 3.16484 11.5545 2.32278 11.8913C2.02248 12.0114 1.7434 12.1402 1.49402 12.2685L1.28135 12.3817L1.1991 12.4288C0.824178 12.6538 0.337888 12.5322 0.112938 12.1573C-0.112013 11.7824 0.00955948 11.2961 0.384477 11.0711L0.599087 10.9488L0.865683 10.8097C1.10846 10.6883 1.40143 10.5545 1.73475 10.4212C2.74817 10.0158 3.76902 9.77081 4.75012 9.77081Z"
      fill={color}
    />
    <Path
      d="M4.75012 5.02081C5.80067 5.02081 6.60508 5.214 7.83446 5.73544L8.2871 5.93333L8.78159 6.15979L9.5088 6.4997L9.92754 6.68828C9.99402 6.71754 10.0589 6.74573 10.1224 6.77289L10.4864 6.92356C11.3574 7.2702 11.9525 7.39581 12.6668 7.39581C13.4175 7.39581 14.2521 7.19551 15.0941 6.85869C15.3944 6.73856 15.6735 6.60976 15.9229 6.48151L16.1356 6.36826L16.2178 6.32113C16.5927 6.09618 17.079 6.21775 17.304 6.59267C17.5289 6.96759 17.4073 7.45388 17.0324 7.67883L16.8178 7.8012L16.5512 7.94024C16.3085 8.0617 16.0155 8.19545 15.6822 8.32877C14.6687 8.73414 13.6479 8.97915 12.6668 8.97915C11.6162 8.97915 10.8118 8.78596 9.58244 8.26452L9.1298 8.06663L8.63532 7.84017L7.9081 7.50026L7.48936 7.31168C7.42288 7.28242 7.35798 7.25423 7.29454 7.22707L6.93049 7.0764C6.05949 6.72976 5.46443 6.60415 4.75012 6.60415C3.99945 6.60415 3.16484 6.80445 2.32278 7.14127C2.02248 7.2614 1.7434 7.3902 1.49402 7.51845L1.28135 7.6317L1.1991 7.67883C0.824178 7.90378 0.337888 7.78221 0.112938 7.40729C-0.112013 7.03237 0.00955948 6.54608 0.384477 6.32113L0.599087 6.19876L0.865683 6.05972C1.10846 5.93826 1.40143 5.80451 1.73475 5.67119C2.74817 5.26582 3.76902 5.02081 4.75012 5.02081Z"
      fill={color}
    />
    <Path
      d="M4.75012 0.270813C5.80067 0.270813 6.60508 0.464004 7.83446 0.98544L8.2871 1.18333L8.78159 1.40979L9.5088 1.7497L9.92754 1.93828C9.99402 1.96754 10.0589 1.99573 10.1224 2.02289L10.4864 2.17356C11.3574 2.5202 11.9525 2.64581 12.6668 2.64581C13.4175 2.64581 14.2521 2.44551 15.0941 2.10869C15.3944 1.98856 15.6735 1.85976 15.9229 1.73151L16.1356 1.61826L16.2178 1.57113C16.5927 1.34618 17.079 1.46775 17.304 1.84267C17.5289 2.21759 17.4073 2.70388 17.0324 2.92883L16.8178 3.0512L16.5512 3.19024C16.3085 3.3117 16.0155 3.44545 15.6822 3.57877C14.6687 3.98414 13.6479 4.22915 12.6668 4.22915C11.6162 4.22915 10.8118 4.03596 9.58244 3.51452L9.1298 3.31663L8.63532 3.09017L7.9081 2.75026L7.48936 2.56168C7.42288 2.53242 7.35798 2.50423 7.29454 2.47707L6.93049 2.3264C6.05949 1.97976 5.46443 1.85415 4.75012 1.85415C3.99945 1.85415 3.16484 2.05445 2.32278 2.39127C2.02248 2.5114 1.7434 2.6402 1.49402 2.76845L1.28135 2.8817L1.1991 2.92883C0.824178 3.15378 0.337888 3.03221 0.112938 2.65729C-0.112013 2.28237 0.00955948 1.79608 0.384477 1.57113L0.599087 1.44876L0.865683 1.30972C1.10846 1.18826 1.40143 1.05451 1.73475 0.921186C2.74817 0.515819 3.76902 0.270813 4.75012 0.270813Z"
      fill={color}
    />
  </Svg>
);

const TravellingIcon = ({ width = 18, height = 18, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.8542 2.27083C13.1983 2.27083 12.6667 2.8025 12.6667 3.45833C12.6667 4.11417 13.1983 4.64583 13.8542 4.64583C14.51 4.64583 15.0417 4.11417 15.0417 3.45833C15.0417 2.8025 14.51 2.27083 13.8542 2.27083ZM11.0833 3.45833C11.0833 1.92804 12.3239 0.6875 13.8542 0.6875C15.3845 0.6875 16.625 1.92804 16.625 3.45833C16.625 4.98862 15.3845 6.22917 13.8542 6.22917C12.3239 6.22917 11.0833 4.98862 11.0833 3.45833ZM6.34031 3.06253C6.65736 3.06532 6.94216 3.25701 7.06411 3.54968L10.2092 11.098L11.124 8.35382C11.2217 8.06052 11.4813 7.85096 11.7886 7.81723C12.0959 7.78349 12.3948 7.93175 12.5539 8.19686L17.3039 16.1135C17.4506 16.3581 17.4544 16.6627 17.3139 16.9109C17.1734 17.1591 16.9102 17.3125 16.625 17.3125H0.791669C0.524501 17.3125 0.275354 17.1777 0.12912 16.9542C-0.0171148 16.7306 -0.0407083 16.4483 0.066378 16.2035L5.60804 3.53685C5.73513 3.24637 6.02326 3.05974 6.34031 3.06253ZM2.00214 15.7292H15.2268L12.0817 10.4874L11.0427 13.6045C10.9383 13.9177 10.6505 14.1333 10.3206 14.1453C9.99065 14.1574 9.68788 13.9634 9.5609 13.6587L6.31558 5.86988L2.00214 15.7292Z"
      fill={color}
    />
  </Svg>
);

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: 'Mathew Ben',
    username: 'Mathew_ben',
    gender: 'Female(she/her)',
    bio: 'Love music, cooking, swimming, going out, travellig etc. Wanna be friends??',
    interests: ['Music', 'Cooking', 'Swimming', 'Travelling'],
  });


  const handleImageSelected = (image) => {
    setProfileImage(image);
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile:', formData);
    navigation.goBack();
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} color="#D9D8F3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <ProfileImageUpload
            onImageSelected={handleImageSelected}
            currentImage={profileImage}
            size={120}
          />
        </View>

        {/* User Information Section */}
        <View style={styles.userInfoSection}>
          {/* Name */}
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{formData.name}</Text>
            <EditIcon />
          </View>

          {/* Username */}
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{formData.username}</Text>
            <EditIcon />
          </View>

          {/* Gender */}
          <View style={styles.infoRow}>
            <Text style={styles.genderText}>{formData.gender}</Text>
            <EditIcon />
          </View>
        </View>

        {/* Short Bio Section */}
        <View style={styles.bioSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Short Bio</Text>
            <EditIcon />
          </View>
          <Text style={styles.bioText}>{formData.bio}</Text>
        </View>

        {/* Interests Section */}
        <View style={styles.interestsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <EditIcon />
          </View>
          <View style={styles.interestsContainer}>
            {formData.interests.map((interest, index) => (
              <View key={index} style={styles.interestItem}>
                {interest === 'Music' ? <MusicIcon width={16} height={18} color="#B783EB" /> :
                  interest === 'Cooking' ? <CookingIcon width={18} height={18} color="#B783EB" /> :
                    interest === 'Swimming' ? <SwimmingIcon width={18} height={14} color="#B783EB" /> :
                      interest === 'Travelling' ? <TravellingIcon width={18} height={18} color="#B783EB" /> :
                        <Text style={styles.interestIcon}>{interest}</Text>

                }
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Save Details Button */}
        <CustomButton
          title="Save Details"
          onPress={handleSave}
          style={styles.saveButtonContainer}
        />
      </ScrollView>
    </CommonBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F44363',
    fontFamily: fonts.primary,
    fontWeight:700
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfoSection: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: fonts.primary,
  },
  genderText: {
    fontSize: 16,
    color: '#B783EB',
    fontFamily: fonts.primary,
  },
  editIconContainer: {
    padding: 4,
  },
  bioSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: fonts.primary,
  },
  bioText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    fontFamily: fonts.primary,
  },
  interestsSection: {
    marginBottom: 40,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,

  },
  interestIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  interestText: {
    fontSize: 14,
    color: '#B783EB',
    fontWeight: '500',
    fontFamily: fonts.primary,
  },
  saveButtonContainer: {
    marginBottom: 40,
  },
});

export default EditProfileScreen;
