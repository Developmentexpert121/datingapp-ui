// import {StyleSheet, TouchableOpacity} from 'react-native';
// import React from 'react';
// import LottieView from 'lottie-react-native';
// interface LoaderProps {
//   color?: string | undefined;
// }
// const Loader = ({color}: LoaderProps) => {
//   return (
//     <TouchableOpacity
//       disabled
//       activeOpacity={1}
//       style={{
//         ...StyleSheet.absoluteFillObject,
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: color ?? '#FFFFFF22',
//       }}>
//       <LottieView
//         source={require('../../assets/loaderFile/loaderGif.json')}
//         style={{
//           width: 50,
//           height: 50,
//           alignSelf: 'center',
//         }}
//         autoPlay
//       />
//     </TouchableOpacity>
//   );
// };

// export default Loader;

// const styles = StyleSheet.create({});

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const Loader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size="large" color="#9f28f3" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderWrapper: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
