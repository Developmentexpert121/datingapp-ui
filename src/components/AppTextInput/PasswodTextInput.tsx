import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../constants/Colors';
import Font from '../../constants/Fonts';
import FontSize from '../../constants/FontSize';
import Spacing from '../../constants/Spacing';
import {Controller} from 'react-hook-form';
import {EyeslashIC} from '../../assets/svgs';

const PasswodTextInput = (Props: any) => {
  const {
    name,
    control,
    errors,
    borderColor,
    borderWidth,
    marginLeft,
    textstyle,
    rightIcon,
    secureTextEntry,
    ...textInputProps
  } = Props;
  const [focused, setFocused] = useState<boolean>(false);
  const hasError = errors;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={{required: true}}
      defaultValue=""
      render={({field: {onChange, onBlur, value}}) => (
        <View
          style={[
            {...styles.viewInput},
            hasError
              ? styles.errorBorder
              : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
            {
              width: '80%',
            },
          ]}>
          <TextInput
            {...textInputProps}
            style={[styles.textInput1, textstyle]}
            keyboardType={Props.keyboardType}
            placeholderTextColor={Colors.darkText}
            onFocus={() => setFocused(true)}
            onBlur={() => (onBlur(), setFocused(false))}
            onChangeText={onChange}
            value={value}
            error={Boolean(errors)}
            secureTextEntry={secureTextEntry && !showPassword}
          />
          {rightIcon}
          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}>
              {showPassword ? <EyeslashIC /> : <EyeslashIC />}
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

export default PasswodTextInput;

const styles = StyleSheet.create({
  textInput1: {
    height: 45,
    fontFamily: 'Sansation-Regular',
    fontSize: 16,
    paddingLeft: 10,
    width: '88%',
    textAlign: 'center',
  },
  viewInput: {
    height: 45,
    // padding: Spacing,
    backgroundColor: Colors.onPrimary,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  errorBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
  icon: {
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
  },
});
