import {Platform} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ChatIC,
  ChatpressIC,
  FindIC,
  FindpressIc,
  FireIC,
  FirepressIC,
  LoveIC,
  LovepressIC,
  ProfileIC,
  ProfilepressIC,
} from '../assets/svgs';
import ExploredScreen from '../screens/Explore/explored';
import LikedScreen from '../screens/LikedYou/liked';
import ChatSection from '../screens/ChatHome/allChats';
import FilterSection from '../screens/FilterSection/filterSection';
import ProfileSection from '../screens/Profile/profileSection';
import HomeScreen from '../screens/Home/home';

export type HomeStackParamList = {
  HomeScreen: undefined;
  FilterSection: undefined;
};
export type ChatStackParamList = {
  ChatSection: undefined;
  VideoCallRedirect: undefined;
};
export type BottomTabParamList = {
  Home: undefined;
  ExploredScreen: undefined;
  LikedScreen: undefined;
  ChatSection: undefined;
  HomeScreen: undefined;
  VideoCallRedirect: undefined;
  ProfileSection: undefined;
};
const Tab = createBottomTabNavigator<BottomTabParamList>();
const HStack = createNativeStackNavigator<HomeStackParamList>();
const NStack = createNativeStackNavigator<ChatStackParamList>();
const HomeStack = () => {
  return (
    <HStack.Navigator screenOptions={{headerShown: false}}>
      <HStack.Screen name="HomeScreen" component={HomeScreen} />
      <HStack.Screen name="FilterSection" component={FilterSection} />
    </HStack.Navigator>
  );
};
const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS === 'android',
        tabBarStyle: {
          height: 90,
          borderTopWidth: 2,
          borderTopColor: '#AC25AC',
        },
        tabBarIconStyle: {marginTop: 30},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? <FirepressIC /> : <FireIC />,
          title: '',
        }}
      />
      <Tab.Screen
        name="ExploredScreen"
        component={ExploredScreen}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? <FindpressIc /> : <FindIC />,
          title: '',
        }}
      />
      <Tab.Screen
        name="LikedScreen"
        component={LikedScreen}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? <LovepressIC /> : <LoveIC />,
          title: '',
        }}
      />
      <Tab.Screen
        name="ChatSection"
        component={ChatSection}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? <ChatpressIC /> : <ChatIC />,
          title: '',
        }}
      />
      <Tab.Screen
        name="ProfileSection"
        component={ProfileSection}
        options={{
          tabBarIcon: ({focused, color, size}) =>
            focused ? <ProfilepressIC /> : <ProfileIC />,
          title: '',
        }}
      />
    </Tab.Navigator>
  );
};
export default BottomTabNavigation;
