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
  PurchaseError,
  requestSubscription,
  useIAP,
  validateReceiptIos,
} from 'react-native-iap';

import CommonBackbutton from '../../../components/commonBackbutton/BackButton';

const errorLog = ({message, error}) => {
  console.error('An error happened:', message, error);
};

const isIos = Platform.OS === 'ios';

const subscriptionSkus = Platform.select({
  ios: ['TopTierDatingMonthly15.99'],
  android: ['15.99'],
});

const SubscriptionsScreen = ({navigation}) => {
  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    finishTransaction,
    purchaseHistory,
    getPurchaseHistory,
  } = useIAP();
  console.log('!!!!!!!!!!!!!!', subscriptions);

  const [loading, setLoading] = useState(false);

  const handleGetSubscriptions = async () => {
    try {
      console.log('Fetching subscriptions...');
      await getSubscriptions({skus: subscriptionSkus});
      console.log('Subscriptions fetched:');
    } catch (error) {
      console.log('error error', error);
      errorLog({message: 'handleGetSubscriptions', error});
    }
  };

  useEffect(() => {
    if (connected) {
      handleGetSubscriptions();
      getPurchaseHistory();
      console.log('connected', connected);
    } else {
      console.log('Not connected to IAP');
    }
  }, [connected]);

  const handleBuySubscription = async productId => {
    try {
      console.log('Initiating purchase for:', productId);
      setLoading(true);
      await requestSubscription(productId);
    } catch (error) {
      console.log('error handleBuySubscription', error);
      if (error instanceof PurchaseError) {
        errorLog({message: `[${error.code}]: ${error.message}`, error});
      } else {
        errorLog({message: 'handleBuySubscription', error});
      }
      setLoading(false);
    }
  };

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
          errorLog({message: 'checkCurrentPurchase', error});
        } finally {
          setLoading(false);
        }
      }
    };

    if (currentPurchase) {
      checkCurrentPurchase(currentPurchase);
    }
  }, [currentPurchase, finishTransaction, navigation]);

  return (
    <SafeAreaView>
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
            {subscriptions.map((subscription, index) => {
              const owned = purchaseHistory.find(
                s => s?.productId === subscription.productId,
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
                  {owned && (
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
                  )}
                  {loading && <ActivityIndicator size="large" />}
                  {!loading && !owned && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        handleBuySubscription(subscription.productId)
                      }>
                      <Text style={styles.buttonText}>Subscribe</Text>
                    </TouchableOpacity>
                  )}
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
