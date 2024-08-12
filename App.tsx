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

const App = () => {
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
