import {
  StyleSheet,
  TextInput
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';
import {Controller} from 'react-hook-form';

const LoginTextInput = (Props: any) => {
  const {
    name,
    control,
    errors,
    borderColor,
    borderWidth,
    marginLeft,
    textstyle,
    ...textInputProps
  } = Props;
  const [focused, setFocused] = useState<boolean>(false);
  const hasError = errors;

  return (
    <Controller
      name={name}
      control={control}
      rules={{required: true}}
      defaultValue=""
      render={({field: {onChange, onBlur, value}}) => (
        <TextInput
          {...textInputProps}
          style={[
            styles.textInput1,
            hasError
              ? styles.errorBorder
              : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
            {
              width: '80%',
            },
            ,
            textstyle,
          ]}
          keyboardType={Props.keyboardType}
          placeholderTextColor={Colors.darkText}
          onFocus={() => setFocused(true)}
          onBlur={() => (onBlur(), setFocused(false))}
          onChangeText={onChange}
          value={value}
          error={Boolean(errors)}
        />
      )}
    />
  );
};

export default LoginTextInput;

const styles = StyleSheet.create({
  textInput1: {
    height: 45,
    fontFamily: 'Sansation_Regular',
    fontSize: 16,
    padding: Spacing,
    backgroundColor: Colors.onPrimary,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 3,
    // textAlign: 'center',
  },

  errorBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
