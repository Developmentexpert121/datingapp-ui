import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

const HomeHeader = (props: any) => {
  return (
    <SafeAreaView style={styles.topNavigation}>
      <TouchableOpacity>
        <Image
          source={require('../../assets/images/logIcon.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Discover</Text>
      <View style={{flexDirection: 'row', gap: 20, marginRight: 10}}>
        <TouchableOpacity onPress={props?.ClickNotification}>
          {/* <NotificationIC /> */}
          <Image
            source={require('../../assets/images/Notification.png')}
            style={styles.icon1}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={props?.ClickFilter}>
          {/* <FilterIC /> */}
          <Image
            source={require('../../assets/images/Filter_Icon.png')}
            style={styles.icon1}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeHeader;
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
});
