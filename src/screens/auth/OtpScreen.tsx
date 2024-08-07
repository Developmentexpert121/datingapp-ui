import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import Label from '../../components/Label';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpScreen'>;
const OtpScreen = ({navigation: {}}) => {
  const navigation = useNavigation;
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Image
        source={require('../../assets/images/login_Image.png')}
        resizeMode="contain"
        style={{width: '100%', height: '100%'}}
      />
      <Label style={{color: '#000'}} text={'We have sent OTP on your number'} />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already a member?</Text>
        <TouchableOpacity
        // onPress={() => navigate('Login')}
        >
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
