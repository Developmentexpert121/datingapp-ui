import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RadioButton} from 'react-native-paper';
import AppTextInput from '../AppTextInput/AppTextInput';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as yup from 'yup';
import Colors from '../../constants/Colors';
import Font from '../../constants/Fonts';
import FontSize from '../../constants/FontSize';
import Spacing from '../../constants/Spacing';
import {CountryPicker} from 'react-native-country-codes-picker';
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
  dateDisplay,
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
    <SafeAreaView>
      <Text style={styles.headerLabel}>Personal</Text>
      <View style={styles.container}>
        <Text style={styles.label}>My name is</Text>
        {/* <TextInput style={styles.input} placeholder="Enter your name" /> */}
        <AppTextInput
          placeholder="Enter Your Name"
          name={name}
          control={control}
          errors={Boolean(errors?.name)}
        />
        <Text style={styles.label2}>This is how it will appear in dating</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Date Of Birth </Text>
        <Controller
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
                  fontFamily: 'Sansation_Regular',
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
        />
        <Text style={styles.label2}>Your age will be public</Text>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Phone number</Text>
        {/* <TextInput style={styles.input} placeholder="Enter your name" /> */}
        <AppTextInput
          placeholder="Enter Your Phone"
          name={phone}
          control={control}
          errors={Boolean(errors?.phone)}
          keyboardType="numeric"
        />
        <Text style={styles.label2}>Yor name will be public</Text>
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
                  <RadioButton
                    value={item.label}
                    status={value === item.label ? 'checked' : 'unchecked'}
                    onPress={() => onChange(item.label)}
                    color={errors?.[gender] ? 'red' : '#AC25AC'}
                    uncheckedColor={errors?.[gender] ? 'red' : '#AC25AC'}
                  />
                </View>
              )}
            />
          </View>
        ))}
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
        <AppTextInput
          placeholder="Enter Your City"
          name={city}
          control={control}
          errors={Boolean(errors?.city)}
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Email</Text>
        <AppTextInput
          placeholder="Enter Your Email"
          name={email}
          control={control}
          errors={Boolean(errors?.email)}
        />
        {errors.email && (
          <Text style={{color: 'red', fontFamily: 'Sansation_Regular'}}>
            {errors.email.message}
          </Text>
        )}
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Password</Text>
        <AppTextInput
          placeholder="Enter Your Password"
          keyboardType="password"
          name={password}
          control={control}
          errors={Boolean(errors?.password)}
        />
      </View>
    </SafeAreaView>
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
    fontFamily: 'Sansation_Bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
  },
  label1: {
    fontSize: 20,
    //marginBottom: 0,
    textAlign: 'center',
    fontFamily: 'Sansation_Bold',
    color: 'black',
  },

  label: {
    fontSize: 20,
    fontFamily: 'Sansation_Bold',
    color: 'black',
  },

  label2: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 2,
    fontFamily: 'Sansation_Regular',
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

    fontFamily: 'Sansation_Regular',
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
});

export default ZeroStepScreen;
