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
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {RegisterSignUp} from '../../store/Auth/auth';
import ZeroStepScreen from '../../components/Registration/zeroStepScreen';
import FirstStepScreen from '../../components/Registration/firstStepScreen';
import SecondStepScreen from '../../components/Registration/secondStepScreen';
import ThirdStepScreen from '../../components/Registration/thirdStepScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ForthStepScreen from '../../components/Registration/forthStepScreen';
import FifthStepScreen from '../../components/Registration/fifthStepScreen';
import SixthStepScreen from '../../components/Registration/sixthStepScreen';
import SeventhStepScreen from '../../components/Registration/seventhStepScreen';
import EighthStepScreen from '../../components/Registration/eighthStepScreen';
import Geolocation from '@react-native-community/geolocation';
import MainButton from '../../components/ButtonComponent/MainButton';
type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

interface RegisterForm {
  name: string;
  phone: string;
  email: string;
  country: string;
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
  dateDisplay: '',
  profilePercentage: '60',
};

const schema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone must contain only digits')
    .required('Phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  country: yup.string().trim().required('Country is required'),
  city: yup.string().trim().required('City is required'),
  gender: yup.string().trim().required('Gender is required'),
  password: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
    ),
  dob: yup.string().trim().required('DOB is required'),
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
  hobbies: yup.string().trim().required('Hobbies are required'),
});
const schema7 = yup.object().shape({
  hobbies: yup.string().trim().required('Photos are required'),
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
  console.log('OnPress handleSubmit', handleSubmit);
  console.log('errors ', errors);
  const getLocationAndRegister = (data: RegisterForm) => {
    Geolocation.getCurrentPosition(
      (position: any) => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        setPermissionStatus('granted');
        // Call registration API here
        dispatch(
          RegisterSignUp({
            ...data,
            location: {latitude, longitude},
            distance: `${distance}mi`,
            profilePic: profileImages?.join(','),
            dob: dateStr,
          }),
        );
        reset();
        navigate('Login');
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
            dispatch(
              RegisterSignUp({
                ...data,
                distance: `${distance}mi`,
                profilePic: profileImages?.join(','),
                dob: dateStr,
              }),
            );
            reset();
            // navigate('Login');s
          },
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: () => {
            requestLocationPermission(data);
            dispatch(
              RegisterSignUp({
                ...data,
                distance: `${distance}mi`,
                profilePic: profileImages?.join(','),
                dob: dateStr,
              }),
            );
            navigate('Login');
          },
        },
      ],
    );
  };
  console.log('showPermissionPopup', showPermissionPopup);

  const onSubmit: any = (data: RegisterForm) => {
    console.log('dataaaaa:::', data);
    if (steps === 7) {
      setSteps(prev => prev + 1);
    } else if (steps === 8) {
      showPermissionPopup(data);
    } else if (steps < 8) {
      setSteps(prev => prev + 1);
    } else if (steps === 0) {
      data.phone = callingCode + data.phone;
    }
  };
  console.log('onSubmitbutton ...', onSubmit);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? StatusBar.currentHeight || 0 : 0
        }
        style={{flex: 1}}>
        <View
          style={{flex: 1}}
          // scrollEnabled={false}
          // nestedScrollEnabled={true}
          // showsVerticalScrollIndicator={false}
          // contentContainerStyle={styles.scrollViewContent}
        >
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
                // errors={errors}
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
    </SafeAreaView>
  );
};
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

export default RegisterScreen;
