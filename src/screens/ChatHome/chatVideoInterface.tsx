import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Call,
  CallingState,
  StreamCall,
  useCalls,
} from '@stream-io/video-react-native-sdk';
import ChatPage from './chatPage';
import MyOutgoingCallUI from './myOutgoingCallUI';

const VideoCallInterface = ({
  call,
  user,
  goToCallScreen,
  goToHomeScreen,
  setEnableCamera,
  setEnableCamera1,
  activeScreen,
  setCallType,
}: any) => {
  const calls = useCalls();

  // const [outgoingCall] = outgoingCalls;

  const [outgoingCall, setOutgoingCall] = useState<Call | null>(null);
  const [currentScreen, setCurrentScreen] = useState('Home');

  useEffect(() => {
    const outgoingCalls = calls.filter(
      call =>
        call.isCreatedByMe === true &&
        call.state.callingState === CallingState.RINGING,
    );
    if (outgoingCalls) {
      setOutgoingCall(outgoingCalls[0] || null);
      setCurrentScreen('Calling');
    } else {
      setOutgoingCall(null);
    }
  }, [calls]);

  const endCall = () => {
    setCurrentScreen('Home');
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      {currentScreen != 'Home' && outgoingCall ? (
        <StreamCall call={outgoingCall}>
          <MyOutgoingCallUI call={outgoingCall} callEnded={endCall} />
        </StreamCall>
      ) : (
        <ChatPage
          user={user}
          goToCallScreen={goToCallScreen}
          setEnableCamera={setEnableCamera}
          setEnableCamera1={setEnableCamera1}
          setCallType={setCallType}
        />
      )}
    </SafeAreaView>
  );
};

export default VideoCallInterface;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
});
