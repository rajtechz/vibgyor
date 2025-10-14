import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PostsTab = ({ navigation }) => {
  // Use navigation prop if provided, otherwise use useNavigation hook
  const nav = navigation || useNavigation();
  
  const postImages = [
    require('../../assets/images/postImage/Gallery Image 4 (1).png'),
    require('../../assets/images/postImage/Gallery Image 4.png'),
    require('../../assets/images/postImage/Gallery Image 10.png'),
    require('../../assets/images/postImage/Gallery Image 16.png'),
    require('../../assets/images/postImage/Gallery Image 5.png'),
    require('../../assets/images/postImage/Gallery Image 11.png'),
    require('../../assets/images/postImage/Gallery Image 17.png'),
    require('../../assets/images/postImage/Gallery Image 6.png'),
    require('../../assets/images/postImage/Gallery Image 12.png'),
  ];

  const handlePostPress = (image, index) => {
    console.log('Post pressed:', index);
    console.log('Navigating to OtherUserPostView...');
    nav.navigate('OtherUserPostView');
  };

  return (
    <>
      {postImages.map((image, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.contentItem}
          onPress={() => handlePostPress(image, index)}
          activeOpacity={0.8}
        >
          <Image source={image} style={styles.postImage} />
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  contentItem: {
    width: '33.33%',
    marginBottom: 0,
  },
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 0,
    resizeMode: 'cover',
  },
});

export default PostsTab;
