import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import * as yup from 'yup';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Geolocation from '@react-native-community/geolocation';

import {RootStackParamList} from '../../types';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  EmailVerification,
  GoogleLogin,
  ProfileData,
  RegisterSignUp,
  VerifyOtp,
} from '../../store/Auth/auth';
import {
  otpModal,
  setAuthentication,
  toggleGlobalModal,
} from '../../store/reducer/authSliceState';

import ZeroStepScreen from './Registration/zeroStepScreen';
import FirstStepScreen from './Registration/firstStepScreen';
import SecondStepScreen from './Registration/secondStepScreen';
import ThirdStepScreen from './Registration/thirdStepScreen';
import ForthStepScreen from './Registration/forthStepScreen';
import FifthStepScreen from './Registration/fifthStepScreen';
import SixthStepScreen from './Registration/sixthStepScreen';
import SeventhStepScreen from './Registration/seventhStepScreen';
import EighthStepScreen from './Registration/eighthStepScreen';

import MainButton from '../../components/ButtonComponent/MainButton';
import OtpModal from '../../components/OtpModal/OtpModal';
import Loader from '../../components/Loader/Loader';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  activityLoaderFinished,
  activityLoaderStarted,
} from '../../store/Activity/activity';
import {googleLogin} from '../../store/Auth/socialLogin';
import {useNavigation} from '@react-navigation/native';
import {setLocalStorage} from '../../api/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProfile} from '../../store/slice/myProfileSlice/myProfileAction';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

interface RegisterForm {
  name: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  gender: string;
  interests: string;
  partnerType: string;
  habits1: Array<{id: string; selectedText: string}>;
  habits2: Array<{id: string; selectedText: string}>;
  hobbies: string;
  password: string;
  confirmPassword: string;
  distance: string;
  location: string;
  profilePic: string;
  dob: string;
  profilePercentage: string;
}

const defaultValues = {
  name: '',
  phone: '',
  email: '',
  country: '',
  state: '',
  city: '',
  gender: '',
  interests: '',
  partnerType: '',
  habits1: [],
  habits2: [],
  hobbies: '',
  password: '',
  distance: '',
  location: '',
  profilePic: '',
  dob: '',
  profilePercentage: '60',
};

const schemawith = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone must contain only digits')
    .min(8, 'Phone must be at least 8 digits long')
    .required('Phone is required'),
  // email: yup.string().email('Invalid email').required('Email is required'),
  // *************
  // country: yup.string().trim().required('Country, State, and City is required'),
  // state: yup.string().trim().required('State is required'),
  // city: yup.string().trim().required('City is required'),
  // *************
  gender: yup.string().trim().required('Gender is required'),
  // password: yup
  //   .string()
  //   .required('Please Enter your password')
  //   .matches(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
  //     'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case character',
  //   ),
  dob: yup.string().trim().required('DOB is required'),
});
const schema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone must contain only digits')
    .min(8, 'Phone must be at least 8 digits long')
    .required('Phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  // *************
  // country: yup.string().trim().required('Country, State, and City is required'),
  // state: yup.string().trim().required('State is required'),
  // city: yup.string().trim().required('City is required'),
  // *************
  gender: yup.string().trim().required('Gender is required'),
  password: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case character',
    ),
  dob: yup.string().trim().required('DOB is required'),
});

const schema1 = yup.object().shape({
  interests: yup.string().trim().required('Interests are required'),
});

const schema2 = yup.object().shape({
  partnerType: yup.string().required('Choose one term'),
});

const schema4 = yup.object().shape({
  habits1: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        selectedText: yup.string().required(),
      }),
    )
    .min(1, 'At least one item must be selected in the first box'),
});

const schema5 = yup.object().shape({
  habits2: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        selectedText: yup.string().required(),
      }),
    )
    .min(1, 'At least one item must be selected in the second box'),
});

const schema6 = yup.object().shape({
  hobbies: yup.string().trim().required('Hobbies are required'),
});

const schema7 = yup.object().shape({
  hobbies: yup.string().trim().required('Photos are required'),
});

const RegisterScreen: React.FC<Props> = ({navigation: {navigate, goBack}}) => {
  const otpVerified = useAppSelector(
    (state: any) => state?.Auth?.data?.otpVerified,
  );
  const navigation = useNavigation();
  const [steps, setSteps] = React.useState(0);
  const [dateStr, setDateStr] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [distance, setDistance] = useState<any>(40);
  const [error, setError] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<any>([]);
  const [permissionStatus, setPermissionStatus] = useState<any>(null);
  const [callingCode, setCallingCode] = useState('+91');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loader, setLoader] = useState<boolean>(false);
  const [phone, setPhone] = useState<object>({});
  // console.log(phone);
  const [country, setSelectedCountry] = useState<string | null>(null);
  const [state, setSelectedState] = useState<string | null>(null);
  const [city, setSelectedCity] = useState<string | null>(null);
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | undefined>('');
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const dispatch: any = useAppDispatch();

  // Introduce a state variable to track whether email has been verified
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const loginwithgoogle: any = useAppSelector(
    (state: any) => state?.Auth?.data?.loginwithgoogle,
  );

  const Schemas = (steps: any) => {
    if (steps === 0) {
      return yupResolver<any>(loginwithgoogle.email ? schemawith : schema);
    } else if (steps === 1) {
      return yupResolver<any>(schema1);
    } else if (steps === 2) {
      return yupResolver<any>(schema2);
    } else if (steps === 4) {
      return yupResolver<any>(schema4);
    } else if (steps === 5) {
      return yupResolver<any>(schema5);
    } else if (steps === 6) {
      return yupResolver<any>(schema6);
    } else if (steps === 7) {
      return yupResolver<any>(schema7);
    }
  };
  const handleCloseModal = () => {
    dispatch(
      otpModal({
        visible: false,
      }),
      setOtp(['', '', '', '', '', '']),
    );
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm<RegisterForm>({
    defaultValues,
    resolver: Schemas(steps),
  });
  const handleNavigation = (response: any) => {
    if (!response.payload?.data.otpVerified) {
      navigation.navigate('Loginhome');
    } else if (!response.payload?.data?.isProfileCompleted) {
      navigation.navigate('Loginhome');
    } else {
      setLocalStorage('isProfileCompleted', true);
      dispatch(setAuthentication(true));
    }
    dispatch(getProfile());
  };
  const getLocationAndRegister = async (data: RegisterForm) => {
    if (loginwithgoogle.email) {
      setValue('email', loginwithgoogle.email);
    }
    console.log('................', data);
    Geolocation.getCurrentPosition(
      async (position: any) => {
        const {latitude, longitude} = await position.coords;
        setLocation({latitude, longitude});
        console.log('latitude', latitude);
        console.log('longitude', longitude);
        setPermissionStatus('granted');
        // Call registration API here
        dispatch(
          loginwithgoogle.email
            ? RegisterSignUp({
                ...data,
                phoneNumber: phone,
                location: {latitude, longitude},
                distance: `${distance}mi`,
                profilePic: profileImages?.join(','),
                dob: dob,
                country: country,
                state: state,
                city: city,
                email: loginwithgoogle.email,
              })
            : RegisterSignUp({
                ...data,
                phoneNumber: phone,
                location: {latitude, longitude},
                distance: `${distance}mi`,
                profilePic: profileImages?.join(','),
                dob: dob,
                country: country,
                state: state,
                city: city,
              }),
        );
        reset();
      },
      (err: any) => {
        setError(err.message);
        setPermissionStatus('denied.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const requestLocationPermission = async (data: RegisterForm) => {
    await Geolocation.requestAuthorization();
    await getLocationAndRegister(data);
  };

  const showPermissionPopup = (data: RegisterForm) => {
    console.log('................0', data);
    Alert.alert(
      'Location Permission',
      'This app needs access to your location to provide the service.',
      [
        {
          text: 'Cancel',
          onPress: () => {
            setPermissionStatus('denied');
            // reset();
          },
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: async () => {
            await requestLocationPermission(data);
            dispatch(
              loginwithgoogle.email
                ? RegisterSignUp({
                    ...data,
                    phoneNumber: phone,
                    distance: `${distance}mi`,
                    profilePic: profileImages?.join(','),
                    dob: dob,
                    country: country,
                    state: state,
                    city: city,
                    email: loginwithgoogle.email,
                  })
                : RegisterSignUp({
                    ...data,
                    phoneNumber: phone,
                    distance: `${distance}mi`,
                    profilePic: profileImages?.join(','),
                    dob: dob,
                    country: country,
                    state: state,
                    city: city,
                  }),
            )
              .unwrap()
              // .then(res => console.log('res------', res));
              // ***************************
              // dispatch(googleLogin())
              // .unwrap()
              .then(async (response: any) => {
                console.log('response>>>>>>>', response);
                if (response?.payload?.redirect === 'Steps') {
                  await navigation.navigate('Register');
                } else if (response?.redirect === 'Dashboard') {
                  dispatch(activityLoaderStarted());
                  let token: string = response?.token;
                  setLocalStorage('token', token);
                  console.log('..............', token);
                  await AsyncStorage.setItem(
                    'authToken',
                    JSON.stringify(response?.token),
                  );
                  await AsyncStorage.setItem(
                    'userId',
                    JSON.stringify(response?._id),
                  );
                  console.log('dfj', response?._id);
                  dispatch(ProfileData());

                  // If sign-up is successful, call the function to handle the navigation
                  handleNavigation(response);
                  dispatch(activityLoaderFinished());
                } else {
                  // If there is an error in sign-up, check if there is an error message and set it
                  if (response?.payload?.message) {
                    setMsg(response?.payload?.message);
                  }
                  // Show the modal with the error message
                  setActiveModal(true);
                }

                setLoader(false);
              })
              .catch((error: any) => {
                console.error('.......error', error);
                // If there is an error in the promise chain, set the error message and show the modal
                setMsg(error?.payload?.message);
                setActiveModal(true);
              });
            setLoader(false);
            // **********************
            dispatch(GoogleLogin({}));
            reset();
            // navigate('Loginhome');
            // navigate('Home');
          },
        },
      ],
    );
  };

  //******************************************** */

  const onSubmit: any = async (data: RegisterForm) => {
    console.log('onSubmitfirst', data);
    setDob(data.dob);
    setEmail(data.email);

    if (steps === 7) {
      if (profileImages.length > 0) {
        setSteps(prev => prev + 1);
        return;
      } else {
        return;
      }
    } else if (steps === 8) {
      showPermissionPopup(data);
      return;
    } else if (steps < 8 && steps >= 1) {
      setSteps(prev => prev + 1);
      return;
    }
    //  {loginwithgoogle.email ? (setSteps(prev => prev + 1)) : (schema)}
    if (loginwithgoogle.email) {
      setSteps(prev => prev + 1);
    } else {
      if (steps === 0 && !otpVerified) {
        setLoader(true);
        console.log('first', otpVerified);
        try {
          await dispatch(
            EmailVerification({
              email: data.email,
            }),
          ).unwrap();
          setIsEmailVerified(true);
          setLoader(false);
          setPhone({
            countryCode: callingCode,
            number: data.phone,
          });
          return;
        } catch (error) {
          console.error(error);
          setLoader(false);
        }
      } else {
        if (data.email !== email) {
          setLoader(true);
          try {
            await dispatch(
              EmailVerification({
                email: data.email,
              }),
            ).unwrap();

            setIsEmailVerified(true);
            setLoader(false);
            setPhone({
              countryCode: callingCode,
              number: data.phone,
            });
            return;
          } catch (error) {
            console.error(error);
            setLoader(false);
          }
        } else {
          setSteps(prev => prev + 1);
        }
        return;
      }
    }
  };

  const resendOTP: any = () => {
    dispatch(
      EmailVerification({
        email: email,
      }),
      // setOtp(['', '', '', '', '', '']),
    );
  };

  const otpVerify = () => {
    const concatenatedString = otp.join('');
    dispatch(
      VerifyOtp({
        email: email,
        otp: concatenatedString,
      }),
    )
      .unwrap()
      .then((res: any) => {
        if (res.success) {
          setSteps(prev => prev + 1);
          setOtp(['', '', '', '', '', '']);
        } else {
          dispatch(
            toggleGlobalModal({
              visible: true,
              data: {
                text: 'OK',
                label: 'Invalid OTP',
              },
            }),
            setOtp(['', '', '', '', '', '']),
          );
        }
      });
  };
  const onClick = () => {
    dispatch(GoogleLogin({}));
    goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? StatusBar.currentHeight || 0 : 0
        }
        style={{flex: 1}}>
        <View style={{flex: 1}}>
          {steps > 0 && (
            <Pressable style={styles.backPress}>
              {steps !== 8 ? (
                <Ionicons
                  onPress={() => {
                    if (steps === 1) {
                      // Only reset isEmailVerified flag if going back from step 1 to step 0
                      setIsEmailVerified(false);
                    }
                    setSteps(prev => prev - 1);
                  }}
                  style={styles.backPressIcon}
                  name="chevron-back-outline"
                  size={26}
                />
              ) : (
                <View style={{width: 26}}></View>
              )}
              <Text style={styles.stepsText}>{steps + '/8'}</Text>
              <View style={{width: 26}}></View>
            </Pressable>
          )}

          <View style={{flexGrow: 1}}>
            {steps === 0 ? (
              <ZeroStepScreen
                BackClick={onClick}
                countryCode="countryCode"
                phone="phone"
                name="name"
                email="email"
                password="password"
                country="country"
                city="city"
                dob="dob"
                gender="gender"
                dateStr={dateStr}
                setDateStr={setDateStr}
                control={control}
                errors={errors}
                callingCode={callingCode}
                setCallingCode={setCallingCode}
                selectedCountry={country}
                setSelectedCountry={setSelectedCountry}
                selectedState={state}
                setSelectedState={setSelectedState}
                selectedCity={city}
                setSelectedCity={setSelectedCity}
              />
            ) : steps === 1 ? (
              <FirstStepScreen
                interests="interests"
                control={control}
                errors={Boolean(errors?.interests)}
              />
            ) : steps === 2 ? (
              <SecondStepScreen
                partnerType="partnerType"
                control={control}
                errors={Boolean(errors?.partnerType)}
              />
            ) : steps === 3 ? (
              <ThirdStepScreen distance={distance} setDistance={setDistance} />
            ) : steps === 4 ? (
              <ForthStepScreen
                habits1="habits1"
                control={control}
                errors={errors}
              />
            ) : steps === 5 ? (
              <FifthStepScreen
                habits2="habits2"
                control={control}
                errors={errors}
              />
            ) : steps === 6 ? (
              <SixthStepScreen
                hobbies="hobbies"
                control={control}
                errors={Boolean(errors?.hobbies)}
              />
            ) : steps === 7 ? (
              <SeventhStepScreen
                profileImages={profileImages}
                setProfileImages={setProfileImages}
                title="Registeration"
                errors={errors}
              />
            ) : steps === 8 ? (
              <EighthStepScreen />
            ) : null}
          </View>

          <MainButton
            buttonStyle={{width: '90%'}}
            ButtonName={steps === 0 ? 'Continue' : steps < 8 ? 'Next' : 'Done'}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </KeyboardAvoidingView>

      <OtpModal
        onPress={otpVerify}
        otp={otp}
        setOtp={setOtp}
        handleResendOTP={resendOTP}
        onClose={handleCloseModal}
      />

      {loader && <Loader />}
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 0,
  },
  backPress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 15,
  },
  backPressIcon: {
    color: '#AC25AC',
  },
  stepsText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: '#AC25AC',
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontFamily: 'Sansation-Regular',
    overflow: 'hidden',
  },
});
