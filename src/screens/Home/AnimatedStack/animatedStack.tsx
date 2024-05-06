import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedGestureHandler,
  interpolate,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {likedAUser} from '../../../store/Auth/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface AnimatedStackProps {
  data: any[];
  renderItem: (props: {item: any}) => React.ReactNode;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  profileData: any;
  setData: (data: any[]) => void;
}

const ROTATION = 60;
const SWIPE_VELOCITY = 800;

const AnimatedStack: React.FC<AnimatedStackProps> = ({
  data,
  renderItem,
  currentIndex,
  setCurrentIndex,
  profileData,
  setData,
}) => {
  const dispatch = useAppDispatch();

  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currentProfile = data[currentIndex];
  const nextProfile = data[nextIndex];

  const {width: screenWidth} = useWindowDimensions();

  const hiddenTranslateX = 2 * screenWidth;

  const translateX = useSharedValue(0);

  const allUsers = useAppSelector((state: any) => state.Auth.data.allUsers);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
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

  const toRadians = (degrees: number) => {
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
    translateX.value = withSpring(targetX);
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
    translateX.value = withSpring(targetX);
    setTimeout(() => {
      const updatedUsers = [...data];
      updatedUsers.splice(currentIndex, 1);
      setData(updatedUsers);
    }, 10);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context: any) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: event => {
      if (
        Math.abs(event.translationX) < screenWidth / 4 ||
        Math.abs(event.velocityX) < SWIPE_VELOCITY
      ) {
        translateX.value = withSpring(0);
        return;
      }
      const direction = Math.sign(event.translationX);
      if (direction === 1) {
        runOnJS(onSwipeRight)();
      } else {
        runOnJS(onSwipeLeft)();
      }
    },
  });

  useEffect(() => {
    if (currentIndex === data.length) {
      setCurrentIndex(0);
    }
    translateX.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, data.length, setCurrentIndex, translateX]);

  return (
    <View style={styles.root}>
      {currentProfile ? (
        <>
          <View style={styles.cardContainer}>
            <GestureHandlerRootView
              style={{height: 250, width: screenWidth, paddingHorizontal: 20}}>
              <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.animatedCard, cardStyle]}>
                  <Animated.Image
                    source={require('../../../assets/images/LIKE.png')}
                    style={[styles.like, {left: 1}, likeStyle]}
                    resizeMode="contain"
                  />
                  <Animated.Image
                    source={require('../../../assets/images/nope.png')}
                    style={[styles.like, {right: 1}, nopeStyle]}
                    resizeMode="contain"
                  />
                  {renderItem({item: currentProfile})}
                </Animated.View>
              </PanGestureHandler>
            </GestureHandlerRootView>
          </View>

          <View style={styles.icons}>
            <TouchableOpacity onPress={onSwipeLeft}>
              <Image
                source={require('../../../assets/images/Cross.png')}
                style={styles.icons3}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSwipeRight}>
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
            {allUsers[currentIndex]?.habits1?.map(
              (item: any, index: number) => {
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
                      style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
                      {item.selectedText}
                    </Text>
                  </View>
                );
              },
            )}
          </View>
        </>
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
        //
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
    marginTop: 60,
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

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   StyleSheet,
//   useWindowDimensions,
//   Text,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useDerivedValue,
//   useAnimatedGestureHandler,
//   interpolate,
//   withSpring,
//   runOnJS,
//   ReduceMotion,
// } from 'react-native-reanimated';
// import {
//   GestureHandlerRootView,
//   PanGestureHandler,
// } from 'react-native-gesture-handler';
// import {useAppDispatch, useAppSelector} from '../../../store/store';
// import {likedAUser} from '../../../store/Auth/auth';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {CrossIC, HeartIC, StarIC} from '../../../assets/svgs';

// const ROTATION = 60;
// const SWIPE_VELOCITY = 800;

// const AnimatedStack = (props: any) => {
//   const {data, renderItem, currentIndex, setCurrentIndex, profileData} = props;

//   const dispatch: any = useAppDispatch();

//   const [nextIndex, setNextIndex] = useState(currentIndex + 1);

//   const currentProfile = data[currentIndex];
//   console.log('first currentProfile', currentProfile);
//   console.log('first currentIndex', currentIndex);
//   const nextProfile = data[nextIndex];

//   const {width: screenWidth} = useWindowDimensions();

//   const hiddenTranslateX = 2 * screenWidth;

//   const translateX = useSharedValue(0);
//   const allUsers: any = useAppSelector(
//     (state: any) => state?.Auth?.data?.allUsers,
//   );
//   const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
//     const R = 3958.8; // Earth radius in miles
//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRadians(lat1)) *
//         Math.cos(toRadians(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;
//     return distance;
//   };
//   const toRadians = (degrees: any) => {
//     return (degrees * Math.PI) / 180;
//   };
//   const rotate = useDerivedValue(
//     () =>
//       interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
//       'deg',
//   );

//   const cardStyle = useAnimatedStyle(() => ({
//     transform: [
//       {
//         translateX: translateX.value,
//       },
//       {
//         rotate: rotate.value,
//       },
//     ],
//   }));

//   const nextCardStyle = useAnimatedStyle(() => ({
//     transform: [
//       {
//         scale: interpolate(
//           translateX.value,
//           [-hiddenTranslateX, 0, hiddenTranslateX],
//           [1, 0.8, 1],
//         ),
//       },
//     ],
//     opacity: interpolate(
//       translateX.value,
//       [-hiddenTranslateX, 0, hiddenTranslateX],
//       [1, 0.5, 1],
//     ),
//   }));

//   const likeStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(translateX.value, [0, hiddenTranslateX / 5], [0, 1]),
//   }));

//   const nopeStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(translateX.value, [0, -hiddenTranslateX / 5], [0, 1]),
//   }));

//   const onSwipeLeft = () => {
//     const targetX = -hiddenTranslateX;
//     translateX.value = withSpring(targetX, {
//       duration: 5000,
//       dampingRatio: 0.6,
//       stiffness: 6,
//       overshootClamping: false,
//       restDisplacementThreshold: 1,
//       restSpeedThreshold: 8,
//       reduceMotion: ReduceMotion.Never,
//     });
//     setTimeout(() => {
//       setCurrentIndex(currentIndex + 1);
//       setNextIndex(nextIndex + 1);
//     }, 10);
//   };

//   const onSwipeRight = () => {
//     dispatch(
//       likedAUser({
//         likerId: profileData._id,
//         userIdBeingLiked: data[currentIndex]._id,
//       }),
//     );
//     const targetX = hiddenTranslateX;
//     translateX.value = withSpring(targetX, {
//       duration: 12000,
//       dampingRatio: 0.6,
//       stiffness: 6,
//       overshootClamping: false,
//       restDisplacementThreshold: 1,
//       restSpeedThreshold: 8,
//       reduceMotion: ReduceMotion.Never,
//     });
//     setTimeout(() => {
//       // Remove the liked user from allUsers
//       const updatedUsers = [...data];
//       updatedUsers.splice(currentIndex, 1);
//       // Call the setData function passed as a prop to update the allUsers data
//       props.setData(updatedUsers);
//     }, 10);
//   };
//   //
//   const gestureHandler = useAnimatedGestureHandler({
//     onStart: (_, context) => {
//       context.startX = translateX.value;
//     },
//     onActive: (event: any, context: any) => {
//       translateX.value = context.startX + event.translationX;
//     },
//     onEnd: event => {
//       if (
//         Math.abs(event.translationX) < screenWidth / 4 ||
//         Math.abs(event.velocityX) < SWIPE_VELOCITY
//       ) {
//         // If the swipe wasn't significant or fast enough, reset the card position
//         translateX.value = withSpring(0);
//         return;
//       }
//       const direction = Math.sign(event.translationX);
//       if (direction === 1) {
//         // Swipe to the right
//         runOnJS(onSwipeRight)();
//       } else {
//         // Swipe to the left
//         runOnJS(onSwipeLeft)();
//       }
//       // Reset the card position
//       translateX.value = withSpring(0);
//     },
//   });
//   //
//   useEffect(() => {
//     if (currentIndex === data.length) {
//       setCurrentIndex(0);
//     }
//     translateX.value = 0;
//     setNextIndex(currentIndex + 1);
//   }, [currentIndex, translateX, data.length]);

//   //
//   //
//   //

//   return (
//     <View style={styles.root}>
//       {/* {nextProfile && (
//         <View style={styles.nextCardContainer}>
//           <Animated.View style={[styles.animatedCard, nextCardStyle]}>
//             {renderItem({item: nextProfile})}
//           </Animated.View>
//         </View>
//       )} */}
//       {currentProfile ? (
//         <View style={{alignItems: 'center', flex: 1}}>
//           <View
//             style={{height: 250, width: screenWidth, paddingHorizontal: 20}}>
//             <GestureHandlerRootView
//               //  {/* <PanGestureHandler */}
//               onGestureEvent={gestureHandler}
//               //
//             >
//               <Animated.View style={[styles.animatedCard]}>
//                 <Animated.Image
//                   source={require('../../../assets/images/LIKE.png')}
//                   style={[styles.like, {left: 1}, likeStyle]}
//                   resizeMode="contain"
//                 />
//                 <Animated.Image
//                   source={require('../../../assets/images/nope.png')}
//                   style={[styles.like, {right: 1}, nopeStyle]}
//                   resizeMode="contain"
//                 />
//                 {renderItem({item: currentProfile})}
//               </Animated.View>
//               {/* </PanGestureHandler> */}
//             </GestureHandlerRootView>
//           </View>
//           {/*  */}
//           <View style={styles.icons}>
//             <TouchableOpacity onPress={onSwipeLeft}>
//               {/* <CrossIC /> */}
//               <Image
//                 source={require('../../../assets/images/Cross.png')}
//                 style={styles.icons3}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={onSwipeRight}>
//               {/* <HeartIC /> */}
//               <Image
//                 source={require('../../../assets/images/Heart.png')}
//                 style={styles.icons3}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               {/* <StarIC /> */}
//               <Image
//                 source={require('../../../assets/images/Star.png')}
//                 style={styles.icons3}
//               />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.locText}>
//             <Ionicons name="location-sharp" size={20} color="#AC25AC" />
//             <Text style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
//               {
//                 profileData.location && allUsers[currentIndex]?.location // Check if both locations are available
//                   ? `${Math.round(
//                       calculateDistance(
//                         profileData.location.latitude,
//                         profileData.location.longitude,
//                         allUsers[currentIndex].location.latitude,
//                         allUsers[currentIndex].location.longitude,
//                       ),
//                     ).toFixed(0)} miles away` // Calculate distance and round off to the nearest whole number
//                   : 'Distance information unavailable' // Display a message if distance information is missing
//               }
//             </Text>
//           </View>

//           <View style={styles.container}>
//             {allUsers[currentIndex]?.habits1?.map((item: any, index: any) => {
//               let imagePath;
//               switch (item.imagePath) {
//                 case 'src/assets/images/bottleofchampagne.png':
//                   imagePath = require('../../../assets/images/bottleofchampagne.png');
//                   break;
//                 case 'src/assets/images/smoking.png':
//                   imagePath = require('../../../assets/images/smoking.png');
//                   break;
//                 case 'src/assets/images/Mandumbbells.png':
//                   imagePath = require('../../../assets/images/Mandumbbells.png');
//                   break;
//                 case 'src/assets/images/dogheart.png':
//                   imagePath = require('../../../assets/images/dogheart.png');
//                   break;
//                 case 'src/assets/images/datestep.png':
//                   imagePath = require('../../../assets/images/datestep.png');
//                   break;
//               }
//               return (
//                 <View style={styles.item}>
//                   {imagePath && (
//                     <Image source={imagePath} style={{height: 20, width: 20}} />
//                   )}
//                   <Text
//                     key={index.id}
//                     style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
//                     {item.selectedText}
//                   </Text>
//                 </View>
//               );
//             })}
//           </View>
//         </View>
//       ) : (
//         <Text
//           style={{
//             fontFamily: 'Sansation-Bold',
//             fontSize: 26,
//             textAlign: 'center',
//             paddingHorizontal: 20,
//             marginTop: 100,
//           }}>
//           You have viewed all profiles! Or no profile matches your applied
//           filters!
//         </Text>
//       )}
//     </View>
//   );
// };

// export default AnimatedStack;

// const styles = StyleSheet.create({
//   root: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//     width: '100%',
//   },
//   animatedCard: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   nextCardContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   like: {
//     width: 150,
//     height: 150,
//     position: 'absolute',
//   },
//   icons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     width: '70%',
//     marginTop: 60,
//   },
//   locText: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 20,
//     alignSelf: 'flex-start',
//     marginTop: 15,
//   },
//   container: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     margin: 10,
//   },
//   item: {
//     borderWidth: 1.5,
//     borderRadius: 20,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     columnGap: 4,
//     margin: 5,
//   },
//   icons3: {height: 50, width: 50},
// });
