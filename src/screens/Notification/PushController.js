import React, {Component} from 'react';
import {Platform, Alert} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export default class PushController extends Component {
  componentDidMount() {
    // Request permission for iOS notifications
    if (Platform.OS === 'ios') {
      PushNotificationIOS.requestPermissions().then(
        data => {
          console.log('PushNotificationIOS.requestPermissions........', data);
        },
        data => {
          console.log('PushNotificationIOS.requestPermissions failed', data);
        },
      );
    }

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // Process the notification
        // if (notification.foreground) {
        //   // Show an alert or a local notification when a notification is received in foreground
        //   PushNotification.localNotification({
        //     channelId:
        //       notification?.channelId || 'fcm_fallback_notification_channel',
        //     title: notification?.title || 'Notification',
        //     message:
        //       notification?.message || 'You have received a new notification',
        //   });
        // }

        // Required on iOS only (see issue #236)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when the user fails to register for remote notifications.
      onRegistrationError: function (err) {
        console.error('Registration Error:', err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    if (Platform.OS === 'android') {
      this.requestAndroidNotificationPermission();
    }

    this.createNotificationChannels();
  }

  requestAndroidNotificationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'App needs access to notifications',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.warn('Notification permission denied_____');
    }
  };

  createNotificationChannels = () => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'fcm_fallback_notification_channel',
          channelName: 'Default Channel',
          channelDescription: 'A default channel',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        created => console.log(`createChannel returned '${created}'`),
      );
    }
  };

  render() {
    return null;
  }
}
