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
import {videoCallUser} from './src/store/Activity/activity';
import {useAppDispatch} from './src/store/store';

const App = () => {
  const dispatch: any = useAppDispatch();
  useEffect(() => {
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

      // Navigate to the screen based on the data payload
      notifee.onForegroundEvent(async ({type, detail}) => {
        if (type === EventType.PRESS) {
          console.log('User tapped the notification in the foreground');

          // Navigate based on notification data when tapped
          if (remoteMessage?.data?.screen) {
            if (remoteMessage.data.screen === 'VideoCallRedirect') {
              await dispatch(
                videoCallUser({user: JSON.parse(remoteMessage.data.userData)}),
              );
            }
            navigationRef.current?.navigate(remoteMessage.data.screen);
          }
        }
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
