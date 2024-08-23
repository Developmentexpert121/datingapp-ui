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
import NotificationScreen from '../Notification/notification';
import TinderSwipe from './AnimatedStack/TinderSwipe';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {io} from 'socket.io-client';
import {onlineUser} from '../../store/reducer/authSliceState';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');
import DeviceInfo from 'react-native-device-info';
import GetLocation from 'react-native-get-location';

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
  // console.log('++++++++++++++', data);
  const [checkedInterests, setCheckedInterests] = useState('Everyone');
  const [checkedRelationShip, setCheckedRelationShip] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [noProfilesLoader, setNoProfilesLoader] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any>(null);

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
      />
      {activeScreen === 'HOME' ? (
        <View style={styles.pageContainer2}>
          {/* <View style={{marginTop: 20, borderWidth: 0}}> */}
          <TinderSwipe
            data={data}
            noProfilesLoader={noProfilesLoader}
            setData={setData}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            profileData={profileData}
          />
          {/* </View> */}
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
      ) : (
        <NotificationScreen />
      )}
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
    // borderWidth: 2,
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
});

export default HomeScreen;
