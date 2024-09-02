import {Alert, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import store from './src/store/store';
import {Provider} from 'react-redux';
import {Settings} from 'react-native-fbsdk-next';
import {setPushConfig} from './src/utils/setPushConfig';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import {EventRegister} from 'react-native-event-listeners';

Settings.initializeSDK();
if (__DEV__) {
  require('./ReactotronConfig');
}
setPushConfig();

// const Root = () => {ååå
  

//   useEffect(() => {
//     // Register the event listener
//     const eventListener = EventRegister.addEventListener('test', () => {
//       console.log("hiiiiiloooo  gal bann gayi");
//     });

//     // Clean up the event listener on component unmount
//     return () => {
//       EventRegister.removeEventListener(eventListener);
//     };
//   }, []);
  
  
//   return(
//     <App />
// )};


AppRegistry.registerComponent(appName, () => App);



