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
          <Pressable onPress={() => handleNotification()}>
            <MaterialIcons name="notifications-on" size={30} />
            {/* <MaterialCommunityIcons
            name="star-four-points"
            size={30}
            color={activeScreen === 'STAR' ? activeColor : color}
          /> */}
          </Pressable>
          <Pressable onPress={() => handleFilter()}>
            <Ionicons name="filter-outline" size={30} />
            {/* <Ionicons
              onPress={()=> navigation.navigate('Chat')}
              name="chatbubble-ellipses-sharp"
              size={30}
              color={activeScreen === 'CHAT' ? activeColor : color}
            /> */}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    //flex: 1,
  },
  pageContainer: {
    //  justifyContent: 'center',
    //  alignItems: 'center',
    //  flex: 1,
    marginTop: 20,
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },
  backPressIcon:{
    color: '#BB2CBB'
  }
});

export default HeaderComponent;
