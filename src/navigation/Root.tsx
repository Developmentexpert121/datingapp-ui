// In App.js in a new project

import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import { useAppDispatch, useAppSelector } from "../redux/store";
// import { IPropertyData } from "../redux/reducer/types/propertiesTypes";

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
// import PushNotification from "react-native-push-notification";
// import { setNotificationChannelId } from "../redux/reducer/auth";
import LoginHomeScreen from '../screens/LoginHome/loginHomeScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import LoginScreen from '../screens/Login/loginScreen';
import RegisterScreen from '../screens/Registration/registrationScreen';
import HomeScreen from '../screens/Home/homeScreen';
import LikedScreen from '../components/Dashboard/liked/liked';
import ExploredScreen from '../components/Dashboard/explored/explored';
import ProfileScreen from '../screens/Profile/profileScreen';
import ChatSection from '../components/Chat/allChats';
import VideoCallRedirect from '../components/Chat/chatVideoRedirect';
import SettingsScreen from '../components/settingsSection/settings';
import UpdateProfileScreen from '../components/updateProfile/updateProfile';
import {useAppDispatch, useAppSelector} from '../store/store';
import SplashScreenn from 'react-native-splash-screen';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileData  from '../store/Auth/auth';
// import { ITicketProps } from "../redux/reducer/types/authTypes";
// import { getAllNotifications, getUserDetails } from "../redux/action/authAPI";
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
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const Root = () => {
 
  // const { user, notificationChannelId } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(
    (state: any) => state?.Auth?.isAuthenticated,
  );
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      SplashScreenn.hide();
    }, 500);
  }, []);
 
  const authToken: any = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token !== null) {
        return JSON.parse(token);
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // useEffect(()=>{
  //   dispatch(ProfileData());
  // },[]) 
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated && authToken() ? (
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Liked" component={LikedScreen} />
          <Stack.Screen name="Explore" component={ExploredScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
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
