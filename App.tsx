import React, {Fragment, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {withIAPContext} from 'react-native-iap';
import InternetModal from './src/components/Modals/InternetModal';
import {navigationRef} from './src/utils/staticNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';

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

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
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
