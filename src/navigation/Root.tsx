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
import ForgotPassword from '../screens/auth/forgotPassword';
import NewPassword from '../screens/auth/newPassword';
import Subscriptions from '../screens/Profile/SubscriptionComponent/SubscriptionsScreen';
import exploreHome from '../screens/Explore/ExploreHome/exploreHome';
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
import {EventRegister} from 'react-native-event-listeners';
import {useDispatch} from 'react-redux';
import MyIncomingCallUI from '../screens/ChatHome/myIncomingCallUI';
import {PermissionsAndroid, Platform, SafeAreaView, View} from 'react-native';
import filterSection from '../screens/FilterSection/filterSection';
import NotificationScreen from '../screens/Notification/notification';
import userProfile from '../screens/UserProfile/userProfile';
import ResetPassword from '../screens/ResetPassword/resetPassword';
import {useNavigation} from '@react-navigation/native';
import {io} from 'socket.io-client';

const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');

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
  const navigation = useNavigation<any>();
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
    // const timeoutId = setTimeout(() => {

    requestUserPermission();
    // }, 1000);
  }, []);

  useEffect(() => {
    const eventListener: any = EventRegister.addEventListener('LogOut', () => {
      logoutUserButton();
    });

    return () => {
      // clearTimeout(timeoutId);
      EventRegister.removeEventListener(eventListener);
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
          await setLocalStorage('deviceToken', token);
        } else {
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // console.log('inside fetch Data');
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
          const userMain = {
            id: userdata.id,
            name: userdata.name,
            image: userdata.image.split(',')[0],
          };

          const myClient = StreamVideoClient.getOrCreateInstance({
            apiKey,
            user: userMain,
            tokenProvider: token,
          });
          console.log('myClient', !!myClient);
          setClient(myClient);
        } catch (error) {
          console.error('Error connecting to Stream Video Client:', error);
        }
      }
    };

    // Only proceed if userdata is available
    if (userdata?.id) {
      fetchData();

      return () => {
        // Cleanup: disconnect the client when the component unmounts or userdata changes
        if (client) {
          // console.log('return client disconnect');
          client.disconnectUser();
          setClient(null);
        }
      };
    }
  }, [userdata]); // Ensure 'client' is included in the dependency array

  const logoutUserButton = async () => {
    const userId = await getUserId();
    try {
      dispatch(
        updateProfileData({
          field: 'authToken',
          value: '',
          id: userId,
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
      socket.on('disconnect', () => {
        console.log('App Disconnected from server');
      });
      socket.emit('user_connected', userId);
      socket.emit('user_disconnected', userId); // Notify the server if necessary
      socket.disconnect();
      await authTokenRemove();
      dispatch(setModal());
      dispatch(updateAuthentication());
      await StreamVideoRN.onPushLogout();
    } catch (error) {
      console.error('errorLogoutUserButton', error);
    }
  };

  const authTokenRemove = async () => {
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
      const filteredIncomingCalls = calls.filter(
        call =>
          !call.isCreatedByMe &&
          call.state.callingState === CallingState.RINGING,
      );
      if (!!filteredIncomingCalls) {
        if (filteredIncomingCalls.length > 0) {
          setIncomingCall(filteredIncomingCalls[0]);
          setCurrentScreen('Calling');
        } else {
          setIncomingCall(null);
          setCurrentScreen('Home');
        }
      }
    }, [calls]);

    const endCall = () => {
      // console.log('call ended');
      setCurrentScreen('Home');
    };

    if (currentScreen === 'Calling' && !!incomingCall) {
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
            name="filterSection"
            component={filterSection}
          />
          <AfterLoginStack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
          />
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
          <AfterLoginStack.Screen name="userProfile" component={userProfile} />
          <AfterLoginStack.Screen
            name="ResetPassword"
            component={ResetPassword}
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
