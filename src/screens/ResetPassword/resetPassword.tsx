import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {useAppSelector} from '../../store/store';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
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
    .notOneOf(
      [yup.ref('currentPassword'), null],
      'New password must be different from current password',
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case character',
    ),
  confirmNewPassword: yup
    .string()
    .required('Please Enter your password')
    .oneOf([yup.ref('newPassword')], 'Confirm Password must match New Password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case character',
    ),
});

const ResetPassword = () => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterForm>({
    defaultValues,
    //@ts-ignore
    resolver: yupResolver(schema),
  });

  const [loader, setLoader] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onSubmit: any = async (data: RegisterForm) => {
    setLoader(true);
    await dispatch(resetPasswordSettings({data, id: profileData._id}))
      .unwrap()
      .then((res: any) => {
        if (res.success === false) {
          setVisible(true);
          setMessage(res.message);
        } else {
          setVisible(true);
          setMessage(res.message);
        }
        setLoader(false);
      });
  };

  const modal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{message}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (message === 'Password reset successfully!') {
                  navigation.navigate('ProfileSection');
                } else {
                  setVisible(false);
                }
              }}>
              <Text style={styles.buttonCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? undefined : hp(3)}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
        <View style={styles.topView}>
          <BackIC onPress={() => navigation.goBack()} />
          <Text style={styles.headerLabel}>Change Password</Text>
          <View style={styles.blankview}></View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            width: '100%',
          }}>
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              // justifyContent: 'center',
            }}>
            <Image
              source={require('../../assets/images/LoginTop.png')}
              style={{
                height: hp(20),
                width: wp(40),
                resizeMode: 'contain',
                marginTop: hp(3),
                marginBottom: hp(2),
              }}
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
                <Text style={styles.errorText}>
                  {errors.newPassword.message}
                </Text>
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
          </View>
          <View style={{marginTop: hp(2)}}>
            <MainButton
              buttonStyle={{width: '90%'}}
              ButtonName={'Next'}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </ScrollView>
        {loader && <Loader />}
        {modal()}
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
  },
  button: {
    width: '90%',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#AC25AC',
    marginVertical: 5,
  },
  buttonClose: {
    backgroundColor: '#FFFF',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
  },
  buttonCancel: {
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
  },
});
