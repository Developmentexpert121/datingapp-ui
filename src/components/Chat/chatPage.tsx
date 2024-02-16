import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ListItem, Avatar, SearchBar} from 'react-native-elements';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome6';

const ChatPage = () => {
  const navigation = useNavigation();

  const messagesList = [
    {
      isMyMessage: true,
      message: 'Hlo',
    },
    {
      isMyMessage: false,
      message: 'No',
    },
    {isMyMessage: true, message: 'Hi'},
    {isMyMessage: false, message: 'Bye'},
    {isMyMessage: true, message: 'Ok'},
    {isMyMessage: true, message: 'byee'},
  ];

  return (
    <View>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            paddingStart: 10,
            alignItems: 'center',
          }}>
          <Pressable style={styles.backPress}>
            <Ionicons
              onPress={() => navigation.navigate('Chat')}
              style={styles.backPressIcon}
              name="chevron-back-outline"
              size={30}
            />
          </Pressable>
          <Avatar
            source={{uri: 'https://placekitten.com/50/50'}}
            rounded
            size={60}
          />
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.stepsText}>Watt</Text>
            <Text style={{fontSize: 15, marginStart: 15}}>online 30m ago</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginEnd: 10}}>
          <TouchableOpacity onPress={() => navigation.navigate('ChatPage')}>
            <Icon1
              name="phone"
              size={24}
              color="#AC25AC"
              style={styles.editIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ChatPage')}>
            <Icon2
              name="video"
              size={24}
              color="#AC25AC"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {messagesList.map((messageItem, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignSelf: messageItem.isMyMessage ? 'flex-end' : 'flex-start',
              margin: 10,
              alignItems: 'baseline',
            }}>
            {!messageItem.isMyMessage && (
              <View style={{alignSelf: 'flex-end', marginBottom: 'auto'}}>
                <Image
                  source={{
                    uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg',
                  }}
                  style={styles.circularImage}
                />
              </View>
            )}

            <View
              style={{
                backgroundColor: messageItem.isMyMessage
                  ? '#BA55D3'
                  : '#c1c1c1',
                padding: 10,
                marginHorizontal: 10,
                borderRadius: 10,
                maxWidth: 260,
                borderBottomRightRadius: messageItem.isMyMessage ? 0 : 10,
                borderBottomLeftRadius: messageItem.isMyMessage ? 10 : 0,
              }}>
              <Text>{messageItem.message}</Text>
            </View>
            {messageItem.isMyMessage && (
              <View style={{alignSelf: 'flex-end', marginBottom: 'auto'}}>
                <Image
                  source={{
                    uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim1.JPG',
                  }}
                  style={styles.circularImage}
                />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    alignItems: 'center',
  },
  circularImage: {
    width: 20,
    height: 20,
    borderRadius: 50, // half of width and height to make it circular
  },
  backPress: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // padding: 10,
    marginEnd: 10,
  },
  backPressIcon: {
    //marginRight: 8,
    color: '#AC25AC',
  },
  stepsText: {
    color: 'grey',
    fontSize: 20,
    //backgroundColor: '#AC25AC',
    marginHorizontal: 15,
    borderRadius: 15,
    //marginLeft: 80,
    fontWeight: 'bold',
  },

  editIcon: {
    marginRight: 10,
    backgroundColor: '#edb9ed',
    borderRadius: 20,
    padding: 8,
  },
});
