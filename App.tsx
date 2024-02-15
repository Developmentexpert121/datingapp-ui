import React, { useEffect } from 'react';
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
import {useAppSelector} from './src/store/store';
import LoadingSpinner from './src/services/spinner/spinner';
import SplashScreen from 'react-native-splash-screen';
const App = () => {
  const isLoading = useAppSelector(
    (state: any) => state.ActivityLoader.loading,
  );
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const isAuthenticated = useSelector(
    (state: any) => state?.Auth?.isAuthenticated,
  );
  console.log('isAuthenticated======================', isAuthenticated);

  useEffect(()=>{
   if(Platform.OS==='android'){
    SplashScreen.hide();
   }
  }, [])
  const authToken: any = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token !== null) {
        console.log('authToken ', token);
        return JSON.parse(token);
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

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
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
};

export default App;
