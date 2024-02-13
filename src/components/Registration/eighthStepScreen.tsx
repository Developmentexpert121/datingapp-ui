import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const EighthStepScreen = () => {
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<any>(null);

//   useEffect(() => {
//     // Request location permission on component mount
//     Geolocation.requestAuthorization();
//   }, []);

//   const getLocation = async () => {
//     try {
//       const granted:any = Geolocation.requestAuthorization();
//       if (granted === 'granted') {
//         Geolocation.getCurrentPosition(
//           position => {
//             const { latitude, longitude } = position.coords;
//             setLocation({ latitude, longitude });
//           },
//           err => setError(err.message),
//           { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//       } else {
//         setError('Location permission denied');
//       }
//     } catch (error) {
//       console.error('Error requesting location permission:', error);
//     }
//   };
  

// useEffect(() => {
//     Geolocation.requestAuthorization();
//   }, []);



  return (
    
    <View style={styles.container}>
        <Text style={styles.title}>So, are you from around here? </Text>
        <Text style={styles.para}>Set your location to see who's in your neighbourhood or beyound. You won't be able to match with people otherwise.</Text>
      <Image source={require("../../assets/images/locationImage.gif")} 
        style={styles.image}
       // resizeMode="cover" 
        />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    image: {
      width: 360,
      height: 400,
      borderRadius: 20,
    },

    title:{
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 15
    },
    para:{
        textAlign: 'center',
        fontSize: 15,
        marginHorizontal: 15,
        marginVertical: 10
    }
  });

export default EighthStepScreen;
