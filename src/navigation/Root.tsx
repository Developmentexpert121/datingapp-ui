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
import ProfileData from '../store/Auth/auth';
import BottomTabNavigation from './BottomTabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import {requestNotifications} from 'react-native-permissions';
import FilterSection from '../screens/FilterSection/filterSection';
import {useNavigation} from '@react-navigation/native';
import VideoCall from '../components/videoCall';
import VideoCallInterface from '../screens/ChatHome/chatVideoInterface';
import ForgotPassword from '../screens/auth/forgotPassword';
import NewPassword from '../screens/auth/newPassword';
// import {configureGoogleSignIn} from '../store/Auth/socialLogin';
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
  VideoCallInterface: undefined;
  BottomTabNavigation: undefined;
  FilterSection: undefined;
  ForgotPassword: undefined;
  NewPassword: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
const Root = () => {
  const dispatch = useAppDispatch();
  const [authToken, setAuthToken] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation: any = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      SplashScreen.hide();
      requestUserPermission();
      getToken();
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
    // console.log('Sdk Token:', token);
  };
  const fetchAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token !== null) {
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }
    } catch (error) {
      console.error('Error fetching auth token:', error);
      setAuthToken(null);
    }
  };
  useEffect(() => {
    fetchAuthToken();
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState<any>('');

  // const isAuthenticated = useAppSelector(
  //     (state: any) => state?.Auth?.isAuthenticated,
  //   );

  useEffect(() => {
    setIsAuthenticated(Boolean(authToken));
  }, [authToken]);

  useEffect(() => {
    isAuthenticated?.authToken &&
      dispatch(ProfileData({userId: isAuthenticated?._id}));
    // user?.token && dispatch(getUserDetails({userId: isAuthenticated?.id}));
    return;
  }, []);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        // {!isAuthenticated?.authToken ? (
        <Stack.Group>
          <Stack.Screen
            name="BottomTabNavigation"
            component={BottomTabNavigation}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
          <Stack.Screen name="ChatScreen" component={ChatSection} />
          <Stack.Screen name="FilterSection" component={FilterSection} />
          <Stack.Screen
            name="VideoCallRedirect"
            component={VideoCallRedirect}
          />
          <Stack.Screen
            name="VideoCallInterface"
            component={VideoCallInterface}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Loginhome" component={LoginHomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="NewPassword" component={NewPassword} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default Root;
