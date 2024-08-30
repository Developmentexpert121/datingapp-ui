import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import CommonBackbutton from '../../components/commonBackbutton/BackButton';
import LinearGradient from 'react-native-linear-gradient';

const ExploredScreen = () => {
  const likedData = [
    {
      id: '1',
      name: 'Let`s be Friends',
      imageUrl: require('../../assets/images/friends.png'),
    },
    {
      id: '2',
      name: 'Coffee Date',
      imageUrl: require('../../assets/images/coffee.png'),
    },
    {
      id: '3',
      name: 'Date at Night',
      imageUrl: require('../../assets/images/exploreDate.png'),
    },
    {
      id: '4',
      name: 'Binge Watcher',
      imageUrl: require('../../assets/images/movies.png'),
    },
    {
      id: '5',
      name: 'Creatives',
      imageUrl: require('../../assets/images/art.png'),
    },
    {
      id: '6',
      name: 'Sporty',
      imageUrl: require('../../assets/images/sporty.png'),
    },
    {
      id: '7',
      name: 'Music Lover',
      imageUrl: require('../../assets/images/musical.png'),
    },
    {
      id: '8',
      name: 'Travel',
      imageUrl: require('../../assets/images/travel.png'),
    },

    // Add more data as needed
  ];
  const navigation = useNavigation();

  const renderGridItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('exploreHome', {name: item?.name})}>
      <ImageBackground source={item.imageUrl} style={styles.image}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
          style={styles.gradient}></LinearGradient>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CommonBackbutton title="Explore" />
      <View
        style={{
          flex: 1,
          marginHorizontal: 26,
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={likedData}
          renderItem={renderGridItem}
          keyExtractor={item => item.id}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
};

const cardWidth = (Dimensions.get('window').width - 82) / 2;

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
    width: cardWidth,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  image: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    height: 200,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    top: '20%', // Adjust the position of the gradient
    height: '80%',
  },
  cardInner: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  name: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    color: '#fff',
  },
});

export default ExploredScreen;
