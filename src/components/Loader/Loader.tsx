import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
interface LoaderProps {
  color?: string | undefined;
}
const Loader = ({color}: LoaderProps) => {
  return (
    <TouchableOpacity
      disabled
      activeOpacity={1}
      style={{
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: color ?? '#FFFFFF22',
      }}>
      <Image
        source={require('../../assets/git/lodaerIcon.gif')}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});

// import React from 'react';
// import {View, ActivityIndicator, StyleSheet} from 'react-native';

// const Loader = () => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.loaderWrapper}>
//         <ActivityIndicator size="large" color="#9f28f3" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderWrapper: {
//     width: 100,
//     height: 100,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Loader;

// import React from 'react';
// import {View, ActivityIndicator, StyleSheet} from 'react-native';

// const Loader = () => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.loaderWrapper}>
//         <ActivityIndicator size="large" color="#9f28f3" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderWrapper: {
//     width: 100,
//     height: 100,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Loader;
