// // // src/components/common/GradientBackground.js
// // import React from 'react';
// // import { View, StyleSheet } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { gradients } from '../../styles/colors';

// // function GradientBackground({ children, style, gradient = 'background', direction = 'vertical' }) {
// //   const gradientColors = gradients[gradient] || gradients.background;
  
// //   // Define gradient directions
// //   const gradientDirections = {
// //     vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }, // top to bottom
// //     horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }, // left to right
// //     diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // diagonal
// //   };
  
// //   const gradientConfig = gradientDirections[direction] || gradientDirections.vertical;
  
// //   return (
// //     <LinearGradient
// //       colors={gradientColors}
// //       style={[styles.container, style]}
// //       start={gradientConfig.start}
// //       end={gradientConfig.end}
// //     >
// //       {children}
// //     </LinearGradient>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// // });

// // export default GradientBackground;


// // src/components/common/GradientBackground.js
// import React from 'react';
// import { StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { gradients } from '../../styles/colors';

// function GradientBackground({ children, style, gradient = 'background', direction = 'vertical' }) {
//   const gradientColors = gradients[gradient] || gradients.background;

//   // Define gradient directions
//   const gradientDirections = {
//     vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },     // top to bottom
//     horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },   // left to right
//     diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },     // diagonal
//   };

//   const gradientConfig = gradientDirections[direction] || gradientDirections.vertical;

//   return (
//     <LinearGradient
//       colors={gradientColors}
//       style={[styles.container, style]}
//       start={gradientConfig.start}
//       end={gradientConfig.end}
//     >
//       {children}
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default GradientBackground;


import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../styles/colors';

function GradientBackground({ children, style, gradient = 'background', direction = 'vertical' }) {
  const gradientColors = gradients[gradient] || gradients.background;

  // Define gradient directions
  const gradientDirections = {
    vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },     // top to bottom
    horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },   // left to right
    diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },     // diagonal
  };

  const gradientConfig = gradientDirections[direction] || gradientDirections.vertical;

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, style]}
      start={gradientConfig.start}
      end={gradientConfig.end}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;
