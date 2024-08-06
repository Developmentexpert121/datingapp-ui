import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import HeaderComponent from '../../components/Dashboard/header/header';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
  ProfileData,
  getAllUsers,
  updateProfileData,
} from '../../store/Auth/auth';
import FilterSection from '../FilterSection/filterSection';
import NotificationScreen from '../Notification/notification';
import TinderSwipe from './AnimatedStack/TinderSwipe';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {io} from 'socket.io-client';
const socket = io('https://datingapp-api-9d1ff64158e0.herokuapp.com');

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
  const [checkedInterests, setCheckedInterests] = useState('Everyone');
  const [checkedRelationShip, setCheckedRelationShip] = useState('');
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        // console.log('latitude:', latitude);
        // console.log('Longitude:', longitude);

        dispatch(
          updateProfileData({
            field: 'location',
            value: {latitude, longitude},
            id: getUserId(),
          }),
        );
      },
      err => {
        console.error('Error fetching location:', err);
      },
      {enableHighAccuracy: true, timeout: 50000, maximumAge: 10000}, // Increased timeout to 30000ms (30 seconds)
    );
    dispatch(ProfileData())
      .unwrap()
      .then((res: any) => {
        setShowIn(res.data.showInDistance);
        setDistance(parseInt(res.data.distance));
        setCheckedInterests(res.data.interests);
        setCheckedRelationShip(res.data.partnerType);
        setTrigger(true);
      });
  }, []);

  useEffect(() => {
    socket.emit('user_connected', profileData?._id);
    socket.on('connect', () => {
      console.log('App Connected from server');
      const userId = profileData?._id;
      socket.emit('user_connected', profileData?._id);
      // console.log('ahsdgjuhgdgsu', userId);
    });
    return () => {
      socket.off('connect');
    };
  }, []);

  useEffect(() => {
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
        });
    apply && setApply(false);
  }, [apply, trigger]);

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
          <View style={{marginTop: 20, borderWidth: 0}}>
            <TinderSwipe
              data={data}
              setData={setData}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              profileData={profileData}
            />
          </View>
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
    // flex: 1,
    width: '100%',
    height: '90%',
    backgroundColor: '#ededed',
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
