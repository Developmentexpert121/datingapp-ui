import React, {useEffect, useState, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {
  requestSubscription,
  useIAP,
  validateReceiptIos,
} from 'react-native-iap';

import CommonBackbutton from '../../../components/commonBackbutton/BackButton';
import SubscriptionUi from './SubscriptionUi';
import Loader from '../../../components/Loader/Loader';

const isIos = Platform.OS === 'ios';

const subscriptionSkus = Platform.select({
  ios: [
    'TopTierDatingMonthly15.99',
    'TopTierDatingMonthlyMedium29.99',
    'TopTierDatingPremiumPlus59.99',
  ],
  android: [
    // '15toptierdating',
    '15.99toptierdating',
    'toptierdatingmonthly29.99',
    'toptierdatingpremiumplus59.99',
  ],
});

const SubscriptionsScreen = ({navigation}) => {
  const {
    connected,
    subscriptions = [], // Ensure subscriptions is an array by default
    getSubscriptions,
    currentPurchase,
    finishTransaction,
    purchaseHistory = [], // Ensure purchaseHistory is an array by default
    getPurchaseHistory,
  } = useIAP();

  const [loading, setLoading] = useState(false);
  const [subscriptionsFetched, setSubscriptionsFetched] = useState(false);

  // ******************************************************
  useEffect(() => {
    if (connected && !subscriptionsFetched) {
      handleGetSubscriptions();
      getPurchaseHistory();
      setSubscriptionsFetched(true); // Set this to true to avoid re-fetching
    } else {
      // console.log('Not connected to IAP or already fetched subscriptions');
    }
  }, [connected, subscriptionsFetched]);
  // }, [connected, subscriptionsFetched]);
  // console.log('!!!!!!!!!!!!!!!!!', connected);
  // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', subscriptionsFetched);

  //

  // ******************************************************
  useEffect(() => {
    const checkCurrentPurchase = async purchase => {
      if (purchase) {
        try {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            if (isIos) {
              const isTestEnvironment = __DEV__;
              const appleReceiptResponse = await validateReceiptIos(
                {
                  'receipt-data': receipt,
                  password: '', // Ensure this is the correct shared secret
                },
                isTestEnvironment,
              );
              if (appleReceiptResponse && appleReceiptResponse.status === 0) {
                await finishTransaction(purchase);
                navigation.navigate('Home');
              }
            } else {
              await finishTransaction(purchase);
              navigation.navigate('Home');
            }
          }
        } catch (error) {
          console.log('Error in checkCurrentPurchase:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (currentPurchase) {
      checkCurrentPurchase(currentPurchase);
    }
  }, [currentPurchase, finishTransaction, isIos]);
  // }, [currentPurchase, finishTransaction, navigation, isIos]);
  // console.log('#######', currentPurchase);
  // console.log('$$$4$', finishTransaction);
  // console.log('%%%%%%%%', navigation);
  // console.log('^^^^^^^^^^', isIos);

  //

  // ******************************************************

  const handleGetSubscriptions = useCallback(async () => {
    try {
      // console.log('Fetching subscriptions...', subscriptionSkus);
      await getSubscriptions({skus: subscriptionSkus});
      // console.log('Subscriptions fetched:', subscriptions);
    } catch (error) {
      console.log('Error in handleGetSubscriptions:', error);
    }
  }, [getSubscriptions, subscriptions]);

  const handleBuySubscription = useCallback(
    async productId => {
      try {
        // console.log('Initiating purchase for:', productId);
        setLoading(true);
        if (!productId || typeof productId !== 'string') {
          throw new Error('Invalid productId');
        }
        await requestSubscription(productId);
      } catch (error) {
        console.log('Error in handleBuySubscription:', error);
        setLoading(false);
      }
    },
    [requestSubscription],
  );

  //

  // ******************************************************

  // console.log('22222222222', currentPurchase);

  //

  // ******************************************************
  const handleSubscriptionExpiry = () => {
    // Example logic for handling expired subscriptions
    Alert.alert(
      'Subscription Expired',
      'Your subscription has expired. Please renew to continue using premium features.',
      [
        {text: 'Renew Now', onPress: () => navigateToSubscriptionPage()},
        {
          text: 'Cancel',
          onPress: () => console.log('Subscription expiry cancelled'),
        },
      ],
    );
  };

  const navigateToSubscriptionPage = () => {
    // Navigate to subscription page or show options to renew
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{padding: 1}}>
          <CommonBackbutton title="Subscribe" />
          {/* <SubscriptionUi /> */}
          <View style={{height: 20}}></View>
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
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription, index) => {
                const owned = purchaseHistory.find(
                  s => s?.productId === subscription.productId,
                );
                return (
                  <View style={styles.box} key={index}>
                    {/* {subscription?.introductoryPriceSubscriptionPeriodIOS && (
                    <Text style={styles.specialTag}>SPECIAL OFFER</Text>
                  )} */}
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
                        {subscription?.title}
                      </Text>
                      <Text
                        style={{
                          paddingBottom: 20,
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        {subscription?.localizedPrice}
                      </Text>
                    </View>
                    {subscription?.introductoryPriceSubscriptionPeriodIOS && (
                      <Text>
                        Free for 1{' '}
                        {subscription?.introductoryPriceSubscriptionPeriodIOS}
                      </Text>
                    )}
                    <Text style={{paddingBottom: 20}}>
                      {subscription?.description}
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
                          onPress={() =>
                            handleBuySubscription(subscription.productId)
                          }>
                          <Text style={styles.buttonText}>Subscribe</Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={{textAlign: 'center', marginTop: 20}}>
                No subscriptions available. Please check your Play Store
                configuration.
              </Text>
            )}
            {loading && <Loader size="large" />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionsScreen;

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
