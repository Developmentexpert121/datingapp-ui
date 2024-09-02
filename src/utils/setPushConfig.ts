import {
  StreamVideoClient,
  StreamVideoRN,
} from '@stream-io/video-react-native-sdk';
import {AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {staticNavigate} from './staticNavigation';
import http from '../services/http/http-common';
import messaging from '@react-native-firebase/messaging';

const getTokenForUser = async (userId: any) => {
  try {
    const response = await http.post(`/user/stream-chat/token`, {id :userId});
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      return {error: 'Bad Request'};
    } else {
      throw error;
    }
  }
};

export function setPushConfig() {
  StreamVideoRN.setPushConfig({
    ios: {
      // add your push_provider_name for iOS that you have setup in Stream dashboard
      pushProviderName: __DEV__ ? 'TopTierDating' : 'TopTierDating',
    },
    android: {
      // add your push_provider_name for Android that you have setup in Stream dashboard
      pushProviderName: __DEV__ ? 'TopTierDating' : 'TopTierDating',
      // configure the notification channel to be used for incoming calls for Android.
      incomingCallChannel: {
        id: 'stream_incoming_call',
        name: 'Incoming call notifications',
        // This is the advised importance of receiving incoming call notifications.
        // This will ensure that the notification will appear on-top-of applications.
        importance: AndroidImportance.HIGH,
        // optional: if you dont pass a sound, default ringtone will be used
        // sound:'default',
        sound:'ring',
        vibration:true
      },
      // configure the functions to create the texts shown in the notification
      // for incoming calls in Android.
      incomingCallNotificationTextGetters: {
        getTitle: (createdUserName: string) =>
          `Incoming call from ${createdUserName}`,
        getBody: (_createdUserName: string) => 'Tap to answer the call',
      },
    },
    // add the callback to be executed a call is accepted, used for navigation
    navigateAcceptCall: () => {
      staticNavigate({name: 'AfterLogin', params: undefined});
    },
    // add the callback to be executed when a notification is tapped,
    // but the user did not press accept or decline, used for navigation
    navigateToIncomingCall: () => {
      staticNavigate({name: 'AfterLogin', params: undefined});
    },
    // add the async callback to create a video client
    // for incoming calls in the background on a push notification
    createStreamVideoClient: async () => {
      // note that since the method is async,
      // you can call your server to get the user data or token or retrieve from offline storage.
      const allProfileData: any = await AsyncStorage.getItem('profileData');
      const  profileData = JSON.parse(allProfileData);
      if (!profileData) return undefined;
      const apiKey = '48e74nbgz5az';
      const tokenProvider = async () => {
        const token = await getTokenForUser(profileData?.data?._id).then(
          auth => auth?.token,
        );
        return token;
      };

      const token = await tokenProvider();
      
      const userMain = {
        id: profileData?.data?._id,
        name: profileData?.data?.name,
        image: profileData?.data?.profilePic.split(',')[0],
      };

      return StreamVideoClient.getOrCreateInstance({
        apiKey,
        user: userMain,
        tokenProvider: token,
      });
    },
  });
}
