import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAppSelector} from './src/store/store';
import messaging from '@react-native-firebase/messaging';
// import {requestNotifications} from 'react-native-permissions';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';
import Loader from './src/components/Loader/Loader';
import io from 'socket.io-client';

const socket = io('https://datingapp-api.onrender.com');

const App = () => {
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
  // useEffect(() => {
  //   socket.on('user_online', userId => {
  //     // Update UI to show user as online
  //   });

  //   socket.on('user_offline', userId => {
  //     // Update UI to show user as offline
  //   });
  //   socket.on('connection', () => {
  //     console.log('Connected to server');
  //     const userId = profileData._id();
  //     console.log('userId userId', userId);
  //     socket.emit('user_connected', userId);
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('Disconnected from server');
  //   });

  //   socket.on('chat message', msg => {
  //     // Handle incoming messages
  //     console.log('Received message:', msg);
  //     // Update chatMessages state accordingly

  //     // Update chatMessages state with the received message
  //     if (msg.sender !== profileData._id) {
  //       setChatMessages((prevMessages: any) => [...prevMessages, msg]);
  //     }
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

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

// import {View, Text} from 'react-native';
// import React from 'react';
// import SecondStepScreen from './src/screens/auth/Registration/secondStepScreen';

// const App = () => {
//   return (
//     <View>
//       <SecondStepScreen />
//     </View>
//   );
// };

// export default App;
