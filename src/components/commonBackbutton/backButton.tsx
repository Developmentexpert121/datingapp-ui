import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch } from '../../store/store';
import { footerStatus } from '../../store/Activity/activity';

const BackButton = ({title}:any) => {
const navigation = useNavigation();
const dispatch:any = useAppDispatch();
const handleBack = () => {
  navigation.navigate('Home')
  dispatch(footerStatus({footerStatus:"HOME"}))
}
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
    </Pressable>
    </View>
  )
}

export default BackButton

const styles = StyleSheet.create({
    backPress: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginTop: 15,
      },
      backPressIcon: {
        marginRight: 8,
        color: '#BB2CBB',
      },
      stepsText: {
        color: 'grey',
        fontSize: 20,
        //backgroundColor: '#BB2CBB',
        paddingHorizontal: 20,
        borderRadius: 15,
        marginLeft: 80,
        fontWeight: 'bold',
      },
})