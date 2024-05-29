import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from './src/store/store';
import messaging from '@react-native-firebase/messaging';
// import {requestNotifications} from 'react-native-permissions';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';
import Loader from './src/components/Loader/Loader';
import io from 'socket.io-client';
import {ProfileData} from './src/store/Auth/auth';

const socket = io('https://datingapp-api.onrender.com');

const App = () => {
  const dispatch: any = useAppDispatch();
  // async function requestUserPermission() {
  //   await requestNotifications(['alert', 'sound']);
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     // console.log('Authorization status:', authStatus);
  //   }
  // }
  // *********************

  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [chatMessages, setChatMessages] = useState<any>([]);
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  // console.log('........profileData', profileData);
  useEffect(() => {
    // console.log('........profileData111111', profileData?._id);

    // dispatch(ProfileData())
    //   .unwrap()
    //   .then((res: any) => {
    // console.log(';s;s;s;s;s;s', res.data._id);
    if (profileData?._id) {
      socket.emit('user_connected', profileData?._id);
      socket.on('connect', () => {
        const userId = profileData?._id;
        // console.log('----------------------', userId);
        socket.emit('user_connected', userId);
      });
    }

    // });

    // socket.on('chat message', msg => {
    //   // Handle incoming messages
    //   console.log('App Received message:', msg);
    //   // Update chatMessages state accordingly
    //   if (msg.sender !== profileData._id) {
    //     setChatMessages((prevMessages: any) => [...prevMessages, msg]);
    //   }
    // });

    // return () => {
    //   socket.disconnect();
    // };
  }, [profileData._id]);

  socket.on('user_online', userId => {
    // console.log('userIduserIduserId', userId);

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

  // console.log(',,,,,,,onlineUsers', onlineUsers);

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
          {/* {isLoading && <LoadingSpinner />} */}
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
};

export default App;
