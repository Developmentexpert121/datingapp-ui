import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {
  CallingState,
  StreamCall,
  useCalls,
} from '@stream-io/video-react-native-sdk';
import ChatPage from './chatPage';
import MyIncomingCallUI from './myIncomingCallUI';
import MyOutgoingCallUI from './myOutgoingCallUI';

const VideoCallInterface = ({
  call,
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
      <StreamCall call={incomingCall} key={incomingCall?.cid}>
        <MyIncomingCallUI call={incomingCall} goToHomeScreen={goToHomeScreen} />
      </StreamCall>
    );
  }

  return (
    <SafeAreaView style={styles.containerMain}>
      {activeScreen === 'call-screen' ? (
        call ? (
          <MyOutgoingCallUI call={call} goToHomeScreen={goToHomeScreen} />
        ) : (
          <View>
            <Text style={{fontFamily: 'Sansation-Regular'}}>
              Calling...{user?.name}
            </Text>
          </View>
        )
      ) : (
        <ChatPage
          user={user}
          goToCallScreen={goToCallScreen}
          setEnableCamera={setEnableCamera}
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
