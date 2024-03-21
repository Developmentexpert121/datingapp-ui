import {CallContent, StreamCall} from '@stream-io/video-react-native-sdk';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from '../../store/store';

export default function MyOutgoingCallUI({call, goToHomeScreen}: any) {
  const user: any = useAppSelector((state: any) => state?.ActivityLoader?.user);
  return (
    <View style={styles.container}>
      <StreamCall call={call}>
        <View style={styles.container}>
          <CallContent
            onHangupCallHandler={() => {
              goToHomeScreen();
            }}
          />
        </View>
      </StreamCall>
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
