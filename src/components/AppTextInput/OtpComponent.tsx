import React, {useState, useRef, FC} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const OtpComponent: FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleOTPChange = (txt: string, index: number) => {
    const newOtp = [...otp];
    if (txt.length <= 1) {
      newOtp[index] = txt;
      setOtp(newOtp);

      if (txt.length === 1 && index < otp.length - 1) {
        inputRefs[index + 1].current?.focus();
      } else if (txt.length === 0 && index > 0) {
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={value}
          onChangeText={txt => handleOTPChange(txt, index)}
          keyboardType="numeric"
          maxLength={1}
          ref={inputRefs[index]}
          onKeyPress={e => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    textAlign: 'center',
    borderRadius: 5,
  },
});

export default OtpComponent;
