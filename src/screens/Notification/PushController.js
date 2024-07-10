import React, {Component} from 'react';
import PushNotification from 'react-native-push-notification';
// var PushNotification = require("react-native-push-notification");
export default class PushController extends Component {
  componentDidMount() {
    PushNotification.configure(
      {
        // (optional) Called when Token is generated (iOS and Android)
        popInitialNotification: notification => {
          return notification.priority === 'high'; // Only show high priority notifications
        },
        onRegister: function (token) {
          // console.log('TOKEN:', token);
        },

        // (required) Called when a remote or local notification is opened or received
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
          // process the notification here
          // required on iOS only
          // notification.finish(PushNotificationIOS.FetchResult.NoData);
          PushNotification.localNotification({
            channelId: notification?.channelId,
            title: notification?.title,
            message: notification?.message,
          });
          // notification.finish(PushNotification.FetchResult.NoData);
        },
        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: function (notification) {
          console.log('ACTION:', notification.action);
          console.log('NOTIFICATION:', notification);
          // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function (err) {
          console.error(err.message, err);
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        // popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
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
