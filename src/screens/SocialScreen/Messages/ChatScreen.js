import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Alert, AlertIOS } from 'react-native';
import Sound from 'react-native-sound';
import CommonBackground from '../../../components/common/CommonBackground';
import { setChatScreenActive, setCurrentScreen, hideTabBar, showTabBar } from '../../../redux/slices/uiSlice';
import { setCurrentChat } from '../../../redux/slices/chatSlice';
import {
  BackArrowIcon,
  SendIcon,
  VoiceIcon,
  VideoCallIcon,
  AudioCallIcon,
  EmojiIcon,
  PinIcon,
  MenuIcon,
  BgHeart1,
  BgHeart2,
  BgHeart3,
  BgHeart4,
  BgHeart5,
  ArchiveIcon,
  BlockIcon,
  ClearIcon,
  MediaIcon,
  ReportIcon,
  SearchIcon,
  UserIcon,
  DeleteIcon,
  CloseButtonIcon,
} from '../../../components/icons/SvgIcons';


// Message Bubble Component
const MessageBubble = ({ message, isUser, time, isRead, readTime }) => (
  <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.otherMessageContainer]}>
    <LinearGradient
      colors={isUser ? ['#DD3562', '#B02A4A'] : ['#501B41', '#3A062C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.messageBubble, isUser ? styles.userBubble : styles.otherBubble]}
    >
      <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.otherMessageText]}>
        {message}
      </Text>
      <View style={styles.messageTimeContainer}>
        <Text style={[styles.messageTime, isUser ? styles.userMessageTime : styles.otherMessageTime]}>
          {time}
        </Text>
        {isUser && isRead && readTime && (
          <Text style={styles.readTime}>{readTime}</Text>
        )}
      </View>
    </LinearGradient>
  </View>
);

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnim] = useState(new Animated.Value(300));
  const [callButtonScale] = useState(new Animated.Value(1));
  const [videoButtonScale] = useState(new Animated.Value(1));

  // Sound effects
  const [sendSound, setSendSound] = useState(null);
  const [receiveSound, setReceiveSound] = useState(null);
  const [soundsInitialized, setSoundsInitialized] = useState(false);
  
  // Visual feedback function (removed - no more screen flash)

  // Get user data from route params
  const { user } = route.params || {};

  useEffect(() => {
    // Initialize sound effects with actual MP3 playback
    const initializeSounds = () => {
      try {
        console.log('🎵 Initializing MP3 sound system...');
        
        // Enable playback in silence mode
        Sound.setCategory('Playback');
        
        // Try to load send sound
        const sendSoundInstance = new Sound('send.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('❌ Failed to load send.mp3:', error);
            // Try alternative path
            const altSendSound = new Sound('send.mp3', Sound.MAIN_BUNDLE, (altError) => {
              if (altError) {
                console.log('❌ Failed to load send.mp3 from alternative path:', altError);
                setSendSound(null);
              } else {
                console.log('✅ Send sound loaded from alternative path');
                setSendSound(altSendSound);
              }
            });
          } else {
            console.log('✅ Send sound loaded successfully');
            setSendSound(sendSoundInstance);
          }
        });
        
        // Try to load receive sound
        const receiveSoundInstance = new Sound('recieve.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('❌ Failed to load recieve.mp3:', error);
            // Try alternative path
            const altReceiveSound = new Sound('recieve.mp3', Sound.MAIN_BUNDLE, (altError) => {
              if (altError) {
                console.log('❌ Failed to load recieve.mp3 from alternative path:', altError);
                setReceiveSound(null);
              } else {
                console.log('✅ Receive sound loaded from alternative path');
                setReceiveSound(altReceiveSound);
              }
            });
          } else {
            console.log('✅ Receive sound loaded successfully');
            setReceiveSound(receiveSoundInstance);
          }
        });
        
        setSoundsInitialized(true);
        console.log('🎵 MP3 sound system initialization complete');
        
      } catch (error) {
        console.log('❌ Sound initialization failed:', error);
        setSoundsInitialized(true);
      }
    };

    initializeSounds();

    // Smooth fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Initialize with sample messages matching Figma
    const initialMessages = [
      {
        id: 1,
        text: 'Hey, I\'m Fins, Free now, U?',
        isUser: true,
        time: '01:12 AM',
        timestamp: new Date().getTime() - 3600000,
      },
      {
        id: 2,
        text: 'Hi, Good Morning',
        isUser: false,
        time: '8:19 AM',
        timestamp: new Date().getTime() - 3000000,
      },
      {
        id: 3,
        text: 'Good Morning, any plan for today?',
        isUser: true,
        time: '09:37 AM',
        timestamp: new Date().getTime() - 2400000,
        isRead: true,
        readTime: 'Seen 04:49',
      },
      {
        id: 4,
        text: 'Nothing much, W@H, Yours?',
        isUser: false,
        time: '9:49 AM',
        timestamp: new Date().getTime() - 1800000,
      },
    ];
    setMessages(initialMessages);

    // Keyboard event listeners
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });

    // Cleanup listeners and sounds
    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
      
      // Cleanup sound resources
      console.log('🧹 Cleaning up sound resources');
      try {
        if (sendSound && typeof sendSound.release === 'function') {
          sendSound.release();
        }
        if (receiveSound && typeof receiveSound.release === 'function') {
          receiveSound.release();
        }
      } catch (error) {
        console.log('❌ Error cleaning up sound resources:', error);
      }
    };
  }, []);

  // Redux-based tab bar hiding when ChatScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('💬 ChatScreen Focused - Hiding TabBar');
      // Dispatch Redux actions to hide tab bar and set chat screen as active
      dispatch(setCurrentScreen('Chat'));
      dispatch(setChatScreenActive(true));
      dispatch(hideTabBar());
      
      // Set current chat in Redux
      if (user) {
        dispatch(setCurrentChat(user));
      }

      // Show tab bar when screen is unfocused (only if not going to call screens)
      return () => {
        console.log('💬 ChatScreen Unfocused - Showing TabBar');
        dispatch(setChatScreenActive(false));
        dispatch(showTabBar());
        dispatch(setCurrentScreen(null));
      };
    }, [navigation, dispatch, user])
  );

  // Additional backup using useLayoutEffect
  useLayoutEffect(() => {
    dispatch(setCurrentScreen('Chat'));
    dispatch(setChatScreenActive(true));
    dispatch(hideTabBar());

    return () => {
      dispatch(setChatScreenActive(false));
      dispatch(showTabBar());
      dispatch(setCurrentScreen(null));
    };
  }, [dispatch]);

  // Sound effect functions
  const playSendSound = () => {
    console.log('🎵 Playing send sound...');
    console.log('Send sound available:', !!sendSound);
    console.log('Sounds initialized:', soundsInitialized);

    if (soundsInitialized) {
      try {
        // Play actual MP3 sound only
        if (sendSound && typeof sendSound.play === 'function') {
          console.log('🔊 Playing send.mp3...');
          sendSound.stop(() => {
            sendSound.play((success) => {
              if (success) {
                console.log('✅ Send MP3 played successfully');
              } else {
                console.log('❌ Send MP3 play failed');
              }
            });
          });
        } else {
          console.log('⚠️ Send sound not loaded, using fallback');
        }
        
        console.log('✅ Send sound played (MP3 only)');
        console.log('📤 Message sent with audio feedback');
        
      } catch (error) {
        console.log('❌ Error playing send sound:', error);
        console.log('📤 Message sent (no feedback)');
      }
    } else {
      console.log('📤 Message sent (no sound available)');
    }
  };

  const playReceiveSound = () => {
    console.log('🎵 Playing receive sound...');
    console.log('Receive sound available:', !!receiveSound);
    console.log('Sounds initialized:', soundsInitialized);

    if (soundsInitialized) {
      try {
        // Play actual MP3 sound only
        if (receiveSound && typeof receiveSound.play === 'function') {
          console.log('🔊 Playing recieve.mp3...');
          receiveSound.stop(() => {
            receiveSound.play((success) => {
              if (success) {
                console.log('✅ Receive MP3 played successfully');
              } else {
                console.log('❌ Receive MP3 play failed');
              }
            });
          });
        } else {
          console.log('⚠️ Receive sound not loaded, using fallback');
        }
        
        console.log('✅ Receive sound played (MP3 only)');
        console.log('📨 Message received with audio feedback');
        
      } catch (error) {
        console.log('❌ Error playing receive sound:', error);
        console.log('📨 Message received (no feedback)');
      }
    } else {
      console.log('📨 Message received (no sound available)');
    }
  };

  const handleGoBack = () => {
    // Dispatch Redux actions to show tab bar before going back
    dispatch(setChatScreenActive(false));
    dispatch(showTabBar());
    dispatch(setCurrentScreen(null));
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message.trim(),
        isUser: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().getTime(),
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Play send sound effect
      playSendSound();

      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simulate response after 1 second
      setTimeout(() => {
        const responses = [
          'That sounds interesting!',
          'I see what you mean.',
          'Thanks for sharing that with me.',
          'That\'s really cool!',
          'I agree with you on that.',
          'Tell me more about it.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage = {
          id: Date.now() + 1,
          text: randomResponse,
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date().getTime(),
        };

        setMessages(prev => [...prev, responseMessage]);
        
        // Play receive sound effect
        playReceiveSound();
        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1000);
    }
  };

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      // Close menu
      Animated.timing(menuAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsMenuOpen(false);
      });
    } else {
      // Open menu
      setIsMenuOpen(true);
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMenuClose = () => {
    Animated.timing(menuAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuOpen(false);
    });
  };

  // Animation functions for call buttons
  const animateCallButton = (buttonType) => {
    const scaleAnim = buttonType === 'audio' ? callButtonScale : videoButtonScale;
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAudioCall = () => {
    animateCallButton('audio');
    setTimeout(() => {
      navigation.navigate('Call', { user });
    }, 200);
  };

  const handleVideoCall = () => {
    animateCallButton('video');
    // Navigate to VideoCall screen with user data
    setTimeout(() => {
      navigation.navigate('VideoCall', { user });
    }, 200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140034" />
      <CommonBackground>
        {/* Background Hearts */}
        <View style={styles.backgroundHearts}>
          <BgHeart1 style={styles.heart1} />
          <BgHeart2 style={styles.heart2} />
          <BgHeart3 style={styles.heart3} />
          <BgHeart4 style={styles.heart4} />
          <BgHeart5 style={styles.heart5} />
          <BgHeart1 style={styles.heart6} />
          <BgHeart2 style={styles.heart7} />
          <BgHeart3 style={styles.heart8} />
          <BgHeart4 style={styles.heart9} />
          <BgHeart5 style={styles.heart10} />
        </View>
        
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
              {/* Back Button */}
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <BackArrowIcon width={18} height={18} color="#D9D8F3" />
              </TouchableOpacity>
              
              {/* Profile Image */}
              <View style={styles.avatarContainer}>
                <Image source={user?.image || require('../../../assets/messageUser/message1.png')} style={styles.headerAvatar} />
                <View style={styles.onlineIndicator} />
              </View>
              
              {/* User Info Container */}
              <View style={styles.userInfoContainer}>
                <Text 
                  style={styles.userName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user?.name || 'Belle Benson'}
                </Text>
                <Text style={styles.userStatus}>Online</Text>
              </View>
              
              {/* Spacer to push action buttons to the right */}
              <View style={styles.spacer} />
              
              {/* Audio Call Button */}
              <Animated.View style={{ transform: [{ scale: callButtonScale }] }}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleAudioCall}
                >
                  <AudioCallIcon width={28} height={28} />
                </TouchableOpacity>
              </Animated.View>
              
              {/* Video Call Button */}
              <Animated.View style={{ transform: [{ scale: videoButtonScale }] }}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleVideoCall}
                >
                  <VideoCallIcon width={28} height={28} />
                </TouchableOpacity>
              </Animated.View>
              
              {/* Menu Button */}
              <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
                <MenuIcon width={18} height={18} color="white" />
              </TouchableOpacity>
            </View>

            {/* Messages List */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.text}
                  isUser={msg.isUser}
                  time={msg.time}
                  isRead={msg.isRead}
                  readTime={msg.readTime}
                />
              ))}
            </ScrollView>

            {/* Message Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type Message"
                  placeholderTextColor="#B0B0B0"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={500}
                />
                <View style={styles.inputActions}>
                  {/* Send button - always visible */}
                  <TouchableOpacity 
                    style={[
                      styles.inputActionButton,
                      isKeyboardOpen && styles.sendButtonFocused
                    ]}
                    onPress={handleSendMessage}
                  >
                    <SendIcon width={23} height={25} />
                  </TouchableOpacity>
                  
                  {/* Other action buttons - only visible when keyboard is closed */}
                  {!isKeyboardOpen && (
                    <View style={styles.otherActionsContainer}>
                  <TouchableOpacity style={styles.inputActionButton}>
                    <VoiceIcon width={18} height={23} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputActionButton}>
                    <EmojiIcon width={20} height={21} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputActionButton}>
                    <PinIcon width={19} height={21} />
                  </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>

        {/* Menu Drawer */}
        {isMenuOpen && (
          <View style={styles.menuOverlay}>
            <TouchableOpacity 
              style={styles.menuBackdrop} 
              onPress={handleMenuClose}
              activeOpacity={1}
            />
            <Animated.View 
              style={[
                styles.menuDrawer,
                { transform: [{ translateX: menuAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#C9234F', '#7E1D96']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.menuGradient}
              >
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={handleMenuClose}>
                  <CloseButtonIcon width={40} height={40} />
                </TouchableOpacity>

                {/* Menu Items */}
                <View style={styles.menuItems}>
                  <TouchableOpacity style={styles.menuItem}>
                    <UserIcon width={20} height={20} color="white" />
                    <Text style={styles.menuText}>View Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem}>
                    <ArchiveIcon width={20} height={20} color="white" />
                    <Text style={styles.menuText}>Archive Conversation</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem}>
                    <DeleteIcon width={20} height={20} color="white" />
                    <Text style={styles.menuText}>Delete Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem}>
                    <ClearIcon width={20} height={20} color="white" />
                    <Text style={styles.menuText}>Clear History</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem}>
                    <SearchIcon width={20} height={20} color="white" />
                    <Text style={styles.menuText}>Search Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem}>
                    <MediaIcon width={20} height={20} color="white" />
                    <Text style={styles.menuText}>View Media</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem}>
                    <BlockIcon width={20} height={20} color="white" />
                    <Text style={styles.menuText}>Block User</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem}>
                    <ReportIcon width={20} height={20} color="white" />
                    <Text style={styles.menuText}>Report User</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        )}
      </CommonBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140034',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  animatedContainer: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 8,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    borderWidth: 1.5,
    borderColor: '#140034',
  },
  userInfoContainer: {
    flex: 1,
    marginRight: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '400',
  },
  spacer: {
    flex: 1,
  },
  actionButton: {
    padding: 4,
    marginHorizontal: 1,
  },
  menuButton: {
    padding: 4,
    marginLeft: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  userMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: 'white',
  },
  messageTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.7,
  },
  userMessageTime: {
    color: 'white',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: 'white',
  },
  readTime: {
    fontSize: 10,
    color: 'white',
    opacity: 0.6,
    marginLeft: 4,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 4,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  otherActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sendButtonFocused: {
    marginLeft: 'auto',
  },
  inputActionButton: {
    padding: 4,
  },
  backgroundHearts: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  heart1: {
    position: 'absolute',
    top: 50,
    left: -20,
    transform: [{ rotate: '15deg' }],
  },
  heart2: {
    position: 'absolute',
    top: 100,
    right: -30,
    transform: [{ rotate: '-25deg' }],
  },
  heart3: {
    position: 'absolute',
    top: 200,
    left: 20,
    transform: [{ rotate: '45deg' }],
  },
  heart4: {
    position: 'absolute',
    top: 120,
    left: 10,
    transform: [{ rotate: '-10deg' }],
  },
  heart5: {
    position: 'absolute',
    top: 20,
    left: 10,
    transform: [{ rotate: '30deg' }],
  },
  heart6: {
    position: 'absolute',
    top: 500,
    right: 20,
    transform: [{ rotate: '-45deg' }],
  },
  heart7: {
    position: 'absolute',
    top: 150,
    left: 100,
    transform: [{ rotate: '60deg' }],
  },
  heart8: {
    position: 'absolute',
    top: 350,
    left: -10,
    transform: [{ rotate: '-30deg' }],
  },
  heart9: {
    position: 'absolute',
    top: 450,
    right: 80,
    transform: [{ rotate: '20deg' }],
  },
  heart10: {
    position: 'absolute',
    top: 250,
    left: 200,
    transform: [{ rotate: '-60deg' }],
  },
  // Menu Drawer Styles
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuDrawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 300,
    zIndex: 1001,
    maxHeight: '80%',
    borderBottomLeftRadius: 40,
    overflow: 'hidden',
  },
  menuGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItems: {
    marginTop: 20,
    paddingBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuIcon: {
    width: 15,
    height: 15,
  },
  menuText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
    marginLeft:10
  },
});

export default ChatScreen;
