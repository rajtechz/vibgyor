// src/screens/Profile/StartVerificationScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, requestCameraPermission } from 'react-native-image-picker';
import CommonBackground from '../../../components/common/CommonBackground';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

// Back Arrow Icon
const BackArrowIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Video Camera Icon - Dark Purple Style (matching the design)
const VideoCameraIcon = ({ width = 120, height = 120 }) => (
  <Svg width={width} height={height} viewBox="0 0 120 120" fill="none">
    {/* Main rectangular camera body */}
    <Rect
      x="15"
      y="30"
      width="70"
      height="55"
      rx="6"
      stroke="#8A52F3"
      strokeWidth="3.5"
      fill="none"
    />
    {/* Large circular lens in center */}
    <Circle
      cx="50"
      cy="57.5"
      r="20"
      stroke="#8A52F3"
      strokeWidth="3.5"
      fill="none"
    />
    {/* Inner lens circle */}
    <Circle
      cx="50"
      cy="57.5"
      r="12"
      stroke="#8A52F3"
      strokeWidth="2.5"
      fill="none"
      opacity="0.6"
    />
    {/* Viewfinder/top accessory */}
    <Rect
      x="32"
      y="20"
      width="36"
      height="12"
      rx="3"
      stroke="#8A52F3"
      strokeWidth="3"
      fill="none"
    />
    {/* Flash/Light indicator */}
    <Circle
      cx="68"
      cy="42"
      r="4"
      fill="#8A52F3"
      opacity="0.8"
    />
    {/* Side grip/handle detail */}
    <Rect
      x="88"
      y="38"
      width="10"
      height="39"
      rx="5"
      fill="#8A52F3"
      opacity="0.5"
    />
  </Svg>
);

function StartVerificationScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isRecording, setIsRecording] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const requestVideoPermissions = async () => {
    try {
      if (Platform.OS !== 'android') {
        // iOS permissions are handled automatically by react-native-image-picker
        return true;
      }

      console.log('📹 Checking current permission status...');
      
      // First, check current permission status
      const cameraCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      const micCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      
      console.log('🔍 Current status - Camera:', cameraCheck, 'Microphone:', micCheck);

      // If both are already granted, return true
      if (cameraCheck && micCheck) {
        console.log('✅ All permissions already granted');
        return true;
      }

      // Check camera permission first
      let cameraGranted = cameraCheck;
      if (!cameraCheck) {
        console.log('📹 Requesting camera permission...');
        cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to record verification videos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        console.log('📹 Camera permission result:', cameraGranted);
        
        if (cameraGranted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Camera Permission Required',
            'Camera permission was previously denied. Please enable it in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: async () => {
                  try {
                    await Linking.openSettings();
                  } catch (error) {
                    console.error('Error opening settings:', error);
                  }
                }
              }
            ]
          );
          return false;
        }
      }

      if (cameraGranted !== PermissionsAndroid.RESULTS.GRANTED && !cameraCheck) {
        console.log('❌ Camera permission not granted');
        return false;
      }

      // Check microphone permission
      let micGranted = micCheck;
      if (!micCheck) {
        console.log('🎤 Requesting microphone permission...');
        micGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to record audio with videos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        console.log('🎤 Microphone permission result:', micGranted);
        
        if (micGranted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Microphone Permission Required',
            'Microphone permission was previously denied.\n\nIMPORTANT: If you don\'t see "Microphone" permission in your app settings, you need to:\n\n1. Uninstall the app completely\n2. Rebuild and reinstall the app\n\nThis is required because the microphone permission was recently added to the app.\n\nWould you like to open settings to check?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: async () => {
                  try {
                    await Linking.openSettings();
                  } catch (error) {
                    console.error('Error opening settings:', error);
                  }
                }
              }
            ]
          );
          return false;
        }
      }

      if (micGranted !== PermissionsAndroid.RESULTS.GRANTED && !micCheck) {
        console.log('❌ Microphone permission not granted');
        return false;
      }

      // Final verification
      const finalCameraCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      const finalMicCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      
      console.log('🔍 Final verification - Camera:', finalCameraCheck, 'Microphone:', finalMicCheck);
      
      if (!finalCameraCheck || !finalMicCheck) {
        console.log('⚠️ Final permission check failed');
        return false;
      }

      return true;
    } catch (err) {
      console.error('❌ Permission request error:', err);
      return false;
    }
  };

  const handleCameraPress = async () => {
    console.log('📹 Camera icon pressed - Starting video recording');
    
    setIsRecording(true);
    
    try {
      // Request permissions
      const hasPermission = await requestVideoPermissions();
      
      if (!hasPermission) {
        setIsRecording(false);
        Alert.alert(
          'Permission Denied',
          'Camera and microphone permissions are required to record verification videos. Please enable them in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Settings', 
              onPress: async () => {
                try {
                  console.log('📱 Opening device settings...');
                  await Linking.openSettings();
                  console.log('✅ Settings opened successfully');
                } catch (error) {
                  console.error('❌ Error opening settings:', error);
                  Alert.alert('Error', 'Unable to open settings. Please manually enable camera and microphone permissions in your device settings.');
                }
              }
            },
          ]
        );
        return;
      }

      console.log('✅ Permissions granted, launching camera for video...');

      // Configure camera for video recording
      const options = {
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 60, // Maximum 60 seconds
        quality: 1,
        saveToPhotos: false, // Don't save to gallery automatically
        includeBase64: false,
      };

      launchCamera(options, (response) => {
        setIsRecording(false);
        
        console.log('📹 Camera response:', {
          didCancel: response.didCancel,
          errorMessage: response.errorMessage,
          hasAssets: !!response.assets,
          assetCount: response.assets?.length || 0,
        });
        
        if (response.didCancel) {
          console.log('📹 User cancelled video recording');
        } else if (response.errorMessage) {
          console.error('❌ Video recording error:', response.errorMessage);
          console.error('❌ Full error response:', JSON.stringify(response, null, 2));
          
          // Check if it's a permission error
          if (response.errorMessage.toLowerCase().includes('permission') || 
              response.errorMessage.toLowerCase().includes('denied')) {
            Alert.alert(
              'Permission Error',
              'Camera or microphone permission is required. Please enable them in your device settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Settings', 
                  onPress: async () => {
                    try {
                      await Linking.openSettings();
                    } catch (error) {
                      console.error('Error opening settings:', error);
                    }
                  }
                },
              ]
            );
          } else {
            Alert.alert('Error', `Failed to record video: ${response.errorMessage}`);
          }
        } else if (response.assets && response.assets[0]) {
          const video = response.assets[0];
          console.log('✅ Video recorded successfully:', video.uri);
          console.log('📹 Video details:', {
            uri: video.uri,
            duration: video.duration,
            fileSize: video.fileSize,
            type: video.type,
            width: video.width,
            height: video.height,
          });
          
          // Handle the recorded video here
          // You can upload it to server, save it, etc.
          Alert.alert(
            'Video Recorded',
            `Video recorded successfully!\nDuration: ${Math.round(video.duration || 0)}s`,
            [
              { text: 'OK', onPress: () => {
                // Navigate to next step or upload video
                console.log('📹 Video ready for upload:', video);
              }}
            ]
          );
        } else {
          console.log('⚠️ No video assets in response');
          Alert.alert('Error', 'No video was recorded. Please try again.');
        }
      });
    } catch (error) {
      setIsRecording(false);
      console.error('💥 Exception in handleCameraPress:', error);
      Alert.alert('Error', `Failed to start video recording: ${error.message || 'Unknown error'}`);
    }
  };

  const handleStartVerification = () => {
    console.log('Start Verification button pressed');
    // Handle verification start action here
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackArrowIcon width={24} height={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Instruction Text */}
        <Text style={styles.instructionText}>
          We strongly give full freedom to our users, but to avoid any kind of mishap & nuisance we recommend you to provide a ID proof for safety & security
        </Text>

        {/* Camera Upload Area with Dotted Border */}
        <TouchableOpacity 
          style={styles.uploadArea} 
          onPress={handleCameraPress}
          activeOpacity={0.8}
        >
          <VideoCameraIcon width={120} height={120} />
          <Text style={styles.tapToRecordText}>Tap to Record Video</Text>
        </TouchableOpacity>

        {/* Start Verification Button */}
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={handleStartVerification}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#DD3562', '#8354FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Start Verification</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingBottom: 16,
    backgroundColor: '#140034',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    flexGrow: 1,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 80,
    paddingHorizontal: 40,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#8A52F3',
    borderStyle: 'dashed',
    minHeight: 300,
  },
  tapToRecordText: {
    fontSize: 14,
    color: '#8A52F3',
    marginTop: 16,
    fontWeight: '500',
  },
  startButton: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  startButtonGradient: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.5,
  },
});

export default StartVerificationScreen;
