import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import LoginHomeScreen from '../screens/auth/loginHomeScreen';
import LoginScreen from '../screens/auth/loginScreen';
import RegisterScreen from '../screens/auth/registrationScreen';
import ChatSection from '../screens/ChatHome/allChats';
import VideoCallRedirect from '../screens/ChatHome/chatVideoRedirect';
import SettingsScreen from '../screens/SettingsSection/settings';
import UpdateProfileScreen from '../screens/UpdateProfile/updateProfile';
import {useAppDispatch, useAppSelector} from '../store/store';
import {setAuthData} from '../store/Auth/auth';
import BottomTabNavigation from './BottomTabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import ForgotPassword from '../screens/auth/forgotPassword';
import NewPassword from '../screens/auth/newPassword';
import Subscriptions from '../screens/Profile/SubscriptionComponent/Subscriptions';
import PushNotification from 'react-native-push-notification';
import exploreHome from '../screens/Explore/ExploreHome/exploreHome';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {StreamVideo, StreamVideoRN} from '@stream-io/video-react-native-sdk';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Loader from '../components/Loader/Loader';

const Stack = createNativeStackNavigator();

const Root = () => {
  const userid: any = useAppSelector((state: any) => state?.Auth?.userID);
  // const isprofiledataPresent: any = useAppSelector(
  //   (state: any) => state?.Auth?.data?.isProfileDataPresenr,
  // );
  const isAuthLoading = useAppSelector((state: any) => state.Auth.authLoading);

  const dispatch: any = useAppDispatch();
  const [deviceToken, setDeviceToken] = useState<any>(null);
  const AfterLoginStack = createNativeStackNavigator();
  const BeforeLoginStack = createNativeStackNavigator();

  GoogleSignin.configure({
    webClientId:
      '151623051367-b882b5sufigjbholkehodmi9ccn4hv6m.apps.googleusercontent.com', // From Google Developer Console
    offlineAccess: true,
  });

  console.log('isAuthLoading==>', isAuthLoading);
  console.log('userid Root==>', userid);
  // console.log('token==>', userid);
  console.log('==========================================');

  useEffect(() => {
    console.log('userid Root==>', userid);

    dispatch(setAuthData());
  }, [userid]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      SplashScreen.hide();
      requestUserPermission();
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission({
        sound: true,
        alert: true,
        badge: true,
      });
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        const token = await messaging().getToken();
        setDeviceToken(token);
      } else {
        console.log('Authorization status:', authStatus);
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const BeforeLogin = () => {
    return (
      <BeforeLoginStack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Loginhome">
        <BeforeLoginStack.Screen name="Loginhome" component={LoginHomeScreen} />
        <BeforeLoginStack.Screen name="Login" component={LoginScreen} />
        <BeforeLoginStack.Screen name="Register" component={RegisterScreen} />
        <BeforeLoginStack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
        />
        <BeforeLoginStack.Screen name="NewPassword" component={NewPassword} />
      </BeforeLoginStack.Navigator>
    );
  };

  const AfterLogin = () => {
    return (
      <AfterLoginStack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="BottomTabNavigation">
        <AfterLoginStack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
        />
        <AfterLoginStack.Screen name="Settings" component={SettingsScreen} />
        <AfterLoginStack.Screen
          name="UpdateProfile"
          component={UpdateProfileScreen}
        />
        <AfterLoginStack.Screen
          name="Subscriptions"
          component={Subscriptions}
        />
        <AfterLoginStack.Screen name="ChatScreen" component={ChatSection} />
        <AfterLoginStack.Screen name="exploreHome" component={exploreHome} />
        <AfterLoginStack.Screen
          name="VideoCallRedirect"
          component={VideoCallRedirect}
        />
      </AfterLoginStack.Navigator>
    );
  };

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthLoading ? (
        <Stack.Screen name="Loader" component={Loader} />
      ) : userid ? (
        <Stack.Screen name="AfterLogin" component={AfterLogin} />
      ) : (
        <Stack.Screen name="BeforeLogin" component={BeforeLogin} />
      )}
    </Stack.Navigator>
  );
};

export default Root;
