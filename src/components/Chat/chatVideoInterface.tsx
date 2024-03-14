import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCalls,
} from '@stream-io/video-react-native-sdk';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {CallScreen} from '../VideoAudioCall/CallScreen';
import ChatPage from './chatPage';
import {useRoute} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import {videoCallToken} from '../../store/Auth/auth';
import MyIncomingCallUI from './myIncomingCallUI';
import MyOutgoingCallUI from './myOutgoingCallUI';

const VideoCallInterface = ({
  client,
  user,
  goToCallScreen,
  goToHomeScreen,
  setEnableCamera,
  activeScreen,
}: any) => {
  const calls = useCalls();

  const incomingCalls = calls.filter(
    call =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING,
  );

  const [incomingCall] = incomingCalls;
  if (incomingCall) {
    return (
      <StreamCall call={incomingCall} key={incomingCall.cid}>
        <MyIncomingCallUI call={incomingCall} goToHomeScreen={goToHomeScreen} />
      </StreamCall>
    );
  }

  // handle outgoing ring calls
  const outgoingCalls = calls.filter(
    call =>
      call.isCreatedByMe === true &&
      call.state.callingState === CallingState.RINGING,
  );

  const [outgoingCall] = outgoingCalls;
  if (outgoingCall) {
    return (
      <StreamCall call={outgoingCall}>
        <MyOutgoingCallUI call={outgoingCall} goToHomeScreen={goToHomeScreen} />
      </StreamCall>
    );
  }

  return (
    <SafeAreaView style={styles.containerMain}>
      <ChatPage
        user={user}
        goToCallScreen={goToCallScreen}
        setEnableCamera={setEnableCamera}
      />
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
