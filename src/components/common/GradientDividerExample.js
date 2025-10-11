// src/components/common/GradientDividerExample.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GradientDivider from './GradientDivider';

const GradientDividerExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GradientDivider Examples</Text>
      
      {/* Basic horizontal divider */}
      <View style={styles.section}>
        <Text style={styles.label}>Basic Horizontal (Primary Gradient)</Text>
        <GradientDivider />
      </View>
      
      {/* Vertical divider */}
      <View style={styles.section}>
        <Text style={styles.label}>Vertical Divider</Text>
        <View style={styles.verticalContainer}>
          <Text style={styles.text}>Left</Text>
          <GradientDivider direction="vertical" height={50} width={2} />
          <Text style={styles.text}>Right</Text>
        </View>
      </View>
      
      {/* Background gradient */}
      <View style={styles.section}>
        <Text style={styles.label}>Background Gradient</Text>
        <GradientDivider gradient="background" height={3} />
      </View>
      
      {/* Custom opacity */}
      <View style={styles.section}>
        <Text style={styles.label}>Custom Opacity (0.5)</Text>
        <GradientDivider opacity={0.5} height={2} />
      </View>
      
      {/* Custom width */}
      <View style={styles.section}>
        <Text style={styles.label}>Custom Width (50%)</Text>
        <GradientDivider width="50%" height={2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#140034',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 10,
  },
  verticalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  text: {
    color: 'white',
    marginHorizontal: 10,
  },
});

export default GradientDividerExample;
