import {Alert, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import store from './src/store/store';
import {Provider} from 'react-redux';
import {Settings} from 'react-native-fbsdk-next';
import {setPushConfig} from './src/utils/setPushConfig';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

Settings.initializeSDK();
if (__DEV__) {
  require('./ReactotronConfig');
}

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);


setPushConfig();

// messaging().onNotificationOpenedApp((message)=>{
//   console.log('Messagee' , message)
// })





// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log('Message handled in the background!', remoteMessage);
//   console.log('Message handled in the background!', remoteMessage?.data?.type.includes('call'));


//   if (remoteMessage?.data?.type.includes('call')) {
//     setPushConfig();
//     console.log('type =>' ,remoteMessage?.data?.type )
//   }


  // // Handle notification data when app is in background
  // if (remoteMessage?.data?.screen) {
  //   if (remoteMessage.data.screen === 'VideoCallRedirect') {
  //     // await dispatch(
  //     //   videoCallUser({user: JSON.parse(remoteMessage.data.userData)}),
  //     // );
  //   }
  //   // navigationRef.current?.navigate(remoteMessage.data.screen);
  // }else{
  //   console.log('background Notification')
  //   // setPushConfig();
  // }
//   console.log('background Notification')
// });


AppRegistry.registerComponent(appName, () => Root);

// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   console.log('Background api hit')
// });






  // Background notification handling
    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //   console.log('Message handled in the background!', remoteMessage);

    //   // Handle notification data when app is in background
    //   if (remoteMessage?.data?.screen) {
    //     if (remoteMessage.data.screen === 'VideoCallRedirect') {
    //       // await dispatch(
    //       //   videoCallUser({user: JSON.parse(remoteMessage.data.userData)}),
    //       // );
    //     }
    //     // navigationRef.current?.navigate(remoteMessage.data.screen);
    //   }else{
    //     console.log('background Notification')
    //     // setPushConfig();
    //   }
    //   console.log('background Notification')
    // });
  

    // Handle notification when app is opened from a killed state
    // messaging()
    //   .getInitialNotification()
    //   .then(async (remoteMessage) => {
    //     if (remoteMessage) {
    //       console.log('App opened from a killed state!', remoteMessage);

    //       // if (remoteMessage?.data?.screen) {
    //       //   await dispatch(initialRouteSetter(remoteMessage.data.screen));
    //       //   if (remoteMessage.data.screen === 'VideoCallRedirect') {
    //       //     await dispatch(
    //       //       videoCallUser({user: JSON.parse(remoteMessage.data.userData)}),
    //       //     );
    //         // }
    //       }else{
    //         console.log('kill state notification')
    //         setPushConfig();
    //       }
    //     // }
    //   });




