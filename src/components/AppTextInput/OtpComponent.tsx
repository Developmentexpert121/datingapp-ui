import React, {useState, useRef, FC} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const OtpComponent: FC = () => {
  // Use a single state variable to hold an array of OTP values
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  // Create refs for each input to manage focus transitions
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  // Function to handle OTP digit change and manage focus transitions
  const handleOTPChange = (txt: string, index: number) => {
    // Update the specific OTP digit in the array
    const newOtp = [...otp];
    newOtp[index] = txt;
    setOtp(newOtp);

    // Move focus forward when input length is equal to or greater than the required length
    if (txt.length >= 1 && index < otp.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
    // Move focus backward when input is empty
    else if (txt.length === 0 && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };
  return (
    <View style={styles.container}>
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
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
