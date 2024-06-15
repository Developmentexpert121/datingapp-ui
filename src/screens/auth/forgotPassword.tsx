import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import Label from '../../components/Label';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';
import {BackIC} from '../../assets/svgs';
import AppTextInputEmail from '../../components/AppTextInput/AppTextInputEmail';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpScreen'>;
const ForgotPassword = ({navigation: {}}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.topView}>
        <BackIC onPress={() => navigation.goBack()} />
        <Text style={styles.headerLabel}>Forgot Password</Text>
        <View style={styles.blankview}></View>
      </View>
      <View>
        <AppTextInputEmail
          placeholder="Enter Your Email"
          name="email"
          autoCapitalize="none"
          //   control={control}
          //   errors={Boolean(errors?.email)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
const styles = StyleSheet.create({
  container: {
    width: '90%',
    //padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#AA22AA',
    backgroundColor: '#E1D1E1',
    marginHorizontal: 20,
    justifyContent: 'center', // Center items vertically
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 15,
    // zIndex: 0,
  },
  container1: {
    width: '90%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#AA22AA',
    backgroundColor: '#E1D1E1',
    marginHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 15,
  },
  headerLabel: {
    fontSize: 22,
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
    // marginTop: 20,
    color: 'black',
  },
  label1: {
    fontSize: 20,
    //marginBottom: 0,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  label: {
    fontSize: 20,
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  label2: {
    fontSize: 16,
    textAlign: 'center',
    // marginBottom: 2,
    fontFamily: 'Sansation-Regular',
  },
  input: {
    //height: 40,
    color: 'gray',
    textAlign: 'center',
    //borderRadius: 5,
  },
  radio: {
    flexGrow: 1,
    alignContent: 'flex-start',
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
  },
  dateBtn: {
    padding: 12,
    backgroundColor: Colors.onPrimary,
    marginVertical: Spacing,
    width: '80%',
    borderRadius: 10,
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
  cricleView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontFamily: 'Sansation-Regular',
    textAlign: 'center',
  },
  iosBorder: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#AC25AC',
  },
  radioOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
    paddingHorizontal: 20,
    // borderWidth: 1,
  },
});
