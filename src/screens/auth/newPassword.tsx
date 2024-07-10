// In NewPassword.tsx

import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {BackIC} from '../../assets/svgs';
import PasswodTextInput from '../../components/AppTextInput/PasswodTextInput';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import MainButton from '../../components/ButtonComponent/MainButton';
import {useAppDispatch} from '../../store/store';
import {NewPasswordAdd} from '../../store/Auth/auth';
import Loader from '../../components/Loader/Loader';

interface RegisterForm {
  newPassword: string;
  email: string;
}

const defaultValues = {
  newPassword: '',
  email: '',
};

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case character',
    ),
});

type Props = NativeStackScreenProps<RootStackParamList, 'NewPassword'>;

const NewPassword: React.FC<Props> = ({navigation, route}) => {
  const {email} = route.params; // Retrieve the email from params
  console.log('first....', email);
  const dispatch: any = useAppDispatch();
  const [newPassword, setNewPassword] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit: any = async (data: RegisterForm) => {
    setNewPassword(data.newPassword);
    try {
      await dispatch(
        NewPasswordAdd({
          email,
          newPassword: data.newPassword,
        }),
      ).unwrap();
      navigation.navigate('Login');
      setLoader(false);
      return;
    } catch (error) {
      console.error(error);
      setLoader(false);
    }

    return;
  };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.topView}>
        <BackIC onPress={() => navigation.goBack()} />
        <Text style={styles.headerLabel}>New Password</Text>
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
          <Text style={styles.label}>New Password</Text>
          <PasswodTextInput
            placeholder="Enter Your Password"
            name="newPassword"
            control={control}
            errors={Boolean(errors?.newPassword)}
            secureTextEntry
          />
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword.message}</Text>
          )}
        </View>
        <MainButton
          buttonStyle={{width: '90%'}}
          ButtonName={'Done'}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      {loader && <Loader />}
    </SafeAreaView>
  );
};

export default NewPassword;

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
