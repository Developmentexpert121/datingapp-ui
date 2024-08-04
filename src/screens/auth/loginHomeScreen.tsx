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
import {useAppDispatch, useAppSelector} from '../../store/store';
// import {googleLogin} from '../../store/Auth/socialLogin';
import {setLocalStorage} from '../../api/storage';
import {setAuthentication} from '../../store/reducer/authSliceState';
import {googleLogin, onAppleButtonPress} from '../../store/Auth/socialLogin';
import {userProfileDataChange} from '../../store/slice/myProfileSlice/myProfileSlice';
import {AppleLogin, GoogleLogin, ProfileData} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProfile} from '../../store/slice/myProfileSlice/myProfileAction';
import {
  activityLoaderFinished,
  activityLoaderStarted,
} from '../../store/Activity/activity';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../components/Loader/Loader';
interface AppleAuthResponse {
  user: string;
  email: string | null;
  // fullName: AppleAuthentication.AppleIDFullName | null;
  identityToken: string | null;
  authorizationCode: string | null;
}
const LoginHomeScreen = () => {
  const [state, setState] = useState<string>('');
  const [userInfo, setUserInfo] = useState<null>(null);
  const dispatch: any = useAppDispatch();
  const navigation = useNavigation();
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | undefined>('');
  const [loader, setLoader] = useState<boolean>(false);
  // **************
  const dataToSend = {
    email: 86,
    otherParam: 'anything you want here',
  };
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
    dispatch(getProfile());
  };
  // Google Login
  const handleGoogleLogin = async () => {
    setLoader(true);
    try {
      let userInfo = await googleLogin();
      if (userInfo) {
        // Extract the email and id from the user info
        const {email, id, name, photo} = userInfo;
        console.log(userInfo);
        dispatch(
          userProfileDataChange({
            key: 'email',
            value: email,
          }),
        );
        // Prepare the login payload for Google login
        let loginPayload = {
          loginType: 'GOOGLE',
          role: 'U',
          email: email,
          socialId: id,
          deviceToken: 'abcde',
          name: name,
          photo: photo,
        };

        dispatch(GoogleLogin({...loginPayload}))
          .then(async (response: any) => {
            if (response?.payload?.redirect === 'Steps') {
              await navigation.navigate('Register');
            } else if (response?.payload?.redirect === 'Dashboard') {
              dispatch(activityLoaderStarted());
              let token: string = response?.payload?.token;
              setLocalStorage('token', token);
              await AsyncStorage.setItem(
                'authToken',
                JSON.stringify(response?.payload?.token),
              );
              await AsyncStorage.setItem(
                'userId',
                JSON.stringify(response?.payload?._id),
              );
              dispatch(ProfileData());
              // If sign-up is successful, call the function to handle the navigation
              handleNavigation(response);
              dispatch(activityLoaderFinished());
            } else {
              // If there is an error in sign-up, check if there is an error message and set it
              if (response?.payload?.message) {
                setMsg(response?.payload?.message);
              }
              // Show the modal with the error message
              setActiveModal(true);
            }
            setLoader(false);
          })
          .catch((error: any) => {
            console.error('.......error', error);
            // If there is an error in the promise chain, set the error message and show the modal
            setMsg(error?.payload?.message);
            setActiveModal(true);
          });
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      // Handle any errors that occur during the Google login process
      console.log('Error logging in with Google:', error);
      setLoader(false);
    }
  };
  // Apple Login
  const handleAppleLogin = async () => {
    // Check if the platform is iOS
    if (Platform.OS === 'ios') {
      console.log('Apple login initiated');

      try {
        // Call the function to handle Apple button press and get user info
        const userInfo = await onAppleButtonPress();

        if (userInfo) {
          // Prepare the login payload for Apple login
          const loginPayload = {
            loginType: 'APPLE',
            role: 'U',
            email: userInfo?.email,
            socialId: userInfo?.sub,
            deviceToken: 'abcde', // Replace with actual device token if available
          };

          // Dispatch the user sign-up action with the login payload
          dispatch(AppleLogin({...loginPayload}))
            .then(async (response: any) => {
              if (response?.payload?.redirect === 'Steps') {
                await navigation.navigate('Register');
              } else if (response?.payload?.redirect === 'Dashboard') {
                dispatch(activityLoaderStarted());
                let token: string = response?.payload?.token;
                setLocalStorage('token', token);
                await AsyncStorage.setItem(
                  'authToken',
                  JSON.stringify(response?.payload?.token),
                );
                await AsyncStorage.setItem(
                  'userId',
                  JSON.stringify(response?.payload?._id),
                );
                dispatch(ProfileData());

                // If sign-up is successful, call the function to handle the navigation
                handleNavigation(response);
                dispatch(activityLoaderFinished());
              } else {
                // If there is an error in sign-up, check if there is an error message and set it
                if (response?.payload?.message) {
                  setMsg(response?.payload?.message);
                }
                // Show the modal with the error message
                setActiveModal(true);
              }
            })
            .catch((error: any) => {
              // If there is an error in the promise chain, set the error message and show the modal
              console.error('Apple login dispatch error:', error);
              setMsg(
                error?.payload?.message ||
                  'An error occurred during Apple login.',
              );
              setActiveModal(true);
            });
        } else {
          // Handle the case when the user info is not available
          setMsg('User information could not be retrieved. Please try again.');
          setActiveModal(true);
        }
      } catch (error) {
        // Handle any errors that occur during the Apple login process
        console.error('Apple Authentication Error:', error);
        setMsg('An error occurred during Apple login. Please try again.');
        setActiveModal(true);
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
      }}>
      <View style={{flex: 1}}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/LoginTop.png')}
            style={{resizeMode: 'contain', width: wp(36), height: hp(18)}}
          />
          <Image
            source={require('../../assets/images/LoginBottom.png')}
            resizeMode="contain"
            style={{
              resizeMode: 'contain',
              width: hp(100),
              height: hp(40),
            }}
          />
        </View>
        <View
          style={{
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
            onPress={() => navigation.navigate('Register')}
          />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              alignItems: 'center',
              width: '50%',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity onPress={handleGoogleLogin}>
              <GoogleIC />
            </TouchableOpacity>
            {/* <TouchableOpacity
          // onPress={handleFacebookLogin}
          //
          >
            <FacebookIC />
          </TouchableOpacity> */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity onPress={handleAppleLogin}>
                <AppleIC />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already a member?</Text>
            <TouchableOpacity
              style={{paddingVertical: 5}}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.touchableText}> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          height: hp(5),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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
      {loader && <Loader />}
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
