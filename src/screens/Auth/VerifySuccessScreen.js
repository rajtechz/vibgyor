// src/screens/Auth/VerifySuccessScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, G, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { setVerificationStatus } from '../../utils/authUtils';
import { authAPI } from '../../api/authAPI';
import CommonBackground from '../../components/common/CommonBackground';

// Success Icon Component - Complete version matching the original SVG
const SuccessIcon = ({ width = 180, height = 180 }) => (
  <Svg width={width} height={height} viewBox="0 0 232 232" fill="none">
    <G filter="url(#filter0_d_63_1947)">
      <Path 
        opacity="0.2" 
        d="M105.593 23.9062C111.203 19.1082 120.352 19.032 126.155 23.6826L126.43 23.9072L139.694 35.3271C140.983 36.4437 142.817 37.4435 144.745 38.1641C146.674 38.8848 148.72 39.334 150.438 39.334H164.712C173.474 39.334 180.668 46.5283 180.668 55.292V69.5684C180.668 71.2448 181.119 73.2907 181.839 75.2295C182.559 77.1678 183.558 79.0232 184.675 80.3125V80.3135L196.095 93.5811C200.968 99.2807 200.969 108.632 196.095 114.418L184.675 127.687C183.558 128.975 182.559 130.81 181.839 132.738C181.118 134.667 180.668 136.714 180.668 138.432V152.708C180.668 161.472 173.474 168.666 164.712 168.666H150.438C148.761 168.666 146.716 169.116 144.777 169.836C142.839 170.556 140.983 171.556 139.694 172.673L126.428 184.094C120.817 188.892 111.668 188.968 105.865 184.317L105.592 184.093L92.3262 172.673C91.0377 171.556 89.2037 170.556 87.2754 169.836C85.3467 169.115 83.3007 168.666 81.583 168.666H67.0566C58.2942 168.666 51.1007 161.472 51.1006 152.708V138.348C51.1006 136.671 50.6511 134.646 49.9414 132.729C49.2317 130.811 48.2536 128.978 47.1807 127.69L47.1787 127.688L35.8428 114.336C31.0516 108.634 31.052 99.3643 35.8438 93.6631L35.8428 93.6621L47.1787 80.3115L47.1807 80.3096C48.2536 79.0218 49.2317 77.189 49.9414 75.2715C50.6511 73.3541 51.1006 71.3289 51.1006 69.6523V55.208C51.1007 46.4444 58.2942 39.2501 67.0566 39.25H81.583C83.2592 39.25 85.3056 38.8005 87.2441 38.0801C89.1822 37.3598 91.0371 36.3602 92.3262 35.2432L105.593 23.9062Z" 
        fill="black" 
        fillOpacity="0.01" 
        stroke="url(#paint0_linear_63_1947)" 
        strokeWidth="0.5"
      />
      <Path 
        opacity="0.4" 
        d="M106.6 31.5518C111.667 27.2184 119.932 27.1491 125.174 31.3496L125.421 31.5537L137.422 41.8848C138.59 42.8975 140.252 43.8033 141.999 44.4561C143.746 45.1088 145.6 45.5166 147.158 45.5166H160.073C167.988 45.5168 174.485 52.015 174.485 59.9307V72.8477C174.485 74.3681 174.894 76.2227 175.546 77.9785C176.198 79.7337 177.103 81.4148 178.116 82.584V82.585L188.448 94.5879V94.5889C192.849 99.7366 192.852 108.184 188.449 113.41L178.117 125.415C177.104 126.584 176.199 128.246 175.546 129.993C174.893 131.74 174.485 133.594 174.485 135.152V148.069C174.485 155.985 167.988 162.483 160.073 162.483H147.158C145.638 162.483 143.784 162.892 142.028 163.544C140.382 164.156 138.801 164.99 137.646 165.927L137.422 166.115L125.419 176.448C120.352 180.781 112.087 180.851 106.846 176.65L106.599 176.446L94.5967 166.115H94.5977C93.4291 165.102 91.7664 164.197 90.0195 163.544C88.2727 162.891 86.4192 162.483 84.8613 162.483H71.7178C63.8032 162.483 57.3059 155.985 57.3057 148.069V135.076C57.3057 133.556 56.8975 131.721 56.2549 129.984C55.6121 128.248 54.726 126.587 53.7529 125.419L53.752 125.417L43.4951 113.336C39.1678 108.186 39.1682 99.8125 43.4961 94.6631L43.4951 94.6621L53.752 82.583L53.7529 82.5811C54.726 81.4132 55.6121 79.7523 56.2549 78.0156C56.8975 76.2793 57.3057 74.4444 57.3057 72.9238V59.8555C57.3057 51.9396 63.803 45.4406 71.7178 45.4404H84.8613C86.3816 45.4404 88.2356 45.0323 89.9912 44.3799C91.7467 43.7274 93.4276 42.821 94.5967 41.8076L106.6 31.5518Z" 
        fill="black" 
        fillOpacity="0.01" 
        stroke="url(#paint1_linear_63_1947)" 
        strokeWidth="0.5"
      />
      <Path 
        opacity="0.6" 
        d="M107.606 39.1982C112.202 35.268 119.746 35.2663 124.412 39.1992L135.15 48.4434C136.199 49.352 137.688 50.1644 139.253 50.749C140.818 51.3338 142.48 51.6992 143.878 51.6992H155.434C162.501 51.6992 168.303 57.5022 168.303 64.5703V76.127C168.303 77.4915 168.669 79.1537 169.253 80.7266C169.837 82.2994 170.649 83.8071 171.559 84.8564V84.8555L180.802 95.5957V95.5967C184.731 100.193 184.733 107.736 180.803 112.402L171.559 123.144C170.65 124.192 169.838 125.683 169.253 127.248C168.668 128.813 168.303 130.475 168.303 131.873V143.43C168.303 150.498 162.501 156.301 155.434 156.301H143.878C142.514 156.301 140.852 156.667 139.279 157.251C137.707 157.835 136.2 158.647 135.15 159.557L124.411 168.802C119.959 172.609 112.74 172.73 108.051 169.158L107.604 168.801L96.8672 159.557H96.8662C95.8177 158.648 94.3282 157.836 92.7637 157.251C91.1988 156.666 89.5366 156.301 88.1387 156.301H76.3789C69.3119 156.301 63.5107 150.498 63.5107 143.43V131.805C63.5107 130.44 63.144 128.795 62.5684 127.24C61.9925 125.684 61.1983 124.195 60.3252 123.147L60.3242 123.146L51.1475 112.336C47.284 107.738 47.2834 100.26 51.1475 95.6621L60.3242 84.8545L60.3252 84.8525C61.1983 83.8047 61.9925 82.3155 62.5684 80.7598C63.144 79.2045 63.5107 77.5599 63.5107 76.1953V64.502C63.5107 57.4339 69.3119 51.6311 76.3789 51.6309H88.1387C89.503 51.6309 91.1656 51.2651 92.7383 50.6807C94.3102 50.0964 95.8171 49.2849 96.8662 48.376L107.606 39.1982Z" 
        fill="black" 
        fillOpacity="0.01" 
        stroke="url(#paint2_linear_63_1947)" 
        strokeWidth="0.5"
      />
      <Path 
        opacity="0.8" 
        d="M108.487 45.8887C112.6 42.3713 119.353 42.3697 123.529 45.8896L133.161 54.1807V54.1816C134.105 54.9996 135.445 55.7296 136.851 56.2549C138.256 56.7801 139.75 57.1083 141.008 57.1084H151.374C157.7 57.1084 162.893 62.3026 162.893 68.6289V78.9961C162.893 80.2241 163.222 81.7181 163.747 83.1309C164.272 84.5432 165.001 85.8984 165.819 86.8428V86.8438L174.111 96.4775V96.4785C177.628 100.592 177.631 107.345 174.112 111.521L165.819 121.156C165.002 122.1 164.272 123.44 163.747 124.846C163.222 126.252 162.893 127.746 162.893 129.004V139.371C162.893 145.697 157.7 150.892 151.374 150.892H141.008C139.78 150.892 138.286 151.22 136.874 151.745C135.461 152.27 134.105 153 133.161 153.818L123.528 162.111C119.544 165.519 113.081 165.627 108.885 162.43L108.485 162.11L98.8535 153.818C97.9099 153.001 96.5706 152.27 95.165 151.745C93.7592 151.22 92.2649 150.892 91.0068 150.892H80.458C74.1325 150.892 68.9395 145.697 68.9395 139.371V128.942C68.9394 127.714 68.6098 126.236 68.0928 124.839C67.5755 123.441 66.8618 122.102 66.0762 121.159L66.0752 121.158L57.8428 111.461C54.3854 107.346 54.3858 100.653 57.8438 96.5381L57.8428 96.5371L66.0752 86.8418L66.0762 86.8408C66.8618 85.8979 67.5755 84.5586 68.0928 83.1611C68.6098 81.7642 68.9394 80.2857 68.9395 79.0576V68.5674C68.9397 62.2413 74.1327 57.0479 80.458 57.0479H91.0068C92.2347 57.0479 93.729 56.7183 95.1416 56.1934C96.5537 55.6686 97.9084 54.9391 98.8525 54.1211L108.487 45.8887Z" 
        fill="black" 
        fillOpacity="0.01" 
        stroke="url(#paint3_linear_63_1947)" 
        strokeWidth="0.5"
      />
      <Path 
        d="M109.125 51.4748C112.92 48.2298 119.135 48.2298 122.985 51.4748L131.675 58.9548C133.325 60.3848 136.405 61.5398 138.605 61.5398H147.955C153.785 61.5398 158.57 66.3248 158.57 72.1548V81.5048C158.57 83.6498 159.725 86.7848 161.155 88.4348L168.635 97.1248C171.88 100.92 171.88 107.135 168.635 110.985L161.155 119.675C159.725 121.325 158.57 124.405 158.57 126.605V135.955C158.57 141.785 153.785 146.57 147.955 146.57H138.605C136.46 146.57 133.325 147.725 131.675 149.155L122.985 156.635C119.19 159.88 112.975 159.88 109.125 156.635L100.435 149.155C98.7848 147.725 95.7048 146.57 93.5048 146.57H83.9898C78.1598 146.57 73.3748 141.785 73.3748 135.955V126.55C73.3748 124.405 72.2198 121.325 70.8448 119.675L63.4198 110.93C60.2298 107.135 60.2298 100.975 63.4198 97.1798L70.8448 88.4348C72.2198 86.7848 73.3748 83.7048 73.3748 81.5598V72.0998C73.3748 66.2698 78.1598 61.4848 83.9898 61.4848H93.5048C95.6498 61.4848 98.7848 60.3298 100.435 58.8998L109.125 51.4748Z" 
        fill="url(#paint4_linear_63_1947)"
      />
      <Path 
        d="M109.345 121.435C108.245 121.435 107.2 120.995 106.43 120.225L93.1201 106.915C91.5251 105.32 91.5251 102.68 93.1201 101.085C94.7151 99.4903 97.3551 99.4903 98.9501 101.085L109.345 111.48L132.995 87.8303C134.59 86.2353 137.23 86.2353 138.825 87.8303C140.42 89.4253 140.42 92.0653 138.825 93.6603L112.26 120.225C111.49 120.995 110.445 121.435 109.345 121.435Z" 
        fill="#0D0D0D"
      />
    </G>
    <Defs>
      <Filter id="filter0_d_63_1947" x="0" y="0" width="232" height="232" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dy="12"/>
        <FeGaussianBlur stdDeviation="16"/>
        <FeComposite in2="hardAlpha" operator="out"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0.251908 0 0 0 0 0.0276215 0 0 0 0 0.330712 0 0 0 0.15 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_63_1947"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_63_1947" result="shape"/>
      </Filter>
      <SvgLinearGradient id="paint0_linear_63_1947" x1="-5.15381" y1="20" x2="73.557" y2="262.673" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint1_linear_63_1947" x1="6.38465" y1="28" x2="77.5992" y2="247.562" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint2_linear_63_1947" x1="17.9231" y1="36" x2="81.6414" y2="232.45" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint3_linear_63_1947" x1="28.0193" y1="43" x2="85.1783" y2="219.227" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint4_linear_63_1947" x1="36.6913" y1="49.041" x2="88.2358" y2="207.978" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DD3562"/>
        <Stop offset="1" stopColor="#8354FF"/>
      </SvgLinearGradient>
    </Defs>
  </Svg>
);

function VerifySuccessScreen({ navigation }) {
  const authState = useSelector((state) => state.auth);
  
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Check if user has tokens (should have after OTP verification)
      if (!authState.accessToken) {
        console.log('❌ VerifySuccessScreen: No access token, redirecting to Auth');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
        return;
      }

      // Check profile completion status via API
      try {
        console.log('📊 VerifySuccessScreen: Checking profile completion status...');
        const profileStepResult = await authAPI.getProfileStep(authState.accessToken);
        
        if (profileStepResult.success) {
          const profileData = profileStepResult.data?.data || {};
          const currentStep = profileData.currentStep || profileData.profileCompletionStep;
          const isCompleted = profileData.isCurrentStepCompleted || profileData.isProfileCompleted || currentStep === 'completed';
          
          console.log('📊 VerifySuccessScreen: Profile Status:', { currentStep, isCompleted });
          
          // Navigate based on profile completion status
          if (isCompleted || currentStep === 'completed') {
            console.log('✅ VerifySuccessScreen: Profile completed, navigating to Main');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          } else {
            console.log('📝 VerifySuccessScreen: Profile not completed, navigating to ProfileSetup');
            navigation.reset({
              index: 0,
              routes: [{ name: 'ProfileSetup' }],
            });
          }
        } else {
          // If API fails, default to ProfileSetup (user likely needs to complete profile)
          console.log('⚠️ VerifySuccessScreen: Failed to check profile status, defaulting to ProfileSetup');
          navigation.reset({
            index: 0,
            routes: [{ name: 'ProfileSetup' }],
          });
        }
      } catch (error) {
        console.error('💥 VerifySuccessScreen: Error checking profile status:', error);
        // On error, default to ProfileSetup
        navigation.reset({
          index: 0,
          routes: [{ name: 'ProfileSetup' }],
        });
      }
    }, 2000);
  
    return () => clearTimeout(timer);
  }, [navigation, authState.accessToken]);

  return (
    <CommonBackground style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <SuccessIcon width={180} height={180} />
        </View>
        <Text style={styles.title}>Verification Successful</Text>
      </View>
    </CommonBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'System',
    opacity: 0.7,
    marginTop: -20,
  }, 
});

export default VerifySuccessScreen;
