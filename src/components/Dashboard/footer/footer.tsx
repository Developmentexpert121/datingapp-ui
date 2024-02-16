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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const FooterComponent = ({icon}: {icon: string}) => {
  const [activeScreen, setActiveScreen] = useState('');
  const navigation = useNavigation();
  const color = 'grey';
  useEffect(() => {
    setActiveScreen(icon);
  }, [icon]);
  const activeColor = '#AC25AC';
  const handleView = (route: any) => {
    navigation.navigate(route);
  };
  console.log(activeScreen);
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.horizontalLine}></View>
      <View style={styles.pageContainer}>
        <View style={styles.topNavigation}>
          <Pressable onPress={() => handleView('Home')}>
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

          <Pressable onPress={() => handleView('Explore')}>
            <Feather
              name="refresh-ccw"
              size={34}
              color={activeScreen === 'EXPLORED' ? activeColor : color}
            />
          </Pressable>

          <Pressable onPress={() => handleView('Liked')}>
            <AntDesign
              name="heart"
              size={34}
              color={activeScreen === 'LIKED' ? activeColor : color}
            />
          </Pressable>
          <Pressable onPress={() => handleView('Chat')}>
            <Ionicons
              name="chatbubbles"
              size={34}
              color={activeScreen === 'CHAT' ? activeColor : color}
            />
          </Pressable>

          <Pressable onPress={() => handleView('Profile')}>
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
    //flex: 1,
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
