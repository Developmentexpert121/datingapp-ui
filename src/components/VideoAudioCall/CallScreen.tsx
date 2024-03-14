import React from 'react';

import {useCalls, CallingState} from '@stream-io/video-react-native-sdk';
import MyIncomingCallUI from '../Chat/myIncomingCallUI';
import MyOutgoingCallUI from '../Chat/myOutgoingCallUI';

export const CallScreen = ({goToHomeScreen}: any) => {
  const calls = useCalls();

  const incomingCalls = calls.filter(
    call =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING,
  );

  const [incomingCall] = incomingCalls;
  if (incomingCall) {
    return (
      <MyIncomingCallUI call={incomingCall} goToHomeScreen={goToHomeScreen} />
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
      <MyOutgoingCallUI call={outgoingCall} goToHomeScreen={goToHomeScreen} />
    );
  }

  return null;

  // if (!call) {
  //   return (
  //     <View style={joinStyles.container}>
  //       <Text style={styles.text}>Joining call...</Text>
  //     </View>
  //   );
  // }

  // return (
  //   <StreamCall call={call}>
  //     <View style={styles.container}>
  //       <CallContent
  //         onHangupCallHandler={() => {
  //           call.endCall();
  //           goToHomeScreen();
  //           client?.disconnectUser();
  //         }}
  //       />
  //     </View>
  //   </StreamCall>
  // );
};
