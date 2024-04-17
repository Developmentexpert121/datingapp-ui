import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CustomOTPInput: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const inputRefs = useRef<TextInput[]>(
    Array(6)
      .fill(null)
      .map(() => React.createRef<TextInput>()),
  );

  const handleInputChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp.join(''));

    // Auto focus to next input
    if (value !== '' && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.current?.focus();
    }
  };

  const handleVerifyOTP = () => {
    // Implement your logic to verify OTP
    console.log('Verifying OTP:', otp);
  };

  return (
    <View style={styles.container}>
      <Text style={{marginBottom: 20}}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {[...Array(6)].map((_, index) => (
          <TextInput
            key={index}
            ref={inputRefs.current[index]}
            style={styles.otpInput}
            onChangeText={value => handleInputChange(index, value)}
            value={otp[index] || ''}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
        <Text style={styles.verifyText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomOTPInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginHorizontal: 5,
    width: 40,
    height: 40,
    textAlign: 'center',
    fontSize: 18,
  },
  verifyButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  verifyText: {
    color: 'white',
    fontSize: 18,
  },
});

// import { View, Text, StyleSheet } from "react-native";
// import React from "react";
// import OTPTextView from "react-native-otp-textinput";
// import Label from "../Label";
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// interface Iprops {
//   showError?: boolean;
//   error?: string;
//   defaultValue?: any;
//   handleTextChange?: any;
// }
// const OtpComponent = ({
//   showError,
//   error,
//   handleTextChange,
//   defaultValue,
// }: Iprops) => {
//   return (
//     <View>
//       <OTPTextView
//         containerStyle={{ marginTop: 15 }}
//         inputCount={6}
//         textInputStyle={styles.input}
//         offTintColor={"#0182FC"}
//         tintColor={"#0182FC"}
//         keyboardType="number-pad"
//         handleTextChange={handleTextChange}
//         defaultValue={defaultValue}
//         // placeholder={"0"}

//         // caretHidden
//         // ref={(input) => (refs.current[index] = input as TextInput)}
//       />
//       <View style={{ height: 30 }}>
//         {showError && error ? (
//           <Label
//             text={"* " + error}
//             style={{ fontSize: 12, marginTop: 5, color: "red" }}
//           />
//         ) : null}
//       </View>
//     </View>
//   );
// };

// export default OtpComponent;

// const styles = StyleSheet.create({
//   input: {
//     height: 45,
//     width: 43,
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#000000",
//     // fontFamily
//     // elevation: 5,
//     // shadowColor: "black",
//     backgroundColor: "#fff",
//     borderColor: "#000",
//     // borderColor: "#000",
//     borderWidth: 1,
//     borderBottomWidth: 1,
//     borderRadius: 16,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     bottom: 15,
//   },
//   verifyTextStyle: {
//     fontSize: 24,
//     fontWeight: "600",
//     fontFamily: "Inter-Normal",
//     color: "#071731",
//   },
//   textstyle: {
//     fontSize: 14,
//     fontFamily: "Inter-Normal",
//     fontWeight: "600",
//     color: "#8C8994",
//     width: "70%",
//     textAlign: "center",
//     lineHeight: 25,
//     marginTop: 10,
//   },
//   buttonView: { width: "90%", marginVertical: "8%" },
// });
