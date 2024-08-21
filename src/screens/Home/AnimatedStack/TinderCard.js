import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {LikeIC, NopeIC, SuperLikeIC} from '../../../assets/svgs';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const {height, width} = Dimensions.get('window');

const TinderCard = ({
  name,
  profilePic,
  hobbies,
  item,
  isFirst,
  swipe,
  currentUser,
  setCurrentUser,
  showSuperLikeIcon, // Use the prop here
  ...rest
}) => {
  console.log('showSuperLikeIcon...........', showSuperLikeIcon);

  const rotate = swipe.x.interpolate({
    inputRange: [wp(-100), 0, wp(100)],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const likeOpacity = swipe.x.interpolate({
    inputRange: [wp(20), wp(25)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const rejectOpacity = swipe.x.interpolate({
    inputRange: [wp(-35), wp(-15)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const superLikeOpacity = swipe.y.interpolate({
    inputRange: [wp(-30), wp(-10)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderChoice = useCallback(() => {
    return (
      <>
        <Animated.View
          style={[
            {position: 'absolute', top: 5, left: 20},
            {opacity: likeOpacity},
          ]}>
          <LikeIC
            width={250}
            height={250}
            style={{transform: [{rotate: '-45deg'}]}}
          />
        </Animated.View>
        <Animated.View
          style={[
            {position: 'absolute', top: 5, right: 20},
            {opacity: rejectOpacity},
          ]}>
          <NopeIC
            width={250}
            height={250}
            style={{transform: [{rotate: '45deg'}]}}
          />
        </Animated.View>
        {showSuperLikeIcon && (
          <Animated.View
            style={[
              {position: 'absolute', top: 80, alignSelf: 'center'},
              {opacity: superLikeOpacity},
            ]}>
            <SuperLikeIC
              width={250}
              height={250}
              style={{transform: [{rotate: '-5deg'}]}}
            />
          </Animated.View>
        )}
      </>
    );
  }, [likeOpacity, rejectOpacity, superLikeOpacity, showSuperLikeIcon]);

  const images = item.profilePic.split(',');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    setCurrentUser(item?._id);
  }, [item, setCurrentUser]);

  const handleNextImage = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <Animated.View
      style={[
        {
          width: width - wp(5),
          height: height - hp(64),
          position: 'absolute',
          alignItems: 'center',
          alignSelf: 'center',
        },
        isFirst && {
          transform: [...swipe.getTranslateTransform(), {rotate: rotate}],
        },
      ]}
      {...rest}>
      <ImageBackground
        source={{
          uri: images[currentIndex],
        }}
        style={{
          width: '100%',
          height: 320,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: 'gray',
          zIndex: 1,
        }}>
        <View style={styles.imageOverlay}>
          <TouchableOpacity
            onPress={handlePrevImage}
            style={styles.leftButton}
          />
          <TouchableOpacity
            onPress={handleNextImage}
            style={styles.rightButton}
          />
        </View>

        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(0,0,0,0.5)']}
          style={{
            width: '100%',
            height: 320,
            position: 'absolute',
            borderRadius: 20,
            zIndex: 2,
          }}>
          <View style={styles.cardInner}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.bio}>{item.hobbies}</Text>
          </View>
        </LinearGradient>
        {isFirst && renderChoice()}
      </ImageBackground>
      {images.length > 1 && (
        <View style={styles.imageCountContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.imageIndicator,
                index === currentIndex
                  ? styles.activeIndicator
                  : styles.inactiveIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

export default TinderCard;

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    top: '50%',
    height: '50%',
  },
  cardInner: {
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
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
  imageOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    zIndex: 5,
  },
  leftButton: {
    width: '50%',
    height: '100%',
  },
  rightButton: {
    width: '50%',
    height: '100%',
  },
  imageCountContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
    zIndex: 2,
  },
  imageIndicator: {
    width: wp(12),
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#AA22AA',
  },
  inactiveIndicator: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
  },
});
