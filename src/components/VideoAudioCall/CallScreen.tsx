//import React from 'react';
import React, {useEffect} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import {
  Call,
  StreamCall,
  useStreamVideoClient,
  CallContent,
} from '@stream-io/video-react-native-sdk';

type Props = {
  goToHomeScreen: () => void;
  callId: string;
  enableCamera: boolean;
  client: any;
};

export const CallScreen = ({
  goToHomeScreen,
  callId,
  enableCamera,
  client,
}: Props) => {
  const [call, setCall] = React.useState<Call | null>(null);

  useEffect(() => {
    console.log('Enableeeeeeee', enableCamera);
    const initializeCall = async () => {
      const call = client?.call('default', callId);
      if (call) {
        if (enableCamera === true) {
          await call.camera.enable();
        } else {
          await call.camera.disable();
        }
        await call.microphone.enable();
      }
      call?.join({create: true}).then(() => setCall(call));
    };

    initializeCall();

    return () => {
      if (call) {
        call.endCall();
      }
    };
  }, [client, callId, enableCamera]);

  if (!call) {
    return (
      <View style={joinStyles.container}>
        <Text style={styles.text}>Joining call...</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <View style={styles.container}>
        <CallContent
          onHangupCallHandler={() => {
            call.endCall();
            goToHomeScreen();
          }}
        />
      </View>
    </StreamCall>
  );
};

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

const joinStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    padding: 20,
    // Additional styles for the text if needed
  },
});
