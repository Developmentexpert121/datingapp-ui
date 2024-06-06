import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import TinderCard from './TinderCard';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {likedAUser} from '../../../store/Auth/auth';

import Ionicons from 'react-native-vector-icons/Ionicons';

const {height, width} = Dimensions.get('window');

// type UnknownAction = {type: string; payload?: any};
const TinderSwipe = ({
  data,
  //   renderItem,
  currentIndex,
  setCurrentIndex,
  profileData,
  setData,
}) => {
  const dispatch = useAppDispatch();
  const currentProfile = data[currentIndex];

  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  const swipe = useRef(new Animated.ValueXY()).current;
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, {dx, dy}) => {
      swipe.setValue({x: dx, y: dy});
    },
    onPanResponderRelease: (_, {dx, dy}) => {
      const direction = Math.sign(dx);
      const isActionActiove = Math.abs(dx) > 200;
      if (isActionActiove) {
        Animated.timing(swipe, {
          toValue: {x: direction * 500, y: dy},
          useNativeDriver: true,

          duration: 500,
        }).start(removeCard);
      } else {
        Animated.spring(swipe, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    },
  });

  const allUsers = useAppSelector(state => state.Auth.data.allUsers);
  console.log('/////////////////////', allUsers);
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
    }, 10);
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
  return (
    <View
      style={{
        // flex: 1,
        height: '100%',
        width: '100%',
      }}>
      {/* {currentProfile ? (
        <> */}
      <View style={{height: 340}}>
        {data
          .map((item, index) => {
            const isFirst = index === 0;
            const dragHandlers = isFirst ? panResponder.panHandlers : {};
            return (
              <TinderCard
                swipe={swipe}
                item={currentProfile}
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
            handleChoiceButtons(1);
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
      <View style={styles.locText}>
        <Ionicons name="location-sharp" size={20} color="#AC25AC" />
        <Text style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
          {profileData.location && allUsers[currentIndex]?.location
            ? `${Math.round(
                calculateDistance(
                  profileData.location.latitude,
                  profileData.location.longitude,
                  allUsers[currentIndex].location.latitude,
                  allUsers[currentIndex].location.longitude,
                ),
              ).toFixed(0)} miles away`
            : 'Distance information unavailable'}
        </Text>
      </View>

      <View style={styles.container}>
        {allUsers[currentIndex]?.habits1?.map((item, index) => {
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
                <Image source={imagePath} style={{height: 20, width: 20}} />
              )}
              <Text style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
                {item.selectedText}
              </Text>
            </View>
          );
        })}
      </View>
      {/* </> */}
      {/* ) : (
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
      )} */}
    </View>
  );
};

export default TinderSwipe;

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  cardContainer: {
    alignItems: 'center',
    flex: 1,
  },
  animatedCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  like: {
    width: 150,
    height: 150,
    position: 'absolute',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    // marginTop: 60,
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
