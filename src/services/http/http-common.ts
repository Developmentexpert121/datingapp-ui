import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

const http = axios.create({
  baseURL: 'http://10.0.2.2:8000/api',
  // baseURL: 'https://datingapp-api.onrender.com/api',
  // baseURL: 'https://datingapp-api-9d1ff64158e0.herokuapp.com/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  async config => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  },
);

export default http;
