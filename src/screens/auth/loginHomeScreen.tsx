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
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {AppleIC, FacebookIC, GoogleIC} from '../../assets/svgs';
import MainButton from '../../components/ButtonComponent/MainButton';
import Colors from '../../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '../../store/store';
// import {googleLogin} from '../../store/Auth/socialLogin';
import {setLocalStorage} from '../../api/storage';
import {setAuthentication} from '../../store/reducer/authSliceState';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import appleAuth, {
  AppleRequestOperation,
  AppleRequestScope,
} from '@invertase/react-native-apple-authentication';

import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
interface AppleAuthResponse {
  user: string;
  email: string | null;
  // fullName: AppleAuthentication.AppleIDFullName | null;
  identityToken: string | null;
  authorizationCode: string | null;
}

// ******************
// GoogleSignin.configure({
//   webClientId:
//     '525170388912-venl0pg78o0idesf36n54pet7mvg9von.apps.googleusercontent.com',
//   offlineAccess: true,
// });
// ***************
type Props = NativeStackScreenProps<RootStackParamList, 'Loginhome'>;
const LoginHomeScreen: React.FC<Props> = ({navigation: {navigate}}) => {
  const [state, setState] = useState<string>('');
  const [userInfo, setUserInfo] = useState<null>(null);
  const dispatch: any = useAppDispatch();
  const navigation = useNavigation();
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | undefined>('');
  // **************
  async function onGoogleButtonPress2() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const onGoogleButtonPress1 = async () => {
    try {
      GoogleSignin.configure({
        scopes: ['profile', 'email'],
        webClientId:
          '151623051367-b882b5sufigjbholkehodmi9ccn4hv6m.apps.googleusercontent.com',
        offlineAccess: false,
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      console.log('userInfouserInfo 000000 ', userInfo);
      return userInfo;
      // const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      // await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log('hhhhhhhhg', error);
    }
  };

  const onGoogleButtonPress = async () => {
    await onGoogleButtonPress1().then((data: any) => {
      console.log('dataaaaa ', data);
    });
  };
  // **************

  // const handleNavigation = (response: any) => {
  //   if (!response.payload?.data.otpVerified) {
  //     navigation.navigate('Loginhome');
  //   } else if (!response.payload?.data?.isProfileCompleted) {
  //     navigation.navigate('Loginhome');
  //   } else {
  //     setLocalStorage('isProfileCompleted', true);
  //     dispatch(setAuthentication(true));
  //   }
  //   // dispatch(getProfile());
  // };

  // const handleGoogleLogin = async () => {
  //   console.log('zzzzzzzzzzzzz');
  //   // crashlytics().log('google-login');
  //   try {
  //     let userInfo = await googleLogin();
  //     if (userInfo) {
  //       // Extract the email and id from the user info
  //       const {email, id} = userInfo;
  //       console.log('zzzzzzzzzzzzz', userInfo);
  //       // dispatch(
  //       //   userProfileDataChange({
  //       //     key: 'email',
  //       //     value: email,
  //       //   }),
  //       // );
  //       // Prepare the login payload for Google login
  //       let loginPayload = {
  //         loginType: 'GOOGLE',
  //         role: 'U',
  //         email: email,
  //         socialId: id,
  //         deviceToken: 'abcde',
  //       };
  //       // Dispatch the user sign-up action with the login payload
  //       // dispatch(userSignUp({...loginPayload}))
  //       //   .then((response: any) => {
  //       //     if (response.payload?.code === 200) {
  //       //       let token: string = response?.payload?.data?.accessToken;
  //       //       setLocalStorage('token', token);

  //       //       // If sign-up is successful, call the function to handle the navigation
  //       //       handleNavigation(response);
  //       //     } else {
  //       //       // If there is an error in sign-up, check if there is an error message and set it
  //       //       if (response.payload?.message) {
  //       //         setMsg(response.payload?.message);
  //       //       }
  //       //       // Show the modal with the error message
  //       //       setActiveModal(true);
  //       //     }
  //       //   })
  //       //   .catch((error: any) => {
  //       //     // If there is an error in the promise chain, set the error message and show the modal
  //       //     setMsg(error?.payload?.message);
  //       //     setActiveModal(true);
  //       //   });
  //     }
  //   } catch (error) {
  //     // Handle any errors that occur during the Google login process
  //     console.log('Error logging in with Google:', error);
  //   }
  // };
  const handleFacebookLogin = async () => {
    try {
      console.log('asdfdsa cancelled');
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      console.log('first', LoginManager);
      if (result.isCancelled) {
        console.log('......Login cancelled');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (!data) {
          console.log('Something went wrong obtaining access token');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          console.log('Access Token: ' + data.accessToken.toString());
        }
      }
    } catch (error) {
      console.log('Login fail with error: ' + error);
    }
  };
  const onAppleButtonPress = async () => {
    try {
      console.log('////////', appleAuth);
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleRequestOperation.LOGIN,
        requestedScopes: [AppleRequestScope.EMAIL, AppleRequestScope.FULL_NAME],
      });

      // Handle successful Apple login response
      console.log(appleAuthRequestResponse);
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // Handle user cancellation
        console.warn('User cancelled Apple login');
      } else {
        // Handle other errors
        Alert.alert('Error', 'An error occurred during Apple login');
        console.error(error);
      }
    }
  };

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
            // onPress={handleGoogleLogin}
            onPress={() => onGoogleButtonPress()}
            //
          >
            <GoogleIC />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFacebookLogin}>
            <FacebookIC />
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              // onPress={handleAppleSignIn}
              onPress={onAppleButtonPress}
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
