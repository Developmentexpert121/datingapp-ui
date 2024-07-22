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
// import {useAppDispatch, useAppSelector} from '../../../store/store';
// import {likedAUser, superLiked} from '../../../store/Auth/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch} from '../../../../store/store';
import Loader from '../../../../components/Loader/Loader';
// import Loader from '../../../../components/Loader/Loader';
// import Loader from '../../../components/Loader/Loader';

const {height, width} = Dimensions.get('window');

const TinderSwipe = ({
  data,
  currentIndex,
  setCurrentIndex,
  profileData,
  setData,
}) => {
  const dispatch = useAppDispatch();
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  const [loader, setLoader] = useState(false);
  const [noProfilesLoader, setNoProfilesLoader] = useState(false);
  // const isUserOnline = showOnlineUser?.includes(user?._id);
  const [isSuperLikeAnimating, setIsSuperLikeAnimating] = useState(false);

  useEffect(() => {
    if (currentIndex === data.length) {
      setCurrentIndex(0);
    }
    setNextIndex(currentIndex + 1);
  }, [currentIndex, data.length, setCurrentIndex]);

  useEffect(() => {
    if (data.length === 0) {
      setNoProfilesLoader(true);
      const timer = setTimeout(() => {
        setNoProfilesLoader(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [data.length]);

  const swipe = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, {dx, dy}) => {
      swipe.setValue({x: dx, y: dy});
    },
    onPanResponderRelease: (_, {dx, dy}) => {
      const directionX = Math.sign(dx);
      const directionY = Math.sign(dy);
      const isActionActiveX = Math.abs(dx) > 200;
      const isActionActiveY = Math.abs(dy) > 200;

      if (isActionActiveY && directionY < 0) {
        handleChoiceSuperLike();
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

  const onSwipeRight = async () => {
    await dispatch(
      likedAUser({
        likerId: profileData?._id,
        userIdBeingLiked: data[currentIndex]?._id,
      }),
    );
    const targetX = hiddenTranslateX;
    translateX.value = withSpring(targetX);
    setTimeout(() => {
      const updatedUsers = [...data];
      updatedUsers.splice(currentIndex, 1);
      setData(updatedUsers);
    }, 1000);
  };

  const onSwipeTop = async () => {
    await dispatch(
      superLiked({
        likerId: profileData?._id,
        userIdBeingLiked: data[currentIndex]?._id,
      }),
    );
    const targetX = hiddenTranslateX;
    translateX.value = withSpring(targetX);
    setTimeout(() => {
      const updatedUsers = [...data];
      updatedUsers.splice(currentIndex, 1);
      setData(updatedUsers);
    }, 1000);
  };

  const onSwipeLeft = async () => {
    // Implement your logic here if needed
  };

  const removeCard = useCallback(() => {
    setData(prevState => prevState.slice(1));
    swipe.setValue({x: 0, y: 0});
    setIsSuperLikeAnimating(false);
  }, [swipe]);

  const handleChoiceCross = useCallback(
    direction => {
      Animated.timing(swipe.x, {
        toValue: direction * width,
        duration: 500,
        useNativeDriver: true,
      }).start(removeCard);
    },
    [removeCard, swipe.x],
  );

  const handleChoiceHeart = useCallback(
    direction => {
      Animated.timing(swipe.x, {
        toValue: direction * width,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (direction > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
        removeCard();
      });
    },
    [removeCard, swipe.x, onSwipeRight, onSwipeLeft],
  );

  const handleChoiceSuperLike = useCallback(() => {
    if (isSuperLikeAnimating) return; // Prevent multiple clicks
    setIsSuperLikeAnimating(true);
    Animated.timing(swipe.y, {
      toValue: -height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onSwipeTop();
      removeCard();
    });
  }, [removeCard, swipe.y, onSwipeTop, isSuperLikeAnimating]);

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

  // const habits1 = {
  //   1: require('../../../assets/images/bottleofchampagne.png'),
  //   2: require('../../../assets/images/smoking.png'),
  //   3: require('../../../assets/images/Mandumbbells.png'),
  //   4: require('../../../assets/images/dogheart.png'),
  //   5: require('../../../assets/images/datestep.png'),
  // };

  // const habits2 = {
  //   1: require('../../../assets/images/chat-balloon.png'),
  //   2: require('../../../assets/images/love.png'),
  //   3: require('../../../assets/images/abroad.png'),
  //   4: require('../../../assets/images/moon.png'),
  // };
  // console.log('kdfhguerwofghqrwh', data);
  return (
    <>
      <View style={{height: '100%', width: '100%', flex: 1, borderWidth: 0}}>
        {data.length > 0 ? (
          <>
            <View style={{height: 340}}>
              {data
                .map((item, index) => {
                  const isFirst = index === 0;
                  const dragHandlers = isFirst ? panResponder.panHandlers : {};
                  return (
                    <TinderCard
                      key={index} // Add key prop here
                      swipe={swipe}
                      item={item}
                      isFirst={isFirst}
                      {...dragHandlers}
                    />
                  );
                })
                .reverse()}
            </View>
            <View style={styles.icons}>
              <TouchableOpacity
                onPress={() => {
                  handleChoiceCross(-1);
                }}>
                <Image
                  source={require('../../../../assets/images/Cross.png')}
                  style={styles.icons3}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleChoiceSuperLike();
                }}>
                <Image
                  source={require('../../../../assets/images/Star.png')}
                  style={styles.icons3}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleChoiceHeart(1);
                }}>
                <Image
                  source={require('../../../../assets/images/Heart.png')}
                  style={styles.icons3}
                />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.locText}>
                <Ionicons name="location-sharp" size={20} color="#AC25AC" />
                <Text style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
                  {profileData.location && data[currentIndex]?.location
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
              {/* <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Sansation-Regular',
                  marginLeft: 20,
                  color: 'green',
                }}>
                Active
              </Text> */}
              {/*  Habits1*/}
              {/* <View style={styles.container}>
                {data[currentIndex]?.habits1?.map((item, index) => {
                  const imagePath = habits1[item.id];

                  return (
                    <View key={index} style={styles.item}>
                      {imagePath && (
                        <Image
                          source={imagePath}
                          style={{height: 20, width: 20}}
                        />
                      )}
                      <Text
                        style={{
                          fontFamily: 'Sansation-Regular',
                          color: 'black',
                        }}>
                        {item.selectedText}
                      </Text>
                    </View>
                  );
                })}
              </View> */}
              {/* Habits2 */}
              {/* <View style={styles.container}>
                {data[currentIndex]?.habits2?.map((item, index) => {
                  const imagePath = habits2[item.id];

                  return (
                    <View key={index} style={styles.item}>
                      {imagePath && (
                        <Image
                          source={imagePath}
                          style={{height: 20, width: 20}}
                        />
                      )}
                      <Text
                        style={{
                          fontFamily: 'Sansation-Regular',
                          color: 'black',
                        }}>
                        {item.selectedText}
                      </Text>
                    </View>
                  );
                })}
              </View> */}
              {/* Partner Type */}
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
              <View style={{height: 50}}></View>
            </ScrollView>
          </>
        ) : noProfilesLoader ? (
          <Loader />
        ) : (
          <View style={{borderWidth: 0, flex: 1}}>
            <Text
              style={{
                fontFamily: 'Sansation-Bold',
                fontSize: 26,
                textAlign: 'center',
                paddingHorizontal: 20,
                marginTop: 100,
                alignSelf: 'center',
                marginTop: '50%',
              }}>
              You have viewed all profiles! Or no profile matches your applied
              filters!
            </Text>
          </View>
        )}
      </View>
      {loader ? <Loader /> : null}
    </>
  );
};

export default TinderSwipe;

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignItems: 'center',
    // width: '70%',
    // alignSelf: 'center',
    // borderWidth: 1,
    marginTop: '40%',
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
    marginTop: '50%',
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
