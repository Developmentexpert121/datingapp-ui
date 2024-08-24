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
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
// const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');

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
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);
  const isUserOnline: any = showOnlineUser?.includes(user?._id) || false;
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
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [scrollViewRef]);

  useEffect(() => {
    socket.on('chat message', msg => {
      if (msg.sender !== profileData?._id) {
        setChatMessages((prevMessages: any) => [...prevMessages, msg]);
      }
    });
  }, []);

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
    const userId = profileData?._id;
    socket.emit('join', userId);
  }, [profileData]);

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

  const handleScroll = ({nativeEvent}: any) => {
    if (nativeEvent.contentOffset.y === 0 && messageCount === limit) {
      setIsLoading(true);
      setSkip(prevSkip => prevSkip + limit);
    }
  };

  const LoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#AC25AC" />
    </View>
  );

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

  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <View style={{flex: 1}}>
          {/* header */}
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
            </View>
            <View style={{flexDirection: 'row', marginEnd: 10, width: '25%'}}>
              <TouchableOpacity
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
              {/*  */}
              {chatMessages?.map((messageItem: any, index: any) => {
                const isTextMessage = !messageItem.uri;
                const isAuthMessage =
                  messageItem.receiver === user?._id ||
                  messageItem.sender === user?._id;
                return (
                  <>
                    {isAuthMessage && (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignSelf:
                            messageItem?.sender === profileData?._id
                              ? 'flex-end'
                              : 'flex-start',
                          margin: 10,
                          marginBottom: 12,
                          alignItems: 'baseline',
                        }}>
                        {/* Reciver Image */}
                        {isAuthMessage &&
                          messageItem?.sender !== profileData?._id && (
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

                        <View
                          style={{
                            backgroundColor:
                              messageItem?.sender === profileData?._id
                                ? '#AC25AC'
                                : '#D9D9D9',
                            padding: 10,
                            marginHorizontal: 10,
                            borderRadius: 8,
                            maxWidth: 260,
                            borderBottomRightRadius:
                              messageItem?.sender === profileData?._id ? 0 : 8,
                            borderBottomLeftRadius:
                              messageItem?.sender === profileData?._id ? 8 : 0,
                          }}>
                          {isTextMessage && isAuthMessage ? (
                            <Text
                              style={{
                                color:
                                  messageItem?.sender === profileData?._id
                                    ? 'white'
                                    : 'black',
                              }}>
                              {messageItem?.message}
                            </Text>
                          ) : (
                            isAuthMessage && (
                              <View>
                                <Image
                                  source={{uri: messageItem.uri}}
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
                                      saveImageToGallery(messageItem.uri)
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

                        {/*  Sender Image*/}
                        {messageItem?.sender === profileData?._id && (
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
                  </>
                );
              })}
            </ScrollView>
          </View>

          {/* footer */}
          {user?.deactivate === false && user?.isBlocked === false ? (
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
    // borderWidth: 1,
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
    // width: "50%",
    fontSize: 18,
    // fontWeight: "400",
    lineHeight: 36,
    color: '#071731',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  modalstyle: {
    // minHeight: 230,
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
    // position: 'absolute',
    zIndex: 4,
  },
});
