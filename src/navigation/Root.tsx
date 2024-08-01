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
import {ProfileData, getNotifications, logoutUser} from '../store/Auth/auth';
import BottomTabNavigation from './BottomTabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import ForgotPassword from '../screens/auth/forgotPassword';
import NewPassword from '../screens/auth/newPassword';
import Subscriptions from '../screens/Profile/SubscriptionComponent/Subscriptions';
import PushNotification from 'react-native-push-notification';
import exploreHome from '../screens/Explore/ExploreHome/exploreHome';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {StreamVideoRN} from '@stream-io/video-react-native-sdk';
import {Platform} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export type RootStackParamList = {
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
  Subscriptions: undefined;
  ChatPage: undefined;
  VideoCallRedirect: undefined;
  VideoCallInterface: undefined;
  BottomTabNavigation: undefined;
  FilterSection: undefined;
  ForgotPassword: undefined;
  NewPassword: any;
  exploreHome: any;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
const Root = () => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const token: string = useAppSelector((state: any) => state?.Auth?.token);
  const dispatch: any = useAppDispatch();
  const [authToken, setAuthToken] = useState<any>(null);
  const [deviceToken, setDeviceToken] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
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

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await notifee.cancelAllNotifications();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH, // Set importance to high
      });

      // Display the notification
      await notifee.displayNotification({
        title: remoteMessage?.notification?.title || 'Notification',
        body:
          remoteMessage?.notification?.body ||
          'You have received a new notification',
        android: {
          channelId,
        },
      });
    });

    return () => unsubscribe();
  }, []);

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

  const getUserId = async () => {
    try {
      const userId: any = await AsyncStorage.getItem('userId');
      return userId ? JSON.parse(userId) : null;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchAuthToken();
  }, []);

  useEffect(() => {
    setIsAuthenticated(Boolean(authToken) && Boolean(profileData));
  }, [authToken, profileData]);

  useEffect(() => {
    if (authToken) {
      dispatch(ProfileData());
    }
  }, [authToken]);

  const authTokenRemove: any = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (profileData && deviceToken) {
      const getId = async () => {
        await GoogleSignin.configure({
          webClientId:
            '151623051367-b882b5sufigjbholkehodmi9ccn4hv6m.apps.googleusercontent.com', // From Google Developer Console
          offlineAccess: true,
        });
        if (profileData.deviceToken[0] === deviceToken) {
          console.log('Called Main');
          dispatch(
            getNotifications({
              userId: profileData?._id,
              deviceToken: deviceToken,
            }),
          );
        } else {
          try {
            console.log('Called');
            // Ensure Google Sign-In is configured
            if (!GoogleSignin.hasPlayServices()) {
              console.error('Google Play Services are not available');
              return;
            }
            const isSignedIn = await GoogleSignin.isSignedIn();

            if (isSignedIn) {
              await GoogleSignin.signOut();
            }

            // dispatch(logoutUser({senderId: profileData._id}));
            await authTokenRemove();
            await StreamVideoRN.onPushLogout();
          } catch (error) {
            console.error('errorLogoutUserButton', error);
          }
        }
      };

      getId();
    }
  }, [deviceToken, profileData]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated && profileData ? (
        <Stack.Group>
          <Stack.Screen
            name="BottomTabNavigation"
            component={BottomTabNavigation}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
          <Stack.Screen name="Subscriptions" component={Subscriptions} />
          <Stack.Screen name="ChatScreen" component={ChatSection} />
          <Stack.Screen name="exploreHome" component={exploreHome} />
          <Stack.Screen
            name="VideoCallRedirect"
            component={VideoCallRedirect}
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
