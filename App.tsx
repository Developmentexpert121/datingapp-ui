import React, {Fragment, useEffect, useState} from 'react';
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
import InternetModal from './src/components/Modals/InternetModal';
// import PushController from './src/screens/Notification/PushController';
import {navigationRef} from './src/utils/staticNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileData} from './src/store/Auth/auth';
import {
  activityLoaderFinished,
  activityLoaderStarted,
} from './src/store/Activity/activity';

const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');

const App = () => {
  const dispatch = useAppDispatch();

  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  useEffect(() => {
    if (profileData) {
      const setStorage = async () => {
        await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
      };

      setStorage();
      socket.emit('user_connected', profileData?._id);
      socket.on('connect', () => {
        console.log('App Connected from server');
        const userId = profileData?._id;
        socket.emit('user_connected', userId);
        // console.log('ahsdgjuhgdgsu', userId);
      });
    }

    return () => {
      socket.off('connect');
    };
  }, [profileData]);

  useEffect(() => {
    socket.on('user_online', users => {
      setOnlineUsers(users);
    });

    socket.on('user_offline', users => {
      setOnlineUsers(users);
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
  useEffect(() => {
    dispatch(activityLoaderStarted());
    dispatch(ProfileData())
      .unwrap()
      .then(() => {
        dispatch(activityLoaderFinished());
        // }
      });
  }, []);
  const isLoading = useAppSelector(
    (state: any) => state.ActivityLoader.loading,
  );

  return (
    <Fragment>
      <SafeAreaProvider>
        {isLoading ? (
          <Loader />
        ) : (
          <NavigationContainer ref={navigationRef}>
            {/* <PushController /> */}
            <Root />
            <GlobalModal />
            <InternetModal />
          </NavigationContainer>
        )}
      </SafeAreaProvider>
    </Fragment>
  );
};

export default withIAPContext(App);
