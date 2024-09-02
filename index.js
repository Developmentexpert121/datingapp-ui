import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Settings} from 'react-native-fbsdk-next';
import {setPushConfig} from './src/utils/setPushConfig';


Settings.initializeSDK();
if (__DEV__) {
  require('./ReactotronConfig');
}
setPushConfig();

AppRegistry.registerComponent(appName, () => App);



