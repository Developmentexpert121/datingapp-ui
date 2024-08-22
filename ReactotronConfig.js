import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({name: 'example', host: '192.168.1.11'}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

reactotron.clear();

export default reactotron;
