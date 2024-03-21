import {
  CallContent,
  CallingState,
  StreamCall,
  useCallStateHooks,
} from '@stream-io/video-react-native-sdk';
import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export default function MyIncomingCallUI({call, goToHomeScreen}: any) {
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();
  if (callingState === CallingState.RINGING) {
    return (
      <View style={styles.container}>
        <Text>Incoming Call</Text>
        <Button title="Join!" onPress={async () => await call.join()} />
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
