import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getLocalStroage} from '../../api/storage';
import {EventRegister} from 'react-native-event-listeners';
import Toast from 'react-native-simple-toast';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token !== null) {
      return JSON.parse(token);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const getDeviceToken = async () => {
  try {
    const deviceToken = await getLocalStroage('deviceToken');
    if (deviceToken !== null) {
      return deviceToken;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving device token:', error);
    return null;
  }
};

const http = axios.create({
  // baseURL: 'http://10.0.2.2:8000/api',
  baseURL: 'https://datingapp-api-9d1ff64158e0.herokuapp.com/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  async config => {
    try {
      const token = await getToken();
      const deviceToken = await getDeviceToken();
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      if (deviceToken) {
        config.headers['device-token'] = deviceToken;
      }
      return config;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return config;
    }
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  response => response,
  async error => {
    const {response} = error;
    if (response && response.status === 403) {
      // Check for specific error message
      if (response.data.message === 'Invalid device token from backend') {
        console.log('Logging out user due to 403 error', response.data.message);
        EventRegister.emit('LogOut');
      }
    }
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  response => response,
  async error => {
    const {response} = error;
    if (response && response.status === 503) {
      Toast.show('Server Error 503', Toast.LONG);
    }
    return Promise.reject(error);
  },
);

export default http;
