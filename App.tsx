// import React, {Fragment, useEffect, useState} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// // import {SafeAreaProvider} from 'react-native-safe-area-context';
// import store, {
//   RootState,
//   useAppDispatch,
//   useAppSelector,
// } from './src/store/store';
// import messaging from '@react-native-firebase/messaging';
// import Root from './src/navigation/Root';
// import GlobalModal from './src/components/Modals/GlobalModal';
// import notifee, {AndroidImportance} from '@notifee/react-native';

// import Loader from './src/components/Loader/Loader';
// import io from 'socket.io-client';
// import {requestNotifications} from 'react-native-permissions';
// import {onlineUser} from './src/store/reducer/authSliceState';
// import {withIAPContext} from 'react-native-iap';
// import InternetModal from './src/components/Modals/InternetModal';
// // import PushController from './src/screens/Notification/PushController';
// import {navigationRef} from './src/utils/staticNavigation';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {ProfileData, videoCallToken} from './src/store/Auth/auth';
// import {
//   activityLoaderFinished,
//   activityLoaderStarted,
//   clientData,
// } from './src/store/Activity/activity';
// import {
//   CallingState,
//   StreamCall,
//   StreamVideo,
//   StreamVideoClient,
//   useCalls,
// } from '@stream-io/video-react-native-sdk';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import SplashScreen from 'react-native-splash-screen';
// import {Provider} from 'react-redux';
// import MyIncomingCallUI from './src/screens/ChatHome/myIncomingCallUI';

// const App = () => {
//   // const calls = useCalls();

//   // const incomingCalls = calls.filter(
//   //   call =>
//   //     call.isCreatedByMe === false &&
//   //     call.state.callingState === CallingState.RINGING,
//   // );

//   // const [incomingCall] = incomingCalls;
//   // if (incomingCall) {
//   //   return (
//   //     <StreamCall call={incomingCall}>
//   //       <MyIncomingCallUI call={incomingCall} />
//   //     </StreamCall>
//   //   );
//   // }

//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       await notifee.cancelAllNotifications();
//       const channelId = await notifee.createChannel({
//         id: 'default',
//         name: 'Default Channel',
//         importance: AndroidImportance.HIGH, // Set importance to high
//       });

//       // Display the notification
//       await notifee.displayNotification({
//         title: remoteMessage?.notification?.title || 'Notification',
//         body:
//           remoteMessage?.notification?.body ||
//           'You have received a new notification',
//         android: {
//           channelId,
//         },
//       });
//     });

//     return () => unsubscribe();
//   }, []);

//   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer ref={navigationRef}>
//         <Root />
//         <GlobalModal />
//         <InternetModal />
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// };

import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import {
  initConnection,
  purchaseUpdatedListener,
  requestSubscription,
  useIAP,
  validateReceiptIos,
  Subscription,
  Purchase,
  withIAPContext,
} from 'react-native-iap';
import {useDispatch} from 'react-redux';
import {verifyReceipt} from './src/store/Auth/auth';

const isIos = Platform.OS === 'ios';

const subscriptionSkus =
  Platform.select({
    ios: [
      'TopTierDatingMonthly15.99',
      'TopTierDatingMonthlyMedium29.99',
      'TopTierDatingPremiumPlus59.99',
    ],
    android: [
      // 'testing',
      '15.99toptierdating',
      'toptierdatingmonthly29.99',
      'toptierdatingpremiumplus59.99',
    ],
  }) || [];

type SubscriptionProduct = Subscription & {
  introductoryPriceSubscriptionPeriodIOS?: string;
};

type Props = {
  navigation: any;
};

const App: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    finishTransaction,
    purchaseHistory,
  }: any = useIAP();

  const [loading, setLoading] = useState(false);

  const handleGetSubscriptions = async () => {
    try {
      await initConnection();
      console.log('Fetching subscriptions...');
      await getSubscriptions({skus: subscriptionSkus});
      console.log('Subscriptions fetched:');
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  useEffect(() => {
    if (connected) {
      handleGetSubscriptions();
      console.log('connected', connected);
    } else {
      console.log('Not connected to IAP');
    }
  }, [connected]);

  const handleBuySubscription = async (product: SubscriptionProduct) => {
    try {
      console.log('Initiating purchase for:', product);
      const itemm = await requestSubscription({
        sku: product.productId,
        ...(product?.subscriptionOfferDetails?.[0]?.offerToken && {
          subscriptionOffers: [
            {
              sku: product.productId,
              offerToken: product.subscriptionOfferDetails[0].offerToken,
            },
          ],
        }),
      });
      dispatch(verifyReceipt({platform: 'ios', receiptData: itemm}));
      console.log('======', itemm);
    } catch (error) {
      console.error('Error in handleBuySubscription:', error);
    }
  };

  const checkCurrentPurchase = async (purchase: Purchase) => {
    if (purchase) {
      try {
        const receipt = purchase.transactionReceipt;
        console.log('receipt???????????', receipt);
        if (receipt) {
          if (isIos) {
            const isTestEnvironment = __DEV__;

            const appleReceiptResponse = await validateReceiptIos(
              {
                'receipt-data': receipt,
                password: '2393e794f5214bc59ab8387a8d2152c7',
              },
              isTestEnvironment,
            );

            if (appleReceiptResponse && appleReceiptResponse.status === 0) {
              await finishTransaction(purchase);
              console.log('finishTransaction successful............');
              // navigation.navigate('Home');
            }
          } else {
            console.log(
              '93y267598469yeihgghidfh!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
            );
            await finishTransaction(purchase);
            console.log('---------------done done done done ');

            // navigation.navigate('Home');
          }
        }
      } catch (error) {
        console.log('error checkCurrentPurchase', error);
      }
    }
  };

  useEffect(() => {
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', currentPurchase);
    if (currentPurchase) {
      checkCurrentPurchase(currentPurchase);
    }
  }, [currentPurchase]);

  useEffect(() => {
    const subscription = purchaseUpdatedListener(purchase => {
      console.log('Purchase updated:', purchase);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{padding: 1}}>
          {/* <CommonBackbutton title="Subscribe" /> */}
          <Text style={styles.listItem}>
            Subscribe to some cool stuff today.
          </Text>
          <Text
            style={{
              ...styles.listItem,
              fontWeight: '500',
              textAlign: 'center',
              marginTop: 10,
              fontSize: 18,
            }}>
            Choose your membership plan.
          </Text>
          <View style={{marginTop: 10}}>
            {subscriptions.map((subscription: any, index: any) => {
              const owned = purchaseHistory.find(
                (s: any) => s.productId === subscription.productId,
              );
              return (
                <View style={styles.box} key={index}>
                  {subscription?.introductoryPriceSubscriptionPeriodIOS && (
                    <Text style={styles.specialTag}>SPECIAL OFFER</Text>
                  )}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        paddingBottom: 10,
                        fontWeight: 'bold',
                        fontSize: 18,
                        textTransform: 'uppercase',
                      }}>
                      {subscription.title}
                    </Text>
                    <Text
                      style={{
                        paddingBottom: 20,
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      {subscription.localizedPrice}
                    </Text>
                  </View>
                  {subscription?.introductoryPriceSubscriptionPeriodIOS && (
                    <Text>
                      Free for 1{' '}
                      {subscription.introductoryPriceSubscriptionPeriodIOS}
                    </Text>
                  )}
                  <Text style={{paddingBottom: 20}}>
                    {subscription.description}
                  </Text>
                  {owned ? (
                    <>
                      <Text style={{textAlign: 'center', marginBottom: 10}}>
                        You are Subscribed to this plan!
                      </Text>
                      <TouchableOpacity
                        style={[styles.button, {backgroundColor: '#0071bc'}]}
                        onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.buttonText}>Continue to App</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    !loading && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleBuySubscription(subscription)}>
                        <Text style={styles.buttonText}>Subscribe</Text>
                      </TouchableOpacity>
                    )
                  )}
                  {loading && <ActivityIndicator size="large" />}
                </View>
              );
            })}
            {subscriptions.length === 0 && (
              <Text style={{textAlign: 'center', marginTop: 20}}>
                No subscriptions available. Please check your Play Store
                configuration.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    paddingLeft: 8,
    paddingBottom: 3,
    textAlign: 'center',
    color: 'black',
  },
  box: {
    margin: 10,
    marginBottom: 5,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 7,
    shadowColor: 'rgba(0, 0, 0, 0.45)',
    shadowOffset: {height: 16, width: 0},
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'mediumseagreen',
    borderRadius: 8,
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  specialTag: {
    color: 'white',
    backgroundColor: 'crimson',
    width: 125,
    padding: 4,
    fontWeight: 'bold',
    fontSize: 12,
    borderRadius: 7,
    marginBottom: 2,
  },
});

export default withIAPContext(App);
