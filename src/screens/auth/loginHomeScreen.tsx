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
// import {_googleLogin, onAppleButtonPress} from '../../store/Auth/socialLogin';
import {GoogleLogin} from '../../store/Auth/auth';
import {useDispatch} from 'react-redux';
import {useAppDispatch} from '../../store/store';
import {googleLogin} from '../../store/Auth/socialLogin';
import {setLocalStorage} from '../../api/storage';
import {setAuthentication} from '../../store/reducer/authSliceState';

// import {LoginButton, AccessToken} from 'react-native-fbsdk-next';

GoogleSignin.configure({
  webClientId:
    '1097775841702-5l4cg4rsng9hhjnjlmah7n75et0eqj4l.apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '',
  accountName: '',
  iosClientId:
    '1097775841702-3616366houm9b5durv1ndpnv3779f07p.apps.googleusercontent.com',
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
  const [state, setState] = useState<string>('');
  const [userInfo, setUserInfo] = useState<null>(null);
  const dispatch: any = useAppDispatch();
  const navigation = useNavigation();
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | undefined>('');

  const handleNavigation = (response: any) => {
    if (!response.payload?.data.otpVerified) {
      navigation.navigate('Loginhome');
    } else if (!response.payload?.data?.isProfileCompleted) {
      navigation.navigate('Loginhome');
    } else {
      setLocalStorage('isProfileCompleted', true);
      dispatch(setAuthentication(true));
    }
    // dispatch(getProfile());
  };

  const handleGoogleLogin = async () => {
    console.log('zzzzzzzzzzzzz');
    // crashlytics().log('google-login');
    try {
      let userInfo = await googleLogin();
      if (userInfo) {
        // Extract the email and id from the user info
        const {email, id} = userInfo;
        console.log('zzzzzzzzzzzzz', userInfo);
        // dispatch(
        //   userProfileDataChange({
        //     key: 'email',
        //     value: email,
        //   }),
        // );
        // Prepare the login payload for Google login
        let loginPayload = {
          loginType: 'GOOGLE',
          role: 'U',
          email: email,
          socialId: id,
          deviceToken: 'abcde',
        };
        // Dispatch the user sign-up action with the login payload
        // dispatch(userSignUp({...loginPayload}))
        //   .then((response: any) => {
        //     if (response.payload?.code === 200) {
        //       let token: string = response?.payload?.data?.accessToken;
        //       setLocalStorage('token', token);

        //       // If sign-up is successful, call the function to handle the navigation
        //       handleNavigation(response);
        //     } else {
        //       // If there is an error in sign-up, check if there is an error message and set it
        //       if (response.payload?.message) {
        //         setMsg(response.payload?.message);
        //       }
        //       // Show the modal with the error message
        //       setActiveModal(true);
        //     }
        //   })
        //   .catch((error: any) => {
        //     // If there is an error in the promise chain, set the error message and show the modal
        //     setMsg(error?.payload?.message);
        //     setActiveModal(true);
        //   });
      }
    } catch (error) {
      // Handle any errors that occur during the Google login process
      console.log('Error logging in with Google:', error);
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
            onPress={handleGoogleLogin}
            //
          >
            <GoogleIC />
          </TouchableOpacity>
          <TouchableOpacity>
            <FacebookIC />
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
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
