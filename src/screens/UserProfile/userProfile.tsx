import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAppSelector} from '../../store/store';
import HeaderComponent from '../../components/Dashboard/header/header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../components/Loader/Loader';
import TinderCard from '../Home/AnimatedStack/TinderCard';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import {
  getUserDataOnId,
  likedAUser,
  likedMe,
  rejectUser,
  superLiked,
} from '../../store/Auth/auth';
import LinearGradient from 'react-native-linear-gradient';
const {height, width} = Dimensions.get('window');

const UserProfile = () => {
  const navigation: any = useNavigation();

  const dispatch: any = useDispatch();

  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const userDataOnId: any = useAppSelector(
    (state: any) => state?.Auth?.data?.userDataOnId,
  );

  const user: any = useAppSelector((state: any) => state?.ActivityLoader?.user);
  const page: any = useAppSelector((state: any) => state?.ActivityLoader?.page);

  const {showOnlineUser}: any = useAppSelector(state => state.authSliceState);

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (userDataOnId) {
      const imagesArray = userDataOnId?.profilePic?.split(',');
      setImages(imagesArray);
    }
    setCurrentIndex(0);
  }, [userDataOnId]);

  // console.log('--------------------', userDataOnId?.name);
  // console.log('--------------------', JSON.stringify(userDataOnId));

  const isUserOnline: any = showOnlineUser?.includes(user?._id) || false;

  const handleNextImage = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + images.length) % images.length,
    );
  };
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    dispatch(getUserDataOnId({id: user._id}))
      .unwrap()
      .then(() => setLoader(false));
  }, []);

  const toRadians = (degrees: any) => {
    return (degrees * Math.PI) / 180;
  };
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

  const habits1: any = {
    1: require('../../assets/images/bottleofchampagne.png'),
    2: require('../../assets/images/smoking.png'),
    3: require('../../assets/images/Mandumbbells.png'),
    4: require('../../assets/images/dogheart.png'),
    5: require('../../assets/images/datestep.png'),
  };

  const habits2: any = {
    1: require('../../assets/images/chat-balloon.png'),
    2: require('../../assets/images/love.png'),
    3: require('../../assets/images/abroad.png'),
    4: require('../../assets/images/moon.png'),
  };

  return (
    <View style={styles.pageContainer}>
      {!loader && (
        <View style={styles.container}>
          <View style={styles.backPress}>
            <Ionicons
              onPress={() => navigation.goBack()}
              style={styles.backPressIcon}
              name="chevron-back-outline"
              size={30}
            />
          </View>
          <Text style={styles.stepsText}>
            {userDataOnId?.name},{' ' + userDataOnId?.age}
          </Text>
          <View style={{width: 40}} />
        </View>
      )}
      {loader ? (
        <Loader />
      ) : (
        <View style={styles.pageContainer2}>
          <View style={{flex: 1}}>
            <View
              style={{
                height: '100%',
                width: '100%',
              }}>
              <View>
                <View style={{height: 340}}>
                  <View
                    style={[
                      {
                        width: width - wp(5),
                        height: height - hp(64),
                        position: 'absolute',
                        alignItems: 'center',
                        alignSelf: 'center',
                      },
                    ]}>
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
                        colors={[
                          'transparent',
                          'transparent',
                          'rgba(0,0,0,0.5)',
                        ]}
                        style={{
                          width: '100%',
                          height: 320,
                          position: 'absolute',
                          borderRadius: 20,
                          zIndex: 2,
                        }}>
                        <View style={styles.cardInner}>
                          {/* <Text style={styles.name}>
                            {userDataOnId.name},{' ' + userDataOnId.age}
                          </Text> */}
                          <Text style={styles.bio}>
                            {userDataOnId?.hobbies}
                          </Text>
                        </View>
                      </LinearGradient>
                    </ImageBackground>
                    {images.length > 1 && (
                      <View style={styles.imageCountContainer}>
                        {images.map((_: any, index: any) => (
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
                  </View>
                </View>
                {page === 'Liked' && (
                  <View style={[styles.icons, {zIndex: -1}]}>
                    <TouchableOpacity
                      onPress={async () => {
                        setLoader(true);
                        await dispatch(
                          rejectUser({
                            userId: profileData._id,
                            userIdToReject: user._id,
                          }),
                        )
                          .unwrap()
                          .then(async () => {
                            setLoader(false);
                            navigation.navigate('LikedScreen');
                          });
                      }}>
                      <Image
                        source={require('../../assets/images/Cross.png')}
                        style={styles.icons3}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        if (user.type === 'superLike') {
                          setLoader(true);
                          await dispatch(
                            superLiked({
                              likerId: profileData?._id,
                              userIdBeingLiked: user?._id,
                            }),
                          )
                            .unwrap()
                            .then(() => {
                              setLoader(false);
                              navigation.navigate('ChatSection');
                            });
                        } else if (user.type === 'like') {
                          setLoader(true);
                          await dispatch(
                            likedAUser({
                              likerId: profileData?._id,
                              userIdBeingLiked: user?._id,
                            }),
                          )
                            .unwrap()
                            .then(() => {
                              setLoader(false);
                              navigation.navigate('ChatSection');
                            });
                        }
                      }}>
                      <Image
                        source={require('../../assets/images/Heart.png')}
                        style={styles.icons3}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  height: hp(40),
                  marginTop: hp(1),
                  zIndex: -1,
                }}
                contentContainerStyle={{
                  paddingBottom: hp(2),
                }}>
                {/* Location */}
                <TouchableOpacity activeOpacity={1}>
                  <View style={styles.locText}>
                    <Ionicons name="location-sharp" size={20} color="#AC25AC" />
                    <Text
                      style={{
                        fontFamily: 'Sansation-Regular',
                        color: 'black',
                      }}>
                      {profileData.location && userDataOnId?.location
                        ? `${Math.round(
                            calculateDistance(
                              profileData?.location.latitude,
                              profileData?.location.longitude,
                              userDataOnId?.location.latitude,
                              userDataOnId?.location.longitude,
                            ),
                          ).toFixed(0)} miles away`
                        : 'Distance information unavailable'}
                    </Text>
                  </View>
                  {/* Active */}
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Sansation-Regular',
                      marginLeft: 25,
                      marginTop: 5,

                      // color: '#6D6D6D',
                      color: isUserOnline ? 'green' : '#6D6D6D',
                    }}>
                    {isUserOnline ? 'Online' : 'Offline'}
                  </Text>
                  {/* habits1 */}
                  <View style={styles.container2}>
                    {userDataOnId?.habits1?.map((item: any) => {
                      const imagePath = habits1[item.id];

                      return (
                        <View key={item.id} style={styles.item}>
                          {imagePath && (
                            <Image
                              source={imagePath}
                              style={{height: 20, width: 20}}
                            />
                          )}
                          <View
                            style={{
                              gap: 4,
                            }}>
                            {item.optionSelected.map((option: any) => (
                              <Text
                                key={option} // Add key for nested items
                                style={{
                                  fontFamily: 'Sansation-Regular',
                                  color: 'black',
                                }}>
                                {option}
                              </Text>
                            ))}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  {/* habits2 */}
                  <View style={styles.container2}>
                    {userDataOnId?.habits2?.map((item: any) => {
                      const imagePath = habits2[item.id];

                      return (
                        <View key={item.id} style={styles.item}>
                          {imagePath && (
                            <Image
                              source={imagePath}
                              style={{height: 20, width: 20}}
                            />
                          )}
                          {item.optionSelected.map((option: any) => (
                            <Text
                              key={option} // Add key for nested items
                              style={{
                                fontFamily: 'Sansation-Regular',
                                color: 'black',
                              }}>
                              {option}
                            </Text>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                  {/* PartnerType */}
                  <View style={styles.container2}>
                    {userDataOnId?.partnerType && (
                      <View style={styles.item}>
                        <Text
                          style={{
                            fontFamily: 'Sansation-Regular',
                            color: 'black',
                          }}>
                          {userDataOnId?.partnerType}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{height: 10}}></View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 0,
  },
  backPressIcon: {
    color: '#AC25AC',
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 4,
    alignItems: 'center',
    // borderWidth: 1,
  },
  backPress: {
    marginStart: 10,
  },
  pageContainer2: {
    flex: 1,
    width: '100%',
    height: '90%',

    marginTop: 20,
  },

  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  locText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  container2: {
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
  stepsText: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
  },
  icons3: {height: 50, width: 50},

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

export default UserProfile;
