import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import CommonBackbutton from '../../components/commonBackbutton/BackButton';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  cancelLoginWithGoogle,
  deactivateUser,
  deleteUser,
  logoutUser,
  resetAuth,
  updateAuthentication,
  updateProfileData,
} from '../../store/Auth/auth';
import Geolocation from '@react-native-community/geolocation';
import {EditTextIC, EmailIC, LocationIC, PhoneIC} from '../../assets/svgs';
import BottomDrawer from './BottomDrawer';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Loader from '../../components/Loader/Loader';
import GlobalModal from '../../components/Modals/GlobalModal';
import ConfirmModal from '../../components/Modals/ConfirmModal';
import {StreamVideoRN} from '@stream-io/video-react-native-sdk';
import PhoneInput from '../../components/AppTextInput/PhoneInput';

interface UpdateForm {
  phone: string;
}
const defaultValues = {
  phone: '',
};

const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone must contain only digits')
    .min(8, 'Phone must be at least 8 digits long')
    .required('Phone is required'),
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
  const [loader, setLoader] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [values, setValues] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState('+91');
  const [actionType, setActionType] = useState<string | null>(null);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '151623051367-b882b5sufigjbholkehodmi9ccn4hv6m.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const onSubmit: any = async (data: UpdateForm) => {
    let payload = {
      countryCode: callingCode,
      number: data.phone,
    };
    await dispatch(
      updateProfileData({
        field: 'phone',
        value: payload,
        id: getUserId(),
      }),
    )
      .unwrap()
      .then(() => setEditPhone(false));
  };

  const {
    control,
    reset,
    handleSubmit,
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
  const [editPhone, setEditPhone] = useState<any>(false);

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
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('profileData');
    } catch (error) {
      return null;
    }
  };

  const logoutUserButton = async () => {
    try {
      dispatch(
        updateProfileData({
          field: 'authToken',
          value: '',
          id: getUserId(),
        }),
      );
      dispatch(cancelLoginWithGoogle());
      // Ensure Google Sign-In is configured
      if (!GoogleSignin.hasPlayServices()) {
        console.error('Google Play Services are not available');
        return;
      }
      const isSignedIn = await GoogleSignin.isSignedIn();

      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
      // dispatch(logoutUser({senderId: profileData._id}));
      await authTokenRemove();
      dispatch(updateAuthentication());
      await StreamVideoRN.onPushLogout();
    } catch (error) {
      console.error('errorLogoutUserButton', error);
    }
  };
  const deleteUserButton = async () => {
    dispatch(deleteUser({senderId: profileData._id}))
      .unwrap()
      .then(async (res: any) => {
        logoutUserButton();
      });
    //
  };
  const deactivateUserButton = async () => {
    dispatch(deactivateUser({userId: profileData?._id}))
      .unwrap()
      .then(async (res: any) => {
        logoutUserButton();
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CommonBackbutton title="Settings" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Account Settings</Text>
        {dataArr &&
          dataArr.map((item, index) => (
            <View style={styles.boxContainer} key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: 32}}></View>
                <Text style={styles.textName}>{item.title}</Text>
                {index === 0 && !editPhone && item.title === 'Phone Number' ? (
                  <EditTextIC
                    style={{marginEnd: 8}}
                    onPress={() => {
                      if (item.title === 'Phone Number') {
                        setEditPhone(true);
                      } else {
                        handleModal(item);
                      }
                    }}
                  />
                ) : item.title === 'Language I Know' ? (
                  <EditTextIC
                    style={{marginEnd: 8}}
                    onPress={() => {
                      if (item.title === 'Phone Number') {
                        setEditPhone(true);
                      } else {
                        handleModal(item);
                      }
                    }}
                  />
                ) : (
                  <View style={{width: 32}} />
                )}
              </View>
              <View style={styles.line} />
              <View>
                {index === 0 && editPhone ? (
                  <View style={styles.textFieldPhone}>
                    <PhoneInput
                      name="phone"
                      control={control}
                      label="Phone Number"
                      showError={Boolean(errors?.phone)}
                      errors={Boolean(errors?.phone)}
                      callingCode={callingCode}
                      setCallingCode={setCallingCode}
                      inComponent="Settings"
                    />
                    <Pressable
                      onPress={
                        handleSubmit(onSubmit)
                        // setEditPhone(false);
                      }
                      style={{
                        backgroundColor: '#AC25AC',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 6,
                        // borderWidth: 1,
                        borderColor: 'gray',
                      }}>
                      <Text style={{color: 'black'}}>Done</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.textField}>
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
                  </View>
                )}
              </View>
            </View>
          ))}
        {!profileData?.googleId && !profileData?.appleId && (
          <TouchableOpacity
            style={styles.boxContainer}
            onPress={() => {
              navigation.navigate('ResetPassword');
            }}>
            <Text style={[styles.textName, {color: '#AC25AC'}]}>
              Reset Password
            </Text>
          </TouchableOpacity>
        )}

        {/* Logout */}
        <TouchableOpacity
          style={styles.boxContainer}
          onPress={() => {
            setActionType('logout');
            setModalVisible(true);
          }}>
          <Text style={[styles.textName, {color: '#AC25AC'}]}>Log Out</Text>
        </TouchableOpacity>
        {/* Delete */}
        <TouchableOpacity
          style={styles.boxContainer}
          onPress={() => {
            setActionType('delete');
            setModalVisible(true);
          }}>
          <Text style={[styles.textName, {color: '#AC25AC'}]}>
            Delete Account
          </Text>
        </TouchableOpacity>
        {/* Deactivate */}
        <TouchableOpacity
          style={styles.boxContainer}
          onPress={() => {
            setActionType('deactivate');
            setModalVisible(true);
          }}>
          <Text style={[styles.textName, {color: '#AC25AC'}]}>Deactivate</Text>
        </TouchableOpacity>
        <BottomDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title={title}
          value={values}
        />
      </ScrollView>
      {loader && <Loader />}

      <ConfirmModal
        onRequestClose={() => {
          setModalVisible(false);
          setActionType(null);
        }}
        visible={modalVisible}
        onPress={() => {
          if (actionType === 'logout') {
            logoutUserButton();
          } else if (actionType === 'delete') {
            deleteUserButton();
          } else if (actionType === 'deactivate') {
            deactivateUserButton();
          }
          setModalVisible(false);
          setActionType(null);
        }}
        onPressCancel={() => {
          setModalVisible(false);
          setActionType(null);
        }}
        TextName={`Are you sure you want to ${actionType} your account? ${
          actionType === 'deactivate'
            ? '(You can reactivate your account when you login.)'
            : ''
        }`}
      />
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
    paddingHorizontal: 24,
  },
  textFieldPhone: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 6,
  },
});
