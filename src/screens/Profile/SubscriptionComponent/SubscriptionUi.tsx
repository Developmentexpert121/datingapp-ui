import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {LockIC, UnlockIC} from '../../../assets/svgs';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const eightyPercentWidth: number = width * 0.84;
const dataType = [
  {
    title: 'Premium',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '999INR',
  },
  {
    title: 'Premium Plus',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '1,999INR',
  },
];

const data2 = [
  {service: 'See who likes you', icon: <LockIC />},
  {service: 'Priority likes', icon: <LockIC />},
  {service: 'Unlimited Rewards', icon: <UnlockIC />},
  {service: 'Unlimited likes', icon: <UnlockIC />},
];

const SubscriptionUi: React.FC = ({premium, item, onPress}: any) => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef: any = useRef(null);

  const Box = ({item, isActive, onPress}: any) => (
    <LinearGradient
      colors={[
        item.title === 'Premium' ? '#AC25AC' : '#101010',
        item.title === 'Premium' ? '#FF4FFF' : '#494949',
      ]}
      start={{x: 0, y: 0.5}}
      end={{x: 1, y: 0.5}}
      style={[styles.box]}>
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

  return (
    <SafeAreaView style={{flex: 1}}>
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
              const index = Math.floor(offsetX / 300);
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
            data={data2}
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
    backgroundColor: '#F99A21',
    fontFamily: 'Sansation-Regular',
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 4,
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
});
