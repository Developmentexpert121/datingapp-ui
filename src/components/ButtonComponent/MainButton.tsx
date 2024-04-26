import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Loader from '../Loader/Loader';

const MainButton = (props: any) => {
  const {onPress, ButtonName, buttonStyle, loading, disabled} = props;
  const [disable, setdisable] = useState<boolean>(false);
  const _onPress = () => {
    setdisable(true);
    onPress && onPress();
    setTimeout(() => {
      setdisable(false);
    }, 500);
  };
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={_onPress}
      // disabled={loading || disable}
      disabled={disabled}>
      {loading ? (
        <Loader />
      ) : (
        <Text style={styles.buttonText}>{ButtonName}</Text>
      )}
    </TouchableOpacity>
  );
};

export default MainButton;
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#AC25AC',
    // padding: 10,
    borderRadius: 20,
    width: '90%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
  },
});
