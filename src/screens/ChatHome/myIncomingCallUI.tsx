import {
  CallContent,
  CallingState,
  StreamCall,
  useCallStateHooks,
} from '@stream-io/video-react-native-sdk';
import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export default function MyIncomingCallUI({
  call,
  goToHomeScreen,
  userName,
}: any) {
  const {useCallCallingState, useCameraState} = useCallStateHooks();
  const {camera} = useCameraState();

  const callingState = useCallCallingState();
  if (callingState === CallingState.RINGING) {
    return (
      <View style={styles.container}>
        <Text>Incoming Call {userName}</Text>
        <Button
          color={'green'}
          title="Join!"
          onPress={async () => await call.join()}
        />
        <View style={{height: 50}}></View>
        <Button
          color={'red'}
          title="End"
          onPress={async () => await call.leave()}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CallContent
        onHangupCallHandler={() => {
          goToHomeScreen();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#005fff',
  },
});
