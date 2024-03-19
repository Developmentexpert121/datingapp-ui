import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {reciveMessages, sendAMessage} from '../../store/Auth/auth';
import {ScrollView} from 'react-native-gesture-handler';
import io from 'socket.io-client';

const socket = io('https://datingapp-api.onrender.com');

type Props = {
  goToCallScreen: () => void;
  setEnableCamera: any;

  user: any;
};

const ChatPage = ({user, goToCallScreen, setEnableCamera}: Props) => {
  const scrollViewRef: any = useRef(null);

  const navigation = useNavigation();
  const dispatch: any = useAppDispatch();

  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const [inputMessage, setInputMessage] = useState('');

  const [chatMessages, setChatMessages] = useState<any>([]);

  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('chat message', msg => {
      // Handle incoming messages
      console.log('Received message:', msg);
      // Update chatMessages state accordingly

      // Update chatMessages state with the received message
      if (msg.sender !== profileData._id) {
        setChatMessages((prevMessages: any) => [...prevMessages, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      // Fetch messages sent by user 1 to user 2

      const response1 = await dispatch(
        reciveMessages({
          senderId: profileData._id,
          receiverId: user?._id,
        }),
      ).unwrap();

      // Fetch messages sent by user 2 to user 1

      const response2 = await dispatch(
        reciveMessages({
          senderId: user?._id,
          receiverId: profileData._id,
        }),
      ).unwrap();

      // Update chatMessages state with the latest messages

      // Inside the useEffect hook after setting chatMessages state

      setChatMessages(
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
    if (inputMessage !== '') {
      const newMessage = {
        sender: profileData._id,
        receiver: user?._id,
        message: inputMessage,
        timestamp: new Date().toISOString(), // You may need to adjust the timestamp format
      };
      socket.emit('chat message', newMessage);
      setChatMessages((prevMessages: any) => [...prevMessages, newMessage]);
      dispatch(
        sendAMessage({
          senderId: profileData?._id,
          receiverId: user?._id,
          message: inputMessage,
        }),
      );
      setInputMessage('');
    }
  }, [inputMessage, profileData, user]);

  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
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
              <Avatar source={{uri: user?.profilePic}} rounded size={60} />
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.stepsText}>{user?.name}</Text>
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
              <TouchableOpacity
                onPress={() => {
                  setEnableCamera(false);
                  goToCallScreen();
                }}>
                <View style={styles.editIcon}>
                  <Icon1 name="phone" size={26} color="#AC25AC" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEnableCamera(true);
                  goToCallScreen();
                }}>
                <View style={styles.editIcon}>
                  <Icon2 name="video" size={24} color="#AC25AC" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginTop: 10, flex: 1}}>
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() => {
                if (scrollViewRef?.current) {
                  scrollViewRef?.current?.scrollToEnd({animated: true});
                }
              }}>
              <View style={{flexGrow: 1}} />
              {chatMessages.map((messageItem: any, index: any) => {
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
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          marginBottom: 'auto',
                        }}>
                        <Image
                          source={{
                            uri: user?.profilePic,
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
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          marginBottom: 'auto',
                        }}>
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
            <TouchableOpacity
              onPress={handleSendMessage}
              style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  sendButton: {
    padding: 10,
    backgroundColor: '#AC25AC',
    borderRadius: 8,
  },
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
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
    paddingTop: 16,
    paddingBottom: 4,
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
