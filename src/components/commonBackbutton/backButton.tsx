import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch} from '../../store/store';
import {footerStatus} from '../../store/Activity/activity';

const BackButton = ({title}: any) => {
  const navigation = useNavigation();
  const dispatch: any = useAppDispatch();
  const handleBack = () => {
    navigation.navigate('Home');
    dispatch(footerStatus({footerStatus: 'HOME'}));
  };
  return (
    <View>
      <Pressable style={styles.backPress}>
        <Ionicons
          onPress={() => handleBack()}
          style={styles.backPressIcon}
          name="chevron-back-outline"
          size={30}
        />
        <Text style={styles.stepsText}>{title}</Text>
        <View style={{width: 50}}></View>
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
    marginVertical: 24,
  },
  backPressIcon: {
    color: '#AC25AC',
  },
  stepsText: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation_Bold',
  },
});
