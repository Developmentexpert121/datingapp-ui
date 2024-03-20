import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';

const MainButton = (props: any) => {
  const {onPress, ButtonName} = props;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
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
    marginVertical: 12,
    width: '100%',
    height:40,
    alignSelf: 'center',
    justifyContent:"center",
    alignItems:"center"
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Sansation_Regular',
  },
});
