import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedGestureHandler,
  interpolate,
  withSpring,
  runOnJS,
  ReduceMotion,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {likedAUser} from '../../store/Auth/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CrossIC, HeartIC, StarIC} from '../../assets/svgs';

const ROTATION = 60;
const SWIPE_VELOCITY = 800;

const AnimatedStack = (props: any) => {
  const {data, renderItem, currentIndex, setCurrentIndex, profileData} = props;

  const dispatch: any = useAppDispatch();

  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currentProfile = data[currentIndex];
  const nextProfile = data[nextIndex];

  const {width: screenWidth} = useWindowDimensions();

  const hiddenTranslateX = 2 * screenWidth;

  const translateX = useSharedValue(0);
  const allUsers: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allUsers,
  );
  const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
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
  const toRadians = (degrees: any) => {
    return (degrees * Math.PI) / 180;
  };
  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
      'deg',
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value,
      },
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslateX, 0, hiddenTranslateX],
          [1, 0.8, 1],
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslateX, 0, hiddenTranslateX],
      [1, 0.5, 1],
    ),
  }));

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, hiddenTranslateX / 5], [0, 1]),
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -hiddenTranslateX / 5], [0, 1]),
  }));

  const onSwipeLeft = () => {
    const targetX = -hiddenTranslateX;
    translateX.value = withSpring(targetX, {
      duration: 5000,
      dampingRatio: 0.6,
      stiffness: 6,
      overshootClamping: false,
      restDisplacementThreshold: 1,
      restSpeedThreshold: 8,
      reduceMotion: ReduceMotion.Never,
    });
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setNextIndex(nextIndex + 1);
    }, 10);
  };

  const onSwipeRight = () => {
    dispatch(
      likedAUser({
        likerId: profileData._id,
        userIdBeingLiked: data[currentIndex]._id,
      }),
    );
    const targetX = hiddenTranslateX;
    translateX.value = withSpring(targetX, {
      duration: 12000,
      dampingRatio: 0.6,
      stiffness: 6,
      overshootClamping: false,
      restDisplacementThreshold: 1,
      restSpeedThreshold: 8,
      reduceMotion: ReduceMotion.Never,
    });
    setTimeout(() => {
      // Remove the liked user from allUsers
      const updatedUsers = [...data];
      updatedUsers.splice(currentIndex, 1);
      // Call the setData function passed as a prop to update the allUsers data
      props.setData(updatedUsers);
    }, 10);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event: any, context: any) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: event => {
      if (
        Math.abs(event.translationX) < screenWidth / 4 ||
        Math.abs(event.velocityX) < SWIPE_VELOCITY
      ) {
        // If the swipe wasn't significant or fast enough, reset the card position
        translateX.value = withSpring(0);
        return;
      }
      const direction = Math.sign(event.translationX);
      if (direction === 1) {
        // Swipe to the right
        runOnJS(onSwipeRight)();
      } else {
        // Swipe to the left
        runOnJS(onSwipeLeft)();
      }
      // Reset the card position
      translateX.value = withSpring(0);
    },
  });

  useEffect(() => {
    if (currentIndex === data.length) {
      setCurrentIndex(0);
    }
    translateX.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, translateX, data.length]);
  return (
    <View style={styles.root}>
      {nextProfile && (
        <View style={styles.nextCardContainer}>
          <Animated.View style={[styles.animatedCard, nextCardStyle]}>
            {renderItem({item: nextProfile})}
          </Animated.View>
        </View>
      )}
      {currentProfile ? (
        <View style={{width: '100%', alignItems: 'center'}}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.animatedCard, cardStyle]}>
              <Animated.Image
                source={require('../../assets/images/LIKE.png')}
                style={[styles.like, {left: 1}, likeStyle]}
                resizeMode="contain"
              />
              <Animated.Image
                source={require('../../assets/images/nope.png')}
                style={[styles.like, {right: 1}, nopeStyle]}
                resizeMode="contain"
              />
              {renderItem({item: currentProfile})}
            </Animated.View>
          </PanGestureHandler>
          <View style={styles.locText}>
            <Ionicons name="location-sharp" size={20} color="#AC25AC" />
            <Text style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
              {
                profileData.location && allUsers[currentIndex]?.location // Check if both locations are available
                  ? `${Math.round(
                      calculateDistance(
                        profileData.location.latitude,
                        profileData.location.longitude,
                        allUsers[currentIndex].location.latitude,
                        allUsers[currentIndex].location.longitude,
                      ),
                    ).toFixed(0)} miles away` // Calculate distance and round off to the nearest whole number
                  : 'Distance information unavailable' // Display a message if distance information is missing
              }
            </Text>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity onPress={onSwipeLeft}>
              <CrossIC />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSwipeRight}>
              <HeartIC />
            </TouchableOpacity>
            <TouchableOpacity>
              <StarIC />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text
          style={{
            fontFamily: 'Sansation-Bold',
            fontSize: 26,
            textAlign: 'center',
            paddingHorizontal: 20,
          }}>
          You have viewed all profiles! Or no profile matches your applied
          filters!
        </Text>
      )}
    </View>
  );
};

export default AnimatedStack;

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    // borderWidth: 1,
  },
  animatedCard: {
    width: '80%',
    height: '62%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 68,
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
    top: 10,
    zIndex: 1,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    marginTop: 30,
  },
  button: {},
  locText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    columnGap: 2,
    alignSelf: 'flex-start',
  },
});
