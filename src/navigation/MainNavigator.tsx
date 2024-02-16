// navigation/MainNavigator.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import HomeScreen from '../screens/Home/homeScreen';
import ChatSection from '../components/Chat/chatSection';
import {RootStackParamList} from '../types';
import LikedScreen from '../components/Dashboard/liked/liked';
import NotificationScreen from '../components/Dashboard/Notification/notification';
import FilterScreen from '../components/Dashboard/FilterSection/filterSection';
import ExploredScreen from '../components/Dashboard/explored/explored';
import ProfileScreen from '../components/Profile/profileSection';
import SettingsScreen from '../components/settingsSection/settings';
import UpdateProfileScreen from '../components/updateProfile/updateProfile';
import ChatPage from '../components/Chat/chatPage';

const Stack = createStackNavigator<RootStackParamList>();
enableScreens();
const MainNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      cardStyle: {backgroundColor: '#FFFFFF'},
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Liked" component={LikedScreen} />
    <Stack.Screen name="Notification" component={NotificationScreen} />
    <Stack.Screen name="Filter" component={FilterScreen} />
    <Stack.Screen name="Explore" component={ExploredScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
    <Stack.Screen name="ChatScreen" component={ChatSection} />
    <Stack.Screen name="ChatPage" component={ChatPage} />
  </Stack.Navigator>
);

export default MainNavigator;
