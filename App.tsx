import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootState, useAppDispatch, useAppSelector} from './src/store/store';
import messaging from '@react-native-firebase/messaging';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';
import Loader from './src/components/Loader/Loader';
import io from 'socket.io-client';
import {requestNotifications} from 'react-native-permissions';
import {onlineUser} from './src/store/reducer/authSliceState';
import {withIAPContext} from 'react-native-iap';

import PushNotification from 'react-native-push-notification';

const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');

const App = () => {
  const {showOnlineUser} = useAppSelector(
    (state: RootState) => state.authSliceState,
  );

  const dispatch = useAppDispatch();

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
  // useEffect(() => {
  //   // crashlytics().log("App Mount....");
  //   PushNotification.createChannel(
  //     {
  //       channelId: 'hatti-app',
  //       channelName: 'Hatti',
  //     },
  //     created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  //   );
  // }, []);

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

    return () => {
      socket.off('connect');
    };
  }, [profileData._id]);

  useEffect(() => {
    socket.on('user_online', userId => {
      setOnlineUsers((prevOnlineUsers: any) => {
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

    return () => {
      socket.off('user_online');
      socket.off('user_offline');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    dispatch(onlineUser(onlineUsers));
  }, [onlineUsers, dispatch]);
  // console.log('onlineUsers', onlineUsers);

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

      {/* <Subscriptions /> */}
    </SafeAreaProvider>
  );
};

export default withIAPContext(App);
