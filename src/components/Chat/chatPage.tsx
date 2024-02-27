import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ListItem, Avatar, SearchBar} from 'react-native-elements';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {reciveMessages, sendAMessage} from '../../store/Auth/auth';
import {ScrollView} from 'react-native-gesture-handler';

const ChatPage = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const allUsers: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allUsers,
  );
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const [inputMessage, setInputMessage] = useState('');

  const [chatMessages, setChatMessages] = useState([]);
  console.log(chatMessages);

  useEffect(() => {
    const fetchMessages = async () => {
      // Fetch messages sent by user 1 to user 2
      // @ts-ignore
      const response1 = await dispatch(
        // @ts-ignore
        reciveMessages({
          senderId: profileData._id,
          receiverId: allUsers[2]._id,
        }),
      ).unwrap();

      // Fetch messages sent by user 2 to user 1
      // @ts-ignore
      const response2 = await dispatch(
        // @ts-ignore
        reciveMessages({
          senderId: allUsers[2]._id,
          receiverId: profileData._id,
        }),
      ).unwrap();

      // Update chatMessages state with the latest messages
      // @ts-ignore
      // Inside the useEffect hook after setting chatMessages state

      setChatMessages(
        // @ts-ignore
        [...response1.messages, ...response2.messages].sort((a, b) => {
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        }),
      );
    };

    fetchMessages();
  }, []);

  const handleSendMessage = useCallback(() => {
    dispatch(
      // @ts-ignore
      sendAMessage({
        senderId: profileData?._id,
        receiverId: allUsers[2]?._id,
        message: inputMessage,
      }),
    );
    setInputMessage('');
  }, [inputMessage, profileData, allUsers]);

  return (
    <View style={{flexGrow: 1}}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            paddingStart: 10,
            alignItems: 'center',
          }}>
          <Pressable style={styles.backPress}>
            <Ionicons
              onPress={() => navigation.navigate('ChatScreen')}
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
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Sansation_Regular',
                marginStart: 12,
                color: '#6D6D6D',
              }}>
              online 30m ago
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginEnd: 10}}>
          <TouchableOpacity onPress={() => navigation.navigate('ChatPage')}>
            <View style={styles.editIcon}>
              <Icon1 name="phone" size={26} color="#AC25AC" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ChatPage')}>
            <View style={styles.editIcon}>
              <Icon2 name="video" size={24} color="#AC25AC" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginTop: 10, flex: 1}}>
        <ScrollView>
          {chatMessages.map((messageItem: any, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignSelf:
                    messageItem?.sender === profileData._id
                      ? 'flex-end'
                      : 'flex-start',
                  margin: 10,
                  marginBottom: 12,
                  alignItems: 'baseline',
                }}>
                {messageItem?.sender !== profileData._id && (
                  <View style={{alignSelf: 'flex-end', marginBottom: 'auto'}}>
                    <Image
                      source={{
                        uri: allUsers[2]?.profilePic,
                      }}
                      style={styles.circularImage}
                    />
                  </View>
                )}

                <View
                  style={{
                    backgroundColor:
                      messageItem?.sender === profileData._id
                        ? '#AC25AC'
                        : '#D9D9D9',
                    padding: 10,
                    marginHorizontal: 10,
                    borderRadius: 8,
                    maxWidth: 260,

                    borderBottomRightRadius:
                      messageItem?.sender === profileData._id ? 0 : 8,
                    borderBottomLeftRadius:
                      messageItem?.sender === profileData._id ? 8 : 0,
                  }}>
                  <Text
                    style={{
                      color:
                        messageItem?.sender === profileData._id
                          ? 'white'
                          : 'black',
                    }}>
                    {messageItem?.message}
                  </Text>
                </View>
                {messageItem?.sender === profileData._id && (
                  <View style={{alignSelf: 'flex-end', marginBottom: 'auto'}}>
                    <Image
                      source={{uri: profileData?.profilePic}}
                      style={styles.circularImage}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: '#ADADAD',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TextInput
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  sendButton: {
    padding: 10,
    backgroundColor: '#AC25AC',
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Sansation_Bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
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
    borderRadius: 10,
  },
  backPress: {
    marginEnd: 10,
  },
  backPressIcon: {
    color: '#AC25AC',
  },
  stepsText: {
    color: 'black',
    fontSize: 20,
    marginHorizontal: 12,
    fontFamily: 'Sansation_Bold',
  },

  editIcon: {
    marginRight: 12,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA7FF',
  },
});
