import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
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

const BottomDrawer = ({isOpen, onClose, title, value}: any) => {
  const dispatch: any = useAppDispatch();
  const Data = [
    {id: 1, text: 'Lodo'},
    {id: 2, text: 'Cricket'},
    {id: 3, text: 'Football'},
    {id: 4, text: 'Shopping'},
    {id: 5, text: 'Coffee'},
    {id: 6, text: 'Movies'},
    {id: 7, text: 'Dancing'},
    {id: 8, text: 'Bikes'},
    {id: 9, text: 'games'},
  ];

  const avatars = [
    {id: '1', text: 'Long term partner'},
    {id: '2', text: 'Long term open to short'},
    {id: '3', text: 'Short term open to long'},
    {id: '4', text: 'Short term fun'},
    {id: '5', text: 'New friends'},
    {id: '6', text: 'Still figuring it out'},
    // Add more avatars as needed
  ];

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: {errors},
  } = useForm<UpdateForm>({
    defaultValues,
    resolver: yupResolver<any>(schema),
  });

  useEffect(() => {
    setValue(title, value);
  }, [title]);

  const onSubmit = (data: any) => {
    const fieldValue = data[title];

    let field;
    if (title.toLowerCase() === 'show me') {
      field = 'interests';
    } else {
      // Extract "email" from the title string
      field = title?.toLowerCase().split(' ')[0];
    }

    dispatch(
      updateProfileData({
        field: field,
        value: fieldValue,
        id: getUserId(),
      }),
    ).then(() => onClose());
  };

  const ListItem = ({item}: any) => (
    <View style={styles.listItem}>
      <Text style={{color: 'white', padding: 4}}>{item}</Text>
    </View>
  );

  const ListItem2 = ({item}: any) => (
    <View style={styles.listItem2}>
      <TouchableOpacity>
        <Text style={{color: 'grey', padding: 4}}>{item}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.drawer}>
          <Text style={styles.drawerText}>{title}</Text>
          {title === 'interests' ? (
            <View>
              {/* {value.split(",").map((list:any, index:any)=>(
                   <Text key={index} style={{backgroundColor:'#AC25AC', borderRadius:20, color:'#ffff'}}>{list}</Text>
                  ))} */}
              <FlatList
                data={value.split(',')}
                renderItem={({item}) => <ListItem item={item} />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3} // Display three items per row
              />
              <FlatList
                data={Data}
                renderItem={({item}) => <ListItem2 item={item.text} />}
                keyExtractor={item => item.id.toString()}
                numColumns={4} // Display three items per row
              />
            </View>
          ) : title === 'Relationship Goals' ? (
            <View>
              <Text
                style={{
                  backgroundColor: '#AC25AC',
                  color: 'white',
                  borderRadius: 20,
                  width: 220,
                  padding: 5,
                  marginBottom: 10,
                }}>
                {value}
              </Text>
              <FlatList
                data={avatars}
                renderItem={({item}) => <ListItem2 item={item.text} />}
                keyExtractor={item => item.id.toString()}
                numColumns={4} // Display three items per row
              />
            </View>
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <AppTextInput
                placeholder={'Enter Your ' + title.split(' ')[0]}
                name={title}
                control={control}
              />
            </View>
          )}
          <MainButton
            buttonStyle={{width: '80%'}}
            onPress={handleSubmit(onSubmit)}
            ButtonName={'Save'}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const SettingsSection = () => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const dispatch: any = useAppDispatch();
  const navigation: any = useNavigation();
  const [title, setTitle] = useState<string>('');
  const [values, setValues] = useState<string>('');
  const {
    control,
    handleSubmit,
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
      name: `${profileData?.phone?.countryCode || ''}${
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

        <TouchableOpacity style={styles.boxContainer}>
          <Text
            style={[styles.textName, {color: '#AC25AC'}]}
            // onPress={handleLogout}
            onPress={logoutUserButton}>
            Log Out
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxContainer}>
          <Text
            style={[styles.textName, {color: '#AC25AC'}]}
            onPress={deleteUserButton}>
            Delete Account
          </Text>
        </TouchableOpacity>
        <BottomDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title={title}
          value={values}
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
  slider: {
    marginHorizontal: 20,
  },
  distance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 32,
  },
  drawerText: {
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 40,
    color: 'black',
    fontFamily: 'Sansation-Bold',
  },
  listItem: {
    width: '32%', // Each list item takes one-third of the width
    // height: 100,
    // borderWidth: 1,
    backgroundColor: '#AC25AC',
    //borderColor: 'black',
    color: 'white',
    marginRight: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  listItem2: {
    width: '24%',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderColor: 'grey',
    color: 'grey',
    marginRight: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
});