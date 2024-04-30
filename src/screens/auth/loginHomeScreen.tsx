import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {AppleIC, FacebookIC, GoogleIC} from '../../assets/svgs';
import MainButton from '../../components/ButtonComponent/MainButton';
import Colors from '../../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AppleAuthentication from '@invertase/react-native-apple-authentication';
import {_googleLogin} from '../../store/Auth/socialLogin';

GoogleSignin.configure({
  webClientId:
    '1074716618334-m6trdmrc4b3tojpaaufbslg616vt1al7.apps.googleusercontent.com',
  offlineAccess: true,
});

type Props = NativeStackScreenProps<RootStackParamList, 'Loginhome'>;
const LoginHomeScreen: React.FC<Props> = ({navigation: {navigate}}) => {
  const navigation = useNavigation();
  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken, user} = await GoogleSignin.signIn();
      console.log(userInfo);
      navigation.navigate('Home');
      // Handle successful sign-in, e.g., store user info in state or navigate to another screen
    } catch (error: any) {
      if (error && error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in flow
        console.log('Sign in cancelled');
      } else if (error && error.code === statusCodes.IN_PROGRESS) {
        // Sign-in process is already in progress
        console.log('Sign in in progress');
      } else if (
        error &&
        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        // Play services not available or outdated
        console.log('Play services not available');
      } else {
        // Some other error occurred
        console.error('askfhksfi', error);
      }
    }
  };
  // const handleAppleSignIn = async (AppleAuthentication: any) => {
  //   try {
  //     const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
  //       requestedScopes: [
  //         AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
  //         AppleAuthentication.AppleAuthenticationScope.EMAIL,
  //       ],
  //     });
  //     // Use the appleAuthRequestResponse data for authentication and other purposes
  //     console.log('User signed in with Apple:', appleAuthRequestResponse);
  //   } catch (error: any) {
  //     // Handle the error
  //     if (error.code === AppleAuthentication.Error.CANCELED) {
  //       console.log('Sign in canceled');
  //     } else {
  //       console.error('Sign in failed', error);
  //     }
  //   }
  // };
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFC7FF',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 3 / 5,
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/images/LoginTop.png')}
          // resizeMode="contain"
          style={{width: 160, height: 160}}
        />
        <Image
          source={require('../../assets/images/LoginBottom.png')}
          resizeMode="contain"
          style={{width: '100%', height: '70%'}}
        />
      </View>
      <View
        style={{
          flex: 2 / 5,
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.label}>What's your email?</Text>
          <Text style={styles.subText}>
            Don't lose access to your account,{'\n'}verify your email.
          </Text>
        </View>
        <MainButton
          buttonStyle={{width: '75%'}}
          ButtonName={'Create Account'}
          onPress={() => navigate('Register')}
        />
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 15,
            alignItems: 'center',
            width: '50%',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            onPress={googleLogin}
            // onPress={_googleLogin}
          >
            <GoogleIC />
          </TouchableOpacity>
          <TouchableOpacity>
            <FacebookIC />
          </TouchableOpacity>
          <TouchableOpacity
          // onPress={onAppleButtonPress}
          // onPress={handleAppleSignIn}
          >
            <AppleIC />
          </TouchableOpacity>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already a member?</Text>
          <TouchableOpacity onPress={() => navigate('Login')}>
            <Text style={styles.touchableText}> Log In</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', bottom: 20, position: 'absolute'}}>
          <Text
            style={styles.termsText}
            onPress={() => {
              Linking.openURL('https://sheikhproperty.com/privacy-policy');
            }}>
            Terms of use
          </Text>
          <Text style={styles.termsText1}> and </Text>
          <Text
            style={styles.termsText}
            onPress={() => {
              Linking.openURL('https://sheikhproperty.com/privacy-policy');
            }}>
            privacy policy{' '}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC7FF',
    width: '100%',
    height: '100%',
  },
  image1: {
    width: '100%',
    height: '100%',
  },
  image2: {
    width: '100%',
    height: '60%',
  },
  label: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  subText: {
    marginTop: 8,
    fontFamily: 'Sansation-Regular',
    textAlign: 'center',
    color: 'black',
  },
  termsText1: {
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'Sansation-Regular',
  },
  termsText: {
    color: Colors.pinkDark,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
  },
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

export default LoginHomeScreen;
