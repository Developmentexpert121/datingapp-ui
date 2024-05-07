import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAppSelector} from './src/store/store';
import messaging from '@react-native-firebase/messaging';
// import {requestNotifications} from 'react-native-permissions';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';
import Loader from './src/components/Loader/Loader';

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
