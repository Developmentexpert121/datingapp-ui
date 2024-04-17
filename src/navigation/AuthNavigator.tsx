// navigation/AuthNavigator.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import LoginScreen from '../screens/Login/loginScreen';
import LoginHomeScreen from '../screens/LoginHome/loginHomeScreen';
import RegisterScreen from '../screens/Registration/registrationScreen';
import {RootStackParamList} from '../types';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
const Stack = createStackNavigator<RootStackParamList>();
enableScreens();
const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="Loginhome"
    screenOptions={{
      headerShown: false,
      cardStyle: {backgroundColor: '#FFFFFF'},
    }}>
    <Stack.Screen name="Loginhome" component={LoginHomeScreen} />
    <Stack.Screen name="OtpScreen" component={OtpScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
