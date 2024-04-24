import React from 'react';

import {
  useCalls,
  CallingState,
  StreamCall,
} from '@stream-io/video-react-native-sdk';
import MyIncomingCallUI from '../../screens/ChatHome/myIncomingCallUI';
import MyOutgoingCallUI from '../../screens/ChatHome/myOutgoingCallUI';

export const CallScreen = ({call, goToHomeScreen}: any) => {
  return <MyOutgoingCallUI call={call} goToHomeScreen={goToHomeScreen} />;
};
