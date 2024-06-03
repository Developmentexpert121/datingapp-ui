import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-native-sdk';
import {useCallback, useEffect, useState} from 'react';
import uuid from 'react-native-uuid';
import {videoCallToken} from '../../store/Auth/auth';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {Text, View} from 'react-native';
import {
  useCallStateHooks,
  CallParticipantsList,
} from '@stream-io/video-react-native-sdk';

export default function VideoCall() {
  const dispatch: any = useAppDispatch();
  const {useParticipants} = useCallStateHooks();
  const participants = useParticipants();

  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const id = profileData?._id;
  const userMain = {
    id: profileData?._id,
    name: profileData?.name,
    image: profileData?.profilePic,
  };

  const apiKey = 'xxbhmm34dcx3';
  const ca = uuid.v4();
  const user = {id};

  const tokenProvider = async () => {
    try {
      const {token} = await dispatch(videoCallToken({id})).unwrap();
      return token;
    } catch (error) {
      console.log(error, 'errorerror');
    }
  };

  if (id && ca) {
    var client = new StreamVideoClient({
      apiKey,
      user,
      tokenProvider,
    });
    var call = client.call('default', ca);

    call.join({create: true});
    console.log(client, 'step111');
  }

  return (
    <>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          {/* Your UI */}
          <CallParticipantsList participants={participants} />;
        </StreamCall>
      </StreamVideo>
    </>
  );
}
