import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {
  BlockedUserEvent,
  Call,
  CallAcceptedEvent,
  CallCreatedEvent,
  CallDeletedEvent,
  CallEndedEvent,
  CallHLSBroadcastingFailedEvent,
  CallHLSBroadcastingStartedEvent,
  CallHLSBroadcastingStoppedEvent,
  CallLiveStartedEvent,
  CallMemberAddedEvent,
  CallMemberRemovedEvent,
  CallMemberUpdatedEvent,
  CallMemberUpdatedPermissionEvent,
  CallMissedEvent,
  CallNotificationEvent,
  CallReactionEvent,
  CallRecordingFailedEvent,
  CallRecordingReadyEvent,
  CallRecordingStartedEvent,
  CallRecordingStoppedEvent,
  CallRejectedEvent,
  CallRingEvent,
  CallSessionEndedEvent,
  CallSessionParticipantJoinedEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionFailedEvent,
  CallTranscriptionReadyEvent,
  CallTranscriptionStartedEvent,
  CallTranscriptionStoppedEvent,
  CallUpdatedEvent,
  CallUserMutedEvent,
  ClosedCaptionEvent,
  ConnectedEvent,
  ConnectionErrorEvent,
  CustomVideoEvent,
  HealthCheckEvent,
  OwnCapability,
  PermissionRequestEvent,
  StreamVideo,
  StreamVideoClient,
  UnblockedUserEvent,
  UpdatedCallPermissionsEvent,
  useCallStateHooks,
  UserBannedEvent,
  UserDeactivatedEvent,
  UserDeletedEvent,
  UserMutedEvent,
  UserPresenceChangedEvent,
  UserReactivatedEvent,
  UserUnbannedEvent,
  UserUpdatedEvent,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import {useAppDispatch, useAppSelector} from '../../store/store';
import uuid from 'react-native-uuid';
import {videoCallToken} from '../../store/Auth/auth';
import VideoCallInterface from './chatVideoInterface';

const VideoCallRedirect = () => {
  const user: any = useAppSelector((state: any) => state?.ActivityLoader?.user);
  const dispatch: any = useAppDispatch();
  const client = useStreamVideoClient();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const callId: any = uuid.v4();
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [enableCamera, setEnableCamera] = useState<boolean>(true);
  const [enableCamera1, setEnableCamera1] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState('home');
  // const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | any>(null);
  const [callType, setCallType] = useState('videoCall');

  const handleCallEnd = useCallback(() => {
    setActiveScreen('home');
    setCall(null);
  }, []);

  const goToCallScreen = useCallback(
    async (type: any) => {
      if (!client) return;
      const myCall: any = client.call(
        type === 'videoCall' ? 'default' : 'audio_call',
        callId,
      );
      await myCall
        .getOrCreate({
          // create: true,
          ring: true,
          // notify: true,
          data: {
            members: [
              {
                user_id: profileData._id,
                role: 'admin',
                OwnCapability: OwnCapability.JOIN_ENDED_CALL,
              },
              {
                user_id: user._id,
                role: 'admin',
                OwnCapability: OwnCapability.JOIN_ENDED_CALL,
              },
            ],
          },
        })
        .catch((err: any) => {
          console.error('Failed to join the call', err);
        });

      setCall(myCall);
      setActiveScreen('call-screen');

      let callTimeout = setTimeout(() => {
        myCall
          .endCall()
          .then(handleCallEnd)
          .catch((err: any) => {
            console.error('Failed to end the call', err);
          });
      }, 16000);

      myCall.on('call.accepted', (event: CallAcceptedEvent) => {
        console.log('call.accepted triggered', 'event');
        clearTimeout(callTimeout);
      });

      myCall.on('call.ended', (event: CallEndedEvent) => {
        console.log('call.ended triggered', 'event');
      });

      myCall.on('call.rejected', (event: CallRejectedEvent) => {
        console.log('call.rejected triggered', 'event');
        clearTimeout(callTimeout);
      });

      myCall.on('call.session_ended', (event: CallSessionEndedEvent) => {
        console.log('call.session_ended triggered', 'event');
      });

      myCall.on(
        'call.session_participant_left',
        (event: CallSessionParticipantLeftEvent) => {
          console.log('call.session_participant_left triggered', 'event');
        },
      );

      return () => {
        myCall.leave().catch((err: any) => {
          console.error('Failed to leave the call', err);
        });
      };
    },
    [client, callId],
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
