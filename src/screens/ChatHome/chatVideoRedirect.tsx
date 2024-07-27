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

  const [callId, setCallId] = useState<any>(uuid.v4());
  const [enableCamera, setEnableCamera] = useState<boolean>(true);
  const [enableCamera1, setEnableCamera1] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState('home');
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | any>(null);
  const [callType, setCallType] = useState('videoCall');
  // console.log('Call Call', call);

  useEffect(() => {
    const apiKey = '48e74nbgz5az';
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
      console.log('FifthFifthFifthFifthFifth');
      myClient.disconnectUser();
      setClient(null);
    };
  }, [dispatch, profileData]);

  const handleCallEnd = useCallback(() => {
    setActiveScreen('home');
    setCall(null);
  }, []);

  const goToCallScreen = useCallback(
    (type: any) => {
      if (!client) return;
      const myCall: any = client.call(
        type === 'videoCall' ? 'default' : 'audio_call',
        callId,
      );
      myCall.on('call.left', (event: any) => {
        if (event.user.id !== profileData._id) {
          console.log('firstfirstfirstfirstfirst');
          handleCallEnd();
        } else {
          console.log('SecondSecondSecondSecondSecond');
          myCall.end();
        }
      });

      myCall.on('call.ended', (event: any) => {
        console.log('ThirdThirdThirdThirdThird');
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
        console.log('ThirdThirdThirdThirdThird');
        myCall.leave().catch((err: any) => {
          console.error('Failed to leave the call', err);
        });
      };
    },
    [client, callId, profileData._id, user._id, handleCallEnd],
  );

  const goToHomeScreen = () => {
    if (call) {
      console.log('first');
      call.endCall();
      handleCallEnd();
    } else {
      call.endCall();
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
            setCallType={setCallType}
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
