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
import {
  cancelLoginWithGoogle,
  ProfileData,
  setAuthData,
  setModal,
  updateAuthentication,
  updateProfileData,
  videoCallToken,
} from '../store/Auth/auth';
import BottomTabNavigation from './BottomTabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import ForgotPassword from '../screens/auth/forgotPassword';
import NewPassword from '../screens/auth/newPassword';
import Subscriptions from '../screens/Profile/SubscriptionComponent/SubscriptionsScreen';
import exploreHome from '../screens/Explore/ExploreHome/exploreHome';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamVideoRN,
  useCalls,
} from '@stream-io/video-react-native-sdk';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Loader from '../components/Loader/Loader';
import {getLocalStroage, setLocalStorage} from '../api/storage';
import io from 'socket.io-client';
import {onlineUser} from '../store/reducer/authSliceState';
import {
  activityLoaderFinished,
  activityLoaderStarted,
} from '../store/Activity/activity';
import {EventRegister} from 'react-native-event-listeners';
import {useDispatch} from 'react-redux';
import MyIncomingCallUI from '../screens/ChatHome/myIncomingCallUI';
import {PermissionsAndroid, Platform, SafeAreaView, View} from 'react-native';

const Stack = createNativeStackNavigator();

const getUserId = async () => {
  try {
    const userId: any = await AsyncStorage.getItem('userId');

    if (userId !== null) {
      return JSON.parse(userId);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const Root = () => {
  const userid: any = useAppSelector((state: any) => state?.Auth?.userID);
  const isAuthLoading = useAppSelector((state: any) => state.Auth.authLoading);
  const dispatch: any = useAppDispatch();
  const AfterLoginStack = createNativeStackNavigator();
  const BeforeLoginStack = createNativeStackNavigator();
  const Dispatch = useDispatch<any>();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const userdata: any = useAppSelector(
    (state: any) => state?.Auth?.data?.userData,
  );

  GoogleSignin.configure({
    webClientId:
      '151623051367-b882b5sufigjbholkehodmi9ccn4hv6m.apps.googleusercontent.com', // From Google Developer Console
    offlineAccess: true,
  });

  useEffect(() => {
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
    if (Platform.OS === 'android')
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    let deviceToken = await getLocalStroage('deviceToken');
    if (!deviceToken) {
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
          console.log('DeviceToken==> ', token);
          await setLocalStorage('deviceToken', token);
        } else {
          console.log('Authorization status:', authStatus);
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log('videoCallToken({id: userdata?.id}) -->', userdata?.id);
      if (!client) {
        try {
          const apiKey = '48e74nbgz5az';
          const tokenProvider = async () => {
            const token = await Dispatch(videoCallToken({id: userdata?.id}))
              .unwrap()
              .then((response: any) => response.token);
            return token;
          };

          const token = await tokenProvider();
          console.log('Stream Token', token);

          const userMain = {
            id: userdata.id,
            name: userdata.name,
            image: userdata.image,
          };

          const myClient = new StreamVideoClient({
            apiKey,
            user: userMain,
            tokenProvider: () => token,
          });
          setClient(myClient);
        } catch (error) {
          console.error('Error connecting to Stream Video Client:', error);
        }
      }
    };

    // Only proceed if userdata is available
    if (userdata) {
      fetchData();

      return () => {
        // Cleanup: disconnect the client when the component unmounts or userdata changes
        if (client) {
          console.log('Stream Logout Hit');
          client.disconnectUser();
          setClient(null);
        }
      };
    }
  }, [userdata]); // Ensure 'client' is included in the dependency array

  useEffect(() => {
    // Register the event listener
    const eventListener: any = EventRegister.addEventListener('LogOut', () => {
      console.log('user Logout Hit');
      logoutUserButton();
    });

    // Clean up the event listener on component unmount
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  const logoutUserButton = async () => {
    try {
      dispatch(
        updateProfileData({
          field: 'authToken',
          value: '',
          id: getUserId(),
        }),
      );
      dispatch(cancelLoginWithGoogle());

      if (!GoogleSignin.hasPlayServices()) {
        console.error('Google Play Services are not available');
        return;
      }
      const isSignedIn = await GoogleSignin.isSignedIn();

      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
      await authTokenRemove();
      dispatch(setModal());
      dispatch(updateAuthentication());

      await StreamVideoRN.onPushLogout();
    } catch (error) {
      console.error('errorLogoutUserButton', error);
    }
  };

  const authTokenRemove: any = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('profileData');
    } catch (error) {
      return null;
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

  const IncomingCallHandler = () => {
    const calls = useCalls();

    const [incomingCall, setIncomingCall] = useState<Call | null>(null);
    const [currentScreen, setCurrentScreen] = useState('Home');

    useEffect(() => {
      const incomingCalls = calls.filter(
        call =>
          !call.isCreatedByMe &&
          call.state.callingState === CallingState.RINGING,
      );
      if (incomingCalls) {
        setIncomingCall(incomingCalls[0] || null);
        setCurrentScreen('Calling');
      } else {
        setIncomingCall(null);
      }
    }, [calls]);
    console.log('Incoming call ==>', !!incomingCall);
    if (currentScreen != 'Home' && incomingCall) {
      const endCall = () => {
        setCurrentScreen('Home');
      };
      return (
        <SafeAreaView style={{flex: 1}}>
          <StreamCall call={incomingCall}>
            <MyIncomingCallUI call={incomingCall} callEnded={endCall} />
          </StreamCall>
        </SafeAreaView>
      );
    } else {
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
    }
  };

  const AfterLogin = () => {
    if (!client) {
      return <Loader />;
    }

    return (
      <StreamVideo client={client}>
        <IncomingCallHandler />
      </StreamVideo>
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
