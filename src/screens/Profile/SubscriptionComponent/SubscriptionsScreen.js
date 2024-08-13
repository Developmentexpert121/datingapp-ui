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

const SubscriptionsScreen = ({navigation}) => {
  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    finishTransaction,
    purchaseHistory,
  } = useIAP();

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

  const handleBuySubscription = async product => {
    try {
      console.log('Initiating purchase for:', product);
      await requestSubscription({
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
    } catch (error) {
      console.error('Error in handleBuySubscription:', error);
    }
  };

  const checkCurrentPurchase = async purchase => {
    if (purchase) {
      try {
        const receipt = purchase.transactionReceipt;
        // console.log('receipt >>>>.', receipt);
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
              // navigation.navigate('Home');
            }
          } else {
            await finishTransaction(purchase);
            // navigation.navigate('Home');
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
            {subscriptions.map((subscription, index) => {
              const owned = purchaseHistory.find(
                s => s.productId === subscription.productId,
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

export default SubscriptionsScreen;
