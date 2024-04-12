import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';

const MainButton = (props: any) => {
  const {onPress, ButtonName, buttonStyle} = props;
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={styles.buttonText}>{ButtonName}</Text>
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
