import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {
  Call,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {CallScreen} from '../VideoAudioCall/CallScreen';
import ChatPage from './chatPage';
import {useRoute} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import {videoCallToken} from '../../store/Auth/auth';
import VideoCallInterface from './chatVideoInterface';

const VideoCallRedirect = () => {
  const route: any = useRoute();
  const {user} = route.params;

  const dispatch: any = useAppDispatch();

  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const [callId, setCallId] = useState<any>('');

  const [enableCamera, setEnableCamera] = useState<boolean>(true);

  const [activeScreen, setActiveScreen] = useState('home');

  const [client, setClient] = useState<StreamVideoClient | null>(null);

  const [call, setCall] = useState<Call>();

  useEffect(() => {
    const callId: any = uuid.v4();
    setCallId(callId);
    const apiKey = 'tgmn64zvvytf';
    const tokenProvider = async () => {
      const token = await dispatch(videoCallToken({id: profileData?._id}))
        .unwrap()
        .then((response: any) => response.token);
      return token;
    };

    const userMain = {
      id: profileData?._id,
      name: profileData?.name,
      image: profileData?.profilePic,
    };

    const myClient = new StreamVideoClient({
      apiKey,
      user: userMain,
      tokenProvider,
    });
    setClient(myClient);
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
    setCall(myCall);
    setActiveScreen('call-screen');
  }, [client, user]);

  const goToHomeScreen = () => {
    setActiveScreen('home');
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      {client && (
        <StreamVideo client={client}>
          <VideoCallInterface
            client={client}
            goToHomeScreen={goToHomeScreen}
            user={user}
            goToCallScreen={goToCallScreen}
            setEnableCamera={setEnableCamera}
            activeScreen={activeScreen}
          />
        </StreamVideo>
      )}
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
