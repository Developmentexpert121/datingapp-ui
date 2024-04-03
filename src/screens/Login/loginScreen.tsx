import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import Spacing from '../../constants/Spacing';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import AppTextInput from '../../components/AppTextInput/AppTextInput';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {LoginSignIn} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainButton from '../../components/ButtonComponent/MainButton';
import {useNavigation} from '@react-navigation/native';
import LoginTextInput from '../../components/AppTextInput/LoginTextInput';
import ImageContainer from '../../components/container/ImageContainer';
import {ChevronLeftIC} from '../../assets/svgs';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
interface LoginForm {
  email: string;
  password: string;
}

const defaultValues = {
  email: '',
  password: '',
};

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
const LoginScreen: React.FC<Props> = ({navigation: {navigate}}) => {
  const dispatch: any = useAppDispatch();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: {errors},
  } = useForm<LoginForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit: any = (data: LoginForm) => {
    dispatch(LoginSignIn(data));
    reset();
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const value = await AsyncStorage.getItem('authToken');
        if (value !== null) {
          return value;
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error getting item from AsyncStorage:', error);
      }
    };
    fetchToken();
  }, []);

  return (
    // <ImageContainer
    // isScroll
    // // title="Sign In"
    // // subTitle="Sign In to continue"
    // bgImage={require("../../assets/images/login_Image.png")}
    // >
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      style={styles.container}>
      <ScrollView
        style={{flex: 1, borderWidth: 0}}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="always">
        <View
          style={{
            flex: 9 / 10,
            alignItems: 'center',
          }}>
          <ImageBackground
            source={require('../../assets/images/login_Image.png')}
            resizeMode="contain"
            style={{
              width: '100%',
              height: '100%',
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={{marginLeft: 20, marginTop: 50}}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/images/chevron-left.png')}
                resizeMode="contain"
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View
          style={{
            flex: 1 / 10,
            borderWidth: 0,
          }}>
          <Text style={styles.label}>What's your email?</Text>
          <Text style={styles.subText}>
            Don't lose access to your account,{'\n'}verify your email.
          </Text>
          <View
            style={{
              width: '80%',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <LoginTextInput
              textstyle={{width: '"100%"'}}
              placeholder="Enter Your Email"
              name="email"
              control={control}
              errors={Boolean(errors?.email)}
            />
            {errors.email && (
              <Text style={{color: 'red', fontFamily: 'Sansation_Regular'}}>
                {errors.email.message}
              </Text>
            )}
            <LoginTextInput
              textstyle={{width: '"100%"'}}
              placeholder="Enter Your Password"
              name="password"
              control={control}
              errors={Boolean(errors?.password)}
            />
            {errors.password && (
              <Text style={{color: 'red', fontFamily: 'Sansation_Regular'}}>
                {errors.password.message}
              </Text>
            )}
            <MainButton
              onPress={handleSubmit(onSubmit)}
              ButtonName={'Log In'}
            />
          </View>
          <Text style={styles.termsText}>Terms of use and privacy</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    // </ImageContainer>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#FFC7FF',
    borderWidth: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFC7FF',
    borderWidth: 0,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth:1
  },
  label: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Sansation_Bold',
    color: 'black',
  },
  subText: {
    marginTop: 6,
    fontFamily: 'Sansation_Regular',

    textAlign: 'center',
    color: 'black',
    marginBottom: 8,
  },
  loginText: {
    color: 'blue',
    marginBottom: 10,
    textAlign: 'center',
  },
  termsText: {
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'Sansation_Regular',
  },
  blankview: {
    width: 20,
    height: 20,
    borderWidth: 0,
    margin: 20,
  },
});

export default LoginScreen;
