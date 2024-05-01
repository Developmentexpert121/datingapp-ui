import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {RadioButton} from 'react-native-paper';
import AppTextInput from '../../../components/AppTextInput/AppTextInput';
import {Controller} from 'react-hook-form';
import Colors from '../../../constants/Colors';
import Spacing from '../../../constants/Spacing';
import {useNavigation} from '@react-navigation/native';
import PhoneInput from '../../../components/AppTextInput/PhoneInput';
import CustomDatePicker from '../../../components/AppTextInput/CustomDatePicker';
import PasswodTextInput from '../../../components/AppTextInput/PasswodTextInput';
import {BackIC} from '../../../assets/svgs';
import CountryCity from '../../../DropDwon/CountryCity';

interface RegForm0 {
  name: string;
  email: string;
  password: string;
}
const defaultValues = {
  name: '',
  email: '',
  password: '',
};
const ZeroStepScreen = ({
  name,
  phone,
  control,
  errors,
  email,
  dob,
  password,
  gender,
  country,
  city,
  callingCode,
  setCallingCode,
}: any) => {
  const options = [
    {label: 'Male', value: 'first'},
    {label: 'Female', value: 'second'},
    {label: 'Non-Binary', value: 'third'},
    {label: 'Transgender', value: 'fourth'},
  ];
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{borderWidth: 0, flex: 1}}>
      <View style={styles.topView}>
        <BackIC onPress={() => navigation.goBack()} />
        <Text style={styles.headerLabel}>Personal</Text>
        <View style={styles.blankview}></View>
      </View>
      <ScrollView
        style={{borderWidth: 0, flex: 1}}
        showsVerticalScrollIndicator={false}>
        {/* Name */}
        <View style={styles.container}>
          <Text style={styles.label}>My name is</Text>
          <AppTextInput
            placeholder="Enter Your Name"
            name={name}
            control={control}
            errors={Boolean(errors?.name)}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
          <Text style={styles.label2}>
            This is how it will appear in dating
          </Text>
        </View>
        {/* DOB */}
        <View style={styles.container}>
          <Controller
            control={control}
            name={dob}
            rules={{required: true}}
            defaultValue=""
            render={({field: {onChange, value}}) => (
              <CustomDatePicker
                label="Date Of Birth"
                placeholder="Date of birth"
                value={value.dob}
                onChangeText={onChange}
                errors={Boolean(errors?.dob)}
              />
            )}
          />
          {errors.dob && (
            <Text style={styles.errorText}>{errors.dob.message}</Text>
          )}
          <Text style={styles.label2}>Your age will be public</Text>
        </View>
        {/* Phone Number */}
        <View style={styles.container}>
          <PhoneInput
            name={phone}
            control={control}
            label="Phone Number"
            showError={Boolean(errors?.phone)}
            errors={Boolean(errors?.phone)}
            callingCode={callingCode}
            setCallingCode={setCallingCode}
            // onChangeText={handleChange("phoneNumber")}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone.message}</Text>
          )}

          <Text style={styles.label2}>Your phone will be public</Text>
        </View>
        {/* Gender */}
        <View style={[styles.container1]}>
          <Text style={styles.label1}>Gender</Text>
          {options.map(item => (
            <View key={item.value} style={styles.radio}>
              <Controller
                name={gender}
                control={control}
                defaultValue=""
                render={({field: {onChange, value}}) => (
                  <View
                    style={{
                      marginTop: 4,
                      marginHorizontal: 24,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.radioLabel,
                        {color: errors?.[gender] ? 'red' : 'black'},
                      ]}>
                      {item.label}
                    </Text>
                    <View
                      style={[
                        styles.cricleView,
                        Platform.OS === 'ios' && styles.iosBorder,
                      ]}>
                      <RadioButton
                        value={item.label}
                        status={value === item.label ? 'checked' : 'unchecked'}
                        onPress={() => onChange(item.label)}
                        color={errors?.[gender] ? 'red' : '#AC25AC'}
                        uncheckedColor={errors?.[gender] ? 'red' : '#AC25AC'}
                      />
                    </View>
                  </View>
                )}
              />
            </View>
          ))}
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender.message}</Text>
          )}
        </View>
        {/* Country And  City */}
        <View style={styles.container}>
          <Text style={styles.label}>Location</Text>
          {/* <AppTextInput
            placeholder="Enter Your Country"
            name={country}
            control={control}
            errors={Boolean(errors?.country)}
          />
          {errors.country && (
            <Text style={styles.errorText}>{errors.country.message}</Text>
          )}
          <AppTextInput
            placeholder="Enter Your City"
            name={city}
            control={control}
            errors={Boolean(errors?.city)}
          /> */}
          {errors.city && (
            <Text style={styles.errorText}>{errors.city.message}</Text>
          )}
          <Controller
            control={control}
            name={dob}
            rules={{required: true}}
            defaultValue=""
            render={({field: {onChange, value}}) => <CountryCity />}
          />
        </View>
        {/* Mail */}
        <View style={styles.container}>
          <Text style={styles.label}>Email</Text>
          <AppTextInput
            placeholder="Enter Your Email"
            name={email}
            control={control}
            errors={Boolean(errors?.email)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>
        {/* Password */}
        <View style={styles.container}>
          <Text style={styles.label}>Password</Text>
          <PasswodTextInput
            placeholder="Enter Your Password"
            keyboardType="visible-password"
            name={password}
            control={control}
            errors={Boolean(errors?.password)}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
});

export default ZeroStepScreen;
