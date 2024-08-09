import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Call,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from '@stream-io/video-react-native-sdk';
import {useAppDispatch, useAppSelector} from '../../store/store';
import uuid from 'react-native-uuid';
import {videoCallToken} from '../../store/Auth/auth';
import VideoCallInterface from './chatVideoInterface';

const VideoCallRedirect = () => {
  const user: any = useAppSelector((state: any) => state?.ActivityLoader?.user);
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const clientData: any = useAppSelector(
    (state: any) => state?.ActivityLoader?.clientData,
  );

  const callId: any = uuid.v4();

  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [enableCamera, setEnableCamera] = useState<boolean>(true);
  const [enableCamera1, setEnableCamera1] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState('home');
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | any>(null);
  const [callType, setCallType] = useState('videoCall');

  const handleCallEnd = useCallback(() => {
    setActiveScreen('home');
    setCall(null);
  }, []);

  const goToCallScreen = useCallback(
    (type: any) => {
      console.log('CAll create hit ==>', type);
      if (!client) return;
      const myCall: any = client.call(
        type === 'videoCall' ? 'default' : 'audio_call',
        callId,
      );
      myCall.on('call.left', async (event: any) => {
        if (event.user.id !== profileData._id) {
          // await myCall.endCall();
          handleCallEnd();
        } else {
          console.log('SecondSecondSecondSecondSecond');
          // await myCall.endCall();
        }
      });

      myCall.on('call.ended', (event: any) => {
        // myCall.leave();
        handleCallEnd();
      });

      myCall
        .getOrCreate({
          ring: true,
          data: {
            members: [{user_id: profileData._id}, {user_id: user._id}],
          },
        })
        .catch((err: any) => {
          console.error('Failed to join the call', err);
        });

      setCall(myCall);
      setActiveScreen('call-screen');

      return () => {
        myCall.leave().catch((err: any) => {
          console.error('Failed to leave the call', err);
        });
      };
    },
    [client, callId, profileData._id, user._id],
  );

  const goToHomeScreen = async () => {
    if (call) {
      await call.endCall();
      handleCallEnd();
    } else {
      // await call.endCall();
      setActiveScreen('home');
    }
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      {client && (
        // <StreamVideo client={client}>
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
          setCallType={setCallType}
        />
        // </StreamVideo>
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
