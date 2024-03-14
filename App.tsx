import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import {Provider} from 'react-redux';

import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import {AuthNavigator, MainNavigator} from './src/navigation/index';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from './src/store/store';
import LoadingSpinner from './src/services/spinner/spinner';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import {requestNotifications} from 'react-native-permissions';
import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import {videoCallToken} from './src/store/Auth/auth';

const App = () => {
  const dispatch: any = useAppDispatch();

  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const user: any = useAppSelector((state: any) => state?.ActivityLoader?.user);

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

  const isAuthenticated = useSelector(
    (state: any) => state?.Auth?.isAuthenticated,
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
    requestUserPermission();
    getToken();
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

  const [client, setClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const apiKey = 'tgmn64zvvytf';
    const tokenProvider = async () => {
      const token = await dispatch(videoCallToken({id: profileData?._id}))
        .unwrap()
        .then((response: any) => response.token);
      return token;
    };

    const userMain = {
      id: profileData?._id,
      name: profileData?.name,
      image: profileData?.profilePic,
    };

    const client = new StreamVideoClient({
      apiKey,
      user: userMain,
      tokenProvider,
    });
    setClient(client);

    return () => {
      client?.disconnectUser();
      setClient(undefined);
    };
  }, [profileData]);

  return (
    <SafeAreaProvider>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <NavigationContainer>
          {isAuthenticated && authToken() && client ? (
            <StreamVideo client={client}>
              <MainNavigator />
            </StreamVideo>
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
};

export default App;
