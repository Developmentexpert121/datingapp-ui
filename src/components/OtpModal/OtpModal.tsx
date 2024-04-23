import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Label from '../Label';
// import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";

import Modal from 'react-native-modal';
import MainButton from '../ButtonComponent/MainButton';
import {useAppDispatch} from '../../store/store';
import OtpComponent from '../AppTextInput/OtpComponent';
interface LoginFailModalProps {
  label?: string | undefined;
  onPress?: () => void | undefined;
  text?: string | undefined;
  isVisible?: boolean | undefined;
}
const OtpModal = ({label, onPress, text, isVisible}: LoginFailModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState<string>('');
  const [resendAllowed, setResendAllowed] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(30);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Function to send a new OTP
  const sendNewOTP = async () => {
    if (resendAllowed) {
      setResendAllowed(false);
      setFeedbackMessage('Sending a new OTP...');

      // Simulate sending an OTP (replace with actual API call)
      try {
        // Simulate API call to send OTP
        // const response = await fetch('/api/send-otp');
        // const data = await response.json();

        // Assume OTP sent successfully
        setFeedbackMessage('A new OTP has been sent to your phone.');
      } catch (error) {
        // Handle error (e.g., display an error message)
        setFeedbackMessage(
          'There was an error sending the OTP. Please try again later.',
        );
      }

      // Start the timer for the resend button (e.g., 30 seconds)
      startResendTimer(30);
    }
  };

  // Function to start the resend timer
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
    setOtp(text);
  };

  return (
    <Modal
      animationIn={'slideInDown'}
      isVisible={isVisible}
      // isVisible={modalVisible}
      style={{backgroundColor: 'transparent', margin: 0}}>
      <View style={styles.modal}>
        <View style={styles.modalstyle}>
          <Label
            text={'Enter your verification code'}
            style={styles.textstyle}
          />
          <OtpComponent />
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Didn’t receive a OTP? </Text>
            <TouchableOpacity onPress={sendNewOTP}>
              <Text style={styles.touchableText}>
                {' '}
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
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
    color: '#FFC7FF',
    fontSize: 18,
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
});
