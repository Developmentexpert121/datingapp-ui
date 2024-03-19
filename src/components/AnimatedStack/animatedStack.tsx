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
  withTiming,
  runOnJS,
  ReduceMotion,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useAppDispatch} from '../../store/store';
import {likedAUser} from '../../store/Auth/auth';
import {current} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ROTATION = 60;
const SWIPE_VELOCITY = 800;

const AnimatedStack = (props: any) => {
  const {
    data,
    renderItem,
    currentIndex,
    setData,
    setCurrentIndex,
    profileData,
  } = props;

  const dispatch: any = useAppDispatch();

  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currentProfile = data[currentIndex];
  const nextProfile = data[nextIndex];

  const {width: screenWidth} = useWindowDimensions();

  const hiddenTranslateX = 2 * screenWidth;

  const translateX = useSharedValue(0);
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
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
            <Animated.Image
              source={require('../../assets/images/LIKE.png')}
              style={[styles.like, {left: 10}, likeStyle]}
              resizeMode="contain"
            />
            <Animated.Image
              source={require('../../assets/images/nope.png')}
              style={[styles.like, {right: 10}, nopeStyle]}
              resizeMode="contain"
            />
            {renderItem({item: currentProfile})}
          </Animated.View>
        </PanGestureHandler>
      ) : (
        <Text style={{fontFamily: 'Sansation_Bold', fontSize: 26}}>
          You have viewed all profiles!
        </Text>
      )}
      <View style={{width: '100%', alignItems: 'center'}}>
        <View style={styles.icons}>
          {/* <TouchableOpacity>
          <View style={styles.button}>
            <FontAwesome name="undo" size={30} color="#FBD88B" />
          </View>
        </TouchableOpacity> */}

          <TouchableOpacity onPress={onSwipeLeft}>
            <View style={styles.button}>
              <Entypo name="cross" size={40} color="#FF2222" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSwipeRight}>
            <View style={styles.button}>
              <FontAwesome name="heart" size={40} color="#4FCC94" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.button}>
              <FontAwesome name="star" size={40} color="#3AB4CC" />
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity>
          <View style={styles.button}>
            <Ionicons name="flash" size={30} color="#A65CD2" />
          </View>
        </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,

    width: '100%',
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
    marginBottom: 68,
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
    marginVertical: 12,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',

    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#AC25AC',
  },
});

export default AnimatedStack;
