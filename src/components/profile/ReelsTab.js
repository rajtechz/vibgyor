import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const ReelsTab = () => {
  const reelImages = [
    require('../../assets/images/postImage/Gallery Image 19.png'),
    require('../../assets/images/postImage/Gallery Image 20.png'),
    require('../../assets/images/postImage/Gallery Image 21.png'),
  ];

  return (
    <>
      {reelImages.map((image, index) => (
        <View key={index} style={styles.contentItem}>
          <Image source={image} style={styles.reelImage} />
          <View style={styles.playButtonOverlay}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </View>
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
  reelImage: {
    width: '100%',
    height: 120,
    borderRadius: 0,
    resizeMode: 'cover',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 0,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 16,
    color: '#000',
    marginLeft: 2,
  },
});

export default ReelsTab;
