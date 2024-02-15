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

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  gender: yup.string().required('Please select your gender'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
const ZeroStepScreen = ({
  name,
  phone,
  control,
  errors,
  email,
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
    const dateString = currentDate;
    const date = new Date(dateString);
    setDateStr(date);
  };

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
  console.log('dateee ===== ', date);
  // const {
  //   control,
  //   handleSubmit,
  //   watch,
  //   reset,
  //   formState: {errors},
  // } = useForm<RegForm0>({
  //   defaultValues,
  //   resolver: yupResolver(schema),
  // });

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
        <TouchableOpacity onPress={showDatepicker} style={[styles.dateBtn]}>
          <Text style={{color: 'grey', textAlign: 'center'}}>
            {dateStr === null
              ? 'Select DOB'
              : dateStr.getDate() +
                '-' +
                (dateStr.getMonth() + 1) +
                '-' +
                dateStr.getFullYear()}
          </Text>
        </TouchableOpacity>
        <Text style={styles.label2}>Your age will be in public</Text>
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
                <>
                  <RadioButton
                    value={item.label}
                    status={value === item.label ? 'checked' : 'unchecked'}
                    onPress={() => onChange(item.label)}
                  />
                  <Text
                    style={[
                      styles.radioLabel,
                      {color: errors?.[gender] ? 'red' : 'grey'},
                    ]}>
                    {item.label}
                  </Text>
                </>
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
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Password</Text>
        <AppTextInput
          placeholder="Enter Your Password"
          type="password"
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
    borderRadius: 10,
    borderWidth: 1,
    // borderColor: '#BB2CBB',
    marginTop: 20,
    backgroundColor: '#E1D1E1',
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center', // Center items vertically
    alignItems: 'center',
  },
  container1: {
    width: '90%',
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    // borderColor: '#BB2CBB',
    marginTop: 20,
    backgroundColor: '#E1D1E1',
    marginHorizontal: 20,
  },

  headerLabel: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  label1: {
    fontSize: 20,
    //marginBottom: 0,
    textAlign: 'center',
  },

  label: {
    fontSize: 20,
   // marginBottom: 0,
    // textAlign: 'center',
  },

  label2: {
    fontSize: 16,
    textAlign: 'center',
      marginBottom: 2,
  },

  input: {
    //height: 40,
    color: 'gray',
    textAlign: 'center',
    //borderRadius: 5,
  },

  buttonPressed: {
    backgroundColor: '#BB2CBB',
  },
  radio: {
    flexDirection: 'row',
    marginLeft: 100,
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 10,
  },
  radioContainer: {
   flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  dateBtn: {
    fontFamily: Font['poppins-regular'],
    fontSize: FontSize.small,
    padding: Spacing * 1,
    backgroundColor: Colors.onPrimary,
    borderRadius: Spacing * 2,
    marginVertical: Spacing,
    width: 300,
  },
});

export default ZeroStepScreen;
