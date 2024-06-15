import React, {useState, useEffect} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Label from '../Label';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Spacing from '../../constants/Spacing';
import Colors from '../../constants/Colors';

interface Iprops {
  label?: string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  InputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  secureTextEntry?: boolean;
  error?: string;
  onChangeText?: ((text: string) => void) | undefined;
  value?: string;
  showError?: boolean | undefined | string;
  children?: JSX.Element;
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url';
  editable?: boolean;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  disabled?: any;
  errors?: boolean;
}

const CustomDatePicker = ({
  label,
  containerStyle,
  InputContainerStyle,
  error,
  value,
  showError,
  onChangeText,
  disabled,
  errors,
}: Iprops) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState<string>('');
  const [dateError, setDateError] = useState<string | null>(null);
  console.log(date);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: any) => {
    const selectedDateTime = new Date(selectedDate);
    const minDate = moment().subtract(56, 'years').toDate();
    const maxDate = moment().subtract(18, 'years').toDate();

    // Validate the selected date
    if (selectedDateTime < minDate) {
      setDateError('Date must be within the past 56 years');
    } else if (selectedDateTime > maxDate) {
      setDateError('Date must be within the last 18 years');
    } else {
      setDateError(null);
    }

    setDate(selectedDate);
    if (onChangeText) {
      onChangeText(selectedDate.toString());
    }
    hideDatePicker();
  };

  useEffect(() => {
    setDate(value ?? '');
  }, [value]);

  const hasError = errors;

  return (
    <View style={[styles.container, containerStyle]}>
      <Label text={label} style={[styles.label]} />
      <View
        style={[
          styles.inputContainer,
          InputContainerStyle,
          hasError
            ? styles.errorBorder
            : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
        ]}>
        <Pressable
          disabled={disabled}
          style={styles.input}
          onPress={showDatePicker}>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            // minimumDate={moment().subtract(56, 'years').toDate()}
            // maximumDate={moment().subtract(18, 'years').toDate()}
          />
          <Label
            style={{
              fontSize: 16,
              color: '#434343',
              textAlign: 'center',
              fontFamily: 'Sansation-Regular',
            }}
            text={
              date === '' ? 'DD-MM-YYYY' : moment(date).format('DD-MM-YYYY')
            }
          />
        </Pressable>
      </View>
      {dateError && <Text style={styles.error}>{`* ${dateError}`}</Text>}
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    borderWidth: 0,
    width: '100%',
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.onPrimary,
    marginVertical: Spacing,
    width: '80%',
    borderRadius: 10,
    alignSelf: 'center',
    borderWidth: 1,
  },
  error: {marginTop: 5, color: 'red', textAlign: 'center'},
  errorBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
