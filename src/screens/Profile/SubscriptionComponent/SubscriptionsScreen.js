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
  acknowledgePurchaseAndroid,
} from 'react-native-iap';
import {useDispatch} from 'react-redux';
import {verifyReceipt} from '../../../store/Auth/auth';
import CommonBackbutton from '../../../components/commonBackbutton/BackButton';
import {CommonActions} from '@react-navigation/native';
import Loader from '../../../components/Loader/Loader';
import {useAppSelector} from '../../../store/store';

const isIos = Platform.OS === 'ios';

const subscriptionSkus =
  Platform.select({
    ios: [
      'TopTierDatingMonthly15.99',
      'TopTierDatingMonthlyMedium29.99',
      'TopTierDatingPremiumPlus59.99',
    ],
    android: [
      'toptierdatingbasic15.99',
      'toptierdatingpremium29.99',
      'toptierdatingpremiumplus59.99',
    ],
  }) || [];

const SubscriptionsScreen = ({navigation}) => {
  const profileData = useAppSelector(state => state?.Auth?.data?.profileData);

  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    finishTransaction,
  } = useIAP();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true); // New state for initial loading

  const handleGetSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true); // Show loader
      await initConnection();
      console.log('Fetching subscriptions...');
      if (subscriptions.length === 0) {
        await getSubscriptions({skus: subscriptionSkus});
      }
      console.log('Subscriptions fetched:');
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoadingSubscriptions(false); // Hide loader after fetching
    }
  };

  const [showSubscriptions, setShowSubscriptions] = useState([]);

  useEffect(() => {
    if (subscriptions && isIos) {
      const data = subscriptions.map(sub => {
        let name;
        switch (sub.title) {
          case 'TopTier Dating Premimum':
            name = 'Premium';
            break;
          case 'TopTier Dating':
            name = 'Basic';
            break;
          case 'TopTier Dating Premium Plus ':
            name = 'PremiumPlus';
            break;
          default:
            name = 'Unknown';
            break;
        }
        return {...sub, name};
      });
      setShowSubscriptions(data);
    } else {
      setShowSubscriptions(subscriptions);
    }
  }, [subscriptions]);

  useEffect(() => {
    setLoading(true);
    if (connected) {
      handleGetSubscriptions();
      console.log('connected', connected);
      setLoading(false);
    } else {
      console.log('Not connected to IAP');
      setLoading(false);
    }
  }, [connected]);

  const handleBuySubscription = async product => {
    try {
      console.log(
        'Initiating purchase for::::::::::::::::::::::::::::::::',
        product,
      );

      const itemm = await requestSubscription({
        sku: product?.productId,
        ...(product?.subscriptionOfferDetails?.[0]?.offerToken && {
          subscriptionOffers: [
            {
              sku: product?.productId,
              offerToken: product.subscriptionOfferDetails[0].offerToken,
            },
          ],
        }),
      });

      console.log('first>>>>>>>>>', itemm);
      dispatch(
        verifyReceipt({
          platform: itemm.length > 0 ? 'android' : 'ios',
          receiptData: itemm.length > 0 ? itemm[0] : itemm,
        }),
      )
        .unwrap()
        .then(() => {
          console.log('first');
          purchaseUpdatedListener(async purchase => {
            const receipt = purchase.transactionReceipt;
            console.log('second');

            if (receipt) {
              try {
                console.log('third');

                if (
                  purchase.purchaseStateAndroid === 1 &&
                  !purchase.isAcknowledgedAndroid
                ) {
                  console.log('forth', purchase);

                  const yyy = await acknowledgePurchaseAndroid({
                    token: purchase.purchaseToken,
                    developerPayload: purchase.developerPayloadAndroid,
                  });
                  console.log('Purchase acknowledged', yyy);
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'BottomTabNavigation'}],
                    }),
                  );
                }
              } catch (err) {
                console.warn(err);
              }
            }
          });
        });
    } catch (error) {
      console.error('Error in handleBuySubscription:', error);
    }
  };

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
                password: '',
              },
              isTestEnvironment,
            );

            if (appleReceiptResponse && appleReceiptResponse.status === 0) {
              await finishTransaction(purchase);
            }
          } else {
            await finishTransaction({
              purchase,
              isConsumable: true,
              developerPayloadAndroid: purchase.developerPayloadAndroid,
            });
          }
        }
      } catch (error) {
        console.log('error checkCurrentPurchase', error);
      }
    }
  };

  useEffect(() => {
    if (currentPurchase) {
      checkCurrentPurchase(currentPurchase);
    }
  }, [currentPurchase]);
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!! subscriptions', showSubscriptions);
  return (
    <SafeAreaView style={{flex: 1, borderWidth: 5}}>
      <ScrollView>
        <View style={{padding: 1}}>
          <CommonBackbutton title="Subscribe" />
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
            {loadingSubscriptions ? ( // Show loader if loadingSubscriptions is true
              <Loader size="large" />
            ) : (
              showSubscriptions?.map((subscription, index) => {
                return (
                  <View style={styles.box} key={index}>
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
                    {profileData.plan.productId === subscription.name ? (
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
                    {loading && (
                      <ActivityIndicator size="large" color={'#AC25AC'} />
                    )}
                  </View>
                );
              })
            )}
            {subscriptions?.length === 0 && !loadingSubscriptions && (
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
    backgroundColor: '#AC25AC',
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

export default SubscriptionsScreen;
