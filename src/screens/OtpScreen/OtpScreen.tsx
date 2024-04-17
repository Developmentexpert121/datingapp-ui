import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import HeaderComponent from '../../components/Dashboard/header/header';
import {Image} from 'react-native';
import Label from '../../components/Label';

const OtpScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <HeaderComponent label={'Enter your verification code'} />
      <Image
        source={require('../../assets/images/login_Image.png')}
        resizeMode="contain"
        style={{width: '100%', height: '100%'}}
      />
      <Label style={{color: '#000'}} text={'We have sent OTP on your number'} />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already a member?</Text>
        <TouchableOpacity onPress={() => navigate('Login')}>
          <Text style={styles.touchableText}> Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpScreen;
const styles = StyleSheet.create({
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 0,
  },
  loginText: {
    color: 'black',
    marginRight: 5,
    fontFamily: 'Sansation-Regular',
  },
  touchableText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: 'Sansation-Bold',
  },
});
