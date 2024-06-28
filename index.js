/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import store, {useAppSelector} from './src/store/store';
import {Provider} from 'react-redux';
import {Settings} from 'react-native-fbsdk-next';
Settings.initializeSDK();
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
