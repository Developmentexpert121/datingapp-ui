import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Call,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import {useAppDispatch, useAppSelector} from '../../store/store';
import uuid from 'react-native-uuid';
import {videoCallToken} from '../../store/Auth/auth';
import VideoCallInterface from './chatVideoInterface';

const VideoCallRedirect = () => {
  const user: any = useAppSelector((state: any) => state?.ActivityLoader?.user);
  // console.log('ashdfigsufgosudfgous', user?.deactivate);
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const [callId, setCallId] = useState<any>(uuid.v4());
  const [enableCamera, setEnableCamera] = useState<boolean>(true);
  const [enableCamera1, setEnableCamera1] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState('home');
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    const apiKey = 'xxbhmm34dcx3';
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

    return () => {
      myClient.disconnectUser();
      setClient(null);
    };
  }, [dispatch, profileData?._id, profileData?.name, profileData?.profilePic]);

  const handleCallEnd = useCallback(() => {
    setActiveScreen('home');
    setCall(null);
  }, []);

  const goToCallScreen = useCallback(() => {
    if (!client) return;

    const myCall = client.call('default', callId);
    myCall.on('call.left', event => {
      console.log('User left the call:', event.user.id);
      if (event.user.id !== profileData._id) {
        handleCallEnd();
      }
    });

    myCall.on('call.ended', event => {
      console.log('Call ended:', event);
      handleCallEnd();
    });

    myCall
      .getOrCreate({
        ring: true,
        data: {
          members: [{user_id: profileData._id}, {user_id: user._id}],
          // custom: {color: '#AA22AA'},
          // settings_override: {
          //   audio: {mic_default_on: false},
          //   video: {camera_default_on: false},
          // },
        },
      })
      .catch(err => {
        console.error('Failed to join the call', err);
      });

    setCall(myCall);
    setActiveScreen('call-screen');

    return () => {
      myCall.leave().catch(err => {
        console.error('Failed to leave the call', err);
      });
    };
  }, [client, callId, profileData._id, user._id, handleCallEnd]);

  const goToHomeScreen = () => {
    if (call) {
      call.leave();
      handleCallEnd();
    } else {
      setActiveScreen('home');
    }
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      {client && (
        <StreamVideo client={client}>
          <VideoCallInterface
            call={call}
            client={client}
            goToHomeScreen={goToHomeScreen}
            user={user}
            goToCallScreen={goToCallScreen}
            setEnableCamera={setEnableCamera}
            setEnableCamera1={setEnableCamera1}
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
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
