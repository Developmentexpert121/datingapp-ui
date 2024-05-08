import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Platform,
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
// import AppleAuthentication from '@invertase/react-native-apple-authentication';
import * as AppleAuthentication from '@invertase/react-native-apple-authentication';
import {_googleLogin, onAppleButtonPress} from '../../store/Auth/socialLogin';
import {GoogleLogin} from '../../store/Auth/auth';
import {useDispatch} from 'react-redux';
import {useAppDispatch} from '../../store/store';

// import {LoginButton, AccessToken} from 'react-native-fbsdk-next';

GoogleSignin.configure({
  webClientId:
    '1097775841702-5l4cg4rsng9hhjnjlmah7n75et0eqj4l.apps.googleusercontent.com',
  offlineAccess: true,
});
interface AppleAuthResponse {
  user: string;
  email: string | null;
  // fullName: AppleAuthentication.AppleIDFullName | null;
  identityToken: string | null;
  authorizationCode: string | null;
}
type Props = NativeStackScreenProps<RootStackParamList, 'Loginhome'>;
const LoginHomeScreen: React.FC<Props> = ({navigation: {navigate}}) => {
  const dispatch: any = useAppDispatch();
  const navigation = useNavigation();
  // const googleLogin = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     const {idToken, user} = await GoogleSignin.signIn();
  //     console.log(userInfo);
  //     navigation.navigate('Home');
  //   } catch (error: any) {
  //     if (error && error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       console.log('Sign in cancelled');
  //     } else if (error && error.code === statusCodes.IN_PROGRESS) {
  //       console.log('Sign in in progress');
  //     } else if (
  //       error &&
  //       error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
  //     ) {
  //       console.log('Play services not available');
  //     } else {
  //       console.error('askfhksfi', error);
  //     }
  //   }
  // };

  const onSubmit: any = () => {
    dispatch(GoogleLogin());
  };

  //

  // const handleAppleSignIn = async (): Promise<void> => {
  //   try {
  //     const appleAuthRequestResponse: AppleAuthResponse =
  //       await AppleAuthentication.performRequest({
  //         requestedScopes: [
  //           AppleAuthentication.AppleIDRequestScope.FULL_NAME,
  //           AppleAuthentication.AppleIDRequestScope.EMAIL,
  //         ],
  //       });

  //     // appleAuthRequestResponse contains the user's information
  //     console.log('Apple Auth Response:', appleAuthRequestResponse);

  //     // Use the response to handle the sign-in and the user information
  //     const {user, email, fullName, identityToken, authorizationCode} =
  //       appleAuthRequestResponse;

  //     // Handle the Apple Authentication response as needed
  //     // For example, use user, email, fullName, identityToken, and authorizationCode
  //   } catch (error) {
  //     console.error('Apple sign-in error:', error);
  //   }
  // };

  // const handleFacebookLogin = () => {
  //   AccessToken.getCurrentAccessToken()
  //     .then(data => {
  //       if (data) {
  //         console.log('Logged in with Facebook:', data.accessToken);
  //         // You can now use the token to fetch user data or perform other tasks.
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Facebook login failed:', error);
  //     });
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
            // onPress={googleLogin}
            // onPress={signIn}
            onPress={onSubmit}
            //
          >
            <GoogleIC />
          </TouchableOpacity>
          {/* <LoginButton
            onLoginFinished={(error, result) => {
              if (error) {
                console.error('Login failed:', error);
              } else if (result.isCancelled) {
                console.log('Login cancelled');
              } else {
                handleFacebookLogin();
              }
            }}
          /> */}
          <TouchableOpacity>
            <FacebookIC />
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
            // onPress={onAppleButtonPress}
            // onPress={handleAppleSignIn}
            //
            >
              <AppleIC />
            </TouchableOpacity>
          )}
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