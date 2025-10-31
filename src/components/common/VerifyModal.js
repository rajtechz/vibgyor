import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Rect, Path, G, Defs, LinearGradient as SvgLinearGradient, Stop, ClipPath, Circle } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VerifyModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in from top
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out to top
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleGetVerified = () => {
    // Handle verification action
    console.log('Get Verified button pressed');
    onClose(); // Close modal first
    
    // Navigate to VerificationScreen
    // VerificationScreen is in ProfileStackNavigator, so navigate via Profile tab
    // Using nested navigation to ensure cross-stack navigation works
    navigation.navigate('Profile', { 
      screen: 'Verification' 
    });
    console.log('✅ Navigated to Verification screen');
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          {/* Background SVG */}
          <Svg width={327} height={308} viewBox="0 0 328 308" style={styles.backgroundImage}>
            <Rect x="1" width="327" height="308" rx="35" fill="url(#paint0_linear_1229_1358)"/>
            <G opacity="0.1" clipPath="url(#clip0_1229_1358)">
              <G clipPath="url(#clip1_1229_1358)">
                <Path d="M195.962 53.1505C187.821 62.2294 190.192 77.3602 194.656 93.3642L218.989 67.8873C223.799 53.0392 205.51 42.4629 195.962 53.1505Z" fill="white"/>
                <Path d="M218.99 67.8872L194.656 93.3642C210.848 97.0899 226.071 98.7674 234.766 90.2157C245.006 80.1863 233.603 62.4046 218.99 67.8872Z" fill="#FF7678"/>
              </G>
              <G clipPath="url(#clip2_1229_1358)">
                <Path d="M239.981 18.0992C238.432 19.8263 238.884 22.7047 239.733 25.7492L244.362 20.9026C245.277 18.078 241.798 16.0661 239.981 18.0992Z" fill="white"/>
                <Path d="M244.362 20.9029L239.733 25.7495C242.813 26.4582 245.709 26.7773 247.363 25.1505C249.311 23.2426 247.142 19.8599 244.362 20.9029Z" fill="#FF7678"/>
              </G>
              <G clipPath="url(#clip3_1229_1358)">
                <Path d="M-35.6522 86.4329C-40.385 107.73 -23.4182 129.243 -2.42183 150.282L13.177 89.2165C7.65392 61.8471 -30.1378 61.3948 -35.6522 86.4329Z" fill="white"/>
                <Path d="M13.1764 89.2161L-2.42249 150.282C26.0921 141.891 51.3003 131.156 57.3585 110.196C64.5295 85.5768 31.1546 67.851 13.1764 89.2161Z" fill="#FF7678"/>
              </G>
              <G clipPath="url(#clip4_1229_1358)">
                <Path d="M45.0807 49.304C46.3972 50.6613 48.7631 50.4577 51.2867 49.9398L47.6085 45.9012C45.3637 44.9973 43.5306 47.712 45.0807 49.304Z" fill="white"/>
                <Path d="M47.6088 45.9019L51.287 49.9404C52.0379 47.4762 52.4616 45.1396 51.2326 43.7024C49.7917 42.0104 46.9184 43.5824 47.6088 45.9019Z" fill="#FF7678"/>
              </G>
              <G clipPath="url(#clip5_1229_1358)">
                <Path d="M289.935 134.972C291.803 147.022 305.014 154.772 320.225 161.455L315.924 126.488C307.481 113.361 287.713 120.814 289.935 134.972Z" fill="white"/>
                <Path d="M315.925 126.487L320.226 161.454C333.365 151.285 344.306 140.567 343.196 128.422C341.921 114.145 320.939 111.706 315.925 126.487Z" fill="#FF7678"/>
              </G>
            </G>
            <Path opacity="0.4" d="M173.217 26.8628C174.144 26.6494 175.115 26.7301 175.994 27.0942C176.873 27.4584 177.616 28.0876 178.121 28.894H178.122L182.133 35.2886C182.529 35.9201 183.045 36.4662 183.651 36.896L183.917 37.0728L190.315 41.0796C191.121 41.5847 191.749 42.3283 192.112 43.2065C192.476 44.0848 192.556 45.0547 192.343 45.981L190.654 53.3364C190.487 54.0646 190.466 54.8178 190.592 55.5522L190.654 55.8657L192.339 63.2163V63.2173C192.553 64.1441 192.473 65.1146 192.109 65.9937C191.746 66.8726 191.117 67.6163 190.312 68.1216L183.913 72.1284C183.19 72.5803 182.58 73.1905 182.128 73.9136L178.122 80.3081H178.121C177.617 81.1138 176.873 81.7429 175.995 82.1069C175.117 82.4708 174.147 82.5518 173.221 82.3394L165.865 80.6509C165.033 80.4596 164.168 80.4596 163.336 80.6509L155.984 82.3394C154.085 82.7747 152.116 81.9581 151.084 80.3081H151.083L147.077 73.9136L147.076 73.9116L146.897 73.646C146.528 73.1266 146.074 72.6731 145.554 72.3052L145.288 72.1284L138.894 68.1216C138.088 67.617 137.459 66.8739 137.095 65.9956C136.731 65.1174 136.65 64.1477 136.862 63.2212L138.551 55.8657C138.741 55.0349 138.741 54.1712 138.551 53.3403L136.862 45.981C136.651 45.0549 136.733 44.086 137.097 43.2085C137.461 42.3309 138.088 41.5878 138.894 41.0835L145.288 37.0767L145.29 37.0757C146.011 36.6203 146.621 36.0107 147.073 35.2876L147.072 35.2866L151.079 28.894C151.584 28.0875 152.328 27.4584 153.207 27.0942C154.086 26.7301 155.057 26.6493 155.984 26.8628L163.336 28.5513C164.168 28.7425 165.033 28.7425 165.865 28.5513L173.217 26.8628ZM176.037 42.2866C175.462 41.9465 174.778 41.8426 174.128 41.9966C173.478 42.1507 172.913 42.5508 172.552 43.1128L172.542 43.1304L162.192 60.644L156.226 54.9302H156.225C155.986 54.6884 155.702 54.4953 155.389 54.3638C155.069 54.2298 154.725 54.1621 154.379 54.1636C154.033 54.1651 153.69 54.2359 153.372 54.3726C153.054 54.5093 152.767 54.7092 152.527 54.9595C152.288 55.2097 152.101 55.5057 151.979 55.8296C151.856 56.1534 151.8 56.4983 151.813 56.8442C151.827 57.1902 151.91 57.5301 152.058 57.8433C152.203 58.1505 152.408 58.4258 152.659 58.6538V58.6548L160.976 66.6235H160.977C161.257 66.892 161.595 67.0937 161.965 67.2134C162.334 67.333 162.726 67.368 163.111 67.3149C163.496 67.2618 163.864 67.1219 164.188 66.9067C164.511 66.6915 164.782 66.4063 164.979 66.0718L176.979 45.7554L176.984 45.7476L176.989 45.7388C177.308 45.1521 177.387 44.4645 177.21 43.8208C177.032 43.177 176.612 42.6268 176.037 42.2866Z" stroke="white" strokeWidth="1.07057"/>
            <Path opacity="0.8" d="M172.513 29.125C173.364 28.929 174.256 29.0035 175.063 29.3379C175.77 29.6305 176.381 30.1095 176.833 30.7207L177.018 30.9912L180.701 36.8643C181.065 37.444 181.539 37.9452 182.096 38.3398L182.34 38.5029L188.217 42.1826C188.956 42.6465 189.532 43.3293 189.866 44.1357C190.2 44.9423 190.275 45.8329 190.079 46.6836V46.6846L188.528 53.4395C188.375 54.1083 188.355 54.8 188.471 55.4746L188.528 55.7627L190.075 62.5137V62.5146C190.271 63.3658 190.198 64.2572 189.864 65.0645C189.572 65.7709 189.093 66.3822 188.482 66.835L188.213 67.0195L182.336 70.6992C181.755 71.0624 181.254 71.537 180.859 72.0947L180.697 72.3379L177.018 78.2109C176.554 78.9511 175.871 79.5289 175.064 79.8633C174.258 80.1975 173.367 80.2724 172.516 80.0771L165.761 78.5264C164.996 78.3507 164.202 78.3507 163.438 78.5264L156.687 80.0771C155.051 80.4522 153.359 79.816 152.373 78.4863L152.185 78.2109L148.505 72.3379L148.504 72.3369L148.341 72.0928C147.945 71.5362 147.443 71.0624 146.862 70.6992L140.989 67.0195L140.72 66.835C140.109 66.3828 139.63 65.7723 139.337 65.0664C139.003 64.2597 138.928 63.3687 139.123 62.5176L140.674 55.7627C140.849 54.9996 140.849 54.2064 140.674 53.4434L139.123 46.6846C138.929 45.8339 139.005 44.9437 139.339 44.1377C139.631 43.4325 140.109 42.822 140.72 42.3701L140.989 42.1865L146.862 38.5068L146.863 38.5059C147.526 38.0877 148.085 37.5273 148.5 36.8633L148.501 36.8643L152.181 30.9912H152.182C152.645 30.2504 153.328 29.6723 154.136 29.3379C154.943 29.0037 155.834 28.9291 156.686 29.125H156.687L163.438 30.6758C164.106 30.8295 164.798 30.8487 165.473 30.7334L165.761 30.6758L172.513 29.125ZM175.103 43.291C174.575 42.9787 173.946 42.884 173.35 43.0254C172.753 43.1669 172.234 43.5338 171.902 44.0498L171.893 44.0654L162.388 60.1514L156.907 54.9033H156.906C156.687 54.6813 156.427 54.5036 156.139 54.3828C155.845 54.2598 155.53 54.1979 155.212 54.1992C154.894 54.2006 154.579 54.2661 154.287 54.3916C153.995 54.5172 153.731 54.7 153.511 54.9297C153.291 55.1595 153.119 55.432 153.007 55.7295C152.894 56.0268 152.842 56.3435 152.854 56.6611C152.867 56.979 152.944 57.2914 153.08 57.5791C153.213 57.8612 153.401 58.1139 153.632 58.3232V58.3242L161.271 65.6426V65.6436C161.528 65.8901 161.839 66.0747 162.179 66.1846C162.518 66.2944 162.878 66.3261 163.231 66.2773C163.585 66.2286 163.923 66.1009 164.22 65.9033C164.517 65.7056 164.766 65.443 164.947 65.1357L175.969 46.4775L175.973 46.4697L175.978 46.4619C176.27 45.9231 176.343 45.2914 176.18 44.7002C176.017 44.1088 175.63 43.6035 175.103 43.291Z" stroke="white" strokeWidth="0.983241"/>
            <Path fillRule="evenodd" clipRule="evenodd" d="M176.295 32.85C175.823 32.096 175.128 31.5079 174.306 31.1676C173.484 30.8272 172.577 30.7515 171.71 30.951L165.558 32.3641C164.927 32.5091 164.272 32.5091 163.642 32.3641L157.49 30.951C156.623 30.7515 155.716 30.8272 154.894 31.1676C154.072 31.5079 153.377 32.096 152.905 32.85L149.552 38.2013C149.21 38.7488 148.748 39.2107 148.2 39.5562L142.849 42.9094C142.096 43.3808 141.509 44.0749 141.169 44.8953C140.829 45.7156 140.752 46.6216 140.95 47.4874L142.363 53.6462C142.508 54.2756 142.508 54.9295 142.363 55.5588L140.95 61.7142C140.751 62.5805 140.827 63.4872 141.168 64.3083C141.508 65.1293 142.096 65.824 142.849 66.2957L148.2 69.6488C148.748 69.9909 149.21 70.4528 149.555 71.0003L152.908 76.3516C153.873 77.8947 155.714 78.6577 157.49 78.2506L163.642 76.8375C164.272 76.6926 164.927 76.6926 165.558 76.8375L171.713 78.2506C172.58 78.4493 173.486 78.3732 174.307 78.0329C175.128 77.6926 175.823 77.1049 176.295 76.3516L179.648 71.0003C179.99 70.4528 180.452 69.9909 180.999 69.6488L186.354 66.2957C187.107 65.8233 187.695 65.1279 188.035 64.3062C188.374 63.4844 188.449 62.5772 188.25 61.7108L186.84 55.5588C186.695 54.9284 186.695 54.2732 186.84 53.6428L188.253 47.4874C188.452 46.6215 188.377 45.715 188.037 44.894C187.697 44.0729 187.11 43.3781 186.358 42.9059L181.003 39.5528C180.456 39.21 179.994 38.748 179.651 38.2013L176.295 32.85ZM174.574 46.9707C174.785 46.5816 174.838 46.1255 174.72 45.6985C174.602 45.2715 174.323 44.9068 173.942 44.6812C173.561 44.4556 173.107 44.3866 172.676 44.4888C172.245 44.591 171.87 44.8564 171.631 45.2292L162.684 60.373L157.281 55.1996C157.121 55.035 156.929 54.9044 156.717 54.8155C156.505 54.7267 156.278 54.6814 156.048 54.6824C155.818 54.6834 155.591 54.7307 155.38 54.8214C155.169 54.9121 154.978 55.0443 154.82 55.2103C154.661 55.3763 154.537 55.5725 154.456 55.7874C154.374 56.0022 154.337 56.2312 154.346 56.4608C154.355 56.6903 154.41 56.9157 154.508 57.1234C154.607 57.3312 154.745 57.517 154.917 57.6699L161.876 64.3385C162.063 64.5166 162.287 64.6504 162.532 64.7297C162.777 64.8091 163.037 64.832 163.292 64.7968C163.548 64.7616 163.792 64.6692 164.006 64.5264C164.221 64.3837 164.4 64.1943 164.531 63.9724L174.574 46.9707Z" fill="white"/>
            <Defs>
              <SvgLinearGradient id="paint0_linear_1229_1358" x1="-71.3172" y1="-2.315e-05" x2="66.0769" y2="449.732" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#DD3562"/>
                <Stop offset="1" stopColor="#8354FF"/>
              </SvgLinearGradient>
              <ClipPath id="clip0_1229_1358">
                <Rect width="327.257" height="166" fill="white" transform="translate(0.371094)"/>
              </ClipPath>
              <ClipPath id="clip1_1229_1358">
                <Rect width="51.2639" height="46.3475" fill="white" transform="translate(225.691 41.114) rotate(71.0115)"/>
              </ClipPath>
              <ClipPath id="clip2_1229_1358">
                <Rect width="9.75216" height="8.81688" fill="white" transform="translate(245.637 15.8096) rotate(71.0115)"/>
              </ClipPath>
              <ClipPath id="clip3_1229_1358">
                <Rect width="91.7095" height="82.9142" fill="white" transform="translate(0.146484 41.5925) rotate(41.656)"/>
              </ClipPath>
              <ClipPath id="clip4_1229_1358">
                <Rect width="7.94851" height="7.18621" fill="white" transform="translate(43.5391 44.5762) rotate(-15)"/>
              </ClipPath>
              <ClipPath id="clip5_1229_1358">
                <Rect width="51.2639" height="46.3475" fill="white" transform="translate(299.451 104.343) rotate(20.3143)"/>
              </ClipPath>
            </Defs>
          </Svg>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Svg width={36} height={36} viewBox="0 0 36 36">
              <Circle cx="18" cy="18" r="18" fill="white"/>
              <Path d="M23.9992 12L11.1992 24.8" stroke="url(#paint0_linear_close)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M11.1992 12L23.9992 24.8" stroke="url(#paint1_linear_close)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <Defs>
                <SvgLinearGradient id="paint0_linear_close" x1="12.007" y1="22.7055" x2="24.7897" y2="22.0538" gradientUnits="userSpaceOnUse">
                  <Stop stopColor="#DD3562"/>
                  <Stop offset="1" stopColor="#8354FF"/>
                </SvgLinearGradient>
                <SvgLinearGradient id="paint1_linear_close" x1="12.007" y1="22.7055" x2="24.7897" y2="22.0538" gradientUnits="userSpaceOnUse">
                  <Stop stopColor="#DD3562"/>
                  <Stop offset="1" stopColor="#8354FF"/>
                </SvgLinearGradient>
              </Defs>
            </Svg>
          </TouchableOpacity>

          {/* Modal Content */}
          <View style={styles.modalContent}>
            {/* Title */}
            <Text style={styles.title}>Verify Now</Text>

            {/* Description */}
            <Text style={styles.description}>
              For More And Real Connections{'\n'}
              Get Verification Badge now
            </Text>


            <TouchableOpacity style={styles.verifyButton} onPress={handleGetVerified}>
              <Text style={styles.verifyButtonText}>GET VERIFIED NOW </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 327,
    height: 308,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 327,
    height: 308,
    borderRadius: 35,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 36,
    height: 36,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DD3562',
    lineHeight: 20,
  },
  modalContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginTop:50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  verifyButton: {
    backgroundColor: '#140034',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default VerifyModal;
