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
import {io} from 'socket.io-client';
import {onlineUser} from '../../store/reducer/authSliceState';
const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');

const VideoCallRedirect = () => {
  const user: any = useAppSelector((state: any) => state?.ActivityLoader?.user);
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const clientData: any = useAppSelector(
    (state: any) => state?.ActivityLoader?.clientData,
  );

  console.log('--------', clientData);

  const callId: any = uuid.v4();

  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [enableCamera, setEnableCamera] = useState<boolean>(true);
  const [enableCamera1, setEnableCamera1] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState('home');
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | any>(null);
  const [callType, setCallType] = useState('videoCall');

  useEffect(() => {
    socket.on('user_online', users => {
      setOnlineUsers(users);
    });

    socket.on('user_offline', users => {
      setOnlineUsers(users);
    });

    socket.on('disconnect', () => {
      console.log('App Disconnected from server');
    });

    return () => {
      socket.off('user_online');
      socket.off('user_offline');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    dispatch(onlineUser(onlineUsers));
  }, [onlineUsers]);

  useEffect(() => {
    if (profileData) {
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

      // return () => {
      //   myClient.disconnectUser();
      //   setClient(null);
      // };
    }
  }, [profileData]);

  useEffect(() => {
    if (clientData) {
      setClient(clientData);
    }
  }, [clientData]);

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
