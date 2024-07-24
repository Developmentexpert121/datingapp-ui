/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import store, {useAppSelector} from './src/store/store';
import {Provider} from 'react-redux';
import {Settings} from 'react-native-fbsdk-next';
import {setPushConfig} from './src/utils/setPushConfig';
Settings.initializeSDK();

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
setPushConfig();
AppRegistry.registerComponent(appName, () => Root);

// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';
// import {LogBox} from 'react-native';
// import {Settings} from 'react-native-fbsdk-next';

// Settings.initializeSDK();
// LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

// AppRegistry.registerComponent(appName, () => App);
