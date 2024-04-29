// import React from "react";
// import { View, Text, StyleSheet, Button } from "react-native";
// {/* <Button title="Toggle drawer" onPress={() => navigation.toggleDrawer()} />
// <Button title="Settings" onPress={() => navigation.jumpTo("Settings")} /> */}
// const Drawer= ({ navigation }:any) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to the Dating App</Text>
//       <View style={styles.iconContainer}>
//         <Icon name="heart" size={50} color="red" />
//         <Icon name="search" size={50} color="blue" />
//         <Icon name="user" size={50} color="green" />
//       </View>
//     </View>
//   );
// };

// export default Drawer;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '80%',
//   },
// });

import React from 'react';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import DrawerScreen from '../../../screens/Home/home';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Button,
} from 'react-native';
import ProfileScreen from '../../../screens/Profile/profileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateAuthentication} from '../../../store/Auth/auth';
import {useAppDispatch} from '../../../store/store';
import {
  activityLoaderFinished,
  activityLoaderStarted,
} from '../../../store/Activity/activity';
import {useAppSelector} from '../../../store/store';
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const {navigation} = props;
  const dispatch: any = useAppDispatch();
  const profileData = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const handleLogout = async () => {
    dispatch(activityLoaderStarted());
    dispatch(updateAuthentication());
    await AsyncStorage.removeItem('authToken');
    dispatch(activityLoaderFinished());
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.view1}>
        <Image
          source={{uri: 'https://picsum.photos/200/300'}}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            shadowColor: 'black',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.5,
            shadowRadius: 2,
          }}
        />
        <Text style={styles.username}>{profileData?.email ?? 'username'}</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity
        style={styles.xicon}
        onPress={() => navigation.closeDrawer()}>
        {/* <Icon name="close" size={30} color="#333" /> */}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleLogout()}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const HomeDrawer = () => {
  return (
    <Drawer.Navigator
      // initialRouteName="Dashboard"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Dashboard"
        component={DrawerScreen}
        options={{
          title: 'Dashboard',
          //  drawerLabel: () => null,
          drawerActiveTintColor: '#333',
          drawerActiveBackgroundColor: 'lightblue',
          drawerContentStyle: {
            backgroundColor: '#c6cbef',
          },
        }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={DrawerScreen} />
      <Drawer.Screen name="Network" component={DrawerScreen} />
      <Drawer.Screen name="Privacy" component={DrawerScreen} />
      <Drawer.Screen name="Friends" component={DrawerScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  xicon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  view1: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeDrawer;
