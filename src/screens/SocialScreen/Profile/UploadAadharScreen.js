// src/screens/Profile/UploadAadharScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Image, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import CommonBackground from '../../../components/common/CommonBackground';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

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

// Upload Icon
const UploadIcon = ({ width = 60, height = 60 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    {/* Document Icon */}
    <Path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke="#8A52F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 2V8H20"
      stroke="#8A52F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 13H8"
      stroke="#8A52F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 17H8"
      stroke="#8A52F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 9H8"
      stroke="#8A52F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Upload Arrow */}
    <Path
      d="M12 6L12 2"
      stroke="#8A52F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 5L12 2L15 5"
      stroke="#8A52F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function UploadAadharScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageData, setImageData] = useState(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUpload = () => {
    console.log('Upload Aadhar pressed - Opening gallery');
    
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 2048,
      maxHeight: 2048,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to open gallery. Please try again.');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        console.log('✅ Aadhar image selected:', asset.uri);
        
        // Store image URI for preview
        setSelectedImage(asset.uri);
        
        // Store image data for upload
        setImageData({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || `aadhar_${Date.now()}.jpg`,
          fileSize: asset.fileSize,
        });
        
        console.log('📸 Image data stored:', {
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
        });
      }
    });
  };

  const handleContinue = () => {
    if (!selectedImage || !imageData) {
      Alert.alert('Upload Required', 'Please upload your Aadhar card before contin`uing.');
      return;
    }
    
    console.log('Continue pressed with image:', imageData);
    // TODO: Upload image to server here if needed
    // For now, just navigate to next screen
    navigation.navigate('StartVerification');
  };

  return (
    <CommonBackground>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackArrowIcon width={24} height={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Aadhar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Title */}
        <Text style={styles.mainTitle}>Upload Aadhar </Text>
        
        {/* Description Text */}
        <Text style={styles.descriptionText}>
          We strongly give full freedom to our users, but to avoid any kind of mishap & nuisance we recommend you to provide a ID proof for safety & security
        </Text>

        {/* Upload Area */}
        <TouchableOpacity style={styles.uploadArea} onPress={handleUpload} activeOpacity={0.8}>
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.previewImage}
                resizeMode="contain"
              />
              <TouchableOpacity 
                style={styles.changeImageButton}
                onPress={handleUpload}
                activeOpacity={0.8}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <UploadIcon width={60} height={60} />
              <Text style={styles.uploadText}>Upload Aadhar</Text>
              <Text style={styles.uploadHint}>Tap to select from gallery</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
          <LinearGradient
            colors={['#DD3562', '#8A52F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Continue</Text>
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
    color: 'white',
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
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 60,
    paddingHorizontal: 40,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#8A52F3',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8A52F3',
    marginTop: 16,
  },
  uploadHint: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 8,
  },
  imagePreviewContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  changeImageButton: {
    backgroundColor: 'rgba(138, 82, 243, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8A52F3',
  },
  changeImageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A52F3',
  },
  continueButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  continueGradient: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default UploadAadharScreen;
