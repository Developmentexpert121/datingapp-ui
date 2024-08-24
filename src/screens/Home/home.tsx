import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, Alert, Linking} from 'react-native';
import HeaderComponent from '../../components/Dashboard/header/header';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  ProfileData,
  SetLocation,
  getAllUsers,
  updateProfileData,
} from '../../store/Auth/auth';
import FilterSection from '../FilterSection/filterSection';
import TinderSwipe from './AnimatedStack/TinderSwipe';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {io} from 'socket.io-client';
import {navigation, onlineUser} from '../../store/reducer/authSliceState';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');
import DeviceInfo from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import Label from '../../components/Label';
import MainButton from '../../components/ButtonComponent/MainButton';

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
  const navigation = useNavigation();
  const [activeScreen, setActiveScreen] = useState('HOME');
  const [apply, setApply] = useState(false);
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const [low, setLow] = useState<number>(18);
  const [high, setHigh] = useState<number>(56);
  const [showIn, setShowIn] = useState(false);
  const [distance, setDistance] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<any>([]);
  const [checkedInterests, setCheckedInterests] = useState('Everyone');
  const [checkedRelationShip, setCheckedRelationShip] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [noProfilesLoader, setNoProfilesLoader] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState('');

  const initialRouteValue = useAppSelector(
    (state: any) => state.ActivityLoader.initialRouteValue,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (initialRouteValue === 'LikedScreen') {
        console.log('Calllllleddd');
        navigation.navigate(initialRouteValue);
      }
    }, 2000); // 2 seconds delay

    // Cleanup the timer if the component unmounts before the timeout is finished
    return () => clearTimeout(timer);
  }, [initialRouteValue]);

  // const location: any = useAppSelector(
  //   (state: any) => state?.Auth?.data?.location,
  // );

  // console.log('Location on home screen ', location)

  useEffect(() => {
    // getlatestLocation();
    dispatch(ProfileData())
      .unwrap()
      .then((res: any) => {
        if (res.data.location !== undefined) {
          setShowIn(res.data.showInDistance);
        }
        setDistance(parseInt(res.data.distance));
        setCheckedInterests(res.data.interests);
        setCheckedRelationShip(res.data.partnerType);
        setTrigger(true);
      });
  }, [apply]);

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

  useEffect(() => {
    setNoProfilesLoader(true);
    profileData?._id &&
      dispatch(
        getAllUsers({
          userId: profileData._id,
          checkedInterests: checkedInterests,
          showIn: showIn,
          distance: distance,
          low: low,
          high: high,
          checkedRelationShip: checkedRelationShip,
        }),
      )
        .unwrap()
        .then((response: any) => {
          setData(response.users);
          setNoProfilesLoader(false);
        });
    apply && setApply(false);
  }, [apply, trigger]);

  // useEffect(() => {
  //   setUserLcoation();
  // }, [location]);

  // const setUserLcoation = async () => {
  //   const userId = await getUserId();
  //   if (userId && location) {
  //     dispatch(
  //       updateProfileData({
  //         field: 'location',
  //         value: {latitude: location?.latitude, longitude: location.longitude},
  //         id: userId,
  //       }),
  //     );
  //   }
  // };

  // const getlatestLocation = () => {
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 60000,
  //   })
  //     .then(location => {
  //       dispatch(
  //         SetLocation({
  //           latitude: location.latitude,
  //           longitude: location.longitude,
  //         }),
  //       );
  //     })
  //     .catch(error => {
  //       dispatch(SetLocation(undefined));
  //     });
  // };
  useEffect(() => {
    setActiveScreen('HOME');
  }, []);
  return (
    <View style={styles.pageContainer}>
      <HeaderComponent
        showNotifications={true}
        setActiveScreen={setActiveScreen}
        activeScreen={activeScreen}
        setApply={() => setApply(true)}
        applyClick={() => {
          setActiveScreen('HOME');
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
        <FilterSection
          showIn={showIn}
          setShowIn={setShowIn}
          checkedInterests={checkedInterests}
          setCheckedInterests={setCheckedInterests}
          checkedRelationShip={checkedRelationShip}
          setCheckedRelationShip={setCheckedRelationShip}
          distance={distance}
          setDistance={setDistance}
          low={low}
          setLow={setLow}
          high={high}
          setHigh={setHigh}
        />
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
                navigation.navigate('Subscriptions');
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
