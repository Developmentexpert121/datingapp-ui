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

import Ionicons from 'react-native-vector-icons/Ionicons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HeaderComponent = (props: any) => {
  const handleFilter = () => {
    props?.setActiveScreen('Filters');
  };
  const handleNotification = () => {
    props?.setActiveScreen('Notifications');
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <View style={styles.topNavigation}>
          <Pressable>
            {props.activeScreen !== 'HOME' ? (
              <Ionicons
                onPress={() => props?.setActiveScreen('HOME')}
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
            {props?.activeScreen === 'HOME'
              ? 'Discover'
              : props?.activeScreen === 'Notifications'
              ? 'Notifications'
              : 'Filters'}
          </Text>

          {props.activeScreen === 'HOME' ? (
            <View style={{flexDirection: 'row', gap: 20, marginRight: 10}}>
              <Pressable onPress={() => handleNotification()}>
                <MaterialIcons
                  name="notifications-on"
                  size={30}
                  style={{color: 'black'}}
                />
              </Pressable>

              <Pressable onPress={() => handleFilter()}>
                <Image
                  source={require('../../../assets/images/filter.png')}
                  style={{height: 30, width: 30}}
                />
              </Pressable>
            </View>
          ) : (
            <View style={{height: 30, width: 30, marginRight: 50}} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {},
  pageContainer: {
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
    marginRight: 32,
    width: 38,
    height: 39,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  backPressIcon: {
    marginLeft: 10,
    marginRight: 40,
    color: '#AC25AC',
  },
});

export default HeaderComponent;
