import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date: any) => {
    setDate(date);
    onChangeText && onChangeText(date.toString());
    hideDatePicker();
  };
  const currentDate = new Date();
  const minDate = new Date(currentDate);
  minDate.setFullYear(minDate.getFullYear() - 56); // 56 years ago
  const maxDate = new Date(currentDate);
  maxDate.setFullYear(maxDate.getFullYear() - 18); // 18 years ago

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
            minimumDate={minDate}
            maximumDate={maxDate}
          />
          <Label
            style={{
              fontSize: 16,
              color: '#434343',
              textAlign: 'center',
              fontFamily: 'Sansation-Regular',
            }}
            text={date == '' ? 'DD-MM-YYYY' : moment(date).format('DD-MM-YYYY')}
          />
        </Pressable>
      </View>
      {showError && error ? (
        <Text style={styles.error}>{'* ' + error}</Text>
      ) : null}
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
  error: {marginTop: 5, color: 'red'},
  errorBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
