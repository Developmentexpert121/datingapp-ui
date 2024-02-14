// ChatScreen.js
import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet, TextInput} from 'react-native';
import {ListItem, Avatar, SearchBar} from 'react-native-elements';
import CommonBackbutton from '../commonBackbutton/backButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
const ChatScreen = () => {
  const [search, setSearch] = useState<any>('');
  const navigation = useNavigation();
  const data = [
    {
      id: '1',
      name: 'User 1',
      time: '10 min ago',
      lastMessage: 'Hello!',
      avatar: 'https://placekitten.com/50/50',
    },
    {
      id: '2',
      name: 'User 2',
      time: '30 min ago',
      lastMessage: 'Hi there!',
      avatar: 'https://placekitten.com/50/50',
    },
    {
      id: '3',
      name: 'User 3',
      time: '20 min ago',
      lastMessage: 'Hello!',
      avatar: 'https://placekitten.com/50/50',
    },
    {
      id: '4',
      name: 'User 4',
      time: '40 min ago',
      lastMessage: 'Hi there!',
      avatar: 'https://placekitten.com/50/50',
    },
  ];

  const filteredData: any = data.filter(item => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  const updateSearch = (text: string) => {
    setSearch(text);
  };

  console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
  const handleMovepage = (item: any) => {
    navigation.navigate('ChatPage');
  };
  return (
    <View style={styles.container}>
      <CommonBackbutton title="Chat" />
      <View style={styles.containerSearch}>
        <Ionicons name="search-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="Search ..."
          onChangeText={updateSearch}
          value={search}
          style={styles.input}
        />
      </View>
      <Text style={styles.msgs}>Messages</Text>
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListItem
            onPress={() => handleMovepage(item.name)}
            containerStyle={{borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
            <Avatar source={{uri: item.avatar}} rounded />
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.lastMessage}</ListItem.Subtitle>
            </ListItem.Content>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <ListItem.Title>{item.time}</ListItem.Title>
              <Ionicons name="checkmark-done" size={20} color="#BB2CBB" />
            </View>
            <View style={styles.line} />
          </ListItem>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  msgs: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    color: 'grey',
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
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
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#BDBDBD',

    marginHorizontal: 20,
    height: 40,
    fontSize: 20,
  },
  icon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    fontSize: 17,
  },
});

export default ChatScreen;
