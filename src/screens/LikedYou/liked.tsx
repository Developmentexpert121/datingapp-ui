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
} from 'react-native';
import CommonBackbutton from '../../components/commonBackbutton/CommonBackbutton';
import {useAppDispatch, useAppSelector} from '../../store/store';
import LinearGradient from 'react-native-linear-gradient';
import {videoCallUser} from '../../store/Activity/activity';
import {likedMe} from '../../store/Auth/auth';
const LikedScreen = () => {
  const allUsers: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allUsers,
  );
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const dispatch: any = useAppDispatch();

  const [likeData, setLikeData] = useState<any>([]);
  console.log('likeData??????????', likeData);

  const goToChatWith = async (user: any) => {
    await dispatch(videoCallUser({user: user}));
    navigation.navigate('VideoCallRedirect');
  };
  const navigation = useNavigation();

  const LikedUser = async () => {
    try {
      const response = await dispatch(likedMe({id: profileData._id})).unwrap();
      setLikeData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    LikedUser();
  }, []);

  const renderGridItem = ({item, index}: any) => {
    console.log("source={{uri: item.profilePic.split(',')[0]}}", item);
    return (
      <TouchableOpacity onPress={() => goToChatWith(item)} style={styles.card}>
        <ImageBackground
          source={{uri: item.profilePic.split(',')[0]}}
          style={styles.image}>
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}></LinearGradient>
          <View style={styles.cardInner}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.bio}>{item.hobbies}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonBackbutton title="Liked You" />
      {likeData.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <Text style={{fontFamily: 'Sansation-Bold', fontSize: 20}}>
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
    //backgroundColor: '#AC25AC',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 80,
  },
});

export default LikedScreen;
