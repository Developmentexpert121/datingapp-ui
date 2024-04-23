import React, {useState, useRef, FC} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

const OtpComponent: FC = () => {
  // State for each OTP digit
  const [otp1, setOtp1] = useState<string>('');
  const [otp2, setOtp2] = useState<string>('');
  const [otp3, setOtp3] = useState<string>('');
  const [otp4, setOtp4] = useState<string>('');
  const [otp5, setOtp5] = useState<string>('');
  const [otp6, setOtp6] = useState<string>('');

  // Create refs for each input to manage focus transitions
  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);
  const input4Ref = useRef<TextInput>(null);
  const input5Ref = useRef<TextInput>(null);
  const input6Ref = useRef<TextInput>(null);

  // Function to handle OTP digit change and manage focus transitions
  const handleOTPChange = (
    txt: string,
    setOtp: React.Dispatch<React.SetStateAction<string>>,
    nextInputRef: React.RefObject<TextInput> | null,
    prevInputRef: React.RefObject<TextInput> | null,
  ) => {
    setOtp(txt);

    // Move focus forward when input length is equal to or greater than the required length
    if (txt.length >= 1 && nextInputRef) {
      nextInputRef.current?.focus();
    }
    // Move focus backward when input is empty
    else if (txt.length <= 1 && prevInputRef) {
      prevInputRef.current?.focus();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        <TextInput
          style={styles.input}
          value={otp1}
          onChangeText={txt => handleOTPChange(txt, setOtp1, input2Ref, null)}
          keyboardType="numeric"
          maxLength={1}
          ref={input1Ref}
        />
        <TextInput
          style={styles.input}
          value={otp2}
          onChangeText={txt =>
            handleOTPChange(txt, setOtp2, input3Ref, input1Ref)
          }
          keyboardType="numeric"
          maxLength={1}
          ref={input2Ref}
        />
        <TextInput
          style={styles.input}
          value={otp3}
          onChangeText={txt =>
            handleOTPChange(txt, setOtp3, input4Ref, input2Ref)
          }
          keyboardType="numeric"
          maxLength={1}
          ref={input3Ref}
        />
        <TextInput
          style={styles.input}
          value={otp4}
          onChangeText={txt =>
            handleOTPChange(txt, setOtp4, input5Ref, input3Ref)
          }
          keyboardType="numeric"
          maxLength={1}
          ref={input4Ref}
        />
        <TextInput
          style={styles.input}
          value={otp5}
          onChangeText={txt =>
            handleOTPChange(txt, setOtp5, input6Ref, input4Ref)
          }
          keyboardType="numeric"
          maxLength={1}
          ref={input5Ref}
        />
        <TextInput
          style={styles.input}
          value={otp6}
          onChangeText={txt => handleOTPChange(txt, setOtp6, null, input5Ref)}
          keyboardType="numeric"
          maxLength={1}
          ref={input6Ref}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
