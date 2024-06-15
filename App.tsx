import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootState, useAppDispatch, useAppSelector} from './src/store/store';
import messaging from '@react-native-firebase/messaging';
// import {requestNotifications} from 'react-native-permissions';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';
import Loader from './src/components/Loader/Loader';
import io from 'socket.io-client';
import {requestNotifications} from 'react-native-permissions';
import {onlineUser} from './src/store/reducer/authSliceState';
// import PushNotification from 'react-native-push-notification';

// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);
//   },
//   requestPermissions: true,
// });

const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');

const App = () => {
  const {showOnlineUser} = useAppSelector(
    (state: RootState) => state.authSliceState,
  );

  const dispatch: any = useAppDispatch();
  async function requestUserPermission() {
    await requestNotifications(['alert', 'sound']);
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  }
  // *********************

  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  useEffect(() => {
    if (profileData?._id) {
      socket.emit('user_connected', profileData?._id);
      socket.on('connect', () => {
        console.log('App Connected from server');
        const userId = profileData?._id;
        socket.emit('user_connected', userId);
      });
    }
  }, [profileData._id]);

  socket.on('user_online', userId => {
    setOnlineUsers((prevOnlineUsers: any) => {
      // Check if userId already exists in the array
      if (!prevOnlineUsers.includes(userId)) {
        return [...prevOnlineUsers, userId];
      }
      return prevOnlineUsers;
    });
  });

  socket.on('user_offline', userId => {
    setOnlineUsers((prevOnlineUsers: any) =>
      prevOnlineUsers.filter((user: any) => user !== userId),
    );
  });

  socket.on('disconnect', () => {
    console.log('App Disconnected from server');
  });
  dispatch(onlineUser(onlineUsers));
  console.log(',,,,,,,onlineUsers', onlineUsers);
  const isLoading = useAppSelector(
    (state: any) => state.ActivityLoader.loading,
  );

  return (
    <SafeAreaProvider>
      {isLoading ? (
        <Loader />
      ) : (
        <NavigationContainer>
          <Root />
          <GlobalModal />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
};

export default App;
