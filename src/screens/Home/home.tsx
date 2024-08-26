import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import HeaderComponent from '../../components/Dashboard/header/header';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {ProfileData, getAllUsers} from '../../store/Auth/auth';
import FilterSection from '../FilterSection/filterSection';
import TinderSwipe from './AnimatedStack/TinderSwipe';
import {io} from 'socket.io-client';
import {onlineUser} from '../../store/reducer/authSliceState';

const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import Label from '../../components/Label';
import MainButton from '../../components/ButtonComponent/MainButton';
import Loader from '../../components/Loader/Loader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const getUserId = async () => {
  try {
    const userId: any = await AsyncStorage.getItem('userId');

    if (userId !== null) {
      return JSON.parse(userId);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const HomeScreen = () => {
  const navigation: any = useNavigation();

  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<any>([]);
  const [activeScreen, setActiveScreen] = useState('HOME');
  const [noProfilesLoader, setNoProfilesLoader] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [filterData, setFilterData] = useState({});

  const initialRouteValue = useAppSelector(
    (state: any) => state.ActivityLoader.initialRouteValue,
  );

  useEffect(() => {
    if (initialRouteValue) {
      const timer = setTimeout(() => {
        navigation.navigate(initialRouteValue);
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [initialRouteValue]);

  const location: any = useAppSelector(
    (state: any) => state?.Auth?.data?.location,
  );

  useEffect(() => {
    fetchNewData();
    if (location?.latitude) {
      dispatch(
        updateProfileData({
          field: 'location',
          value: {latitude: location.latitude, longitude: location.longitude},
          id: getUserId(),
        }),
      );
    }
  }, []);

  useEffect(() => {
    socket.emit('user_connected', profileData?._id);
    socket.on('connect', () => {
      console.log('App Connected from server');
      socket.emit('user_connected', profileData?._id);
    });

    socket.on('user_online', users => {
      setOnlineUsers(users);
    });

    socket.on('user_offline', users => {
      setOnlineUsers(users);
    });

    socket.on('disconnect', () => {
      console.log('App Disconnected from server');
    });
    return () => {
      socket.off('connect');
      socket.off('user_online');
      socket.off('user_offline');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    dispatch(onlineUser(onlineUsers));
  }, [onlineUsers]);

  const fetchNewData = () => {
    setActiveScreen('HOME');
    setNoProfilesLoader(true);
    dispatch(ProfileData())
      .unwrap()
      .then((res: any) => {
        console.log('res?.data?.ageRange', res?.data?.ageRange);
        const [lowStr, highStr] = res?.data?.ageRange
          ? res?.data?.ageRange?.split(' ')
          : '18 56'.split(' ');
        const lowValue = parseInt(lowStr);
        const highValue = parseInt(highStr);

        console.log(lowStr, '  ', highStr);
        setFilterData({
          showIn: res.data.showInDistance,
          distance: parseInt(res.data.distance),
          checkedInterests: res.data.interests,
          checkedRelationShip: res.data.partnerType,
          low: lowValue,
          high: highValue,
        });
      })
      .then(() => {
        const [lowStr, highStr] = profileData?.ageRange
          ? profileData?.ageRange?.split(' ')
          : '18 56'.split(' ');

        const lowValue = parseInt(lowStr);
        const highValue = parseInt(highStr);

        dispatch(
          getAllUsers({
            userId: profileData?._id,
            checkedInterests: profileData?.interests,
            showIn: profileData?.showInDistance,
            distance: parseInt(profileData?.distance),
            low: lowValue ?? 18,
            high: highValue ?? 56,
            checkedRelationShip: profileData?.partnerType,
          }),
        )
          .unwrap()
          .then((response: any) => {
            setData(response.users);
            setNoProfilesLoader(false);
          });
      });
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setActiveScreen('HOME');
      };
    }, []),
  );

  return (
    <View style={styles.pageContainer}>
      {noProfilesLoader && (
        <View
          style={{
            height: hp(90),
            width: '100%',
            position: 'absolute',
            zIndex: 20,
          }}>
          <Loader color="#fff" />
        </View>
      )}

      <HeaderComponent
        showNotifications={true}
        setActiveScreen={setActiveScreen}
        activeScreen={activeScreen}
        // setApply={() => )}
        applyClick={() => {
          setActiveScreen('HOME');
          fetchNewData();
        }}
        ClickNotification={() => navigation.navigate('NotificationScreen')}
      />
      {/* <HomeHeader
        ClickNotification={() => navigation.navigate('NotificationScreen')}
        ClickFilter={() => navigation.navigate('filterSection')}
      /> */}
      {activeScreen === 'HOME' ? (
        <View style={styles.pageContainer2}>
          <TinderSwipe
            data={data}
            noProfilesLoader={noProfilesLoader}
            setData={setData}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            profileData={profileData}
            setModalOpen={setModalOpen}
            setReason={setReason}
          />
        </View>
      ) : activeScreen === 'Filters' ? (
        <FilterSection filterData={filterData} setFilterData={setFilterData} />
      ) : null}
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
              text={`You have reached your daily limit of ${
                reason === 'like'
                  ? 'Likes'
                  : reason === 'superLike' && 'Super Likes'
              }. To get more, Subscribe to a bigger plan!`}
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
    </View>
    // <View style={{flex:1}}>
    //   {noProfilesLoader && <View style={{height:'90%' , width:'100%' , position:'absolute' , zIndex:2}}><Loader/></View>}
    // </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ededed',
    borderWidth: 0,
  },
  pageContainer2: {
    flex: 1,
    width: '100%',
    height: '90%',
    backgroundColor: '#ededed',
    marginTop: 20,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    marginVertical: 12,
    borderWidth: 5,
    borderColor: 'red',
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

export default HomeScreen;
