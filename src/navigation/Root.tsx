import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import LoginHomeScreen from '../screens/auth/loginHomeScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import LoginScreen from '../screens/auth/loginScreen';
import RegisterScreen from '../screens/auth/registrationScreen';
import HomeScreen from '../screens/Home/homeScreen';
import LikedScreen from '../screens/LikedYou/liked';
import ExploredScreen from '../screens/Explore/explored';
import ProfileScreen from '../screens/Profile/profileScreen';
import ChatSection from '../screens/ChatHome/allChats';
import VideoCallRedirect from '../screens/ChatHome/chatVideoRedirect';
import SettingsScreen from '../screens/Profile/settingsSection/settings';
import UpdateProfileScreen from '../components/updateProfile/updateProfile';
import {useAppDispatch, useAppSelector} from '../store/store';
import SplashScreenn from 'react-native-splash-screen';
import ProfileData from '../store/Auth/auth';
import BottomTabNavigation from './BottomTabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {requestNotifications} from 'react-native-permissions';
export type RegisterType = {};
export type RootStackParamList = {
  Home: undefined;
  Loginhome: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  ChatScreen: undefined;
  Liked: undefined;
  Notification: undefined;
  Filter: undefined;
  Explore: undefined;
  Settings: undefined;
  UpdateProfile: undefined;
  ChatPage: undefined;
  VideoCallRedirect: undefined;
  OtpScreen: undefined;
  BottomTabNavigation: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const Root = () => {
  // const { isAuthenticated, notificationChannelId } = useAppSelector((state) => state.auth);
  // const isAuthenticated = useAppSelector(
  //   (state: any) => state?.Auth?.isAuthenticated,
  // );
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     SplashScreenn.hide();
  //   }, 500);
  // }, []);

  // useEffect(() => {
  //   isAuthenticated?.token && dispatch(ProfileData());
  // }, []);

  // if (isLoading) return null;

  //
  //
  //
  const dispatch = useAppDispatch();
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      SplashScreen.hide();
    }, 2000);
  }, []);
  async function requestUserPermission() {
    await requestNotifications(['alert', 'sound']);
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('Token:', token);
  };

  const isLoading = useAppSelector(
    (state: any) => state.ActivityLoader.loading,
  );

  const isAuthenticated = useAppSelector(
    (state: any) => state?.Auth?.isAuthenticated,
  );

  console.log('------isAuthenticated', isAuthenticated);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (Platform.OS === 'android') {
        SplashScreen.hide();
      }
      requestUserPermission();
      getToken();
    }, 2000);
    return () => clearTimeout(timeout); // Cleanup function to clear the timeout
  }, []);

  // const authToken: any = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('authToken');
  //     console.log('tokennnnnn', token);
  //     if (token !== null) {
  //       return JSON.parse(token);
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     return null;
  //   }
  // };

  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token !== null) {
          setAuthToken(JSON.parse(token));
        }
      } catch (error) {
        console.error('Error fetching auth token:', error);
      }
    };

    fetchAuthToken();
  }, []);

  const getTokenAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token === '') {
        return null;
      } else if (token !== null) {
        return JSON.parse(token);
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const tokensss = getTokenAuth();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* {isAuthenticated?.token ? ( */}
      {tokensss === null || isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen
            name="BottomTabNavigation"
            component={BottomTabNavigation}
          />
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          {/* <Stack.Screen name="Liked" component={LikedScreen} /> */}
          {/* <Stack.Screen name="Explore" component={ExploredScreen} /> */}
          {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
          <Stack.Screen name="ChatScreen" component={ChatSection} />
          <Stack.Screen
            name="VideoCallRedirect"
            component={VideoCallRedirect}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Loginhome" component={LoginHomeScreen} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default Root;
