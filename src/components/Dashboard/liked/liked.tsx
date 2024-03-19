import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FooterComponent from '../footer/footer';
import CommonBackbutton from '../../commonBackbutton/backButton';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import LinearGradient from 'react-native-linear-gradient';
const LikedScreen = () => {
  const allUsers: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allUsers,
  );
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const likedUsers = allUsers.filter((user: any) =>
    profileData?.likedBy.includes(user?._id),
  );

  const navigation = useNavigation();

  const renderGridItem = ({item}: any) => (
    <View style={styles.card}>
      <ImageBackground source={{uri: item.profilePic}} style={styles.image}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}></LinearGradient>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.bio}>{item.hobbies}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <CommonBackbutton title="Liked You" />
      {likedUsers.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <Text style={{fontFamily: 'Sansation_Bold', fontSize: 20}}>
            No one has liked your profile!
          </Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginHorizontal: 26,
          }}>
          <FlatList
            data={likedUsers}
            renderItem={renderGridItem}
            keyExtractor={item => item._id}
            numColumns={2}
          />
        </View>
      )}

      <FooterComponent />
    </View>
  );
};

const cardWidth = (Dimensions.get('window').width - 82) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: cardWidth,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    top: '50%', // Adjust the position of the gradient
    height: '50%',
  },
  image: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    height: 200,
  },
  cardInner: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingBottom: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Sansation_Bold',
    color: '#fff',
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Sansation_Regular',
  },
  backPress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 15,
  },
  backPressIcon: {
    marginRight: 8,
    color: '#AC25AC',
  },
  stepsText: {
    color: 'grey',
    fontSize: 20,
    //backgroundColor: '#AC25AC',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 80,
  },
});

export default LikedScreen;
