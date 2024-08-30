import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {LockIC, UnlockIC} from '../../../assets/svgs';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../../store/store';
import {Button} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const {width} = Dimensions.get('window');
const eightyPercentWidth = width * 0.84;

const dataType = [
  {
    id: 0,
    title: 'Basic',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '$14.99',
  },
  {
    id: 1,
    title: 'Premium',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '$29.99',
  },
  {
    id: 2,
    title: 'PremiumPlus',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '$59.99',
  },
];

const data2 = [
  // Basic
  {
    id: 1,
    service: 'See who likes you',
    presentIn: 0,
  },
  {
    id: 2,
    service: '50 Likes',
    presentIn: 0,
  },
  {
    id: 3,
    service: '3 Super Likes',
    presentIn: 0,
  },
  {
    id: 4,
    service: 'Access to Chat',
    presentIn: 0,
  },
  // Premium
  {id: 5, service: 'Unlimited Likes', presentIn: 1},
  {
    id: 6,
    service: '6 Super Likes',
    presentIn: 1,
  },
  {
    id: 7,
    service: 'Acces to Audio call',
    presentIn: 1,
  },
  // Premium Plus
  {
    id: 8,
    service: 'Access to Video call',
    presentIn: 2,
  },
  // *******
  // {
  //   id: 9,
  //   service: 'Unlimited Super Likes',
  //   presentIn: 1,
  // },
  // {
  //   id: 10,
  //   service: 'Control who sees you',
  //   presentIn: 1,
  // },
  // {id: 11, service: 'Top picks', presentIn: 2},
  // {id: 12, service: 'Live streaming', presentIn: 2},
  // {id: 13, service: 'Video call access', presentIn: 2},
  // {id: 14, service: 'Message before matching.', presentIn: 2},
  // {id: 15, service: 'Hide ads', presentIn: 2},
];

const SubscriptionUi: React.FC = ({premium, item, onPress}: any) => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const navigation = useNavigation();
  const [activeDot, setActiveDot] = useState(0);
  const [currentPlanId, setCurrentPlanId] = useState(0);

  const flatListRef: any = useRef(null);

  useEffect(() => {
    dataType.sort((a, b) => (a.title === profileData.plan.productId ? -1 : 1));
    setCurrentPlanId(dataType[0].id);
  }, [profileData]);

  const Box = ({item, isActive, onPress}: any) =>
    item.title !== profileData.plan.productId ? (
      <LinearGradient
        colors={[
          item.title === 'Premium' ? '#AC25AC' : '#101010',
          item.title === 'Premium' ? '#FF4FFF' : '#494949',
          item.title === 'Premium' ? '#AC25AC' : '#101010',
        ]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={styles.box}>
        <Text style={styles.boxTitle}>{item.title}</Text>
        <Text style={styles.boxDescription}>{item.description}</Text>
        <TouchableOpacity onPress={onPress} style={styles.upgradeButtonfrom}>
          <Text>Upgrade from {item.price}</Text>
        </TouchableOpacity>
      </LinearGradient>
    ) : (
      <LinearGradient
        colors={['#FFFFFF', '#FFEFBA', '#FFD700', '#FFC107']}
        start={{x: 0, y: 0.5}}
        end={{x: 0.5, y: 3}}
        style={styles.box}>
        <View style={{width: '100%'}}>
          <Text style={styles.currentPlanText}>
            Your current plan is{' '}
            <Text style={styles.planName}>{profileData.plan.productId}</Text>
          </Text>
        </View>
        <Text style={styles.planDetailText}>
          Plan bought on{' '}
          <Text style={styles.planDate}>
            {new Date(profileData.plan.transactionDate).toLocaleDateString()}
          </Text>
        </Text>
        {profileData.plan.productId !== 'PremiumPlus' && (
          <Pressable
            style={styles.upgradeButtonPlan}
            onPress={() => navigation.navigate('Subscriptions')}>
            <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
          </Pressable>
        )}
        {profileData.plan.cancellationDate ? (
          <Text style={[styles.planDetailText, {marginTop: 6}]}>
            Your subscription will end on:{' '}
            <Text style={styles.planDate}>
              {new Date(profileData.plan.cancellationDate).toLocaleDateString()}
            </Text>
          </Text>
        ) : (
          <Pressable
            style={styles.cancelButton}
            onPress={handleCancelSubscription}>
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </Pressable>
        )}
      </LinearGradient>
    );

  const renderBox = ({item, index, onPress}: any) => (
    <Box item={item} onPress={() => navigation.navigate('Subscriptions')} />
  );

  const handleDotPress = (index: any, item: any) => {
    setActiveDot(index);
    setCurrentPlanId(item.id);
    flatListRef.current.scrollToIndex({animated: true, index});
  };

  const handleCancelSubscription = () => {
    if (Platform.OS === 'ios') {
      // Open App Store subscriptions page
      Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else if (Platform.OS === 'android') {
      // Open Google Play Store subscriptions page
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* {profileData.plan === 'Free' ? ( */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.boxContainer}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={dataType}
            renderItem={renderBox}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={event => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const index = Math.floor(offsetX / eightyPercentWidth);
              setActiveDot(index);
              setCurrentPlanId(dataType[index]?.id);
            }}
          />
          <View style={styles.dotsContainer}>
            {dataType.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDotPress(index, item)}>
                <View
                  style={[styles.dot, index === activeDot && styles.activeDot]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.servicesList}>
          <FlatList
            scrollEnabled={false}
            data={data2}
            renderItem={({item, index}) => (
              <View style={styles.serviceItem}>
                <View style={styles.serviceIconContainer}>
                  {item.presentIn <= currentPlanId ? <UnlockIC /> : <LockIC />}
                </View>
                <View style={styles.serviceTextContainer}>
                  <Text style={styles.serviceText}>{item.service}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionUi;

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
  },
  boxContainer: {
    marginTop: 20,
  },
  box: {
    borderRadius: 6,
    padding: 16,
    alignItems: 'center',
    paddingHorizontal: 28,
    marginHorizontal: 30,
    marginVertical: 10,
    width: eightyPercentWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    // borderWidth: 1,
  },
  boxTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
  },
  boxDescription: {
    marginTop: 4,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
  },
  upgradeButtonPlan: {
    alignSelf: 'center',
    color: 'black',
    backgroundColor: 'green',
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    borderRadius: hp(3),
    paddingHorizontal: wp(8),
    paddingVertical: hp(0.5),
    overflow: 'hidden',
  },

  upgradeButtonfrom: {
    alignSelf: 'center',
    color: 'black',
    backgroundColor: '#AC25AC',
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    borderRadius: hp(3),
    paddingHorizontal: wp(8),
    paddingVertical: hp(0.5),
    overflow: 'hidden',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#AC25AC',
  },
  servicesList: {
    flex: 0,
    paddingTop: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    columnGap: 10,
    paddingVertical: 5,
  },
  serviceIconContainer: {
    marginRight: 8,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceText: {
    fontFamily: 'Sansation-Regular',
    color: 'black',
    fontSize: 16,
  },
  container: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 20,
    marginTop: 20,
  },
  currentPlanText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Sansation-Bold',
    marginBottom: 10,
    flexDirection: 'row',
    textAlign: 'center',
  },
  planName: {
    color: '#AC25AC',
  },
  planDetailText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Sansation-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  planDate: {
    color: '#AC25AC',
  },

  upgradeButtonText: {
    color: '#FFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
  },
  cancelButton: {
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'orange',
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
  },
});
