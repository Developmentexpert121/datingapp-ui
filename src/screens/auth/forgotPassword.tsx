import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {BackIC} from '../../assets/svgs';
import AppTextInputEmail from '../../components/AppTextInput/AppTextInputEmail';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import MainButton from '../../components/ButtonComponent/MainButton';
import {useAppDispatch} from '../../store/store';
import {ResetPassword, VerifyOtp} from '../../store/Auth/auth';
import OtpModal from '../../components/OtpModal/OtpModal';
import {otpModal, toggleGlobalModal} from '../../store/reducer/authSliceState';
import Loader from '../../components/Loader/Loader';
import {useNavigation} from '@react-navigation/native';

interface RegisterForm {
  email: string;
}

const defaultValues = {
  email: '',
};

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword = () => {
  const navigation = useNavigation<any>();
  const dispatch: any = useAppDispatch();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit: any = async (data: RegisterForm) => {
    setEmail(data.email);
    setLoader(true);
    try {
      await dispatch(ResetPassword(data)).unwrap();
      setIsEmailVerified(true);
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  const resendOTP = () => {
    dispatch(
      ResetPassword({
        email: email,
      }),
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
          navigation.navigate('NewPassword', {email: email});
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
          );
          setOtp(['', '', '', '', '', '']);
        }
      });
  };

  const handleCloseModal = () => {
    dispatch(
      otpModal({
        visible: false,
      }),
    );
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.topView}>
        <BackIC onPress={() => navigation.goBack()} />
        <Text style={styles.headerLabel}>Forgot Password</Text>
        <View style={styles.blankview}></View>
      </View>

      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          // justifyContent: 'center',
        }}>
        <Image
          source={require('../../assets/images/LoginTop.png')}
          style={{height: 150, width: 150, top: 10}}
        />
        <View style={styles.container}>
          <Text style={styles.label}>Email</Text>
          <AppTextInputEmail
            placeholder="Enter Your Email"
            name="email"
            control={control}
            errors={Boolean(errors?.email)}
            autoCapitalize="none"
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>
        <MainButton
          buttonStyle={{width: '90%'}}
          ButtonName={'Next'}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      {isEmailVerified && (
        <OtpModal
          onPress={otpVerify}
          otp={otp}
          setOtp={setOtp}
          handleResendOTP={resendOTP}
          onClose={handleCloseModal}
        />
      )}
      {loader && <Loader />}
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#AA22AA',
    backgroundColor: '#E1D1E1',
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 15,
    marginTop: 50,
  },
  headerLabel: {
    fontSize: 22,
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
    color: 'black',
  },
  label: {
    fontSize: 20,
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  blankview: {
    width: 20,
    height: 20,
    borderWidth: 0,
  },
  topView: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderWidth: 0,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontFamily: 'Sansation-Regular',
    textAlign: 'center',
  },
});
