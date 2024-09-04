import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
import CommonBackbutton from '../../components/commonBackbutton/BackButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  UnBlockAUser,
  blockAUser,
  getChatUsersList,
} from '../../store/Auth/auth';
import {videoCallUser} from '../../store/Activity/activity';
import SmallLoader from '../../components/Loader/SmallLoader';
import BlockModal from '../../components/Modals/BlockModal';
import Loader from '../../components/Loader/Loader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const ChatSection = () => {
  const navigation: any = useNavigation();
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const [chatListData, setChatListData] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const goToChatWith = async (user: any) => {
    await dispatch(videoCallUser({user: user}));
    navigation.navigate('VideoCallRedirect');
  };

  const handleLongPress = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleBlockUser = () => {
    BlockData();
    setModalVisible(false);
  };
  const handleUnBlockUser = () => {
    UnBlockData();
    setModalVisible(false);
  };

  // Search Function
  const [search, setSearch] = useState<any>('');
  const handleSearchChange = (text: any) => {
    setSearch(text);
  };
  const filteredData = chatListData.data
    ? chatListData.data.filter((item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  const fetchData = async () => {
    try {
      const response = await dispatch(
        getChatUsersList({userId: profileData._id}),
      ).unwrap();
      setChatListData(response);
      setInitialLoading(false);
    } catch (error) {
      console.error('Error fetching data:11', error);
      setInitialLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      // Start polling when the screen is focused
      const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds
      fetchData(); // Fetch data immediately on component mount

      return () => {
        clearInterval(intervalId);
      }; // Clear interval on blur
    }, [dispatch, profileData._id]),
  );
  // Time Funcation
  const getTimeAgo = (timestamp: string) => {
    const timeNow = new Date();
    const timeSent = new Date(timestamp);
    const differenceInSeconds = Math.floor(
      (timeNow.getTime() - timeSent.getTime()) / 1000,
    );
    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} sec ago`;
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes} mins ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours} hrs ago`;
    } else if (differenceInSeconds < 604800) {
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days} days ago`;
    } else if (differenceInSeconds < 2592000) {
      const weeks = Math.floor(differenceInSeconds / 604800);
      return `${weeks} weeks ago`;
    } else if (differenceInSeconds < 31536000) {
      const months = Math.floor(differenceInSeconds / 2592000);
      return `${months} months ago`;
    } else if (differenceInSeconds < 31536000) {
      const years = Math.floor(differenceInSeconds / 2592000);
      return `${years} months ago`;
    } else {
      const year = Math.floor(differenceInSeconds / 31536000);
      return ``;
    }
  };
  // Block
  const BlockData = async () => {
    try {
      const response = await dispatch(
        blockAUser({
          userId: profileData._id,
          userIdBeingBlocked: selectedUser._id,
        }),
      ).unwrap();
    } catch (error) {
      console.error('Error fetching data:22', error);
    }
  };
  // UnBlock
  const UnBlockData = async () => {
    try {
      const response = await dispatch(
        UnBlockAUser({
          userId: profileData._id,
          userIdBeingUnblocked: selectedUser._id,
        }),
      ).unwrap();
    } catch (error) {
      console.error('Error UnBlockData', error);
    }
  };

  //
  const renderItem = ({item}: {item: any}) => {
    const isTextMessage = !item?.chat?.uri;

    return (
      <ListItem
        containerStyle={styles.listItemContainer}
        onPress={() => goToChatWith(item)}
        onLongPress={() => handleLongPress(item)}>
        <View style={{width: '15%'}}>
          {item.profilePic ? (
            <Avatar
              size={60}
              source={{uri: item.profilePic.split(',')[0]}}
              rounded
            />
          ) : (
            <SmallLoader />
          )}
        </View>
        <View style={{width: '60%'}}>
          <Text
            style={{
              fontFamily: 'Sansation-Bold',
              fontSize: 18,
              color: 'black',
              marginBottom: 8,
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Sansation-Regular',
            }}>
            {isTextMessage ? (
              item.chat?.message
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/camera.png')}
                  style={{
                    resizeMode: 'contain',
                    height: hp(1.5),
                    width: wp(3),
                    marginRight: wp(1),
                  }}
                />
                <Text>Photo</Text>
              </View>
            )}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            rowGap: 4,
            width: '25%',
            // borderWidth: 1,
            alignItems: 'center',
          }}>
          {item.isBlocked === true ? (
            <Text
              style={{
                fontFamily: 'Sansation-Regular',
                color: 'red',
              }}>
              Bolck
            </Text>
          ) : (
            <>
              <Text
                style={{
                  fontFamily: 'Sansation-Regular',
                  fontSize: 10,
                  color: 'black',
                }}>
                {getTimeAgo(item.chat?.timestamp)}
              </Text>
            </>
          )}
        </View>
      </ListItem>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonBackbutton title="Chat" />
      <View style={{flex: 1}}>
        {initialLoading ? (
          <Loader />
        ) : (
          <View style={{flex: 1}}>
            {filteredData ? (
              <View>
                <View style={styles.containerSearch}>
                  <Ionicons name="search-outline" size={20} />
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor={'gray'}
                    onChangeText={handleSearchChange}
                    value={search}
                    style={styles.input}
                  />
                </View>
                <Text style={styles.msgs}>Messages</Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={filteredData}
                  keyExtractor={(item, index) => item._id || index.toString()}
                  renderItem={renderItem}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: hp(2.2),
                  }}>
                  No users found
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Modal for blocking  */}
      <BlockModal
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        visible={modalVisible}
        onPress={
          selectedUser?.isBlocked === true ? handleUnBlockUser : handleBlockUser
        }
        onPressCancel={() => setModalVisible(!modalVisible)}
        blockText={selectedUser?.isBlocked === true ? 'Unblock' : 'Block'}
      />

      {loader && <Loader />}
    </SafeAreaView>
  );
};

export default ChatSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  msgs: {
    marginTop: 16,
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
    color: 'black',
    marginLeft: 20,
    marginBottom: 4,
  },
  listItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
  },
  containerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 42,
    backgroundColor: '#EBEBEB',
    marginHorizontal: 20,
    height: 40,
    fontSize: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    marginLeft: 10,
  },
});
