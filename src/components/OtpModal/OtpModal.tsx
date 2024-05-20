import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Label from '../Label';
import MainButton from '../ButtonComponent/MainButton';
import {RootState, useAppDispatch, useAppSelector} from '../../store/store';
import GlobalModal from '../Modals/GlobalModal';
import {CrossIconIC} from '../../assets/svgs';

interface LoginFailModalProps {
  onPress?: () => void | undefined;
  onClose?: () => void | undefined;
  text?: string | undefined;
  isVisible?: boolean | undefined;
  setOtp: any;
  otp: any;
  handleResendOTP?: any;
  resetOTP?: () => void | undefined;
}

const OtpModal = ({
  onClose,
  onPress,
  setOtp,
  otp,
  handleResendOTP,
}: LoginFailModalProps) => {
  const {showOtpModal} = useAppSelector(
    (state: RootState) => state.authSliceState,
  );
  const dispatch = useAppDispatch();
  const [resendAllowed, setResendAllowed] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(59);
  const [isOtpComplete, setIsOtpComplete] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const inputRefs = useRef<TextInput[]>([null, null, null, null, null, null]);

  useEffect(() => {
    const allInputsEmpty = otp.every((value: string) => value === '');
    if (allInputsEmpty) {
      inputRefs.current[0]?.focus();
    }
  }, [otp]);

  const resetOTP = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleOTPChange = (txt: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = txt;
    setOtp(newOtp);
    if (txt.length >= 1 && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (txt.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    const isAllFieldsFilled = newOtp.every(field => field !== '');
    setIsOtpComplete(isAllFieldsFilled);
    if (!isAllFieldsFilled) {
      setErrorMessage('Please fill in all OTP fields.');
    } else {
      setErrorMessage('');
    }
  };

  const sendNewOTP = async () => {
    if (resendAllowed) {
      handleResendOTP();
      setResendAllowed(false);
      startResendTimer(59);
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

  return (
    <Modal
      animationType={'slide'}
      visible={showOtpModal}
      transparent={true}
      style={{backgroundColor: 'transparent', margin: 0}}>
      <View style={styles.modal}>
        <View style={styles.modalstyle}>
          <TouchableOpacity onPress={onClose} style={{alignSelf: 'flex-end'}}>
            <CrossIconIC />
          </TouchableOpacity>
          <Label
            text={'Enter your verification code from email'}
            style={styles.textstyle}
          />
          <View style={styles.otpContainer}>
            {otp.map((value: any, index: any) => (
              <TextInput
                key={index}
                style={styles.input}
                value={value}
                onChangeText={txt => handleOTPChange(txt, index)}
                keyboardType="numeric"
                maxLength={1}
                ref={ref => (inputRefs.current[index] = ref)}
              />
            ))}
          </View>
          <View style={{height: 15}}>
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
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
            disabled={!isOtpComplete}
          />
        </View>
        <GlobalModal />
      </View>
    </Modal>
  );
};

export default OtpModal;

const styles = StyleSheet.create({
  textstyle: {
    width: '70%',
    fontSize: 20,
    color: '#071731',
    textAlign: 'center',
    marginVertical: 20,
  },
  modalstyle: {
    height: 325,
    width: '90%',
    backgroundColor: '#FFC7FF',
    borderRadius: 10,
    alignItems: 'center',
    bottom: 20,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000066',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    height: 15,
  },
});
