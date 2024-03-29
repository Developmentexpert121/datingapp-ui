import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import React, {useState} from 'react';
import Spacing from '../../constants/Spacing';
import FontSize from '../../constants/FontSize';
import Colors from '../../constants/Colors';
import Font from '../../constants/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import AppTextInput from '../../components/AppTextInput/AppTextInput';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {RegisterSignUp} from '../../store/Auth/auth';
import {RadioButton} from 'react-native-paper';
// import ZeroStepScreen from '../Registration/zeroStepScreen';
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
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  // confirmPassword: yup
  //   .string()
  //   .oneOf([yup.ref('password')], 'Passwords must match')
  //   .required('Confirm Password is required'),
  dateDisplay: yup.string().trim().required('DOB is required'),
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
  console.log("OnPress", handleSubmit)

  const getLocationAndRegister = (data: RegisterForm) => {
    Geolocation.getCurrentPosition(
      position => {
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
      err => {
        setError(err.message);
        setPermissionStatus('denied');
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
            navigate('Login');
          },
          style: 'cancel',
        },
        {text: 'Allow', onPress: () => requestLocationPermission(data)},
      ],
    );
  };
  console.log("showPermissionPopup",showPermissionPopup)

  const onSubmit: any = (data: RegisterForm) => {
    if (steps === 7) {
      setSteps(prev => prev + 1);
    } else if (steps === 8) {
      showPermissionPopup(data);
    } else if (steps < 8) {
      setSteps(prev => prev + 1);
    }
  };
  console.log("button ...",onSubmit)

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={styles.container}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {/* {steps > 0 && (
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
        )} */}
        <View style={{flexGrow: 1}}>
          {steps === 0 ? (
            <ZeroStepScreen
              phone="phone"
              name="name"
              email="email"
              password="password"
              country="country"
              city="city"
              dateDisplay="dateDisplay"
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
            <SafeAreaView style={styles.container}>
              <View style={styles.contentContainer}>
                <Text style={styles.headerText}>Add photos</Text>
                <Text style={styles.paragraphText}>
                  Pick Some photos for your profile
                </Text>
                <SeventhStepScreen
                  profileImages={profileImages}
                  setProfileImages={setProfileImages}
                  title="Registeration"
                />
              </View>
            </SafeAreaView>
          ) : steps === 8 ? (
            <EighthStepScreen />
          ) : (
            ''
          )}
        </View>
        <View style={styles.containerBtn}>
          <TouchableOpacity
            onPress={
              //() => {
              //forwardStep(steps);
              handleSubmit(onSubmit)
              //}
            }
            
            style={styles.button}>
            <Text style={styles.buttonText}>
              {steps === 0 ? 'Continue' : steps < 8 ? 'Next' : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation_Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  paragraphText: {
    fontFamily: 'Sansation_Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  maindiv: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  
  containerBtn: {
    alignItems: 'center',
    marginVertical: 10,
  },

  button: {
    width: '80%',
    backgroundColor: '#AA22AA',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Sansation_Bold',
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
    borderRadius: 28,
    fontFamily: 'Sansation_Regular',
  },
});

export default RegisterScreen;
