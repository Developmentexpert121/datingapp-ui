import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
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
    console.log("data user",data)
    dispatch(LoginSignIn(data));
    reset();

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
            width: '100%',
            height: '100%',
            alignItems: 'center',
            // borderWidth: 1,
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
              placeholder="Enter Your Email"
              name="email"
              autoCapitalize="none"
              control={control}
              errors={Boolean(errors?.email)}
              keyboardType="email-address"
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
            {/* {signInInfo && ( */}
              <Text
                style={{
                  fontFamily: 'Sansation-Regular',
                  color: 'red',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                ignInInfo
              </Text>
           {/* )} */}
            <MainButton
              buttonStyle={{
                width: '100%',
              }}
              onPress={handleSubmit(onSubmit)}
              ButtonName={'Log In'}
            />
          </View>
          <View
            style={{flexDirection: 'row', bottom: 20, position: 'absolute'}}>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    {/* {loader ? <Loader /> : null} */}
    </>
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
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  subText: {
    marginTop: 6,
    fontFamily: 'Sansation-Regular',

    textAlign: 'center',
    color: 'black',
    marginBottom: 8,
  },
  loginText: {
    color: 'blue',
    marginBottom: 10,
    textAlign: 'center',
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
  blankview: {
    width: 20,
    height: 20,
    borderWidth: 0,
    margin: 20,
  },
});

export default LoginScreen;
