// import React, {useState, useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   FlatList,
//   ScrollView,
//   Dimensions,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {LockIC, UnlockIC} from '../../../assets/svgs';
// import {useNavigation} from '@react-navigation/native';

// const {width} = Dimensions.get('window');
// const eightyPercentWidth = width * 0.84;

// const dataType = [
//   {
//     id: 1,
//     title: 'Basic',
//     description:
//       'Maximize your dating with all the benefits of premium with extra features included',
//     price: '$14.99',
//   },
//   {
//     id: 2,
//     title: 'Premium',
//     description:
//       'Maximize your dating with all the benefits of premium with extra features included',
//     price: '$29.99',
//   },
//   {
//     id: 3,
//     title: 'Premium Plus',
//     description:
//       'Maximize your dating with all the benefits of premium with extra features included',
//     price: '$59.99',
//   },
// ];

// const data2 = [
//   {id: 1, service: 'See who likes you', icon: <LockIC />},
//   {id: 2, service: 'Priority likes', icon: <LockIC />},
//   {id: 3, service: 'Unlimited likes', icon: <UnlockIC />},
//   {id: 4, service: 'Control who you see', icon: <UnlockIC />},
//   {id: 5, service: 'Access to chat', icon: <UnlockIC />},
//   {id: 6, service: 'Access to advanced search filters', icon: <UnlockIC />},
//   {id: 7, service: 'Checkout who likes you', icon: <UnlockIC />},
//   {id: 8, service: 'Access to audio call', icon: <UnlockIC />},
//   {id: 9, service: 'Unlimited Super Likes', icon: <UnlockIC />},
//   {id: 10, service: 'Control who sees you', icon: <UnlockIC />},
//   {id: 11, service: 'Top picks', icon: <UnlockIC />},
//   {id: 12, service: 'Live streaming', icon: <UnlockIC />},
//   {id: 13, service: 'Video call access', icon: <UnlockIC />},
//   {id: 14, service: 'Message before matching.', icon: <UnlockIC />},
//   {id: 15, service: 'Hide ads', icon: <UnlockIC />},
// ];

// const SubscriptionUi: React.FC = ({premium, item, onPress}: any) => {
//   const navigation = useNavigation();
//   const [activeIndex, setActiveIndex] = useState(0);
//   const flatListRef: any = useRef(null);

//   const Box = ({item, isActive, onPress}: any) => (
//     <LinearGradient
//       colors={[
//         item.title === 'Premium' ? '#AC25AC' : '#101010',
//         item.title === 'Premium' ? '#FF4FFF' : '#494949',
//         item.title === 'Premium' ? '#AC25AC' : '#101010',
//       ]}
//       start={{x: 0, y: 0.5}}
//       end={{x: 1, y: 0.5}}
//       style={styles.box}>
//       <Text style={styles.boxTitle}>{item.title}</Text>
//       <Text style={styles.boxDescription}>{item.description}</Text>
//       <TouchableOpacity onPress={onPress}>
//         <Text style={styles.upgradeButton}>Upgrade from {item.price}</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   );

//   const renderBox = ({item, index, onPress}: any) => (
//     <Box
//       item={item}
//       isActive={index === activeIndex}
//       onPress={() => navigation.navigate('Subscriptions')}
//     />
//   );

//   const handleDotPress = (index: any) => {
//     setActiveIndex(index);
//     flatListRef.current.scrollToIndex({animated: true, index});
//   };

//   const getUpdatedData2 = () => {
//     if (activeIndex === 0) {
//       return data2.map((item, index) => ({
//         ...item,
//         icon: index < 4 ? <UnlockIC /> : <LockIC />,
//       }));
//     } else if (activeIndex === 1) {
//       return data2.map((item, index) => ({
//         ...item,
//         icon: index >= 0 && index < 10 ? <UnlockIC /> : <LockIC />,
//       }));
//     } else if (activeIndex === 2) {
//       return data2.map((item, index) => ({
//         ...item,
//         icon: index >= 10 ? <UnlockIC /> : <UnlockIC />,
//       }));
//     }
//     return data2;
//   };

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         style={styles.scrollView}>
//         <View style={styles.boxContainer}>
//           <FlatList
//             ref={flatListRef}
//             horizontal
//             data={dataType}
//             renderItem={renderBox}
//             keyExtractor={(item, index) => index.toString()}
//             showsHorizontalScrollIndicator={false}
//             pagingEnabled
//             onScroll={event => {
//               const offsetX = event.nativeEvent.contentOffset.x;
//               const index = Math.floor(offsetX / eightyPercentWidth);
//               setActiveIndex(index);
//             }}
//           />
//           <View style={styles.dotsContainer}>
//             {dataType.map((_, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => handleDotPress(index)}>
//                 <View
//                   style={[
//                     styles.dot,
//                     index === activeIndex && styles.activeDot,
//                   ]}
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         <View style={styles.servicesList}>
//           <FlatList
//             scrollEnabled={false}
//             data={getUpdatedData2()}
//             renderItem={({item}) => (
//               <View style={styles.serviceItem}>
//                 <View style={styles.serviceIconContainer}>{item.icon}</View>
//                 <View style={styles.serviceTextContainer}>
//                   <Text style={styles.serviceText}>{item.service}</Text>
//                 </View>
//               </View>
//             )}
//             keyExtractor={(item, index) => index.toString()}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SubscriptionUi;

// const styles = StyleSheet.create({
//   scrollView: {
//     width: '100%',
//     height: '100%',
//   },
//   boxContainer: {
//     marginTop: 20,
//   },
//   box: {
//     borderRadius: 6,
//     padding: 16,
//     alignItems: 'center',
//     paddingHorizontal: 28,
//     marginHorizontal: 30,
//     marginBottom: 5,
//     width: eightyPercentWidth,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.23,
//     shadowRadius: 2.62,
//     elevation: 4,
//   },
//   boxTitle: {
//     color: 'white',
//     fontSize: 24,
//     fontFamily: 'Sansation-Bold',
//   },
//   boxDescription: {
//     marginTop: 4,
//     textAlign: 'center',
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'Sansation-Regular',
//   },
//   upgradeButton: {
//     alignSelf: 'center',
//     color: 'black',
//     backgroundColor: '#F99A21',
//     fontFamily: 'Sansation-Regular',
//     marginTop: 16,
//     marginBottom: 6,
//     fontSize: 14,
//     borderRadius: 30,
//     paddingHorizontal: 20,
//     paddingVertical: 4,
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: 'lightgray',
//     marginHorizontal: 5,
//   },
//   activeDot: {
//     backgroundColor: '#AC25AC',
//   },
//   servicesList: {
//     flex: 0,
//     paddingTop: 16,
//   },
//   serviceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     columnGap: 10,
//     paddingVertical: 5,
//   },
//   serviceIconContainer: {
//     marginRight: 8,
//   },
//   serviceTextContainer: {
//     flex: 1,
//   },
//   serviceText: {
//     fontFamily: 'Sansation-Regular',
//     color: 'black',
//     fontSize: 16,
//   },
// });

import React, {useState, useRef} from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {LockIC, UnlockIC} from '../../../assets/svgs';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../../store/store';
import {Button} from 'react-native-elements';

const {width} = Dimensions.get('window');
const eightyPercentWidth = width * 0.84;

const dataType = [
  {
    id: 1,
    title: 'Basic',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '$14.99',
  },
  {
    id: 2,
    title: 'Premium',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '$29.99',
  },
  {
    id: 3,
    title: 'Premium Plus',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '$59.99',
  },
];

const data2 = [
  {id: 1, service: 'See who likes you', icon: <LockIC />},
  {id: 2, service: 'Priority likes', icon: <LockIC />},
  {id: 3, service: 'Unlimited likes', icon: <UnlockIC />},
  {id: 4, service: 'Control who you see', icon: <UnlockIC />},
  {id: 5, service: 'Access to chat', icon: <UnlockIC />},
  {id: 6, service: 'Access to advanced search filters', icon: <UnlockIC />},
  {id: 7, service: 'Checkout who likes you', icon: <UnlockIC />},
  {id: 8, service: 'Access to audio call', icon: <UnlockIC />},
  {id: 9, service: 'Unlimited Super Likes', icon: <UnlockIC />},
  {id: 10, service: 'Control who sees you', icon: <UnlockIC />},
  {id: 11, service: 'Top picks', icon: <UnlockIC />},
  {id: 12, service: 'Live streaming', icon: <UnlockIC />},
  {id: 13, service: 'Video call access', icon: <UnlockIC />},
  {id: 14, service: 'Message before matching.', icon: <UnlockIC />},
  {id: 15, service: 'Hide ads', icon: <UnlockIC />},
];

const SubscriptionUi: React.FC = ({premium, item, onPress}: any) => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef: any = useRef(null);

  const Box = ({item, isActive, onPress}: any) => (
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
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.upgradeButton}>Upgrade from {item.price}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderBox = ({item, index, onPress}: any) => (
    <Box
      item={item}
      isActive={index === activeIndex}
      onPress={() => navigation.navigate('Subscriptions')}
    />
  );

  const handleDotPress = (index: any) => {
    setActiveIndex(index);
    flatListRef.current.scrollToIndex({animated: true, index});
  };

  const getUpdatedData2 = () => {
    if (activeIndex === 0) {
      return data2.map((item, index) => ({
        ...item,
        icon: index < 4 ? <UnlockIC /> : <LockIC />,
      }));
    } else if (activeIndex === 1) {
      return data2.map((item, index) => ({
        ...item,
        icon: index >= 0 && index < 10 ? <UnlockIC /> : <LockIC />,
      }));
    } else if (activeIndex === 2) {
      return data2.map((item, index) => ({
        ...item,
        icon: index >= 10 ? <UnlockIC /> : <UnlockIC />,
      }));
    }
    return data2;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {profileData.plan === 'Free' ? (
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
                setActiveIndex(index);
              }}
            />
            <View style={styles.dotsContainer}>
              {dataType.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDotPress(index)}>
                  <View
                    style={[
                      styles.dot,
                      index === activeIndex && styles.activeDot,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.servicesList}>
            <FlatList
              scrollEnabled={false}
              data={getUpdatedData2()}
              renderItem={({item}) => (
                <View style={styles.serviceItem}>
                  <View style={styles.serviceIconContainer}>{item.icon}</View>
                  <View style={styles.serviceTextContainer}>
                    <Text style={styles.serviceText}>{item.service}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.currentPlanText}>
            Your current plan is{' '}
            <Text style={styles.planName}>{profileData.plan.productId}</Text>
          </Text>
          <Text style={styles.planDetailText}>
            Plan bought on{' '}
            <Text style={styles.planDate}>
              {new Date(profileData.plan.transactionDate).toLocaleDateString()}
            </Text>
          </Text>
          <Pressable
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('Subscriptions')}>
            <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
          </Pressable>
          <Pressable
            style={styles.cancelButton}
            onPress={() => {
              // handle subscription cancellation
            }}>
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </Pressable>
        </View>
      )}
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
    marginBottom: 5,
    width: eightyPercentWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
  upgradeButton: {
    alignSelf: 'center',
    color: 'black',
    backgroundColor: '#AC25AC',
    fontFamily: 'Sansation-Regular',
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  // upgradeButton: {
  //   backgroundColor: '#AC25AC',
  //   borderRadius: 30,
  //   paddingVertical: 12,
  //   alignItems: 'center',
  //   marginBottom: 10,
  // },
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
  },
  planName: {
    color: '#AC25AC',
  },
  planDetailText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Sansation-Regular',
    marginBottom: 20,
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
