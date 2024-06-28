import React from 'react';
import {Text, ImageBackground, View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Card = (props: any) => {
  const {name, profilePic, hobbies} = props.user;
  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: profilePic,
        }}
        style={styles.image}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}></LinearGradient>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.bio}>{hobbies}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#fefefe',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    borderWidth: 0,
  },
  image: {
    width: '100%',
    height: '120%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    top: '50%', // Adjust the position of the gradient
    height: '50%',
  },
  cardInner: {
    paddingHorizontal: 24,
    paddingBottom: 20,
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

export default Card;
