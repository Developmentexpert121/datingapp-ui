import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import TinderCard from './TinderCard';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {likedAUser, superLiked} from '../../../store/Auth/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../../components/Loader/Loader';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {height, width} = Dimensions.get('window');

const TinderSwipe = ({
  data,
  currentIndex,
  setCurrentIndex,
  profileData,
  setData,
  setModalOpen,
  setReason,
  setTotalLikesPossible,
  totalLikesPossible,
  setTotalSuperLikesPossible,
  totalSuperLikesPossible,
}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  const [loader, setLoader] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const {showOnlineUser} = useAppSelector(state => state.authSliceState);

  const isUserOnline =
    showOnlineUser?.includes(data[currentIndex]?._id) || false;

  const [isSuperLikeAnimating, setIsSuperLikeAnimating] = useState(false);

  useEffect(() => {
    if (currentIndex === data.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, data.length, setCurrentIndex]);

  const swipe = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, {dx, dy}) => {
      swipe.setValue({x: dx, y: dy});
    },
    onPanResponderRelease: (_, {dx, dy}) => {
      const directionX = Math.sign(dx);
      const isActionActiveX = Math.abs(dx) > 57;
      const isActionActiveY = Math.abs(dy) > 10;

      const angleInRadians = Math.atan2(dy, dx);
      const angleInDegrees = (angleInRadians * 180) / Math.PI;
      const absoluteAngle = Math.abs(angleInDegrees);

      const isStrictUpwardSwipe =
        absoluteAngle >= 80 && absoluteAngle <= 100 && dy < -70;

      if (isStrictUpwardSwipe) {
        handleChoiceSuperLike(isActionActiveY);
      } else if (isActionActiveX) {
        handleChoiceHeart(directionX);
      } else {
        Animated.spring(swipe, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    },
  });

  const checkLikeLimitReached = previousData => {
    let limitReached = false;

    if (
      (profileData.plan === 'Free' &&
        totalLikesPossible > 19) ||
      (profileData.plan.productId === 'Basic' &&
        totalLikesPossible > 49)
    ) {
      recenterCard();
      setModalOpen(true);
      setReason('like');
      setData(previousData);
      limitReached = true;
    } else {
      setTotalLikesPossible(prev => prev + 1);
    }

    return limitReached;
  };

  const onSwipeRight = async () => {
    const previousData = [...data]; // Store previous state
    const isLimitReached = checkLikeLimitReached(previousData);
    if (!isLimitReached) {
      setData(prevState => prevState.slice(1)); // Show next card

      try {
        const res = await dispatch(
          likedAUser({
            likerId: profileData?._id,
            userIdBeingLiked: data[currentIndex]?._id,
          }),
        ).unwrap();

        if (res.success === true) {
          recenterCard();
        } else {
          recenterCard();
          setModalOpen(true);
          setData(previousData);
          setReason('like');
        }
      } catch (error) {
        recenterCard();
        setModalOpen(true);
        setData(previousData);
        setReason('like');
      } finally {
        setLoader(false);
      }
    }
  };

  const checkSuperLikeLimitReached = previousData => {
    let limitReached = false;

    if (
      (profileData.plan === 'Free' &&
        totalSuperLikesPossible > 0) ||
      (profileData.plan.productId === 'Basic' &&
        totalSuperLikesPossible > 2) ||
      (profileData.plan.productId === 'Premium' &&
        totalSuperLikesPossible > 5) ||
      (profileData.plan.productId === 'PremiumPlus' &&
        totalSuperLikesPossible > 9)
    ) {
      recenterCard();
      setModalOpen(true);
      setReason('superLike');
      setData(previousData);
      limitReached = true;
    } else {
      setTotalSuperLikesPossible(prev => prev + 1);
    }

    return limitReached;
  };

  const onSwipeTop = async () => {
    const previousData = [...data]; // Store previous state
    const isLimitReached = checkSuperLikeLimitReached(previousData);
    if (!isLimitReached) {
      setData(prevState => prevState.slice(1)); // Show next card
      // setLoader(true); // Show loader
      try {
        const res = await dispatch(
          superLiked({
            likerId: profileData?._id,
            userIdBeingLiked: data[currentIndex]?._id,
          }),
        ).unwrap();

        if (res.success === true) {
          recenterCard();
        } else {
          recenterCard();
          setModalOpen(true);
          setData(previousData);
          setReason('superLike');
        }
      } catch (error) {
        recenterCard();
        setModalOpen(true);
        setData(previousData);
        setReason('superLike');
      } finally {
        setLoader(false);
      }
    }
  };

  // ######################
  const onSwipeLeft = async () => {
    setData(prevState => prevState.slice(1));
    recenterCard();
    // Implement your logic here if needed
  };
  const recenterCard = useCallback(() => {
    swipe.setValue({x: 0, y: 0});
    setIsSuperLikeAnimating(false);
  }, [swipe]);
  // Nope..............
  const handleChoiceCross = useCallback(
    direction => {
      Animated.timing(swipe.x, {
        toValue: direction * width * 1.1,
        // duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setData(prevState => prevState.slice(1));
        recenterCard();
      });
    },
    [recenterCard, swipe.x],
  );
  // Like..........
  const handleChoiceHeart = useCallback(
    direction => {
      Animated.timing(swipe.x, {
        toValue: direction * width * 1.1,
        // duration: 800,
        useNativeDriver: true,
      }).start(() => {
        if (direction > 0) {
          onSwipeRight();
          recenterCard();
        } else {
          onSwipeLeft();
          recenterCard();
        }
      });
    },
    [recenterCard, swipe.x, onSwipeRight, onSwipeLeft],
  );
  // SuperLike.............
  const handleChoiceSuperLike = useCallback(() => {
    if (isSuperLikeAnimating) return; // Prevent multiple clicks
    setIsSuperLikeAnimating(true);
    Animated.timing(swipe.y, {
      toValue: -height,
      // duration: 800,
      useNativeDriver: true,
    }).start(() => {
      onSwipeTop();
      recenterCard();
    });
  }, [recenterCard, swipe.y, onSwipeTop, isSuperLikeAnimating]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Earth radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const toRadians = degrees => {
    return (degrees * Math.PI) / 180;
  };

  const habits1 = {
    1: require('../../../assets/images/bottleofchampagne.png'),
    2: require('../../../assets/images/smoking.png'),
    3: require('../../../assets/images/Mandumbbells.png'),
    4: require('../../../assets/images/dogheart.png'),
    5: require('../../../assets/images/datestep.png'),
  };

  const habits2 = {
    1: require('../../../assets/images/chat-balloon.png'),
    2: require('../../../assets/images/love.png'),
    3: require('../../../assets/images/abroad.png'),
    4: require('../../../assets/images/moon.png'),
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: '100%',
          width: '100%',
        }}>
        {data.length > 0 ? (
          <>
            <View>
              <View style={{height: 340}}>
                {data
                  .map((item, index) => {
                    const isFirst = index === 0;
                    const dragHandlers = isFirst
                      ? panResponder.panHandlers
                      : {};
                    return (
                      <TinderCard
                        key={item._id}
                        swipe={swipe}
                        item={item}
                        setCurrentUser={setCurrentUser}
                        isFirst={isFirst}
                        {...dragHandlers}
                      />
                    );
                  })
                  .reverse()}
              </View>
              <View style={[styles.icons, {zIndex: -1}]}>
                <TouchableOpacity
                  onPress={() => {
                    handleChoiceCross(-1);
                  }}>
                  <Image
                    source={require('../../../assets/images/Cross.png')}
                    style={styles.icons3}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      (profileData.plan === 'Free' &&
                        totalSuperLikesPossible > 0) ||
                      (profileData.plan.productId === 'Basic' &&
                        totalSuperLikesPossible > 2) ||
                      (profileData.plan.productId === 'Premium' &&
                        totalSuperLikesPossible > 5) ||
                      (profileData.plan.productId === 'PremiumPlus' &&
                        totalSuperLikesPossible > 9)
                    ) {
                      setReason('superLike');
                      setModalOpen(true);
                    } else {
                      handleChoiceSuperLike();
                    }
                  }}>
                  <Image
                    source={require('../../../assets/images/Star.png')}
                    style={styles.icons3}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      (profileData.plan === 'Free' &&
                        totalLikesPossible > 19) ||
                      (profileData.plan.productId === 'Basic' &&
                        totalLikesPossible > 49)
                    ) {
                      setReason('like');
                      setModalOpen(true);
                    } else {
                      handleChoiceHeart(1);
                    }
                  }}>
                  <Image
                    source={require('../../../assets/images/Heart.png')}
                    style={styles.icons3}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                height: hp(40),
                marginTop: hp(1),
                zIndex: -1,
              }}
              contentContainerStyle={{
                paddingBottom: hp(2),
              }}>
              {/* Location */}
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.locText}>
                  <Ionicons name="location-sharp" size={20} color="#AC25AC" />
                  <Text
                    style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
                    {profileData?.location && data[currentIndex]?.location
                      ? `${Math.round(
                          calculateDistance(
                            profileData.location.latitude,
                            profileData.location.longitude,
                            data[currentIndex].location.latitude,
                            data[currentIndex].location.longitude,
                          ),
                        ).toFixed(0)} miles away`
                      : 'Distance information unavailable'}
                  </Text>
                </View>
                {/* Active */}
                {isUserOnline ? (
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Sansation-Regular',
                      marginLeft: 25,
                      marginTop: 5,
                      color: 'green',
                    }}>
                    Active
                  </Text>
                ) : null}

                {/* habits1 */}
                <View style={styles.container}>
                  {data[currentIndex]?.habits1?.map((item, index) => {
                    const imagePath = habits1[item.id];

                    return (
                      <View key={item.id} style={styles.item}>
                        {imagePath && (
                          <Image
                            source={imagePath}
                            style={{height: 20, width: 20}}
                          />
                        )}
                        <View
                          style={{
                            gap: 4,
                          }}>
                          {item.optionSelected.map(option => (
                            <Text
                              key={option} // Add key for nested items
                              style={{
                                fontFamily: 'Sansation-Regular',
                                color: 'black',
                              }}>
                              {option}
                            </Text>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
                {/* habits2 */}
                <View style={styles.container}>
                  {data[currentIndex]?.habits2?.map((item, index) => {
                    const imagePath = habits2[item.id];
                    return (
                      <View key={item.id} style={styles.item}>
                        {imagePath && (
                          <Image
                            source={imagePath}
                            style={{height: 20, width: 20}}
                          />
                        )}
                        {item.optionSelected.map(option => (
                          <Text
                            key={option} // Add key for nested items
                            style={{
                              fontFamily: 'Sansation-Regular',
                              color: 'black',
                            }}>
                            {option}
                          </Text>
                        ))}
                      </View>
                    );
                  })}
                </View>
                {/* PartnerType */}
                <View style={styles.container}>
                  {data[currentIndex]?.partnerType && (
                    <View style={styles.item}>
                      <Text
                        style={{
                          fontFamily: 'Sansation-Regular',
                          color: 'black',
                        }}>
                        {data[currentIndex].partnerType}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{height: 10}}></View>
              </TouchableOpacity>
            </ScrollView>
          </>
        ) : (
          data.length === 0 && (
            <Text
              style={{
                fontFamily: 'Sansation-Bold',
                fontSize: 26,
                textAlign: 'center',
                paddingHorizontal: 20,
                marginTop: 100,
                alignSelf: 'center',
              }}>
              You have viewed all profiles! Or no profile matches your applied
              filters!
            </Text>
          )
        )}
      </View>
      {loader ? <Loader /> : null}
    </View>
  );
};

export default TinderSwipe;

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  locText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  item: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
    margin: 5,
  },
  icons3: {height: 50, width: 50},
});
