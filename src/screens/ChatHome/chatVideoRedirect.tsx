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

  console.log('Steam client data on chat screen:', !!client);

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
        console.log('No response within 18 seconds, ending call.');
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

      myCall.on('call.blocked_user', (event: BlockedUserEvent) => {
        console.log('call.blocked_user triggered', 'event');
      });

      myCall.on('call.closed_caption', (event: ClosedCaptionEvent) => {
        console.log('call.closed_caption triggered', 'event');
      });

      myCall.on('call.created', (event: CallCreatedEvent) => {
        console.log('call.created triggered', 'event');
      });

      myCall.on('call.deleted', (event: CallDeletedEvent) => {
        console.log('call.deleted triggered', 'event');
      });

      myCall.on('call.ended', (event: CallEndedEvent) => {
        console.log('call.ended triggered', 'event');
      });

      myCall.on(
        'call.hls_broadcasting_failed',
        (event: CallHLSBroadcastingFailedEvent) => {
          console.log('call.hls_broadcasting_failed triggered', 'event');
        },
      );

      myCall.on(
        'call.hls_broadcasting_started',
        (event: CallHLSBroadcastingStartedEvent) => {
          console.log('call.hls_broadcasting_started triggered', 'event');
        },
      );

      myCall.on(
        'call.hls_broadcasting_stopped',
        (event: CallHLSBroadcastingStoppedEvent) => {
          console.log('call.hls_broadcasting_stopped triggered', 'event');
        },
      );

      myCall.on('call.live_started', (event: CallLiveStartedEvent) => {
        console.log('call.live_started triggered', 'event');
      });

      myCall.on('call.member_added', (event: CallMemberAddedEvent) => {
        console.log('call.member_added triggered', 'event');
      });

      myCall.on('call.member_removed', (event: CallMemberRemovedEvent) => {
        console.log('call.member_removed triggered', 'event');
      });

      myCall.on('call.member_updated', (event: CallMemberUpdatedEvent) => {
        console.log('call.member_updated triggered', 'event');
      });

      myCall.on(
        'call.member_updated_permission',
        (event: CallMemberUpdatedPermissionEvent) => {
          console.log('call.member_updated_permission triggered', 'event');
        },
      );

      myCall.on('call.missed', (event: CallMissedEvent) => {
        console.log('call.missed triggered', 'event');
      });

      myCall.on('call.notification', (event: CallNotificationEvent) => {
        console.log('call.notification triggered', 'event');
      });

      myCall.on('call.permission_request', (event: PermissionRequestEvent) => {
        console.log('call.permission_request triggered', 'event');
      });

      myCall.on(
        'call.permissions_updated',
        (event: UpdatedCallPermissionsEvent) => {
          console.log('call.permissions_updated triggered', 'event');
        },
      );

      myCall.on('call.reaction_new', (event: CallReactionEvent) => {
        console.log('call.reaction_new triggered', 'event');
      });

      myCall.on('call.recording_failed', (event: CallRecordingFailedEvent) => {
        console.log('call.recording_failed triggered', 'event');
      });

      myCall.on('call.recording_ready', (event: CallRecordingReadyEvent) => {
        console.log('call.recording_ready triggered', 'event');
      });

      myCall.on(
        'call.recording_started',
        (event: CallRecordingStartedEvent) => {
          console.log('call.recording_started triggered', 'event');
        },
      );

      myCall.on(
        'call.recording_stopped',
        (event: CallRecordingStoppedEvent) => {
          console.log('call.recording_stopped triggered', 'event');
        },
      );

      myCall.on('call.rejected', (event: CallRejectedEvent) => {
        console.log('call.rejected triggered', 'event');
        clearTimeout(callTimeout);
      });

      myCall.on('call.ring', (event: CallRingEvent) => {
        console.log('call.ring triggered', 'event');
      });

      myCall.on('call.session_ended', (event: CallSessionEndedEvent) => {
        console.log('call.session_ended triggered', 'event');
      });

      myCall.on(
        'call.session_participant_joined',
        (event: CallSessionParticipantJoinedEvent) => {
          console.log('call.session_participant_joined triggered', 'event');
        },
      );

      myCall.on(
        'call.session_participant_left',
        (event: CallSessionParticipantLeftEvent) => {
          console.log('call.session_participant_left triggered', 'event');
        },
      );

      myCall.on('call.session_started', (event: CallSessionStartedEvent) => {
        console.log('call.session_started triggered', 'event');
      });

      myCall.on(
        'call.transcription_failed',
        (event: CallTranscriptionFailedEvent) => {
          console.log('call.transcription_failed triggered', 'event');
        },
      );

      myCall.on(
        'call.transcription_ready',
        (event: CallTranscriptionReadyEvent) => {
          console.log('call.transcription_ready triggered', 'event');
        },
      );

      myCall.on(
        'call.transcription_started',
        (event: CallTranscriptionStartedEvent) => {
          console.log('call.transcription_started triggered', 'event');
        },
      );

      myCall.on(
        'call.transcription_stopped',
        (event: CallTranscriptionStoppedEvent) => {
          console.log('call.transcription_stopped triggered', 'event');
        },
      );

      myCall.on('call.unblocked_user', (event: UnblockedUserEvent) => {
        console.log('call.unblocked_user triggered', 'event');
      });

      myCall.on('call.updated', (event: CallUpdatedEvent) => {
        console.log('call.updated triggered', 'event');
      });

      myCall.on('call.user_muted', (event: CallUserMutedEvent) => {
        console.log('call.user_muted triggered', 'event');
      });

      myCall.on('connection.error', (event: ConnectionErrorEvent) => {
        console.log('connection.error triggered', 'event');
      });

      myCall.on('connection.ok', (event: ConnectedEvent) => {
        console.log('connection.ok triggered', 'event');
      });

      myCall.on('custom', (event: CustomVideoEvent) => {
        console.log('custom triggered', 'event');
      });

      myCall.on('health.check', (event: HealthCheckEvent) => {
        console.log('health.check triggered', 'event');
      });

      myCall.on('user.banned', (event: UserBannedEvent) => {
        console.log('user.banned triggered', 'event');
      });

      myCall.on('user.deactivated', (event: UserDeactivatedEvent) => {
        console.log('user.deactivated triggered', 'event');
      });

      myCall.on('user.deleted', (event: UserDeletedEvent) => {
        console.log('user.deleted triggered', 'event');
      });

      myCall.on('user.muted', (event: UserMutedEvent) => {
        console.log('user.muted triggered', 'event');
      });

      myCall.on('user.presence.changed', (event: UserPresenceChangedEvent) => {
        console.log('user.presence.changed triggered', 'event');
      });

      myCall.on('user.reactivated', (event: UserReactivatedEvent) => {
        console.log('user.reactivated triggered', 'event');
      });

      myCall.on('user.unbanned', (event: UserUnbannedEvent) => {
        console.log('user.unbanned triggered', 'event');
      });

      myCall.on('user.updated', (event: UserUpdatedEvent) => {
        console.log('user.updated triggered', 'event');
      });

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
