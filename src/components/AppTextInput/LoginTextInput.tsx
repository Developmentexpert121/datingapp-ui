import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {memo, useState} from 'react';
import Colors from '../../constants/Colors';
import {Controller} from 'react-hook-form';
import {EyeslashIC, EyeslashOpenIC} from '../../assets/svgs';

const LoginTextInput = memo((Props: any) => {
  const {
    name,
    control,
    errors,
    borderColor,
    borderWidth,
    marginLeft,
    textstyle,
    autoCapitalize,
    viewStyle,
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
            styles.viewInput,
            hasError
              ? styles.errorBorder
              : {borderWidth: 2, borderColor: 'rgba(0, 0, 0, 0.2)'},
            viewStyle,
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
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry && !showPassword}
          />
          {rightIcon}
          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}>
              {showPassword ? <EyeslashOpenIC /> : <EyeslashIC />}
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
});

export default LoginTextInput;

const styles = StyleSheet.create({
  textInput1: {
    // height: 45,
    fontFamily: 'Sansation-Regular',
    fontSize: 16,
    width: '90%',
  },
  viewInput: {
    flexDirection: 'row',
    height: 45,
    paddingLeft: 10,
    backgroundColor: Colors.onPrimary,
    borderRadius: 10,
    marginVertical: 4,
    width: '100%',
  },
  icon: {
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    right: 15,
  },
  errorBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
