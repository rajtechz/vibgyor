import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const PostsTab = () => {
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

  return (
    <>
      {postImages.map((image, index) => (
        <View key={index} style={styles.contentItem}>
          <Image source={image} style={styles.postImage} />
        </View>
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
