import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Image,
  Text,
} from 'react-native';

import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NotificationIcon = () => {
  const navigation = useNavigation();
  return <Pressable></Pressable>;
};
const HeaderComponent = (props: any) => {
  const [activeScreen, setActiveScreen] = useState('HOME');
  const navigation = useNavigation();
  const color = '#b5b5b5';
  const activeColor = '#F76C6B';
  const handleFilter = () => {
    setActiveScreen('CHAT');
    navigation.navigate('Filter');
  };
  const handleNotification = () => {
    setActiveScreen('STAR');
    navigation.navigate('Notification');
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <View style={styles.topNavigation}>
          <Pressable onPress={() => setActiveScreen('HOME')}>
            {/* <Fontisto
              name="tinder"
              size={30}
              color={activeScreen === 'HOME' ? activeColor : color}
            /> */}
            {props.icon === true ? (
              <Ionicons
                onPress={() => navigation.navigate('Home')}
                style={styles.backPressIcon}
                name="chevron-back-outline"
                size={30}
              />
            ) : (
              <Image
                source={require('../../../assets/images/logIcon.png')}
                style={styles.icon}
              />
            )}
          </Pressable>
          <Text style={styles.title}>
            {props.title ? props.title : 'Discover'}
          </Text>
          <View style={{flexDirection: 'row', gap: 20, marginRight: 10}}>
            <Pressable onPress={() => handleNotification()}>
              <MaterialIcons
                name="notifications-on"
                size={30}
                style={{color: 'black'}}
              />
              {/* <MaterialCommunityIcons
            name="star-four-points"
            size={30}
            color={activeScreen === 'STAR' ? activeColor : color}
          /> */}
            </Pressable>
            <Pressable onPress={() => handleFilter()}>
              <Image
                source={require('../../../assets/images/filter.png')}
                style={{height: 30, width: 30}}
              />
              {/* <Ionicons
              onPress={()=> navigation.navigate('Chat')}
              name="chatbubble-ellipses-sharp"
              size={30}
              color={activeScreen === 'CHAT' ? activeColor : color}
            /> */}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {},
  pageContainer: {
    //  justifyContent: 'center',
    //  alignItems: 'center',
    //  flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 4,
  },
  icon: {
    marginLeft: 10,
    width: 38,
    height: 39,
  },
  title: {
    marginLeft: 30,
    fontSize: 26,
    fontFamily: 'Sansation_Bold',
    color: 'black',
  },
  backPressIcon: {
    marginLeft: 10,
    color: '#AC25AC',
  },
});

export default HeaderComponent;
