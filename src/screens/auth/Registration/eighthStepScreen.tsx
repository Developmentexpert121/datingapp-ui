import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const EighthStepScreen = () => {
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Request location permission on component mount
    Geolocation.requestAuthorization();
  }, []);

  const getLocation = async () => {
    try {
      const granted: any = Geolocation.requestAuthorization();
      if (granted === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLocation({latitude, longitude});
          },
          err => setError(err.message),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        setError('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>So, are you from around here? </Text>
        <Text style={styles.paragraphText}>
          Set your location to see who's in your neighbourhood or beyound. You
          won't be able to match with people otherwise.
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            overflow: 'hidden',
          }}>
          <Image
            source={require('../../../assets/images/locationImage.gif')}
            style={styles.image}
          />
        </View>
        <View style={{flexGrow: 1}}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // borderWidth:1
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 40,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
    marginBottom: 10,
  },
  paragraphText: {
    fontFamily: 'Sansation-Regular',
    fontSize: 14,
    textAlign: 'center',
    color: '#575757',
    marginBottom: 40,
  },
});

export default EighthStepScreen;
