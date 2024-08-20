import React, {Fragment, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
import store, {
  RootState,
  useAppDispatch,
  useAppSelector,
} from './src/store/store';
import messaging from '@react-native-firebase/messaging';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';
import notifee, {AndroidImportance} from '@notifee/react-native';

import Loader from './src/components/Loader/Loader';
import io from 'socket.io-client';
import {requestNotifications} from 'react-native-permissions';
import {onlineUser} from './src/store/reducer/authSliceState';
import {withIAPContext} from 'react-native-iap';
import InternetModal from './src/components/Modals/InternetModal';
// import PushController from './src/screens/Notification/PushController';
import {navigationRef} from './src/utils/staticNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileData, videoCallToken} from './src/store/Auth/auth';
import {
  activityLoaderFinished,
  activityLoaderStarted,
  clientData,
} from './src/store/Activity/activity';
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCalls,
} from '@stream-io/video-react-native-sdk';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import MyIncomingCallUI from './src/screens/ChatHome/myIncomingCallUI';
import {PermissionsAndroid, Platform} from 'react-native';

const App = () => {
  // const calls = useCalls();

  // const incomingCalls = calls.filter(
  //   call =>
  //     call.isCreatedByMe === false &&
  //     call.state.callingState === CallingState.RINGING,
  // );

  // const [incomingCall] = incomingCalls;
  // if (incomingCall) {
  //   return (
  //     <StreamCall call={incomingCall}>
  //       <MyIncomingCallUI call={incomingCall} />
  //     </StreamCall>
  //   );
  // }
  useEffect(() => {
    if (Platform.OS === 'android')
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const token = await messaging().getToken();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
      }
    }

    requestUserPermission();
  }, []);

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

  // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Root />
        <GlobalModal />
        <InternetModal />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default withIAPContext(App);
