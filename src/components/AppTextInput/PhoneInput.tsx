import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import React, {useState} from 'react';
import {CountryPicker} from 'react-native-country-codes-picker';
import {Down1IC} from '../../assets/svgs';
import Label from '../Label';
import {findFlagByDialCode} from '../../utils/helper';
import Colors from '../../constants/Colors';
import {Controller} from 'react-hook-form';
interface Iprops {
  label?: string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  InputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  rightIcon?: any;
  error?: string;
  onChangeText?: ((text: string) => void) | undefined;
  onCountryCode?: ((text: string) => void) | undefined;
  value?: string | undefined;
  showError?: boolean;
  code?: any;
  editable?: boolean;
  countryDisable?: boolean;
  errors?: boolean;
  name?: any;
  control?: any;
  callingCode?: any;
  setCallingCode?: any;
}
const PhoneInput = ({
  name,
  control,
  label,
  code,
  showError,
  error,
  onChangeText,
  editable,
  countryDisable,
  errors,
  callingCode,
  setCallingCode,
}: Iprops) => {
  const [show, setShow] = useState<boolean>(false);

  const [countryFlag, setCountryFlag] = useState(
    findFlagByDialCode(code || '+91'),
  );

  const hasError = errors;
  return (
    <Controller
      name={name}
      control={control}
      rules={{required: true}}
      defaultValue=""
      render={({field: {onChange, onBlur, value}}) => (
        <View style={styles.container}>
          <Label text={label} style={[styles.label]} />

          <View
            style={[
              // {
              styles.inputView,
              //   borderColor: showError && error ? 'red' : 'transparent',
              //   borderWidth: showError && error ? 2 : 2,
              // },
              hasError
                ? styles.errorBorder
                : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
            ]}>
            <Pressable
              style={[styles.countryWrap, countryDisable && {opacity: 0.5}]}
              disabled={countryDisable}
              onPress={() => setShow(true)}>
              <Label text={countryFlag || ''} />
              <Label
                text={callingCode}
                style={{marginHorizontal: 8, fontSize: 16}}
              />
              <Down1IC />
            </Pressable>
            <CountryPicker
              show={show}
              onBackdropPress={() => setShow(false)}
              pickerButtonOnPress={item => {
                setCallingCode(item.dial_code);
                setCountryFlag(item?.flag);
                setShow(false);
              }}
              style={{
                modal: {
                  height: '80%',
                  // backgroundColor: 'red'
                },
              }}
              lang={'en'}
            />
            <View style={styles.inputField}>
              <TextInput
                editable={editable}
                style={{flex: 1, fontSize: 16}}
                placeholder="Enter Phone Number"
                value={value}
                returnKeyType="done"
                onChangeText={onChange}
                keyboardType="phone-pad"
                maxLength={12}
              />
            </View>
          </View>
          <View style={{height: 15, marginTop: 4}}>
            {/* {showError && error ? (
          <Label
            text={'* ' + error}
            style={{color: '#FD4755', fontSize: 10, textAlign: 'right'}}
          />
        ) : null} */}
          </View>
        </View>
      )}
    />
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  countryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputView: {
    height: 45,
    width: '80%',
    backgroundColor: Colors.onPrimary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    marginTop: 10,
  },
  label: {
    fontSize: 20,
    fontFamily: 'Sansation-Bold',
    color: 'black',
    textAlign: 'center',
  },
  container: {
    marginVertical: 5,
  },
  flagStyle: {
    marginRight: 10,
    height: 22,
    width: 22,
    borderRadius: 11,
  },
  inputField: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  errorBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
