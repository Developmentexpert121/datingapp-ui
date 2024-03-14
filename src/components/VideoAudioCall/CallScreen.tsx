import React from 'react';

import {
  useCalls,
  CallingState,
  StreamCall,
} from '@stream-io/video-react-native-sdk';
import MyIncomingCallUI from '../Chat/myIncomingCallUI';
import MyOutgoingCallUI from '../Chat/myOutgoingCallUI';

export const CallScreen = ({call, goToHomeScreen}: any) => {
  return <MyOutgoingCallUI call={call} goToHomeScreen={goToHomeScreen} />;
};
