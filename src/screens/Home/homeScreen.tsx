import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
// import HomeComponent from "../../components/Dashboard/drawer/drawer"
import HomeComponent from './home';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = () => {
  // useEffect(() => {
  //   const fetchToken = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('authToken');
  //       if (value !== null) {
  //         return value;
  //       } else {
  //         return null;
  //       }
  //     } catch (error) {
  //       console.error('Error getting item from AsyncStorage:', error);
  //     }
  //   };
  //   fetchToken();
  // }, []);
  return (
    <View style={{flex: 1}}>
      <HomeComponent />
    </View>
  );
};

export default HomeScreen;
