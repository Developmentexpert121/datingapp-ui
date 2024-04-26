import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Platform, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppSelector, useAppDispatch} from './src/store/store';
import LoadingSpinner from './src/services/spinner/spinner';
import messaging from '@react-native-firebase/messaging';
import {requestNotifications} from 'react-native-permissions';
import SplashScreen from 'react-native-splash-screen';
import ProfileData from './src/store/Auth/auth';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';

const App = () => {
  // const dispatch = useAppDispatch();
  // const [authToken, setAuthToken] = useState(null);
  // const [loading, setLoading] = useState<boolean>(true);

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
  // const getToken = async () => {
  //   const token = await messaging().getToken();
  //   console.log('Token:', token);
  // };

  const isLoading = useAppSelector(
    (state: any) => state.ActivityLoader.loading,
  );
  // const isDarkMode = useColorScheme() === 'dark';

  // const isAuthenticated = useAppSelector(
  //   (state: any) => state?.Auth?.isAuthenticated,
  // );
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (Platform.OS === 'android') {
  //       SplashScreen.hide();
  //     }
  //     requestUserPermission();
  //     getToken();
  //   }, 2000);
  //   return () => clearTimeout(timeout); // Cleanup function to clear the timeout
  // }, []);
  // useEffect(() => {
  //   const fetchAuthToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('authToken');
  //       if (token !== null) {
  //         setAuthToken(JSON.parse(token));
  //       }
  //     } catch (error) {
  //       console.error('Error fetching auth token:', error);
  //     }
  //   };

  //   fetchAuthToken();
  // }, []);

  // const getTokenAuth = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('authToken');
  //     if (token === '') {
  //       return null;
  //     } else if (token !== null) {
  //       return JSON.parse(token);
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     return null;
  //   }
  // };

  // const tokensss = getTokenAuth();

  // useEffect(() => {
  //   isAuthenticated && dispatch(ProfileData());
  // }, []);

  // if (loading) return null;
  return (
    <SafeAreaProvider>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <NavigationContainer>
          {/* {tokensss === null || isAuthenticated ? (
            // <MainNavigator />
            <BottomTabNavigation />
          ) : (
            <AuthNavigator />
          )} */}
          <Root />
          <GlobalModal />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
};

export default App;

// import {View, Text} from 'react-native';
// import React from 'react';
// import SecondStepScreen from './src/screens/auth/Registration/secondStepScreen';

// const App = () => {
//   return (
//     <View>
//       <SecondStepScreen />
//     </View>
//   );
// };

// export default App;
