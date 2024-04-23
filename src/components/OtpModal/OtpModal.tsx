import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Label from '../Label';
// import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";

import Modal from 'react-native-modal';
import MainButton from '../ButtonComponent/MainButton';
import {RootState, useAppDispatch, useAppSelector} from '../../store/store';
import OtpComponent from '../AppTextInput/OtpComponent';
import {otpModal} from '../../store/reducer/authSliceState';
import {EmailVerification, VerifyOtp} from '../../store/Auth/auth';
interface LoginFailModalProps {
  label?: string | undefined;
  onPress?: () => void | undefined;
  text?: string | undefined;
  isVisible?: boolean | undefined;
  setOtp: any;
  otp: any;
  value?: any;
}
const OtpModal = ({
  label,
  onPress,
  text,
  isVisible,
  setOtp,
  otp,
  value,
}: LoginFailModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {showOtpModal} = useAppSelector(
    (state: RootState) => state.authSliceState,
  );
  const dispatch = useAppDispatch();
  const [otp1, setOtp1] = useState<string>('');
  const [resendAllowed, setResendAllowed] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(30);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

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
    newOtp[index] = txt;
    setOtp(newOtp);
    if (txt.length >= 1 && index < otp.length - 1) {
      inputRefs[index + 1].current?.focus();
    } else if (txt.length === 0 && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  useEffect(() => {
    sendNewOTP();
  }, []);

  const sendNewOTP = async () => {
    if (resendAllowed) {
      setResendAllowed(false);
      setFeedbackMessage('Sending a new OTP...');
      // dispatch(
      //   EmailVerification({
      //     email: 'vkarwasra127@gmail.com',
      //   })
      // )
      try {
        setFeedbackMessage('A new OTP has been sent to your phone.');
      } catch (error) {
        setFeedbackMessage(
          'There was an error sending the OTP. Please try again later.',
        );
      }
      startResendTimer(30);
    }
  };
  const startResendTimer = (seconds: number) => {
    setTimer(seconds);
    const timerInterval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(timerInterval);
          setResendAllowed(true);
          return 0;
        }
      });
    }, 1000);
  };
  // Handle OTP input changes
  const handleOtpChange = (text: string) => {
    setOtp1(text);
  };
  return (
    <Modal
      animationIn={'slideInDown'}
      // isVisible={isVisible}
      isVisible={showOtpModal}
      style={{backgroundColor: 'transparent', margin: 0}}>
      <View style={styles.modal}>
        <View style={styles.modalstyle}>
          <Label
            text={'Enter your verification code'}
            style={styles.textstyle}
          />
          {/* <OtpComponent />   */}

          <View style={styles.otpContainer}>
            {otp.map((value: any, index: any) => (
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

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Didn’t receive a OTP? </Text>
            <TouchableOpacity onPress={sendNewOTP} disabled={!resendAllowed}>
              <Text style={styles.touchableText}>
                {resendAllowed ? 'Resend' : `${timer} seconds`}
              </Text>
            </TouchableOpacity>
          </View>
          <MainButton
            buttonStyle={{width: '85%', marginTop: 20}}
            ButtonName={'Verify OTP'}
            onPress={onPress}
          />
        </View>
      </View>
    </Modal>
  );
};

export default OtpModal;
const styles = StyleSheet.create({
  textstyle: {
    width: '50%',
    fontSize: 20,
    // fontWeight: "400",
    color: '#071731',
    textAlign: 'center',
    marginVertical: 20,
  },
  modalstyle: {
    height: '40%',
    width: '90%',
    backgroundColor: '#FFC7FF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000066',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 0,
  },
  loginText: {
    color: 'black',
    marginRight: 5,
    fontFamily: 'Sansation-Regular',
  },
  touchableText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: 'Sansation-Bold',
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
