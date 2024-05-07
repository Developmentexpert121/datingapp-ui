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
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  EmailVerification,
  RegisterSignUp,
  VerifyOtp,
} from '../../store/Auth/auth';
import ZeroStepScreen from './Registration/zeroStepScreen';
import FirstStepScreen from './Registration/firstStepScreen';
import SecondStepScreen from './Registration/secondStepScreen';
import ThirdStepScreen from './Registration/thirdStepScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ForthStepScreen from './Registration/forthStepScreen';
import FifthStepScreen from './Registration/fifthStepScreen';
import SixthStepScreen from './Registration/sixthStepScreen';
import SeventhStepScreen from './Registration/seventhStepScreen';
import EighthStepScreen from './Registration/eighthStepScreen';
import Geolocation from '@react-native-community/geolocation';
import MainButton from '../../components/ButtonComponent/MainButton';
import OtpModal from '../../components/OtpModal/OtpModal';
import Loader from '../../components/Loader/Loader';
import {otpModal, toggleGlobalModal} from '../../store/reducer/authSliceState';
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

const schema = yup.object().shape({
  // name: yup.string().trim().required('Name is required'),
  // phone: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Phone must contain only digits')
  //   .min(8, 'Phone must be at least 8 digits long')
  //   .required('Phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  // country: yup.string().trim().required('Country,State and City is required'),
  // state: yup.string().trim().required('Country is required'),
  // city: yup.string().trim().required('City is required'),
  //
  // gender: yup.string().trim().required('Gender is required'),
  // password: yup
  //   .string()
  //   .required('Please Enter your password')
  //   .matches(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
  //     'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
  //   ),
  // dob: yup.string().trim().required('DOB is required'),
});

const schema1 = yup.object().shape({
  interests: yup.string().trim().required('interests is required'),
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
    .min(1, 'At least one item of any box must be selected'),
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
    .min(1, 'At least one item of any box must be selected'),
});
const schema6 = yup.object().shape({
  // hobbies: yup.string().trim().required('Hobbies are required'),
});
const schema7 = yup.object().shape({
  hobbies: yup
    .string()
    .trim()
    // .min(1, 'At least one item of any box must be selected')
    .required('Photos are required'),
});
const RegisterScreen: React.FC<Props> = ({navigation: {navigate}}) => {
  const profileData = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const [steps, setSteps] = React.useState(0);
  const [dateStr, setDateStr] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [distance, setDistance] = useState<any>(20);
  const [error, setError] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<any>([]);
  const [permissionStatus, setPermissionStatus] = useState<any>(null);
  const [callingCode, setCallingCode] = useState('+91');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loader, setLoader] = useState<boolean>(false);
  const [phone, setPhone] = useState<object>({});

  const [country, setSelectedCountry] = useState<string | null>(null);
  const [state, setSelectedState] = useState<string | null>(null);
  const [city, setSelectedCity] = useState<string | null>(null);

  const dispatch: any = useAppDispatch();
  const Schemas = (steps: any) => {
    if (steps === 0) {
      return yupResolver<any>(schema);
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
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<RegisterForm>({
    defaultValues,
    resolver: Schemas(steps),
  });
  const getLocationAndRegister = (data: RegisterForm) => {
    console.log('firstdatadata', data);
    Geolocation.getCurrentPosition(
      (position: any) => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        setPermissionStatus('granted');
        console.log('latitude', latitude);
        console.log('longitude', longitude);
        // Call registration API here
        dispatch(
          RegisterSignUp({
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
  const requestLocationPermission = (data: RegisterForm) => {
    Geolocation.requestAuthorization();
    getLocationAndRegister(data);
  };
  const showPermissionPopup = (data: RegisterForm) => {
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
        {
          text: 'Allow',
          onPress: () => {
            requestLocationPermission(data);
            console.log('requestLocationPermission data', data);
            dispatch(
              RegisterSignUp({
                ...data,
                phoneNumber: phone,
                distance: `${distance}mi`,
                profilePic: profileImages?.join(','),
                dob: dob,
                country: country,
                state: state,
                city: city,
              }),
            );
            navigate('Loginhome');
          },
        },
      ],
    );
  };

  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');

  const onSubmit: any = (data: RegisterForm) => {
    console.log('onSubmitfirst', data);
    setDob(data.dob);
    setEmail(data.email);
    if (steps === 7) {
      if (profileImages.length > 0) {
        return setSteps(prev => prev + 1);
      }
    } else if (steps === 8) {
      showPermissionPopup(data);
    } else if (steps < 8 && steps >= 1) {
      setSteps(prev => prev + 1);
    } else if (steps === 0) {
      setLoader(true);
      dispatch(
        EmailVerification({
          email: data.email,
        }),
      )
        .unwrap()
        .then(() => setLoader(false));
      setPhone({
        countryCode: callingCode,
        number: data.phone,
      });
    }
  };
  const resendOTP: any = (data: RegisterForm) => {
    console.log('fsfsass', data);
    dispatch(
      EmailVerification({
        email: email,
      }),
      console.log('first'),
    );
  };

  const otpVerifity = () => {
    const concatenatedString = otp.join('');
    console.log(concatenatedString);
    setLoader(false);
    dispatch(
      VerifyOtp({
        email: email,
        otp: concatenatedString,
      }),
    )
      .unwrap()
      .then((res: any) =>
        res.success === true
          ? setSteps(prev => prev + 1)
          : dispatch(
              toggleGlobalModal({
                visible: true,
                data: {
                  text: 'OK',
                  label: 'Invalid OTP',
                },
              }),
            ),
      );
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
          {steps > 0 ? (
            <Pressable style={styles.backPress}>
              <Ionicons
                onPress={() => setSteps(prev => prev - 1)}
                style={styles.backPressIcon}
                name="chevron-back-outline"
                size={26}
              />
              <Text style={styles.stepsText}>{steps + '/8'}</Text>
              <View style={{width: 26}}></View>
            </Pressable>
          ) : null}
          <View style={{flexGrow: 1}}>
            {steps === 0 ? (
              <ZeroStepScreen
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
            ) : (
              ''
            )}
          </View>
          <MainButton
            buttonStyle={{width: '90%'}}
            ButtonName={steps === 0 ? 'Continue' : steps < 8 ? 'Next' : 'Done'}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </KeyboardAvoidingView>
      <OtpModal
        onPress={otpVerifity}
        otp={otp}
        setOtp={setOtp}
        handleResendOTP={resendOTP}
      />
      {loader ? <Loader /> : null}
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
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
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
