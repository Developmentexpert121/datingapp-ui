import {
  View,
  Text,
  Dimensions,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import React, {useCallback} from 'react';
import TinderLike from './TinderLike';
import LinearGradient from 'react-native-linear-gradient';
const {height, width} = Dimensions.get('window');
const TinderCard = ({
  name,
  profilePic,
  hobbies,
  item,
  isFirst,
  swipe,
  ...rest
}) => {
  const rotate = swipe.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['8deg', '0deg', '-8deg'],
  });
  const likeOpacity = swipe.x.interpolate({
    inputRange: [10, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const rejectOpacity = swipe.x.interpolate({
    inputRange: [-100, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const renderChoice = useCallback(() => {
    return (
      <>
        <Animated.View
          style={[
            {position: 'absolute', top: 100, left: 20},
            {opacity: likeOpacity},
          ]}>
          <TinderLike type={'Like'} />
        </Animated.View>
        <Animated.View
          style={[
            {position: 'absolute', top: 100, right: 20},
            {opacity: rejectOpacity},
          ]}>
          <TinderLike type={'Nope'} />
        </Animated.View>
      </>
    );
  }, []);
  return (
    <Animated.View
      style={[
        {
          width: width - 20,
          height: height - 200,
          position: 'absolute',
          // top: 50,
          // justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        },
        isFirst && {
          transform: [...swipe.getTranslateTransform(), {rotate: rotate}],
        },
      ]}
      {...rest}>
      <Image
        source={{
          uri: item.profilePic ? item.profilePic : null,
        }}
        style={{
          width: '100%',
          // height: '80%',
          height: 320,
          borderRadius: 20,
          // borderWidth: 1,
          backgroundColor: 'gray',
        }}
      />
      {isFirst && renderChoice()}
      <LinearGradient
        colors={['transparent', 'transparent', 'rgba(0,0,0,0.5)']}
        style={{
          width: '100%',
          // height: '100%',
          height: 320,
          position: 'absolute',
          borderRadius: 20,
        }}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.bio}>{item.hobbies}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default TinderCard;
const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    top: '50%', // Adjust the position of the gradient
    height: '50%',
  },
  cardInner: {
    paddingHorizontal: 24,
    // paddingBottom: 20,
    justifyContent: 'flex-end',
    // borderWidth: 1,
    position: 'absolute',
    bottom: 20,
  },
  name: {
    fontSize: 26,
    color: 'white',
    fontFamily: 'Sansation-Bold',
  },
  bio: {
    fontSize: 18,
    color: 'white',
    lineHeight: 25,
    fontFamily: 'Sansation-Regular',
  },
});
