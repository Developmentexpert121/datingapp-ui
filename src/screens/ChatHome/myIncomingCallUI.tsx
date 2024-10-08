import {
  CallContent,
  CallEndedEvent,
  CallingState,
  CallSessionEndedEvent,
  CallSessionParticipantLeftEvent,
  StreamCall,
  useCallStateHooks,
  UserResponse,
} from '@stream-io/video-react-native-sdk';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Avatar} from 'react-native-elements';
export default function MyIncomingCallUI({call, userName, callEnded}: any) {
  const {useCallCallingState, useCallMembers} = useCallStateHooks();
  const members = useCallMembers();
  const callingState = useCallCallingState();

  useEffect(() => {
    call.on('call.session_ended', (event: CallSessionEndedEvent) => {
      console.log('call.session_ended triggered Incoming---', 'event');
      callEnded();
    });
    call.on(
      'call.session_participant_left',
      (event: CallSessionParticipantLeftEvent) => {
        console.log(
          'call.session_participant_left triggered Incoming ---',
          'event',
        );
        callEnded();
      },
    );
    call.on('call.ended', (event: CallEndedEvent) => {
      console.log('call.ended triggered Incoming ---', 'event');
      callEnded();
    });
  }, []);

  const membersToShow: UserResponse[] = (members || []).map(({user}) => user);

  return (
    <View style={styles.container}>
      {callingState === CallingState.RINGING ? (
        <View style={styles.contentContainer}>
          <View style={styles.userViewContainer}>
            <View style={styles.listView}>
              {membersToShow.map((res, index) => {
                return (
                  <View style={styles.userView} key={res?.name}>
                    {/* <Image
                      source={
                        res?.image
                          ? {uri: res.image.split(',')[0]}
                          : require('../../assets/images/user.png')
                      }
                      style={styles.userImage}
                    /> */}
                    <Avatar
                      source={
                        res?.image
                          ? {uri: res.image.split(',')[0]}
                          : require('../../assets/images/user.png')
                      }
                      rounded
                      size={wp(35)}
                    />
                    <Text style={styles.userName}>
                      {res?.name ? res.name : `User${index + 1}`}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.ringLabel}>Incoming Call....</Text>
          </View>
          <View style={styles.endCallView}>
            <TouchableOpacity
              onPress={async () => {
                await call.reject();
              }}
              style={[styles.endCallContainer, {backgroundColor: '#FF0000'}]}>
              <Image
                source={require('../../assets/images/phone-call.png')}
                style={[styles.callIcon, {transform: [{rotate: `135deg`}]}]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await call.join();
              }}
              style={[styles.endCallContainer, {backgroundColor: '#00FF00'}]}>
              <Image
                source={require('../../assets/images/phone-call.png')}
                style={styles.callIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CallContent
          onHangupCallHandler={async () => {
            await call.endCall();
            callEnded();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#005fff',
  },

  //ringing Ui

  contentContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  userViewContainer: {
    flex: 1,
    alignItems: 'center',
  },
  listView: {
    flexDirection: 'row',
    height: hp(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userView: {
    alignItems: 'center',
    padding: wp(5),
  },
  userImage: {
    resizeMode: 'contain',
    height: wp(40),
    width: wp(40),
    borderRadius: wp(20),
    backgroundColor: '#404040',
  },
  userName: {
    color: '#fff',
    fontSize: hp(2),
    marginTop: hp(2),
    width: wp(30),
    textAlign: 'center',
  },
  ringLabel: {
    color: '#fff',
    fontSize: hp(2.5),
    fontWeight: 'bold',
  },
  endCallView: {
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  endCallContainer: {
    padding: wp(4),
    borderRadius: wp(9),
    marginHorizontal: wp(16),
  },
  callIcon: {
    resizeMode: 'contain',
    height: wp(9),
    width: wp(9),
  },
});
