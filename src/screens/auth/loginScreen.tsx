import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ImageBackground,
  Linking,
  Keyboard,
  Animated,
  TextInput,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {useAppDispatch, useAppSelector} from '../../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainButton from '../../components/ButtonComponent/MainButton';
import {useNavigation} from '@react-navigation/native';
import {LoginSignIn} from '../../store/Auth/auth';
import Colors from '../../constants/Colors';
import Loader from '../../components/Loader/Loader';
import {BackIC, EyeslashIC, EyeslashOpenIC} from '../../assets/svgs';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
interface LoginForm {
  email: string;
  password: string;
}

const LoginScreen: React.FC<Props> = ({navigation: {navigate}}) => {
  const dispatch: any = useAppDispatch();
  const navigation = useNavigation();
  const [loader, setLoader] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState({email: '', password: ''});
  const [errors, setErrors] = useState({
    emptyEmail: false,
    emptyPassword: false,
    email: false,
    password: false,
  });

  const [keyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    });

    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

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

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log('Valid email =>', regex.test(email));
    return regex.test(email);
  };

  const Validate = () => {
    let error = {
      emptyEmail: false,
      emptyPassword: false,
      email: false,
      password: false,
    };

    if (formData.email == '') {
      error.emptyEmail = true;
    } else if (!validateEmail(formData.email)) {
      error.email = true;
    }

    if (formData.password == '') {
      error.emptyPassword = true;
    } else if (formData.password.length < 6) {
      error.password = true;
    }

    setErrors(error);

    if (
      !error.email &&
      !error.emptyEmail &&
      !error.emptyPassword &&
      !error.password
    ) {
      console.log('All well');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFC7FF'}}>
      <Animated.View
        // style={[styles.container, {paddingBottom: keyboardHeight}]}>
        style={[styles.container]}>
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
                <View
                  style={[
                    styles.mailView,
                    {
                      borderColor:
                        errors.email || errors.emptyEmail
                          ? 'red'
                          : 'rgba(0, 0, 0, 0.2)',
                    },
                  ]}>
                  <TextInput
                    placeholder="Enter Your Email"
                    placeholderTextColor={Colors.darkText}
                    style={{
                      fontFamily: 'Sansation-Regular',
                      fontSize: hp(2),
                    }}
                    value={formData.email}
                    onChangeText={value =>
                      setFormData({...formData, email: value})
                    }
                  />
                </View>

                {errors.emptyEmail && (
                  <Text style={styles.errorText}>Email is required</Text>
                )}
                {errors.email && (
                  <Text style={styles.errorText}>Invalid email</Text>
                )}

                <View
                  style={[
                    styles.passwordView,
                    {
                      borderColor:
                        errors.email || errors.emptyEmail
                          ? 'red'
                          : 'rgba(0, 0, 0, 0.2)',
                    },
                  ]}>
                  <TextInput
                    style={{
                      fontFamily: 'Sansation-Regular',
                      fontSize: hp(2),
                      width: wp(65),
                    }}
                    placeholder="Enter Your Password"
                    placeholderTextColor={Colors.darkText}
                    value={formData.password}
                    onChangeText={value =>
                      setFormData({...formData, password: value})
                    }
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setIsPasswordVisible(prev => !prev);
                    }}>
                    {isPasswordVisible ? <EyeslashOpenIC /> : <EyeslashIC />}
                  </TouchableOpacity>
                </View>

                {errors.emptyPassword && (
                  <Text style={styles.errorText}>Password is required</Text>
                )}
                {errors.password && (
                  <Text style={styles.errorText}>
                    Password must be at least 6 characters
                  </Text>
                )}
                <MainButton
                  buttonStyle={styles.loginButton}
                  onPress={Validate}
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
      </Animated.View>
    </SafeAreaView>
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
    flex: 9,
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    marginLeft: 20,
    marginTop: Platform.OS === 'ios' ? 80 : 50,
  },
  formContainer: {
    flex: 0.5,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: hp(3),
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  subText: {
    fontFamily: 'Sansation-Regular',
    textAlign: 'center',
    color: 'black',
    marginVertical: hp(1.5),
    fontSize: hp(1.8),
  },
  inputContainer: {
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontFamily: 'Sansation-Regular',
    fontSize: hp(1.6),
    marginBottom: hp(0.5),
  },
  loginButton: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    marginBottom: hp(1),
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

  // email and pasword view
  mailView: {
    backgroundColor: Colors.onPrimary,
    borderWidth: wp(0.5),
    borderRadius: wp(2.5),
    height: hp(6),
    paddingHorizontal: wp(2.5),
  },
  passwordView: {
    backgroundColor: Colors.onPrimary,
    borderWidth: wp(0.5),
    borderRadius: wp(2.5),
    height: hp(6),
    paddingHorizontal: wp(2.5),
    marginTop: hp(0.5),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LoginScreen;
