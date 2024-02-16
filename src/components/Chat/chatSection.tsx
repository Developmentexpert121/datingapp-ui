// ChatScreen.js
import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet, TextInput} from 'react-native';
import {ListItem, Avatar, SearchBar} from 'react-native-elements';
import CommonBackbutton from '../commonBackbutton/backButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import FooterComponent from '../Dashboard/footer/footer';
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
      <View style={{marginHorizontal: 20, flex: 1}}>
        <View style={styles.containerSearch}>
          <Ionicons name="search-outline" size={20} style={styles.icon} />
          <TextInput
            placeholder="Search"
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
              containerStyle={styles.listItemContainer}
              onPress={() => handleMovepage(item.name)}>
              <Avatar size={60} source={{uri: item.avatar}} rounded />
              <View style={styles.line}>
                <View style={{marginBottom: 10}}>
                  <Text
                    style={{
                      fontFamily: 'Sansation_Bold',
                      fontSize: 18,
                      color: 'black',
                      marginBottom: 8,
                    }}>
                    {item.name}
                  </Text>
                  <Text style={{fontFamily: 'Sansation_Regular'}}>
                    {item.lastMessage}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    rowGap: 4,
                  }}>
                  <Text style={{fontFamily: 'Sansation_Regular', fontSize: 10}}>
                    {item.time}
                  </Text>
                  <Ionicons name="checkmark-done" size={20} color="#AC25AC" />
                </View>
              </View>
            </ListItem>
          )}
        />
      </View>
      <FooterComponent icon="CHAT" />
    </View>
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
    fontFamily: 'Sansation_Bold',
    color: 'black',
  },
  listItemContainer: {
    padding: 0,
    paddingVertical: 10,
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 6,
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

    height: 40,
    fontSize: 20,
  },
  icon: {},
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Sansation_Regular',
  },
});

export default ChatScreen;
