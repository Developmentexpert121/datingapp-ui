import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Text,
} from 'react-native';
import Card from '../homeCard/homeCard';
import users from '../../../assets/data/users';
import AnimatedStack from '../../AnimatedStack/animatedStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import HeaderComponent from '../header/header';
import FooterComponent from '../footer/footer';

const HomeScreen = () => {
  const onSwipeLeft = (user: any) => {
    //  console.warn('swipe left', user.name);
  };

  const onSwipeRight = (user: any) => {
    // console.warn('swipe right: ', user.name);
  };
  const dataArr: any = [
    'Non-Smoker',
    'Photography',
    'Virgo',
    'Street food',
    'Foodie tour',
  ];
  return (
    <View style={styles.pageContainer}>
      <HeaderComponent />
      <AnimatedStack
        data={users}
        renderItem={({item}: any) => <Card user={item} />}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />

      <View style={styles.icons}>
        {/* <TouchableOpacity>
          <View style={styles.button}>
            <FontAwesome name="undo" size={30} color="#FBD88B" />
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={onSwipeLeft}>
          <View style={styles.button}>
            <Entypo name="cross" size={30} color="#BB2CBB" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.button}>
            <FontAwesome name="star" size={30} color="#3AB4CC" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.button}>
            <FontAwesome name="heart" size={30} color="#4FCC94" />
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity>
          <View style={styles.button}>
            <Ionicons name="flash" size={30} color="#A65CD2" />
          </View>
        </TouchableOpacity> */}
      </View>
      <View style={styles.locText}>
        <Ionicons name="location-sharp" size={20} color="#BB2CBB" />
        <Text>30 miles away</Text>
      </View>
      <View style={styles.container}>
      {dataArr.map((item:any, index:any) => (
        <Text key={index} style={styles.item}>
          {item}
        </Text>
      ))}
    </View>

      <FooterComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#ededed',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },

  locText: {
    flexDirection: 'row', 
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 17
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjust as needed
    padding: 10,
  },
  item: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    margin: 5,
  },
});

export default HomeScreen;
