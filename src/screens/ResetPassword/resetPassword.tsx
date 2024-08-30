import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {BackIC} from '../../assets/svgs';
import {useNavigation} from '@react-navigation/native';
import AppTextInputEmail from '../../components/AppTextInput/AppTextInputEmail';
import MainButton from '../../components/ButtonComponent/MainButton';
import Loader from '../../components/Loader/Loader';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useDispatch} from 'react-redux';
import {resetPasswordSettings} from '../../store/Auth/auth';

interface RegisterForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case character',
    ),
  newPassword: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case character',
    ),
  confirmNewPassword: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case character',
    ),
});

const ResetPassword = () => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [loader, setLoader] = useState<boolean>(false);

  const onSubmit: any = async (data: RegisterForm) => {
    console.log(data);
    setLoader(true);
    await dispatch(resetPasswordSettings(data))
      .unwrap()
      .then((res: any) => {
        console.log(res);
        setLoader(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.topView}>
        <BackIC onPress={() => navigation.goBack()} />
        <Text style={styles.headerLabel}>Reset Password</Text>
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
          <Text style={styles.label}>Current Password*</Text>
          <AppTextInputEmail
            placeholder="********"
            name="currentPassword"
            control={control}
            errors={Boolean(errors?.currentPassword)}
            autoCapitalize="none"
          />
          {errors.currentPassword && (
            <Text style={styles.errorText}>
              {errors.currentPassword.message}
            </Text>
          )}
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>New Password*</Text>
          <AppTextInputEmail
            placeholder="********"
            name="newPassword"
            control={control}
            errors={Boolean(errors?.newPassword)}
            autoCapitalize="none"
          />
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword.message}</Text>
          )}
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>Confirm New Password*</Text>
          <AppTextInputEmail
            placeholder="********"
            name="confirmNewPassword"
            control={control}
            errors={Boolean(errors?.confirmNewPassword)}
            autoCapitalize="none"
          />
          {errors.confirmNewPassword && (
            <Text style={styles.errorText}>
              {errors.confirmNewPassword.message}
            </Text>
          )}
        </View>
        <MainButton
          buttonStyle={{width: '90%'}}
          ButtonName={'Next'}
          onPress={handleSubmit(onSubmit)}
        />
      </View>

      {loader && <Loader />}
    </SafeAreaView>
  );
};

export default ResetPassword;

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

    marginTop: 20,
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
    alignItems: 'center',
    borderWidth: 0,
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    fontFamily: 'Sansation-Regular',
    textAlign: 'center',
  },
});
