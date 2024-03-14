import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {useStreamVideoClient} from '@stream-io/video-react-native-sdk';
import {useAppSelector} from '../../store/store';
import {CallScreen} from '../VideoAudioCall/CallScreen';
import ChatPage from './chatPage';
import {useRoute} from '@react-navigation/native';
import uuid from 'react-native-uuid';

const VideoCallRedirect = () => {
  const route: any = useRoute();
  const {user} = route.params;

  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const [callId, setCallId] = useState<any>('');

  const [enableCamera, setEnableCamera] = useState<boolean>(true);

  const [activeScreen, setActiveScreen] = useState('home');

  const client = useStreamVideoClient();

  useEffect(() => {
    const callId: any = uuid.v4();
    setCallId(callId);
  }, []);

  const goToCallScreen = useCallback(() => {
    if (!client) return;
    const myCall = client.call('default', callId);
    myCall
      .getOrCreate({
        ring: true,
        data: {
          members: [
            // include self
            {user_id: profileData._id},
            // include the userId of the callee
            {user_id: user._id},
          ],
        },
      })
      .catch(err => {
        console.error(`Failed to join the call`, err);
      });

    setActiveScreen('call-screen');
    return () => {
      myCall.leave().catch(err => {
        console.error(`Failed to leave the call`, err);
      });
    };
  }, [client, user]);

  const goToHomeScreen = () => {
    setActiveScreen('home');
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      {client &&
        (activeScreen === 'call-screen' ? (
          <CallScreen
            goToHomeScreen={goToHomeScreen}
            callId={callId}
            enableCamera={enableCamera}
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
