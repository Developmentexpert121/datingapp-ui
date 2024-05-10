import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
import CommonBackbutton from '../../components/commonBackbutton/CommonBackbutton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {getChatUsersList, getReceivers} from '../../store/Auth/auth';
import {videoCallUser} from '../../store/Activity/activity';

const ChatSection = () => {
  const navigation: any = useNavigation();
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const allUsers: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allUsers,
  );
  // console.log('allUsers allUsers', allUsers);
  const chatUsersList: any = useAppSelector(
    (state: any) => state?.Auth?.data?.chatUsersList,
  );
  console.log('chatUsersList', chatUsersList);
  const [receiverData, setReceiverData] = useState<any>([]);
  const [chatListData, setChatListData] = useState<any>([]);
  console.log('--------------Array', receiverData);
  console.log('-------chatListData-------', chatListData);

  const goToChatWith = async (user: any) => {
    await dispatch(videoCallUser({user: user}));
    navigation.navigate('VideoCallRedirect');
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await dispatch(
  //         getReceivers({senderId: profileData._id}),
  //       ).unwrap();
  //       setReceiverData(response.receivers);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   // const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds
  //   fetchData(); // Fetch data immediately on component mount
  //   // return () => clearInterval(intervalId);
  // }, []);

  // Seacrh Function

  const [search, setSearch] = useState<any>('');
  const handleSearchChange = (text: any) => {
    setSearch(text);
  };
  const filteredReceiverData = allUsers.filter((item: any) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
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

  // ******************
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          getChatUsersList({userId: profileData._id}),
        ).unwrap();
        setChatListData(response.receivers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds
    fetchData(); // Fetch data immediately on component mount
    // return () => clearInterval(intervalId);
  }, []);
  // ******************
  const renderItem = ({item}: {item: any}) => {
    return (
      <ListItem
        containerStyle={styles.listItemContainer}
        onPress={() => goToChatWith(item)}
        //
      >
        <View style={{width: '15%'}}>
          <Avatar size={60} source={{uri: item.profilePic}} rounded />
        </View>
        <View style={{width: '65%'}}>
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
            {item.latestMessage}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            rowGap: 4,
            width: '20%',
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
      </ListItem>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <CommonBackbutton title="Chat" />
      <View style={{flex: 1}}>
        <View style={styles.containerSearch}>
          <Ionicons name="search-outline" size={20} />
          <TextInput
            placeholder="Search"
            onChangeText={handleSearchChange}
            value={search}
            style={styles.input}
          />
        </View>
        <Text style={styles.msgs}>Messages</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredReceiverData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </View>
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
    width: '100%',
    flexDirection: 'row',
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
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    marginLeft: 10,
  },
});

export default ChatSection;
