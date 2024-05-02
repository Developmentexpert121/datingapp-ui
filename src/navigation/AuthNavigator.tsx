// navigation/AuthNavigator.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/auth/loginScreen';
import LoginHomeScreen from '../screens/auth/loginHomeScreen';
import RegisterScreen from '../screens/auth/registrationScreen';
import {RootStackParamList} from '../types';
const Stack = createStackNavigator<RootStackParamList>();
// enableScreens();
const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {backgroundColor: '#FFFFFF'},
    }}>
    <Stack.Screen name="Loginhome" component={LoginHomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
