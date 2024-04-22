import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {Platform, useColorScheme} from 'react-native';

import {useSelector , useDispatch} from 'react-redux';
import {AuthNavigator, MainNavigator} from './src/navigation/index';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppSelector, useAppDispatch} from './src/store/store';
import LoadingSpinner from './src/services/spinner/spinner';
import SplashScreenn from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import {requestNotifications} from 'react-native-permissions';
import SplashScreen from 'react-native-splash-screen';
import ProfileData  from './src/store/Auth/auth';
import Root from './src/navigation/Root';

const App = () => {
  const dispatch = useAppDispatch();
  // const [loading, setLoading] = useState<boolean>(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //     SplashScreen.hide();
  //   }, 2000);
  // }, []);
  async function requestUserPermission() {
    await requestNotifications(['alert', 'sound']);
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('Token:', token);
  };

  const isLoading = useAppSelector(
    (state: any) => state.ActivityLoader.loading,
  );
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const isAuthenticated = useAppSelector(
    (state: any) => state?.Auth?.isAuthenticated,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (Platform.OS === 'android') {
        SplashScreen.hide();
      }
      requestUserPermission();
      getToken();
    }, 2000);
    return () => clearTimeout(timeout); // Cleanup function to clear the timeout
  }, []);

  

  const authToken: any = async () => {
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

  // useEffect(()=>{
  //     dispatch(ProfileData());
  //   },[]) 

  // if (loading) return null;
  return (
    <SafeAreaProvider>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <NavigationContainer>
          {isAuthenticated && authToken() ? (
            <MainNavigator />
          ) : (
            <AuthNavigator />
          )}
          {/* <Root/> */}
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
};

export default App;
