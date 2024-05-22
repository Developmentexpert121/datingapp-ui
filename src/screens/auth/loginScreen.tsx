import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useAppDispatch, useAppSelector} from '../../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainButton from '../../components/ButtonComponent/MainButton';
import {useNavigation} from '@react-navigation/native';
import LoginTextInput from '../../components/AppTextInput/LoginTextInput';
import {LoginSignIn} from '../../store/Auth/auth';
import Colors from '../../constants/Colors';
import Loader from '../../components/Loader/Loader';
import {BackIC} from '../../assets/svgs';
import LoginTextInputEmail from '../../components/AppTextInput/LoginTextInputEmail';

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
  const [loader, setLoader] = useState<boolean>(false);
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
    setLoader(true);
    console.log('data user', data);
    dispatch(LoginSignIn(data));
    // reset();
    setLoader(false);
  };

  const signInInfo: any = useAppSelector(
    (state: any) => state?.Auth?.data?.signInInfo,
  );

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
    <>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.container}>
        <ScrollView
          style={{flex: 1}}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="always">
          <View
            style={{
              flex: 9 / 10,
              alignItems: 'center',
            }}>
            {/* <Image
              source={require('../../assets/images/LoginTop.png')}
              // resizeMode="contain"
              style={{width: 160, height: 160}}
            />
            <Image
              source={require('../../assets/images/LoginBottom.png')}
              resizeMode="contain"
              style={{width: '100%', height: '70%'}}
            /> */}
            <ImageBackground
              source={require('../../assets/images/login_Image.png')}
              resizeMode="contain"
              style={{
                width: '100%',
                height: '102%',
                // marginTop: 20,
              }}>
              <TouchableOpacity
                style={{marginLeft: 20, marginTop: 80}}
                onPress={() => navigation.goBack()}>
                <BackIC />
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View
            style={{
              flex: 1 / 10,
              width: '100%',
              height: '100%',
              alignItems: 'center',
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
              <LoginTextInputEmail
                placeholder="Enter Your Email"
                name="email"
                autoCapitalize="none"
                control={control}
                errors={Boolean(errors?.email)}
                // keyboardType="email-address"
              />
              <View style={{height: 15}}>
                {errors.email && (
                  <Text style={{color: 'red', fontFamily: 'Sansation-Regular'}}>
                    {errors.email.message}
                  </Text>
                )}
              </View>

              <LoginTextInput
                placeholder="Enter Your Password"
                name="password"
                control={control}
                errors={Boolean(errors?.password)}
                secureTextEntry
              />
              <View style={{height: 15}}>
                {errors.password && (
                  <Text style={{color: 'red', fontFamily: 'Sansation-Regular'}}>
                    {errors.password.message}
                  </Text>
                )}
              </View>
              <MainButton
                buttonStyle={{
                  width: '100%',
                }}
                onPress={handleSubmit(onSubmit)}
                ButtonName={'Log In'}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          flexDirection: 'row',
          bottom: 20,
          position: 'absolute',
          alignSelf: 'center',
        }}>
        <Text
          style={styles.termsText}
          onPress={() => {
            Linking.openURL('https://sheikhproperty.com/privacy-policy');
          }}>
          Terms of use
        </Text>
        <Text style={styles.termsText1}> and </Text>
        <Text
          style={styles.termsText}
          onPress={() => {
            Linking.openURL('https://sheikhproperty.com/privacy-policy');
          }}>
          privacy policy{' '}
        </Text>
      </View>
      {loader ? <Loader /> : null}
    </>
    // </ImageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFC7FF',
    borderWidth: 0,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  label: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  subText: {
    fontFamily: 'Sansation-Regular',
    textAlign: 'center',
    color: 'black',
    marginVertical: 7,
  },
  termsText1: {
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'Sansation-Regular',
  },
  termsText: {
    color: Colors.pinkDark,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
  },
});

export default LoginScreen;
