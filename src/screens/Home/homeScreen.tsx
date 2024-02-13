import { View, Text, SafeAreaView } from 'react-native'
import React, {useEffect} from 'react'
// import HomeComponent from "../../components/Dashboard/drawer/drawer"
import HomeComponent from "../../components/Dashboard/home/home"
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = () => {
  useEffect(()=>{
    const fetchToken = async() => {
      try {
        const value = await AsyncStorage.getItem('authToken');
        if (value !== null) {
          console.log(`Item  retrieved: ${value}`);
          return value;
        } else {
          console.log(`No item found with key`);
          return null;
        }
      } catch (error) {
        console.error('Error getting item from AsyncStorage:', error);
      }
    }
    fetchToken();
  },[]);
  return (
      <HomeComponent />
  )
}

export default HomeScreen