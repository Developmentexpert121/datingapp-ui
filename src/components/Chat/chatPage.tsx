import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ListItem, Avatar, SearchBar } from 'react-native-elements';
import Icon1 from "react-native-vector-icons/FontAwesome"
import Icon2 from "react-native-vector-icons/FontAwesome6"

const ChatPage = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
        <View style={{flexDirection:'row', paddingStart:10}}>
        <Pressable style={styles.backPress}>
          <Ionicons
            onPress={() => navigation.navigate('Chat')}
            style={styles.backPressIcon}
            name="chevron-back-outline"
            size={30}
          />
         </Pressable>
          <Avatar source={{ uri: 'https://placekitten.com/50/50' }} rounded size={60} />
          <View style={{flexDirection:'column'}}>
          <Text style={styles.stepsText}>Watt</Text>
          <Text style={{fontSize:15, marginStart:15}}>online 30m ago</Text>
          </View></View>
          <View style={{flexDirection:'row', marginEnd:10}}>
          <TouchableOpacity onPress={()=>navigation.navigate('ChatPage')}>
          <Icon1 name="phone" size={24} color="#BB2CBB" style={styles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('ChatPage')}>
          <Icon2 name="video" size={24} color="#BB2CBB" style={styles.editIcon} />
          </TouchableOpacity></View>
    </View>
  )
}

export default ChatPage

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent:'space-between',
        paddingTop:20
    },
    backPress: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // padding: 10,
         marginEnd: 10,
      },
      backPressIcon: {
        //marginRight: 8,
        color: '#BB2CBB',
      },
      stepsText: {
        color: 'grey',
        fontSize: 20,
        //backgroundColor: '#BB2CBB',
        paddingHorizontal: 20,
        borderRadius: 15,
        //marginLeft: 80,
        fontWeight: 'bold',
      },

      editIcon: {
        marginRight: 10,
        backgroundColor:'#edb9ed',
        borderRadius:20,
        padding:8
      },
})