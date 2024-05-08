// ChatScreen.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {ListItem, Avatar, SearchBar} from 'react-native-elements';
import CommonBackbutton from '../../components/commonBackbutton/CommonBackbutton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {getReceivers} from '../../store/Auth/auth';
import {videoCallUser} from '../../store/Activity/activity';

const UsersDrawer = ({isOpen, onClose}: any) => {
  const dispatch: any = useAppDispatch();
  const allUsers: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allUsers,
  );

  const navigation: any = useNavigation();

  const goToChatWith = async (user: any) => {
    await dispatch(videoCallUser({user: user}));
    navigation.navigate('VideoCallRedirect');
    onClose();
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Select a user you want to chat with!
          </Text>

          {allUsers.map((users: any, index: any) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToChatWith(users)}
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingVertical: 10,
                columnGap: 16,
              }}>
              <Avatar source={{uri: users.profilePic}} rounded size={54} />
              <Text
                style={{
                  fontFamily: 'Sansation-Bold',
                  fontSize: 20,
                  color: 'black',
                }}>
                {users.name}
              </Text>
            </TouchableOpacity>
          ))}
          <Text
            onPress={onClose}
            style={{
              fontFamily: 'Sansation-Bold',
              fontSize: 16,
              color: 'white',
              borderWidth: 1,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 30,
              marginTop: 10,
              backgroundColor: '#AC25AC',
              borderColor: '#AC25AC',
            }}>
            Close
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const ChatSection = () => {
  const navigation: any = useNavigation();
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const allUsers: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allUsers,
  );

  const [receiverData, setReceiverData] = useState<any>([]);
  console.log('--------------Array', receiverData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          getReceivers({senderId: profileData._id}),
        ).unwrap();
        setReceiverData(response.receivers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds
    fetchData(); // Fetch data immediately on component mount
    // return () => clearInterval(intervalId);
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Seacrh

  const [search, setSearch] = useState<any>('');

  const handleSearchChange = (text: any) => {
    setSearch(text);
  };
  const filteredReceiverData = receiverData.filter((item: any) =>
    item?.userInfo?.name?.toLowerCase().includes(search.toLowerCase()),
  );
  ///?`,
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleMovepage = async (user: any) => {
    await dispatch(videoCallUser({user: user}));
    navigation.navigate('VideoCallRedirect', {user: user});
  };

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
    } else {
      const years = Math.floor(differenceInSeconds / 31536000);
      return `${years} years ago`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonBackbutton
        title="Chat"
        // iconName="person-add-sharp"
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <View style={{flex: 1}}>
        <View style={styles.containerSearch}>
          <Ionicons name="search-outline" size={20} style={styles.icon} />
          <TextInput
            placeholder="Search"
            onChangeText={handleSearchChange}
            value={search}
            style={styles.input}
          />
        </View>
        <Text style={styles.msgs}>Messages</Text>
        <FlatList
          data={filteredReceiverData}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <ListItem
                containerStyle={styles.listItemContainer}
                onPress={() => handleMovepage(item?.userInfo)}>
                <Avatar
                  size={60}
                  source={{uri: item?.userInfo?.profilePic}}
                  rounded
                />
                <View style={styles.line}>
                  <View style={{paddingBottom: 10}}>
                    <Text
                      style={{
                        fontFamily: 'Sansation-Bold',
                        fontSize: 18,
                        color: 'black',
                        marginBottom: 8,
                      }}>
                      {item?.userInfo?.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Sansation-Regular',
                      }}>
                      {item.latestMessage}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      rowGap: 4,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Sansation-Regular',
                        fontSize: 10,
                        color: 'black',
                      }}>
                      {getTimeAgo(item.latestMessageTimestamp)}
                    </Text>
                    <Ionicons name="checkmark-done" size={20} color="#AC25AC" />
                  </View>
                </View>
              </ListItem>
            );
          }}
        />
      </View>
      <UsersDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </SafeAreaView>
  );
};

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
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
  },
  search: {
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 20,
    height: 40,
    fontSize: 20,
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
  icon: {},
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  modalView: {
    margin: 12,

    backgroundColor: 'white',
    borderRadius: 12,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Sansation-sBold',
  },
});

export default ChatSection;