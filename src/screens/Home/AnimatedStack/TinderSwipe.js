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
import {likedAUser} from '../../../store/Auth/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../../../components/Loader/Loader';

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
      }, 900);
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
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > 200;
      if (isActionActive) {
        handleChoiceButtons1(direction);
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
    const targetX = hiddenTranslateX; // Assuming hiddenTranslateX is defined elsewhere
    translateX.value = withSpring(targetX);
    setTimeout(() => {
      const updatedUsers = [...data];
      updatedUsers.splice(currentIndex, 1);
      setData(updatedUsers);
    }, 1000);
  };

  const onSwipeLeft = async () => {
    // Implement your onSwipeLeft logic here if needed
  };

  const removeCard = useCallback(() => {
    setData(prevState => prevState.slice(1));
    swipe.setValue({x: 0, y: 0});
  }, [swipe]);

  const handleChoiceButtons = useCallback(
    direction => {
      Animated.timing(swipe.x, {
        toValue: direction * width,
        duration: 500,
        useNativeDriver: true,
      }).start(removeCard);
    },
    [removeCard, swipe.x],
  );

  const handleChoiceButtons1 = useCallback(
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

  return (
    <>
      <View style={{height: '100%', width: '100%'}}>
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
                  handleChoiceButtons(-1);
                }}>
                <Image
                  source={require('../../../assets/images/Cross.png')}
                  style={styles.icons3}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleChoiceButtons1(1);
                }}>
                <Image
                  source={require('../../../assets/images/Heart.png')}
                  style={styles.icons3}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={require('../../../assets/images/Star.png')}
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
              <View style={styles.container}>
                {data[currentIndex]?.habits1?.map((item, index) => {
                  let imagePath;
                  switch (item.imagePath) {
                    case 'src/assets/images/bottleofchampagne.png':
                      imagePath = require('../../../assets/images/bottleofchampagne.png');
                      break;
                    case 'src/assets/images/smoking.png':
                      imagePath = require('../../../assets/images/smoking.png');
                      break;
                    case 'src/assets/images/Mandumbbells.png':
                      imagePath = require('../../../assets/images/Mandumbbells.png');
                      break;
                    case 'src/assets/images/dogheart.png':
                      imagePath = require('../../../assets/images/dogheart.png');
                      break;
                    case 'src/assets/images/datestep.png':
                      imagePath = require('../../../assets/images/datestep.png');
                      break;
                  }
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
              </View>
              <View style={{height: 50}}></View>
            </ScrollView>
          </>
        ) : noProfilesLoader ? (
          <Loader />
        ) : (
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
