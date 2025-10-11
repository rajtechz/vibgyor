import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// Report Icon Component (Flag-like icon)
const ReportIcon = ({ width = 16, height = 16 }) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <Path
      d="M2 2h8l1 3-1 3H2V2zm0 12v-6h8l1 3-1 3H2z"
      fill="white"
    />
    <Path
      d="M2 2v12"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </Svg>
);

const PostTooltip = ({ visible, onClose, onReport, position = { x: 0, y: 0 } }) => {
  console.log('PostTooltip render:', { visible, position });
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.overlayTouchable} 
        activeOpacity={1} 
        onPress={onClose}
      />
      <View style={[styles.tooltip, { 
        top: position.y + 10, // Position below the hamburger button
        left: Math.max(10, position.x - 60) // Position to the left of the hamburger button, with screen boundary check
      }]}>
        {/* Arrow pointing up to the hamburger button */}
        <View style={styles.arrow} />
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => {
            onReport();
            onClose();
          }}
          activeOpacity={0.7}
        >
          <ReportIcon width={16} height={16} />
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayTouchable: {
    flex: 1,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 100,
    zIndex: 1001, // Ensure it's above other elements
  },
  arrow: {
    position: 'absolute',
    top: -6,
    right: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000000',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default PostTooltip;
