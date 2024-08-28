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
        backgroundColor: color ?? '#FFFFFF99',
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
