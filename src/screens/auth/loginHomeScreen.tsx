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
import appleAuth, {
  AppleRequestOperation,
  AppleRequestScope,
} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {googleLogin, onAppleButtonPress} from '../../store/Auth/socialLogin';
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
  // **************
  // **************

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
  // **************************
  const handleAppleLogin = async () => {
    // Check if the platform is iOS
    if (Platform.OS === 'ios') {
      // crashlytics().log('Apple-login');
      try {
        // Call the function to handle Apple button press and get user info
        let userInfo: any = await onAppleButtonPress();
        console.log(userInfo, 'userInfo');
        if (userInfo) {
          // Prepare the login payload for Apple login
          let loginPayload = {
            loginType: 'APPLE',
            role: 'U',
            email: userInfo?.email,
            socialId: userInfo?.sub,
            deviceToken: 'abcde',
          };
          // Dispatch the user sign-up action with the login payload
          // dispatch(userSignUp({...loginPayload}))
          //   .then((response: any) => {
          //     if (response.payload?.code === 200) {
          //       // If sign-up is successful, extract the access token and store it in local storage
          //       let token: string = response?.payload?.data?.accessToken;
          //       setLocalStorage('token', token);
          //       // Call the function to handle the navigation based on the response
          //       handleNavigation(response);
          //     } else {
          //       // If there is an error in sign-up, set the error message and show the modal
          //       setMsg(response.payload?.message);
          //       setActiveModal(true);
          //     }
          //   })
          //   .catch((error: any) => {
          //     // If there is an error in the promise chain, set the error message and show the modal
          //     setMsg(error?.payload?.message);
          //     setActiveModal(true);
          //   });
        } else {
          // Handle the case when the user info is not available
        }
      } catch (error) {
        // Handle any errors that occur during the Apple login process
      }
    } else {
      // If the platform is not iOS, show a message indicating that the feature is only supported on Apple devices
      setMsg('This feature is only supported on Apple devices.');
      setActiveModal(true);
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
            // onPress={() => onGoogleButtonPress()}
            //
          >
            <GoogleIC />
          </TouchableOpacity>
          <TouchableOpacity
          // onPress={handleFacebookLogin}
          //
          >
            <FacebookIC />
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              // onPress={handleAppleSignIn}
              onPress={handleAppleLogin}
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
              Linking.openURL(
                'https://www.freeprivacypolicy.com/live/049b6fad-d131-4ee8-b7c0-51b2fe118617',
              );
            }}>
            Terms of use
          </Text>
          <Text style={styles.termsText1}> and </Text>
          <Text
            style={styles.termsText}
            onPress={() => {
              Linking.openURL(
                'https://www.freeprivacypolicy.com/live/049b6fad-d131-4ee8-b7c0-51b2fe118617',
              );
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
