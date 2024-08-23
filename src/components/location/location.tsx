import React, {useEffect, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Button,
  Platform,
  Linking,
  View,
} from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import GetLocation, {Location} from 'react-native-get-location';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const LocationCheckComponent = () => {
  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        console.log('Locatio details ==>', location);
        setLocation(location);
      })
      .catch(error => {
        const {code, message} = error;
        console.log(code, message);
        if (message == 'Authorization denied') {
          showAlert(
            'Location Permission Required',
            'Please enable location permission in settings.',
            true,
            Linking.openSettings,
          );
        } else if (message == 'Location not available') {
          showAlert(
            'Location Permission Required',
            'Please enable location permission in settings.',
            true,
            openLocationSettings,
          );
        }
      });
  };

  const openLocationSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    } else if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
    }
  };

  // Show alert with optional settings redirect
  const showAlert = (
    title: string,
    message: string,
    openSettingsOption = false,
    settingsFunction?: () => void,
  ) => {
    const buttons = openSettingsOption
      ? [
          {text: 'Cancel'},
          {text: 'Open Settings', onPress: settingsFunction || (() => {})},
        ]
      : [{text: 'OK'}];

    Alert.alert(title, message, buttons);
  };

  return true ? null : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        height: hp(100),
        width: wp(100),
        zIndex: 1,
      }}>
      <Button title="Check Location Permissions" onPress={getLocation} />
    </View>
  );
};

export default LocationCheckComponent;
