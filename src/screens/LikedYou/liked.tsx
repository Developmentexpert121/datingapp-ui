import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import CommonBackbutton from '../../components/commonBackbutton/BackButton';
import {useAppDispatch, useAppSelector} from '../../store/store';
import LinearGradient from 'react-native-linear-gradient';
import {videoCallUser} from '../../store/Activity/activity';
import {likedAUser, likedMe, superLiked} from '../../store/Auth/auth';
import {BlurView} from '@react-native-community/blur';
import Loader from '../../components/Loader/Loader';
import {SuperLikeIC} from '../../assets/svgs';

const LikedScreen = () => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const dispatch: any = useAppDispatch();
  const [likeData, setLikeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation: any = useNavigation();

  console.log(likeData);

  const goToChatWith = async (user: any) => {
    console.log('user--------', user);
    await dispatch(videoCallUser({user: user}))
      .unwrap()
      .then(() => navigation.navigate('ChatSection'));
  };

  const LikedUser = async () => {
    try {
      const response = await dispatch(likedMe({id: profileData._id})).unwrap();
      setLikeData(response.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const likeByMe = async (item: any) => {
    if (item.type === 'like') {
      await dispatch(
        likedAUser({
          likerId: profileData?._id,
          userIdBeingLiked: item?._id,
        }),
      )
        .unwrap()
        .then(() => goToChatWith(item));
    } else if (item.type === 'superLike') {
      await dispatch(
        superLiked({
          likerId: profileData?._id,
          userIdBeingLiked: item?._id,
        }),
      )
        .unwrap()
        .then(() => goToChatWith(item));
    }
  };

  useEffect(() => {
    LikedUser();
  }, []);

  const renderGridItem = ({item}: {item: any}) => {
    return (
      <Pressable
        onPress={
          profileData?.plan !== 'Free'
            ? () => navigation.navigate('ChatSection')
            : () => likeByMe(item)
        }
        // onPress={() => goToChatWith(item)}
        style={styles.card}>
        <ImageBackground
          source={{uri: item.profilePic?.split(',')[0]}}
          style={styles.image}>
          {profileData?.plan === 'Free' && item.type !== 'superLike' ? (
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />
          ) : null}
          {item.type === 'superLike' && (
            <SuperLikeIC
              width={50}
              height={50}
              style={{
                transform: [{rotate: '-5deg'}],
                alignSelf: 'flex-end',
                marginHorizontal: 2,
                backgroundColor: 'white',
                borderRadius: 6,
              }}
            />
          )}

          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}></LinearGradient>
          {profileData?.plan !== 'Free' || item.type === 'superLike' ? (
            <View style={styles.cardInner}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.bio}>{item.hobbies}</Text>
            </View>
          ) : null}
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonBackbutton title="Liked You" />
      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : likeData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No one has liked your profile!</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={likeData}
            renderItem={renderGridItem}
            keyExtractor={item => item._id}
            numColumns={2}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const cardWidth = (Dimensions.get('window').width - 82) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  noDataText: {
    fontFamily: 'Sansation-Bold',
    fontSize: 20,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 26,
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
    borderWidth: 1,
  },
  cardInner: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingBottom: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Sansation-Bold',
    color: '#fff',
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Sansation-Regular',
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
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 80,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default LikedScreen;
