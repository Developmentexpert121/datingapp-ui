import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
} from 'react-native';
import CommonBackbutton from '../../components/commonBackbutton/BackButton';
import {useAppDispatch, useAppSelector} from '../../store/store';
import LinearGradient from 'react-native-linear-gradient';
import {videoCallUser} from '../../store/Activity/activity';
import {likedMe} from '../../store/Auth/auth';
import {BlurView} from '@react-native-community/blur';
import Loader from '../../components/Loader/Loader';
import {SuperLikeIC} from '../../assets/svgs';
import Modal from 'react-native-modal';
import Label from '../../components/Label';
import MainButton from '../../components/ButtonComponent/MainButton';

const LikedScreen = () => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const dispatch: any = useAppDispatch();
  const [likeData, setLikeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);

  const navigation: any = useNavigation();

  const LikedUser = async () => {
    try {
      const response = await dispatch(likedMe({id: profileData._id})).unwrap();
      setLikeData(response.users);
    } catch (error) {
      console.error('Error fetching data:33', error);
    } finally {
      setLoading(false);
    }
  };

  const goToUserProfile = async (user: any) => {
    await dispatch(videoCallUser({user: user, page: 'Liked'}));
    navigation.navigate('userProfile');
  };

  useFocusEffect(
    useCallback(() => {
      LikedUser();
    }, []),
  );

  const renderGridItem = ({item}: {item: any}) => {
    return (
      <Pressable
        onPress={
          profileData?.plan === 'Free'
            ? () => {
                setModalOpen(true);
              }
            : () => goToUserProfile(item)
        }
        style={styles.card}>
        <ImageBackground
          source={{uri: item?.profilePic?.split(',')[0]}}
          style={styles.image}>
          {profileData?.plan === 'Free' ? (
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
              <Text style={styles.name}>
                {item.name},{' ' + item.age}
              </Text>
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
            data={likeData.reverse()}
            renderItem={renderGridItem}
            keyExtractor={item => item._id}
            numColumns={2}
          />
        </View>
      )}
      <Modal
        style={{backgroundColor: 'transparent', margin: 0}}
        isVisible={modalOpen}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        animationInTiming={600}
        animationOutTiming={1000}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={1000}>
        <View style={styles.modal}>
          <View style={styles.modalstyle}>
            <Label
              text={`To check who likes you Subscribe to a bigger plan!`}
              style={styles.textstyle}
            />

            <MainButton
              style={{
                width: '85%',
                marginTop: 30,
              }}
              ButtonName="Subscribe!"
              onPress={() => {
                navigation.navigate('ProfileSection');
                setModalOpen(false);
              }}
            />
            <MainButton
              style={{
                width: '85%',
                marginTop: 30,
              }}
              ButtonName="Cancel"
              onPress={() => {
                setModalOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>
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
  textstyle: {
    // width: "50%",
    fontSize: 18,
    // fontWeight: "400",
    lineHeight: 36,
    color: '#071731',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  modalstyle: {
    // minHeight: 230,
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    zIndex: 4,
  },
});

export default LikedScreen;
