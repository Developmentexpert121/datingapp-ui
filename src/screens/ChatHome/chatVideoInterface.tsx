import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
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

  const outgoingCalls = calls.filter(
    call =>
      call.isCreatedByMe === true &&
      call.state.callingState === CallingState.RINGING,
  );

  const [outgoingCall] = outgoingCalls;

  return (
    <SafeAreaView style={styles.containerMain}>
      {outgoingCall ? (
        <StreamCall call={outgoingCall}>
          <MyOutgoingCallUI
            call={outgoingCall}
            goToHomeScreen={goToHomeScreen}
          />
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
