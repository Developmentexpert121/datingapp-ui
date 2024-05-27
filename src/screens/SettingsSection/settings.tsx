import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import CommonBackbutton from '../../components/commonBackbutton/CommonBackbutton';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import AppTextInput from '../../components/AppTextInput/AppTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  deleteUser,
  logoutUser,
  resetAuth,
  updateProfileData,
} from '../../store/Auth/auth';
import Geolocation from '@react-native-community/geolocation';
import MainButton from '../../components/ButtonComponent/MainButton';
import {EmailIC, LocationIC, PhoneIC} from '../../assets/svgs';
import BottomDrawer from './BottomDrawer';

interface UpdateForm {
  name: string;
  email: string;
  password: string;
  gender: string;
}
const defaultValues = {
  name: '',
  email: '',
  password: '',
  gender: '',
};

const schema = yup.object().shape({
  // gender: yup.string().required('gender is required'),
});

const getUserId = async () => {
  try {
    const userId: any = await AsyncStorage.getItem('userId');

    if (userId !== null) {
      return JSON.parse(userId);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const SettingsSection = () => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const dispatch: any = useAppDispatch();
  const navigation: any = useNavigation();
  const [title, setTitle] = useState<string>('');
  const [values, setValues] = useState<string>('');
  const [phone, setPhone] = useState<object>({});
  console.log('title', title);
  console.log('values', values);
  const {
    reset,
    formState: {errors},
  } = useForm<UpdateForm>({
    defaultValues,
    resolver: yupResolver<any>(schema),
  });
  //   const handleSliderChange = (value:any) => {
  //     setDistance(value);
  //   };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<any>(null);

  //
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');

      dispatch(resetAuth());
      console.log('handleLogout', resetAuth);
      // Reset navigation stack and navigate to the root screen (LoginHomeScreen)
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginHomeScreen'}],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  //

  //
  useEffect(() => {
    const getAddressFromCoordinates = async (latitude: any, longitude: any) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        );
        const data = await response.json();
        return data.display_name;
      } catch (error) {
        console.error('Error fetching address:', error);
        return null;
      }
    };

    // Usage
    getAddressFromCoordinates(
      profileData?.location?.latitude,
      profileData?.location?.longitude,
    ).then(address => setAddress(address));
  }, [profileData?.location?.latitude, profileData?.location?.longitude]);

  const dataArr = [
    {
      title: 'Phone Number',
      name: `${profileData?.phone?.countryCode || ''} ${
        profileData?.phone?.number || ''
      }`,
    },
    {title: 'Email Address', name: profileData?.email},
    {
      title: 'Location',
      name: address,
    },
    {title: 'Language I Know', name: profileData?.language},
  ];
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // setPhone({
    //   countryCode: callingCode,
    //   number: data.phone,
    // });
  };

  const handleModal = (item: any) => {
    setTitle(item?.title);
    setValues(item?.name);
    setIsDrawerOpen(true);
  };

  const authTokenRemove: any = async () => {
    try {
      const token: any = await AsyncStorage.removeItem('authToken');
      // if (token !== null) {
      //   return JSON.parse(token);
      // } else {
      //   return null;
      // }
    } catch (error) {
      return null;
    }
  };
  const [permissionStatus, setPermissionStatus] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const getLocationAndRegister = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(latitude);
        console.log(longitude);
        setPermissionStatus('granted');
        // Call registration API here
        dispatch(
          updateProfileData({
            field: 'location',
            value: {latitude, longitude},
            id: getUserId(),
          }),
        ).then(() => setLocation({latitude, longitude}));

        reset();
      },
      err => {
        setError(err.message);
        setPermissionStatus('denied');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const requestLocationPermission = () => {
    Geolocation.requestAuthorization();
    getLocationAndRegister();
  };

  const showPermissionPopup = () => {
    Alert.alert(
      'Location Permission',
      'This app needs access to your location to provide the service.',
      [
        {
          text: 'Cancel',
          onPress: () => {
            setPermissionStatus('denied');

            reset();
          },
          style: 'cancel',
        },
        {text: 'Allow', onPress: () => requestLocationPermission()},
      ],
    );
  };

  const deleteUserButton = async () => {
    dispatch(deleteUser({senderId: profileData._id}));
    await authTokenRemove();
  };
  const logoutUserButton = async () => {
    dispatch(logoutUser({senderId: profileData._id}));
    await authTokenRemove();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CommonBackbutton title="Settings" />
      <ScrollView>
        <Text style={styles.title}>Account Settings</Text>
        {dataArr &&
          dataArr.map((item, index) => (
            <View style={styles.boxContainer} key={index}>
              <Text style={styles.textName}>{item.title}</Text>
              <View style={styles.line} />
              <View>
                <TouchableOpacity
                  style={styles.textField}
                  disabled={index === 1 || index === 0}
                  onPress={() => {
                    if (item.title === 'Location') {
                      showPermissionPopup();
                    } else {
                      handleModal(item);
                    }
                  }}>
                  {index === 0 ? (
                    <PhoneIC />
                  ) : index === 1 ? (
                    <EmailIC />
                  ) : index === 2 ? (
                    <LocationIC />
                  ) : (
                    ''
                  )}
                  <Text
                    style={{
                      fontFamily: 'Sansation-Regular',
                      textAlign: 'center',
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        <TouchableOpacity
          style={styles.boxContainer}
          // onPress={handleLogout}
          onPress={deleteUserButton}>
          <Text style={[styles.textName, {color: '#AC25AC'}]}>Log Out</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.boxContainer}>
          <Text
            style={[styles.textName, {color: '#AC25AC'}]}
            onPress={deleteUserButton}>
            Delete Account
          </Text>
        </TouchableOpacity> */}
        <BottomDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title={title}
          value={values}
          // callingCode={`${profileData?.phone?.countryCode}`}
          // setCallingCode={`${profileData?.phone?.countryCode}`}
          // abde={`${profileData?.phone?.number}`}
          // zxcv={`${profileData?.phone?.number}`}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsSection;

const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: 10,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Sansation-Bold',
    color: 'black',
    marginLeft: 24,
    marginBottom: 12,
  },
  textName: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  line: {
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  textField: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 20,
  },
});
