import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../constants/Colors';
import Font from '../../constants/Fonts';
import FontSize from '../../constants/FontSize';
import Spacing from '../../constants/Spacing';
import {Controller, FieldErrors, Control, FieldValues} from 'react-hook-form';

const AppTextInput = (Props: any) => {
  const {
    name,
    control,
    errors,
    borderColor,
    borderWidth,
    marginLeft,
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

            hasError && styles.errorBorder,
            {
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.2)',
              width: '80%',
            },
          ]}
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

export default AppTextInput;

const styles = StyleSheet.create({
  textInput1: {
    fontFamily: 'Sansation_Regular',
    fontSize: 16,
    padding: Spacing,
    backgroundColor: Colors.onPrimary,
    borderRadius: 13,
    marginVertical: 10,
  },

  errorBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
