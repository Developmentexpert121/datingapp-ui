import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FooterComponent from '../footer/footer';
import CommonBackbutton from '../../commonBackbutton/backButton';
const ExploredScreen = () => {
  const likedData = [
    {
      id: '1',
      name: 'Name 1',
      bio: 'Bio 1',
      imageUrl: require('../../../assets/images/screenImage1.png'),
    },
    {
      id: '2',
      name: 'Name 2',
      bio: 'Bio 2',
      imageUrl: require('../../../assets/images/screenImage2.png'),
    },
    {
      id: '4',
      name: 'Name 4',
      bio: 'Bio 4',
      imageUrl: require('../../../assets/images/screenImage2.png'),
    },
    {
      id: '3',
      name: 'Name 3',
      bio: 'Bio 3',
      imageUrl: require('../../../assets/images/screenImage1.png'),
    },
    {
      id: '5',
      name: 'Name 5',
      bio: 'Bio 5',
      imageUrl: require('../../../assets/images/screenImage1.png'),
    },
    {
      id: '6',
      name: 'Name 6',
      bio: 'Bio 6',
      imageUrl: require('../../../assets/images/screenImage2.png'),
    },
    {
      id: '9',
      name: 'Name 9',
      bio: 'Bio 9',
      imageUrl: require('../../../assets/images/screenImage2.png'),
    },
    {
      id: '7',
      name: 'Name 7',
      bio: 'Bio 7',
      imageUrl: require('../../../assets/images/screenImage1.png'),
    },

    // Add more data as needed
  ];

  const navigation = useNavigation();

  const renderGridItem = ({item}: any) => (
    <View style={styles.gridItem}>
      <ImageBackground source={item.imageUrl} style={styles.card}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.bio}>{item.bio}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <CommonBackbutton title="Explore" />
      <View
        style={{
          flex: 1,
          marginHorizontal: 26,
        }}>
        <FlatList
          data={likedData}
          renderItem={renderGridItem}
          keyExtractor={item => item.id}
          numColumns={2}
        />
      </View>
      <FooterComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    height: 200,
  },
  cardInner: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingBottom: 5,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Sansation_Bold',
    color: '#fff',
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Sansation_Regular',
  },
  backPress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 15,
  },
  backPressIcon: {
    marginRight: 8,
    color: '#AC25AC',
  },
  stepsText: {
    color: 'grey',
    fontSize: 20,
    //backgroundColor: '#AC25AC',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 80,
  },
});

export default ExploredScreen;
