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
      <View style={{width: '100%', alignItems: 'center'}}>
        <View style={styles.icons}>
          {/* <TouchableOpacity>
          <View style={styles.button}>
            <FontAwesome name="undo" size={30} color="#FBD88B" />
          </View>
        </TouchableOpacity> */}

          <TouchableOpacity onPress={onSwipeLeft}>
            <View style={styles.button}>
              <Entypo name="cross" size={40} color="#AC25AC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.button}>
              <FontAwesome name="heart" size={40} color="#4FCC94" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.button}>
              <FontAwesome name="star" size={40} color="#3AB4CC" />
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity>
          <View style={styles.button}>
            <Ionicons name="flash" size={30} color="#A65CD2" />
          </View>
        </TouchableOpacity> */}
        </View>
      </View>
      <View style={styles.locText}>
        <Ionicons name="location-sharp" size={20} color="#AC25AC" />
        <Text style={{fontFamily: 'Sansation_Regular', color: 'black'}}>
          30 miles away
        </Text>
      </View>
      <View style={styles.container}>
        {dataArr.map((item: any, index: any) => (
          <Text key={index} style={styles.item}>
            {item}
          </Text>
        ))}
      </View>

      <FooterComponent icon="HOME" />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ededed',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    marginVertical: 12,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',

    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#AC25AC',
  },

  locText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10, // Adjust as needed
    marginHorizontal: 20,
    marginBottom: 20,
  },
  item: {
    borderWidth: 1.4,
    borderRadius: 52,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: 'Sansation_Regular',
    color: 'black',
    marginBottom: 10,
  },
});

export default HomeScreen;
