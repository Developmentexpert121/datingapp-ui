import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {reciveMessages, sendAMessage} from '../../store/Auth/auth';
import io from 'socket.io-client';
import {PhoneCallIC, SendIC, VideoIC} from '../../assets/svgs';

const socket = io('https://datingapp-api.onrender.com');

type Props = {
  goToCallScreen: () => void;
  setEnableCamera: any;

  user: any;
};

const ChatPage = ({user, goToCallScreen, setEnableCamera}: Props) => {
  // const scrollViewRef: any = useRef(null);

  const navigation = useNavigation();
  const dispatch: any = useAppDispatch();

  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [limit, setLimit] = useState(10); // Number of messages to fetch per request
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  // const handleSendMessage = () => {
  //   // Implement logic to send the message
  //   // Example:
  //   console.log('Sending message:', inputMessage);
  //   setInputMessage(''); // Clear the input field after sending
  // };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // Scroll to the end of the ScrollView whenever new content is added
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [scrollViewRef /* Add any dependencies */]);

  useEffect(() => {
    // socket.on('connect', () => {
    //   const userId = profileData?._id;
    //   console.log('userId userId', userId);
    //   socket.emit('user_connected', userId);
    // });

    // socket.on('user_online', userId => {
    //   setOnlineUsers(prevOnlineUsers => [...prevOnlineUsers, userId]);
    // });

    // socket.on('user_offline', userId => {
    //   setOnlineUsers(prevOnlineUsers =>
    //     prevOnlineUsers.filter(user => user !== userId),
    //   );
    // });

    // socket.on('disconnect', () => {
    //   console.log('Disconnected from server');
    // });

    socket.on('chat message', msg => {
      // Handle incoming messages
      console.log('Received message:', msg);
      // Update chatMessages state accordingly
      if (msg.sender !== profileData._id) {
        setChatMessages((prevMessages: any) => [...prevMessages, msg]);
      }
    });
    // console.log(',,,,,,,', onlineUsers);
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(
          reciveMessages({
            senderId: profileData._id,
            receiverId: user?._id,
            limit,
            skip,
          }),
        ).unwrap();
        setChatMessages((prevMessages: any) => [
          ...response.messages.reverse(),
          ...prevMessages,
        ]);
        setMessageCount(response.messages.length);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false); // Stop loading indicator
      }
    };

    fetchMessages();
  }, [skip]);

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

  const handleScroll = ({nativeEvent}: any) => {
    if (nativeEvent.contentOffset.y === 0 && messageCount === limit) {
      // If scrolled to the top and there are more messages to fetch
      setIsLoading(true);
      setSkip(prevSkip => prevSkip + limit);
    }
  };

  const LoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#AC25AC" />
    </View>
  );
  const handleImageSelect = useCallback(
    (selectedImage: any) => {
      const newMessage = {
        selfMessage: true,
        fileType: selectedImage.type,
        uri: selectedImage.uri,
        name: selectedImage.name,
        createdAt: new Date(),
      };
      // dispatch(sendMessageAction({newMessage}));
      // setMessage('');
    },
    [dispatch],
  );

  return (
    <>
      <KeyboardAvoidingView
        // behavior="padding"
        style={{flex: 1}}
        // behavior={Platform.OS === 'ios' ? 'padding' : null}
        behavior="padding"
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            <View style={styles.container}>
              <View
                style={{
                  width: '72%',
                  flexDirection: 'row',
                  paddingStart: 10,
                  alignItems: 'center',
                  borderWidth: 0,
                }}>
                <Pressable style={styles.backPress}>
                  <Ionicons
                    onPress={() => navigation.goBack()}
                    style={styles.backPressIcon}
                    name="chevron-back-outline"
                    size={30}
                  />
                </Pressable>
                <Avatar source={{uri: user?.profilePic}} rounded size={50} />
                <View style={{flexDirection: 'column', flex: 1}}>
                  <Text numberOfLines={1} style={styles.stepsText}>
                    {user?.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Sansation-Regular',
                      marginStart: 12,
                      color: '#6D6D6D',
                    }}>
                    online
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginEnd: 10, width: '25%'}}>
                <TouchableOpacity
                  onPress={() => {
                    // setEnableCamera(false);
                    // goToCallScreen();
                  }}>
                  <View style={styles.editIcon}>
                    {/* <PhoneCallIC /> */}
                    <Image
                      source={require('../../assets/images/Phone.png/')}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                // onPress={() => {
                //   setEnableCamera(true);
                //   goToCallScreen();
                // }}
                >
                  <View style={styles.editIcon}>
                    {/* <VideoIC /> */}
                    <Image
                      source={require('../../assets/images/Video.png/')}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginTop: 10, flex: 1, borderWidth: 0}}>
              <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => {
                  if (scrollViewRef?.current) {
                    scrollViewRef?.current?.scrollToEnd({animated: true});
                  }
                }}
                onScroll={handleScroll}>
                <View style={{flexGrow: 1}} />
                {isLoading && <LoadingIndicator />}
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
              style={[
                styles.inputView,
                isKeyboardVisible && {marginBottom: 40},
              ]}>
              <View
                style={{borderWidth: 1, width: '88%', flexDirection: 'row'}}>
                <TextInput
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  placeholder="Type your message..."
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => ''}>
                  <Image
                    source={require('../../assets/images/documentUpload.png')}
                    style={{height: 40, width: 40, alignSelf: 'center'}}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                // onPress={handleSendMessage}
                style={styles.sendButton}>
                <SendIC onPress={handleSendMessage} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  sendButton: {
    // padding: 10,
    // backgroundColor: '#AC25AC',
    // borderRadius: 8,
  },
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    // borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 4,
    alignItems: 'center',
    // borderWidth: 2,
  },
  circularImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  backPress: {
    // width: '10%',
    marginEnd: 10,
  },
  backPressIcon: {
    color: '#AC25AC',
  },
  stepsText: {
    // flex: 1,
    // width: '60%',
    color: 'black',
    fontSize: 20,
    marginHorizontal: 12,
    fontFamily: 'Sansation-Bold',
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
  inputView: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ADADAD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
