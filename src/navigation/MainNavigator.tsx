// navigation/MainNavigator.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import HomeScreen from '../screens/Home/homeScreen';
import ChatSection from '../screens/ChatHome/allChats';
import {RootStackParamList} from '../types';
import LikedScreen from '../screens/LikedYou/liked';
import NotificationScreen from '../screens/Notification/notification';
import FilterScreen from '../screens/FilterSection/filterSection';
import ExploredScreen from '../screens/Explore/explored';
import ProfileScreen from '../screens/Profile/profileSection';
import SettingsScreen from '../screens/SettingsSection/settings';
import UpdateProfileScreen from '../screens/UpdateProfile/updateProfile';
import VideoCallRedirect from '../screens/ChatHome/chatVideoRedirect';

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
    <Stack.Screen name="Explore" component={ExploredScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
    <Stack.Screen name="ChatScreen" component={ChatSection} />
    <Stack.Screen name="VideoCallRedirect" component={VideoCallRedirect} />
  </Stack.Navigator>
);

export default MainNavigator;
