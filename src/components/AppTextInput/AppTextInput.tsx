import {NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputFocusEventData, TextInputProps, View} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../constants/Colors';
import Font from '../../constants/Fonts';
import FontSize from '../../constants/FontSize';
import Spacing from '../../constants/Spacing';
import {Controller, FieldErrors, Control, FieldValues} from "react-hook-form"

const AppTextInput = (Props:any) => {
  const { name, control, errors, borderColor, borderWidth, marginLeft, ...textInputProps } = Props;
  const [focused, setFocused] = useState<boolean>(false);
  const hasError = errors;

  return (
     <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        defaultValue=""
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            {...textInputProps}
            style={[styles.textInput1, styles.textInput11, hasError && styles.errorBorder, 
              // {borderWidth:borderWidth?borderWidth:0, borderColor:borderColor?borderColor:0, marginLeft: marginLeft}
            ]}
            placeholderTextColor={Colors.darkText}
            onFocus={() => setFocused(true)}
            onBlur={()=>(onBlur(), setFocused(false))}
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
    fontFamily: Font['poppins-regular'],
    fontSize: FontSize.small,
    padding: Spacing * 1,
    backgroundColor: Colors.onPrimary,
    borderRadius: Spacing*2,
    marginVertical: Spacing,
    width: 300
  },
  textInput11: {
   // borderWidth: 1,
    borderColor: Colors.primary,
    shadowOffset: {width: 4, height: Spacing},
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: Spacing,
  },
  errorBorder:{
    borderWidth: 2,
    borderColor: 'red'
  },
  none:{
    borderColor: 'none'
  },
});
