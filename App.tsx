import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {withIAPContext} from 'react-native-iap';
import InternetModal from './src/components/Modals/InternetModal';
import {navigationRef} from './src/utils/staticNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LocationCheckComponent from './src/components/location/location';
import {initialRouteSetter, videoCallUser} from './src/store/Activity/activity';
import {useAppDispatch} from './src/store/store';

const App = () => {
  const dispatch: any = useAppDispatch();

  useEffect(() => {
    // Foreground notification handling
    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
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

      // Handle notification press in the foreground
      // notifee.onForegroundEvent(async ({type, detail}) => {
      //   if (type === EventType.PRESS) {
      //     if (remoteMessage?.data?.screen) {
      //       if (remoteMessage.data.screen === 'VideoCallRedirect') {
      //         await dispatch(
      //           videoCallUser({user: JSON.parse(remoteMessage.data.userData)}),
      //         );
      //       }
      //       navigationRef.current?.navigate(remoteMessage.data.screen);
      //     }
      //   }
      // });
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <LocationCheckComponent />
      <NavigationContainer ref={navigationRef}>
        <Root />
        <GlobalModal />
        <InternetModal />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default withIAPContext(App);
