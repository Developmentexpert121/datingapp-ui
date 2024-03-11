import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

// 1. Import the StreamVideo and StreamVideoClient components
import {
  CallingState,
  StreamVideo,
  StreamVideoClient,
  useCalls,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {videoCallToken} from '../../store/Auth/auth';
import {CallScreen} from '../VideoAudioCall/CallScreen';
import ChatPage from './chatPage';
import {useRoute} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import MyIncomingCallUI from './myIncomingCallUI';
import MyOutgoingCallUI from './myOutgoingCallUI';

const VideoCallRedirect = () => {
  const calls = useCalls();

  const route: any = useRoute();
  const {user} = route.params;

  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  // Define client state
  const [callId, setCallId] = useState<any>('');

  const [enableCamera, setEnableCamera] = useState<boolean>(true);

  const [activeScreen, setActiveScreen] = useState('home');

  const client = useStreamVideoClient();

  useEffect(() => {
    const callId: any = uuid.v4();
    setCallId(callId);
  }, []);

  const goToCallScreen = () => {
    setActiveScreen('call-screen');
    client?.call('default', 'test-outgoing-call').getOrCreate({
      ring: true,
      data: {
        members: [{user_id: profileData._id}, {user_id: user._id}],
      },
    });
  };
  const goToHomeScreen = () => {
    client?.disconnectUser();
    setActiveScreen('home');
    const call = client?.call('default', callId);
    call?.endCall();
  };

  const incomingCalls = calls.filter(
    call =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING,
  );

  const [incomingCall] = incomingCalls;
  if (incomingCall) {
    // render the incoming call UI
    return <MyIncomingCallUI call={incomingCall} />;
  }

  // handle outgoing ring calls
  const outgoingCalls = calls.filter(
    call =>
      call.isCreatedByMe === true &&
      call.state.callingState === CallingState.RINGING,
  );

  const [outgoingCall] = outgoingCalls;
  if (outgoingCall) {
    // render the outgoing call UI
    return <MyOutgoingCallUI call={outgoingCall} />;
  }

  return (
    <SafeAreaView style={styles.containerMain}>
      {client &&
        (activeScreen === 'call-screen' ? (
          <CallScreen
            goToHomeScreen={goToHomeScreen}
            callId={callId}
            enableCamera={enableCamera}
            client={client}
          />
        ) : (
          <ChatPage
            user={user}
            goToCallScreen={goToCallScreen}
            setEnableCamera={setEnableCamera}
          />
        ))}
    </SafeAreaView>
  );
};

export default VideoCallRedirect;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
});
