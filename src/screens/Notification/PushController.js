import React, {Component} from 'react';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
export default class PushController extends Component {
  componentDidMount() {
    PushNotification.configure(
      {
        popInitialNotification: notification => {
          return notification.priority === 'high';
        },
        onRegister: function (token) {},
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
          PushNotification.localNotification({
            channelId: notification?.channelId,
            title: notification?.title,
            message: notification?.message,
          });
        },
        onAction: function (notification) {
          console.log('ACTION:', notification.action);
          console.log('NOTIFICATION::::::', notification);
          // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function (err) {
          console.error('error.', err.message, err);
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
      async callback => {
        // Request permissions if not already granted (optional)
        console.log(Platform.OS);
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.NOTIFICATION_ACCESS,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Notification permission denied');
          }
        } else {
          // Request iOS notification permissions here using UNUserNotificationCenter APIs
        }

        // Any other logic that relies on successful configuration can go here
        callback && callback(); // Call the callback if provided
      },
    );
    this.createNotificationChannels();
  }
  createNotificationChannels = () => {
    // Create a default channel
    PushNotification.createChannel(
      {
        channelId: 'fcm_fallback_notification_channel', // (required)
        channelName: 'fcm_fallback_notification_channel', // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        soundName: 'default', // (optional) See soundName parameter of localNotification function
        importance: 4, // (optional) default: 4. Int value of the importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      // created => console.log(`createChannelreturned...'${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };
  render() {
    return null;
  }
}
