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
import {ProfileData, getNotifications} from '../store/Auth/auth';
import BottomTabNavigation from './BottomTabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import FilterSection from '../screens/FilterSection/filterSection';
import ForgotPassword from '../screens/auth/forgotPassword';
import NewPassword from '../screens/auth/newPassword';
import Subscriptions from '../screens/Profile/SubscriptionComponent/Subscriptions';
// import PushNotification from 'react-native-push-notification';
import exploreHome from '../screens/Explore/ExploreHome/exploreHome';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {Platform} from 'react-native';

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
  console.log('deviceToken', deviceToken);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      SplashScreen.hide();
      requestUserPermission();
      unsubscribe();
    }, 1000);

    return unsubscribe;
  }, []);

  async function requestUserPermission() {
    await notifee.requestPermission();
  }

  const unsubscribe = messaging().onMessage(async remoteMessage => {
    const channelId = await notifee.createChannel({
      id: 'fcm_fallback_notification_channel',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
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

  //Testingß
  // Display a notification
  const displayNotification = async () => {
    // Create a notification channel (required for Android)
    console.log('Notification ===========+>');
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display the notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
      },
    });
  };

  // const requestUserPermission = async () => {
  //   try {
  //     const authStatus = await messaging().requestPermission({
  //       sound: true,
  //       alert: true,
  //       badge: true,
  //     });
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //     if (enabled) {
  //       const token = await messaging().getToken();
  //       setDeviceToken(token);
  //     } else {
  //       console.log('Authorization status:', authStatus);
  //     }
  //   } catch (error) {
  //     console.error('Error requesting permission:', error);
  //   }
  // };

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

  useEffect(() => {
    const getId = async () => {
      const userId = await getUserId();
      dispatch(
        getNotifications({
          userId: profileData?._id,
          deviceToken: deviceToken,
        }),
      );
    };
    getId();
  }, [deviceToken]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated && profileData?._id ? (
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
