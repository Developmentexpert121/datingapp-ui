import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import {RootState, useAppDispatch, useAppSelector} from '../../store/store';
import {
  reciveMessages,
  sendAMessage,
  uploadImages,
} from '../../store/Auth/auth';
import io from 'socket.io-client';
import {PhoneCallIC, SendIC, VideoIC} from '../../assets/svgs';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import Label from '../../components/Label';
import MainButton from '../../components/ButtonComponent/MainButton';
import SmallLoader from '../../components/Loader/SmallLoader';

const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');

type Props = {
  goToCallScreen: (e: any) => void;
  setEnableCamera: any;
  setEnableCamera1: any;
  user: any;
  setCallType: (e: any) => void;
};

const ChatPage = ({
  user,
  goToCallScreen,
  setEnableCamera,
  setEnableCamera1,
  setCallType,
}: Props) => {
  const navigation: any = useNavigation();
  const dispatch: any = useAppDispatch();

  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const {showOnlineUser}: any = useAppSelector(
    (state: RootState) => state.authSliceState,
  );
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [limit, setLimit] = useState(20);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);
  // console.log('111111');

  const isUserOnline: any = showOnlineUser?.includes(user?._id) || false;

  useEffect(() => {
    if (scrollViewRef.current && chatMessages.length) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, []);

  useEffect(() => {
    if (scrollViewRef?.current) {
      scrollViewRef?.current?.scrollToEnd({animated: true});
    }
  }, []);

  const handleScroll = ({nativeEvent}: any) => {
    if (nativeEvent.contentOffset.y === 0 && messageCount === limit) {
      setIsLoading(true);
      setSkip(prevSkip => prevSkip + limit);
    }
  };

  const LoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <SmallLoader />
    </View>
  );

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
    socket.on('chat message', msg => {
      if (msg.receiver === profileData?._id && msg.sender === user?._id) {
        setChatMessages((prevMessages: any) => [...prevMessages, msg]);
      }
    });
    return () => {
      socket.off('chat message');
    };
  }, [profileData, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(
          reciveMessages({
            senderId: profileData?._id,
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
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [skip]);

  useEffect(() => {
    // Ensure the socket is joined to the correct room for the current conversation
    if (profileData?._id && user?._id) {
      socket.emit('join', {userId: profileData._id, otherUserId: user._id});
    }

    return () => {
      socket.off('join');
    };
  }, []);

  const handleSendMessage = useCallback(() => {
    if (inputMessage !== '') {
      const newMessage = {
        sender: profileData?._id,
        receiver: user?._id,
        message: inputMessage,
        timestamp: new Date().toISOString(),
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

  const handleMediaSelection = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const formData = new FormData();
        formData.append('image', {
          name: asset.fileName,
          fileName: asset.fileName,
          type: asset.type,
          uri: asset.uri,
        });

        const uploadedImageUrl = await dispatch(uploadImages(formData))
          .unwrap()
          .then((response: any) => response.secureUrl);

        handleFileSend(uploadedImageUrl);
      }
    });
  };

  const handleFileSend = (file: Asset) => {
    const newMessage = {
      sender: profileData._id,
      receiver: user?._id,
      fileType: typeof file || 'unknown',
      uri: file || '',
      name: file || 'unknown',
      timestamp: new Date().toISOString(),
    };

    socket.emit('chat message', newMessage);
    setChatMessages((prevMessages: any) => [...prevMessages, newMessage]);

    dispatch(
      sendAMessage({
        senderId: profileData?._id,
        receiverId: user?._id,
        message: file || 'unknown',
        uri: file || '',
        fileType: typeof file || 'unknown',
        timestamp: new Date().toISOString(),
      }),
    );
  };

  const saveImageToGallery = async (url: string) => {
    try {
      // Check permission
      const permission = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      if (permission !== 'granted') {
        await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      }

      const fileName = url.split('/').pop() || 'image.jpg';
      const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const result = await RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadDest,
      }).promise;

      if (result.statusCode === 200) {
        await CameraRoll.save(downloadDest, {type: 'photo'});
        Alert.alert('Save Complete', 'Image saved to Gallery');
      } else {
        Alert.alert('Save Failed', 'There was a problem saving the image.');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  const formatTime = (timestamp: any) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };
  const getFormattedDate = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      return 'Today';
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(6) : 0}
        //@ts-ignore
        behavior={Platform.OS == 'ios' ? 'padding' : 'undefined'}>
        <View style={{flex: 1}}>
          {/* header */}
          <View style={styles.container}>
            <Pressable
              style={{
                width: '72%',
                flexDirection: 'row',
                paddingStart: 10,
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('userProfile');
              }}>
              <View style={styles.backPress}>
                <Ionicons
                  onPress={() => navigation.goBack()}
                  style={styles.backPressIcon}
                  name="chevron-back-outline"
                  size={30}
                />
              </View>
              <Avatar
                source={{uri: user?.profilePic?.split(',')[0]}}
                rounded
                size={50}
              />
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text numberOfLines={1} style={styles.stepsText}>
                  {user?.name}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Sansation-Regular',
                    marginStart: 12,
                    // color: '#6D6D6D',
                    color: isUserOnline ? 'green' : '#6D6D6D',
                  }}>
                  {isUserOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </Pressable>
            <View style={{flexDirection: 'row', marginEnd: 10, width: '25%'}}>
              <TouchableOpacity
                disabled={
                  user?.deactivate === false && user?.isBlocked === false
                    ? false
                    : true
                }
                onPress={
                  profileData?.plan === 'Free'
                    ? () => {
                        setModalOpen(true);
                        setReason('audio');
                      }
                    : () => {
                        setCallType('audioCall');
                        setEnableCamera1(false);
                        goToCallScreen('audioCall');
                      }
                }>
                <View style={styles.editIcon}>
                  <Image
                    source={require('../../assets/images/Phone.png/')}
                    style={{height: 40, width: 40}}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  user?.deactivate === false && user?.isBlocked === false
                    ? false
                    : true
                }
                onPress={
                  profileData?.plan === 'Free'
                    ? () => {
                        setModalOpen(true);
                        setReason('video');
                      }
                    : profileData.plan.productId === 'PremiumPlus'
                    ? () => {
                        setCallType('videoCall');
                        setEnableCamera(true);
                        goToCallScreen('videoCall');
                      }
                    : () => {
                        setModalOpen(true);
                        setReason('video');
                      }
                }>
                <View style={styles.editIcon}>
                  <Image
                    source={require('../../assets/images/Video.png/')}
                    style={{height: 40, width: 40}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* center */}
          <View style={{marginTop: 10, flex: 1}}>
            {isLoading && <LoadingIndicator />}
            <FlatList
              data={chatMessages}
              //@ts-ignore
              ref={scrollViewRef}
              contentContainerStyle={{flexGrow: 1}}
              onContentSizeChange={() => {
                if (scrollViewRef?.current) {
                  scrollViewRef?.current?.scrollToEnd({animated: true});
                }
              }}
              // onScroll={handleScroll}
              keyExtractor={(item, index) => item?.timestamp + index}
              renderItem={({item, index}) => {
                const isTextMessage = !item?.uri;
                const isAuthMessage =
                  item?.receiver === user?._id || item?.sender === user?._id;
                const currentMessageDate = getFormattedDate(item?.timestamp);
                const previousMessageDate =
                  index > 0
                    ? getFormattedDate(chatMessages[index - 1]?.timestamp)
                    : null;

                const shouldDisplayDate =
                  index === 0 || currentMessageDate !== previousMessageDate;

                return (
                  <View style={{}}>
                    {shouldDisplayDate && (
                      <Text
                        style={{
                          textAlign: 'center',
                          color: 'gray',
                          marginVertical: 10,
                          fontSize: 14,
                        }}>
                        {currentMessageDate}
                      </Text>
                    )}

                    {isAuthMessage && (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignSelf:
                            item?.sender === profileData?._id
                              ? 'flex-end'
                              : 'flex-start',
                          marginHorizontal: 10,
                          marginVertical: 1,
                          // marginBottom: 12,
                          alignItems: 'baseline',
                          borderWidth: 2,
                        }}>
                        {/* Receiver Image */}
                        {isAuthMessage && item?.sender !== profileData?._id && (
                          <View
                            style={{
                              alignSelf: 'flex-end',
                              marginBottom: 'auto',
                            }}>
                            <Image
                              source={{
                                uri: user?.profilePic?.split(',')[0],
                              }}
                              style={styles.circularImage}
                            />
                          </View>
                        )}

                        {/* Messages */}
                        <View style={{borderWidth: 0}}>
                          <View
                            style={{
                              backgroundColor:
                                item?.sender === profileData?._id
                                  ? '#AC25AC'
                                  : '#D9D9D9',
                              padding: 10,
                              marginHorizontal: 10,
                              borderRadius: 8,
                              maxWidth: 260,
                              borderBottomRightRadius:
                                item?.sender === profileData?._id ? 0 : 8,
                              borderBottomLeftRadius:
                                item?.sender === profileData?._id ? 8 : 0,
                              // borderWidth: 1,
                            }}>
                            {isTextMessage && isAuthMessage ? (
                              <Text
                                style={{
                                  color:
                                    item?.sender === profileData?._id
                                      ? 'white'
                                      : 'black',
                                }}>
                                {item?.message}
                              </Text>
                            ) : (
                              isAuthMessage && (
                                <View>
                                  <Image
                                    source={{uri: item?.uri}}
                                    style={[
                                      styles.sharedImage,
                                      {position: 'relative'},
                                    ]}
                                  />
                                  <View
                                    style={{
                                      backgroundColor: 'white',
                                      alignSelf: 'flex-start',
                                      padding: 2,
                                      borderRadius: 4,
                                      position: 'absolute',
                                      top: 0,
                                      right: 0,
                                      margin: 4,
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        saveImageToGallery(item?.uri)
                                      }>
                                      <Image
                                        source={require('../../assets/images/download.png')}
                                        style={{
                                          resizeMode: 'contain',
                                          height: hp(2),
                                          width: wp(4),
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              )
                            )}
                          </View>
                          {/* Display timestamp */}
                          <Text
                            style={{
                              fontSize: 12,
                              color:
                                item?.sender === profileData?._id
                                  ? 'black'
                                  : 'black',
                              textAlign:
                                item?.sender === profileData?._id
                                  ? 'right'
                                  : 'left',
                              marginRight:
                                item?.sender === profileData?._id ? 12 : 0,

                              marginLeft:
                                item?.sender === profileData?._id ? 0 : 12,
                              // marginTop: 2,
                            }}>
                            {formatTime(item?.timestamp)}
                          </Text>
                        </View>

                        {/* Sender Image */}
                        {item?.sender === profileData?._id && (
                          <View
                            style={{
                              alignSelf: 'flex-end',
                              marginBottom: 'auto',
                            }}>
                            <Image
                              source={{
                                uri: profileData?.profilePic?.split(',')[0],
                              }}
                              style={styles.circularImage}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              }}
            />
          </View>
          {/* footer */}
          {user?.deactivate === false && user?.isBlocked === false ? (
            <View style={[styles.inputView]}>
              <View
                style={{borderWidth: 1, width: '88%', flexDirection: 'row'}}>
                <TextInput
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  placeholder="Type your message..."
                  placeholderTextColor="gray"
                  style={styles.input}
                />
                <TouchableOpacity onPress={handleMediaSelection}>
                  <Image
                    source={require('../../assets/images/documentUpload.png')}
                    style={{height: 40, width: 40, alignSelf: 'center'}}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.sendButton}>
                <SendIC onPress={handleSendMessage} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Sansation-Regular',
                  color: 'red',
                  fontSize: 20,
                }}>
                This user is {user?.deactivate === true && 'Deactivate '}
                {user?.isBlocked === true && ' Blocked'}
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
      {/* Modal */}
      <Modal
        style={{backgroundColor: 'transparent', margin: 0}}
        isVisible={modalOpen}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        animationInTiming={600}
        animationOutTiming={1000}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={1000}>
        <View style={styles.modal}>
          <View style={styles.modalstyle}>
            <Label
              text={`To access ${
                reason === 'audio' ? 'Audio' : reason === 'video' && 'Video'
              } Calling you will need to atleast subscribe to the ${
                reason === 'audio'
                  ? 'Basic'
                  : reason === 'video' && 'PremiumPlus'
              } Plan`}
              style={styles.textstyle}
            />

            <MainButton
              style={{
                width: '85%',
                marginTop: 30,
              }}
              ButtonName="Subscribe!"
              onPress={() => {
                navigation.navigate('ProfileSection');
                setModalOpen(false);
              }}
            />
            <MainButton
              style={{
                width: '85%',
                marginTop: 30,
              }}
              ButtonName="Cancel"
              onPress={() => {
                setModalOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  sendButton: {},
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
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
  sharedImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  downloadText: {
    color: '#007BFF',
    fontSize: 14,
    marginTop: 5,
  },
  textstyle: {
    fontSize: 18,
    lineHeight: 36,
    color: '#071731',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  modalstyle: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
});
