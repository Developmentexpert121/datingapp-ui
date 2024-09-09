import React, {ReactNode, useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  Linking,
  View,
  Image,
  SafeAreaView,
  Text,
  StyleSheet,
} from 'react-native';
import GetLocation, {Location} from 'react-native-get-location';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Loader from '../Loader/Loader';
import MainButton from '../ButtonComponent/MainButton';
import {useDispatch} from 'react-redux';
import {SetLocation} from '../../store/Auth/auth';
import {useAppSelector} from '../../store/store';
import SplashScreen from 'react-native-splash-screen';

interface LocationCheckComponentProps {
  children: ReactNode;
}

const LocationCheckComponent: React.FC<LocationCheckComponentProps> = ({
  children,
}) => {
  const dispatch = useDispatch<any>();
  const [loader, setLoader] = useState(true);
  const [errorType, setErrorType] = useState('');
  const location: any = useAppSelector(
    (state: any) => state?.Auth?.data?.location,
  );

  useEffect(() => {
    getLocation();
    SplashScreen.hide();
  }, []);

  const getLocation = () => {
    setLoader(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setLoader(false);
        dispatch(
          SetLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        );
      })
      .catch(error => {
        const {code, message} = error;
        dispatch(SetLocation(undefined));
        setLoader(false);
        if (message == 'Authorization denied') {
          setErrorType('Authorization denied');
          showAlert(
            'App Location Permission Required',
            'Please enable App location ',
            true,
            Linking.openSettings,
          );
        } else if (message == 'Location not available') {
          setErrorType('Location not available');
          showAlert(
            'Device Location Permission Required',
            'Please enable Device location ',
            true,
            openLocationSettings,
          );
        } else {
          setErrorType('Authorization denied');
          showAlert(
            'App Location Permission Required',
            'Please enable App location ',
            true,
            Linking.openSettings,
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

  console.log('location +>', location);

  return location?.latitude ? (
    <>{children}</>
  ) : (
    <SafeAreaView style={style.container}>
      {loader ? (
        <Loader />
      ) : (
        <View style={style.contentContainer}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/images/LoginTop.png')}
              style={style.img1}
            />
            <View style={style.img2View}>
              <Image
                source={require('../../assets/images/locationImage.gif')}
                style={style.img2}
              />
            </View>
          </View>

          <Text style={style.label1}>Oops</Text>
          <Text style={style.label2}>
            You need to allow acess to location in order to use DatingApp
          </Text>

          <MainButton
            buttonStyle={{width: '75%'}}
            ButtonName={'Try Again'}
            onPress={getLocation}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC7FF',
    position: 'absolute',
    height: hp(100),
    width: wp(100),
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFC7FF',
    paddingTop: hp(5),
    alignItems: 'center',
  },
  img1: {
    resizeMode: 'contain',
    width: wp(36),
    height: hp(18),
  },
  img2: {
    resizeMode: 'cover',
    width: wp(90),
    height: hp(32),
  },
  img2View: {
    width: wp(90),
    height: hp(32),
    borderRadius: hp(5),
    overflow: 'hidden',
    marginTop: hp(5),
  },
  label1: {
    fontSize: hp(3),
    marginVertical: hp(2),
    color: '#000',
    fontWeight: 'bold',
  },
  label2: {
    fontSize: hp(2),
    color: '#000',
    textAlign: 'center',
    width: wp(80),
    lineHeight: hp(3),
    marginBottom: hp(3),
  },
});

export default LocationCheckComponent;
