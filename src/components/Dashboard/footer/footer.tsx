import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
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
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome2 from 'react-native-vector-icons/FontAwesome';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {footerStatus} from '../../../store/Activity/activity';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
const FooterComponent = () => {
  //const [activeScreen, setActiveScreen] = useState('HOME');
  const dispatch: any = useAppDispatch();
  const activeScreen = useAppSelector(
    (state: any) => state.ActivityLoader.footerStatus,
  );
  console.log('activeScreennactiveScreennactiveScreenn ', activeScreen);
  const navigation = useNavigation();
  const color = '#b5b5b5';
  // const color = "#BB2CBB"
  //   const activeColor = '#F76C6B';
  const activeColor = '#BB2CBB';
  const handleView = (route: any, icon: any) => {
    //setActiveScreen(icon);
    dispatch(footerStatus({footerStatus: icon}));
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.horizontalLine}></View>
      <View style={styles.pageContainer}>
        <View style={styles.topNavigation}>
          <Pressable onPress={() => handleView('Home', 'HOME')}>
            <FontAwesome6
              name="fire"
              size={34}
              color={activeScreen === 'HOME' ? activeColor : color}
            />
          </Pressable>

          {/* <Pressable onPress={() => setActiveScreen('STAR')}>
          <MaterialCommunityIcons
            name="star-four-points"
            size={34}
            color={activeScreen === 'STAR' ? activeColor : color}
          />
          </Pressable> */}

          <Pressable onPress={() => handleView('Explore', 'EXPLORED')}>
            <Feather
              name="refresh-ccw"
              size={34}
              color={activeScreen === 'EXPLORED' ? activeColor : color}
            />
          </Pressable>

          <Pressable onPress={() => handleView('Liked', 'LIKED')}>
            <AntDesign
              name="heart"
              size={34}
              color={activeScreen === 'LIKED' ? activeColor : color}
            />
          </Pressable>
          <Pressable onPress={() => handleView('ChatScreen', 'CHAT')}>
            <Ionicons
              name="chatbubbles"
              size={34}
              color={activeScreen === 'CHAT' ? activeColor : color}
            />
          </Pressable>

          <Pressable onPress={() => handleView('Profile', 'PROFILE')}>
            <FontAwesome
              name="user"
              size={34}
              color={activeScreen === 'PROFILE' ? activeColor : color}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    // backgroundColor: '#f0f0f0',
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: 50, // Adjust the height as needed
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 0,
  },
  pageContainer: {
    //  justifyContent: 'center',
    //  alignItems: 'center',
    //  flex: 1,
    marginVertical: 16,
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
  horizontalLine: {
    height: 2,
    backgroundColor: '#AC25AC',
  },
});

export default FooterComponent;
