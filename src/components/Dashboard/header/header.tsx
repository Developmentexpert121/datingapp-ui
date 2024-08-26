import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {BackIC, FilterIC, NotificationIC} from '../../../assets/svgs';

const HeaderComponent = (props: any) => {
  const handleFilter = () => {
    props?.setActiveScreen('Filters');
  };
  const handleNotification = () => {
    props?.setActiveScreen('Notifications');
  };
  return (
    <SafeAreaView style={styles.topNavigation}>
      <Pressable>
        {props.activeScreen === 'HOME' ? (
          <Image
            source={require('../../../assets/images/logIcon.png')}
            style={styles.icon}
          />
        ) : (
          <Ionicons
            onPress={() => props?.setActiveScreen('HOME')}
            style={styles.backPressIcon}
            name="chevron-back-outline"
            size={30}
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
          <Pressable onPress={props?.ClickNotification}>
            {/* <NotificationIC /> */}
            <Image
              source={require('../../../assets/images/Notification.png')}
              style={styles.icon1}
            />
          </Pressable>
          <Pressable onPress={() => handleFilter()}>
            {/* <FilterIC /> */}
            <Image
              source={require('../../../assets/images/Filter_Icon.png')}
              style={styles.icon1}
            />
          </Pressable>
        </View>
      ) : props?.activeScreen === 'Filters' ? (
        <TouchableOpacity
          onPress={() => {
            props.applyClick();
            // props.setApply();
          }}
          // onPress={() => props?.setActiveScreen('HOME')}
          style={{marginRight: 30}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Sansation-Bold',
              color: '#AA22AA',
              left: 10,
            }}>
            Apply
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{height: 30, width: 30, marginRight: 50}} />
      )}
    </SafeAreaView>
  );
};

export default HeaderComponent;
const styles = StyleSheet.create({
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
  icon1: {
    // marginLeft: 10,
    // marginRight: 32,
    width: 30,
    height: 30,
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
