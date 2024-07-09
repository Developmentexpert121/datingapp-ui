import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
interface LoginForm {
  email: string;
  password: string;
}
const defaultValues = {
  email: '',
  password: 'Test@123',
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
    dispatch(LoginSignIn(data));
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
    <>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraHeight={Platform.select({android: 200})}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={require('../../assets/images/login_Image.png')}
              resizeMode="contain"
              style={styles.imageBackground}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <BackIC />
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>What's your email?</Text>
            <Text style={styles.subText}>
              Don't lose access to your account,{'\n'}verify your email.
            </Text>
            <View style={styles.inputContainer}>
              <LoginTextInputEmail
                placeholder="Enter Your Email"
                name="email"
                autoCapitalize="none"
                control={control}
                errors={Boolean(errors?.email)}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}

              <LoginTextInput
                placeholder="Enter Your Password"
                name="password"
                control={control}
                errors={Boolean(errors?.password)}
                secureTextEntry
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
              <MainButton
                buttonStyle={styles.loginButton}
                onPress={handleSubmit(onSubmit)}
                ButtonName={'Log In'}
              />
            </View>
            <View style={{width: '80%'}}>
              <Text
                onPress={() => navigation.navigate('ForgotPassword')}
                style={{textAlign: 'right'}}>
                Forgot Password?
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFC7FF',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  imageContainer: {
    flex: 9 / 10,
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
    height: '102%',
  },
  backButton: {
    marginLeft: 20,
    marginTop: 80,
  },
  formContainer: {
    flex: 1 / 10,
    width: '100%',
    alignItems: 'center',
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
  inputContainer: {
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontFamily: 'Sansation-Regular',
    height: 15,
  },
  loginButton: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    bottom: 20,
    position: 'absolute',
    alignSelf: 'center',
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
