// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import * as yup from 'yup';
// import Spacing from '../../constants/Spacing';
// import FontSize from '../../constants/FontSize';
// import Colors from '../../constants/Colors';
// import Font from '../../constants/Fonts';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../../types';
// import AppTextInput from '../../components/AppTextInput/AppTextInput';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useAppDispatch, useAppSelector } from '../../store/store';
// import { LoginSignIn } from '../../store/Auth/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
// interface LoginForm {
//   email: string;
//   password: string;
// }

// const defaultValues = {
//   email: "",
//   password: "",
// }

// const schema = yup.object().shape({
//   email: yup.string().email('Invalid email').required('Email is required'),
//   password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
// });
// const LoginScreen: React.FC<Props> = ({navigation: {navigate}}) => {
//   const dispatch:any = useAppDispatch()
//   const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<LoginForm>({
//     defaultValues,
//     resolver: yupResolver(schema),
//   });

//   const onSubmit:any = (data:LoginForm) => {
//     console.log(data);
//     dispatch(LoginSignIn(data));
//     reset();
//   };

//   console.log('login errors ', errors);

//   useEffect(()=>{
//     const fetchToken = async() => {
//       try {
//         const value = await AsyncStorage.getItem('authToken');
//         if (value !== null) {
//           console.log(`Item  retrieved: ${value}`);
//           return value;
//         } else {
//           console.log(`No item found with key`);
//           return null;
//         }
//       } catch (error) {
//         console.error('Error getting item from AsyncStorage:', error);
//       }
//     }
//     fetchToken();
//   },[]);

//   return (
//     <SafeAreaView>
//       <View style={styles.top}>
//         <View style={styles.topb}>
//           <Text style={styles.loginText}>Login here</Text>
//           <Text style={styles.loginTitle}>
//             Welcome back you've been missed!
//           </Text>
//         </View>
//         <View style={styles.viewMargin}>
//           <AppTextInput placeholder="Email" name="email" control={control} errors={Boolean(errors?.email)} />
//           <AppTextInput placeholder="Password" name="password" control={control}  errors={Boolean(errors?.password)} />
//         </View>

//         <View>
//           <Text style={styles.forgetText}>Forgot your password ?</Text>
//         </View>

//         <TouchableOpacity style={styles.signinTouch}
//         onPress={handleSubmit(onSubmit)}>
//           <Text style={styles.signinText}>Sign in</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => navigate('Register')}
//           style={styles.regTouch}>
//           <Text style={styles.newText}>Create new account</Text>
//         </TouchableOpacity>

//         <View style={styles.viewCon}>
//           <Text style={styles.textCon}>Or continue with</Text>

//           <View style={styles.viewIcon}>
//             <TouchableOpacity style={styles.icon1}>
//               <Icon name="google" color={Colors.primary} size={Spacing * 2} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.icon2}>
//               <Icon name="apple" color={Colors.primary} size={Spacing * 2} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.icon3}>
//               <Icon name="facebook" color={Colors.primary} size={Spacing * 2} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   top: {
//     padding: Spacing * 1,
//   },
//   topb: {
//     alignItems: 'center',
//   },
//   loginText: {
//     fontSize: FontSize.xLarge,
//     color: Colors.primary,
//     fontFamily: Font['poppins-bold'],
//     marginVertical: Spacing * 2,
//   },
//   loginTitle: {
//     fontFamily: Font['poppins-semiBold'],
//     fontSize: FontSize.large,
//     maxWidth: '60%',
//     textAlign: 'center',
//   },
//   viewMargin: {
//     marginVertical: Spacing * 3,
//   },
//   forgetText: {
//     fontFamily: Font['poppins-semiBold'],
//     fontSize: FontSize.small,
//     color: Colors.primary,
//     alignSelf: 'flex-end',
//   },
//   signinTouch: {
//     padding: Spacing * 2,
//     backgroundColor: Colors.primary,
//     marginVertical: Spacing * 3,
//     borderRadius: Spacing,
//     shadowColor: Colors.primary,
//     shadowOffset: {
//       width: 0,
//       height: Spacing,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: Spacing,
//   },
//   signinText: {
//     fontFamily: Font['poppins-bold'],
//     color: Colors.onPrimary,
//     textAlign: 'center',
//     fontSize: FontSize.large,
//   },
//   regTouch: {
//     padding: Spacing,
//   },
//   newText: {
//     fontFamily: Font['poppins-semiBold'],
//     color: Colors.text,
//     textAlign: 'center',
//     fontSize: FontSize.small,
//   },
//   viewCon: {
//     marginVertical: Spacing * 3,
//   },
//   textCon: {
//     fontFamily: Font['poppins-semiBold'],
//     color: Colors.primary,
//     textAlign: 'center',
//     fontSize: FontSize.small,
//   },
//   viewIcon: {
//     marginTop: Spacing,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   icon1: {
//     padding: Spacing,
//     backgroundColor: Colors.gray,
//     borderRadius: Spacing / 2,
//     marginHorizontal: Spacing,
//   },
//   icon2: {
//     padding: Spacing,
//     backgroundColor: Colors.gray,
//     borderRadius: Spacing / 2,
//     marginHorizontal: Spacing,
//   },
//   icon3: {
//     padding: Spacing,
//     backgroundColor: Colors.gray,
//     borderRadius: Spacing / 2,
//     marginHorizontal: Spacing,
//   },
// });

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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import Spacing from '../../constants/Spacing';
import FontSize from '../../constants/FontSize';
import Colors from '../../constants/Colors';
import Font from '../../constants/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import AppTextInput from '../../components/AppTextInput/AppTextInput';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {LoginSignIn} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  console.log(errors);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={styles.container}>
      <View style={styles.circle}>
        <Image
          source={require('../../assets/images/logIcon.png')}
          style={{width: 119, height: 122}}
        />
      </View>
      <Image
        source={require('../../assets/images/Group.png')}
        style={{width: '100%', height: '34%', marginTop: 20}}
      />

      <Text style={styles.label}>What's your email?</Text>
      <Text style={styles.subText}>
        Don't lose access to your account,{'\n'}verify your email.
      </Text>
      <View
        style={{width: '80%', justifyContent: 'center', alignItems: 'center'}}>
        <AppTextInput
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
        <AppTextInput
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
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>Terms of use and privacy</Text>
      {/* <View style={styles.signupContainer}>
          <Text>Do not have an account?</Text>
          <TouchableOpacity onPress={() => navigate('Register')}>
            <Text style={styles.touchableText}> Sign-Up</Text>
          </TouchableOpacity>
        </View> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    //paddingHorizontal: 20,
    backgroundColor: '#FFC7FF',
    width: '100%',
    height: '100%',
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
  },
  image1: {
    width: '100%',
    height: '100%',
  },
  image2: {
    width: '100%',
    height: '50%',
  },
  label: {
    fontSize: 22,
    marginTop: 16,
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
  subText2: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
  },
  button: {
    backgroundColor: '#AC25AC',
    padding: 10,
    borderRadius: 20,
    marginVertical: 12,
    width: '60%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Sansation_Regular',
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
  touchableText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  viewMargin: {
    marginVertical: Spacing * 3,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 100,
  },
});
export default LoginScreen;
