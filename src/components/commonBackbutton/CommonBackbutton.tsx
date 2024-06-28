import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch} from '../../store/store';
import {footerStatus} from '../../store/Activity/activity';

const BackButton = ({title, iconName, setIsDrawerOpen}: any) => {
  const navigation = useNavigation();
  const dispatch: any = useAppDispatch();
  const handleBack = () => {
    if (title === 'Edit Profile' || title === 'Settings') {
      navigation.goBack();
      dispatch(footerStatus({footerStatus: 'PROFILE'}));
    } else {
      navigation.goBack();
      dispatch(footerStatus({footerStatus: 'HOME'}));
    }
  };
  return (
    <View style={{borderWidth: 0}}>
      <Pressable style={styles.backPress}>
        <Ionicons
          onPress={() => handleBack()}
          style={styles.backPressIcon}
          name="chevron-back-outline"
          size={30}
        />
        <Text style={styles.stepsText}>{title}</Text>
        {iconName ? (
          <Ionicons
            onPress={() => setIsDrawerOpen(true)}
            style={[styles.backPressIcon, {marginRight: 20}]}
            name={iconName}
            size={30}
          />
        ) : (
          <View style={{width: 50}}></View>
        )}
      </Pressable>
    </View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backPress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginVertical: 15,
  },
  backPressIcon: {
    color: '#AC25AC',
  },
  stepsText: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
  },
});
