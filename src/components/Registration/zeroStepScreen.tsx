import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {RadioButton} from 'react-native-paper';
import AppTextInput from '../AppTextInput/AppTextInput';
import {Controller} from 'react-hook-form';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';
import {useNavigation} from '@react-navigation/native';
import PhoneInput from '../AppTextInput/PhoneInput';
import {ChevronLeftIC} from '../../assets/svgs';
import CustomDatePicker from '../AppTextInput/CustomDatePicker';
import PasswodTextInput from '../AppTextInput/PasswodTextInput';

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
  dateStr,
  setDateStr,
}: any) => {
  const options = [
    {label: 'Male', value: 'first'},
    {label: 'Female', value: 'second'},
    {label: 'Non-Binary', value: 'third'},
    {label: 'Transgender', value: 'fourth'},
  ];
  const [checked, setChecked] = React.useState('Male');

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState<any>(false);
  const navigation = useNavigation();

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);

    setDateStr(currentDate);
  };
  console.log(dateStr);
  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={{borderWidth: 0, flex: 1}}>
      <View style={styles.topView}>
        <ChevronLeftIC onPress={() => navigation.goBack()} />
        <Text style={styles.headerLabel}>Personal</Text>
        <View style={styles.blankview}></View>
      </View>
      <ScrollView style={{borderWidth: 0, flex: 1}} showsVerticalScrollIndicator={false}>
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

        <View style={styles.container}>
          {/* <Text style={styles.label}>Date Of Birth </Text> */}
          {/* <Controller
          name={dateDisplay}
          control={control}
          render={() => (
            <TouchableOpacity
              onPress={showDatepicker}
              style={[
                styles.dateBtn,
                {
                  borderWidth: errors?.[dateDisplay] ? 2 : 1,
                  borderColor: errors?.[dateDisplay]
                    ? 'red'
                    : 'rgba(0, 0, 0, 0.2)',
                },
              ]}>
              <Text
                style={{
                  color: 'grey',
                  textAlign: 'center',
                  fontFamily: 'Sansation-Regular',
                }}>
                {dateStr === null
                  ? 'Select DOB'
                  : dateStr.getDate() +
                    '-' +
                    (dateStr.getMonth() + 1) +
                    '-' +
                    dateStr.getFullYear()}
              </Text>
            </TouchableOpacity>
          )}
        /> */}
          {/* {show && (
          <DateTimePicker
            style={{alignSelf: 'center'}}
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )} */}
          {/*  */}
          {/* <CustomDatePicker
          // disabled={user?.profileKyc !== "unverified"}
          // editable={!(user?.profileKyc !== "unverified")}
          // onChangeText={handleChange('dateOfBirth')}
          // value={values.dateOfBirth}
          // containerStyle={{marginBottom: 20}}
          label="Date Of Birth"
          placeholder="Date of birth"
        /> */}
          <Controller
            control={control}
            name={dob} // You can specify the name for the field
            rules={{required: true}} // Add any validation rules here
            defaultValue="" // Set the default value
            render={({field: {onChange, onBlur, value}}) => (
              <CustomDatePicker
                label="Date Of Birth"
                placeholder="Date of birth"
                value={value}
                onChangeText={onChange}
                showError={Boolean(errors?.phone)}
                errors={Boolean(errors?.dob)}
                // onBlur={field.onBlur}
                // You can pass any additional props required by CustomDatePicker
              />
            )}
          />
          {errors.dob && (
            <Text style={styles.errorText}>{errors.dob.message}</Text>
          )}
          <Text style={styles.label2}>Your age will be public</Text>
        </View>
        <View style={styles.container}>
          {/* <Text style={styles.label}>Phone number</Text> */}
          {/* <TextInput style={styles.input} placeholder="Enter your name" /> */}
          {/* <AppTextInput
          placeholder="Enter Your Phone"
          name={phone}
          control={control}
          errors={Boolean(errors?.phone)}
          keyboardType="numeric"
        /> */}
          <PhoneInput
            name={phone}
            control={control}
            label="Phone Number"
            // showError={touched.phoneNumber}
            showError={Boolean(errors?.phone)}
            errors={Boolean(errors?.phone)}
            // value={values.phoneNumber}
            // code={values.countryCode}
            // onChangeText={handleChange("phoneNumber")}
            // onCountryCode={handleChange("countryCode")}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone.message}</Text>
          )}

          <Text style={styles.label2}>Your phone will be public</Text>
        </View>

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

        <View style={styles.container}>
          <Text style={styles.label}>Location</Text>
          {/* <TextInput style={styles.input} placeholder="Country" />
          <TextInput style={styles.input} placeholder="City" /> */}
          <AppTextInput
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
          />
          {errors.city && (
            <Text style={styles.errorText}>{errors.city.message}</Text>
          )}
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Email</Text>
          <AppTextInput
            placeholder="Enter Your Email"
            name={email}
            control={control}
            errors={Boolean(errors?.email)}
            autoCapitalize="none"
            keyboardType='email-address'
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>Password</Text>
          <PasswodTextInput
            placeholder="Enter Your Password"
            keyboardType="password"
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
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  flatList: {
    width: '100%',
  },
  maindiv: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5', // Set a background color for the entire screen
  },
  container: {
    width: '90%',
    //padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#AA22AA',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#E1D1E1',
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center', // Center items vertically
    alignItems: 'center',
    paddingVertical: 12,
  },
  container1: {
    width: '90%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#AA22AA',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#E1D1E1',
    marginHorizontal: 20,
    paddingVertical: 12,
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
  buttonPressed: {
    backgroundColor: '#AC25AC',
  },
  radio: {
    flexGrow: 1,
    alignContent: 'flex-start',
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
  },
  radioContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 2,
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
