import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {ChevronLeftIC} from '../../assets/svgs';
import {useNavigation} from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <View style={{borderWidth: 2}}>
      {/* <ChevronLeftIC onPress={() => navigation.goBack()} /> */}
      <TouchableOpacity
        style={{margin: 20}}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../assets/images/chevron-left.png')}
          resizeMode="contain"
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
