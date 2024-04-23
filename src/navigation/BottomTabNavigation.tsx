import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ChatIC, FindIC, FireIC, LoveIC, ProfileIC} from '../assets/svgs';
// import { IPropertyData } from "../redux/reducer/types/propertiesTypes";
// import { INewsProps } from "../redux/reducer/types/newsTypes";
// import { ITicketProps } from "../redux/reducer/types/authTypes";

export type HomeStackParamList = {
  // HomeScreen: undefined;
  // Properties: undefined;
  // PropertiesOverview: { propertyId: string; screen?: string | undefined };
  // InvestmentHistory: undefined;
  // Notifications: undefined;
  // Support: undefined;
  // SupportHistory: undefined;
  // SupportDetails: ITicketProps;
};
export type ProfileStackParamList = {
  ProfileScreen: undefined;
  ChangePassword: undefined;
  EditProfile: undefined;
};
export type ReferralStackParamList = {
  ReferralScreen: undefined;
  RefarralList: undefined;
};
export type NewsStackParamList = {
  // NewsScreen: undefined;
  // NewsDetails: { item: INewsProps };
};
export type BottomTabParamList = {
  Home: undefined;
  Deposit: undefined;
  Referral: undefined;
  News: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<ProfileStackParamList>();
const HStack = createNativeStackNavigator<HomeStackParamList>();
const ReferStack = createNativeStackNavigator<ReferralStackParamList>();
const NStack = createNativeStackNavigator<NewsStackParamList>();
const HomeStack = () => {
  return (
    <HStack.Navigator screenOptions={{headerShown: false}}>
      <HStack.Screen name="HomeScreen" component={Home} />
      <HStack.Screen name="Properties" component={Properties} />
      <HStack.Screen name="PropertiesOverview" component={PropertiesOverview} />
      <HStack.Screen name="InvestmentHistory" component={InvestmentHistory} />
    </HStack.Navigator>
  );
};
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
    </Stack.Navigator>
  );
};
const ReferralStack = () => {
  return (
    <ReferStack.Navigator screenOptions={{headerShown: false}}>
      <ReferStack.Screen name="ReferralScreen" component={Referral} />
      <ReferStack.Screen name="RefarralList" component={ReferralList} />
    </ReferStack.Navigator>
  );
};
const NewsStack = () => {
  return (
    <NStack.Navigator screenOptions={{headerShown: false}}>
      <NStack.Screen name="NewsScreen" component={News} />
      <NStack.Screen name="NewsDetails" component={NewsDetail} />
    </NStack.Navigator>
  );
};
const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0182FC',
        tabBarInactiveTintColor: '#7D848D',
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS === 'android',
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
        },
        tabBarLabelStyle: {marginBottom: 8},
        tabBarIconStyle: {marginTop: 8},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            return <FireIC color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={Deposit}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            return <FindIC color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Referral"
        component={ReferralStack}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            return <LoveIC color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsStack}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            return <ChatIC color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            return <ProfileIC color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({});
