import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';
import Card from '../../components/Dashboard/homeCard/homeCard';
import AnimatedStack from './AnimatedStack/animatedStack';
import HeaderComponent from '../../components/Dashboard/header/header';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {ProfileData, getAllUsers} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterSection from '../FilterSection/filterSection';
import NotificationScreen from '../Notification/notification';

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
  const dispatch: any = useAppDispatch();
  const allUsers: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allUsers,
  );
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  // console.log('profileData0', profileData);

  const [showIn, setShowIn] = useState(profileData?.showInDistance);
  console.log('showIn Me', showIn);

  const [distance, setDistance] = useState(
    parseInt(profileData?.distance) || 50,
  );
  // console.log('distance', distance);

  const isAuthenticated = useAppSelector(
    (state: any) => state?.Auth?.isAuthenticated,
  );
  useEffect(() => {
    dispatch(ProfileData());
  }, []);
  console.log('---isAuthenticated', isAuthenticated);
  console.log('---ProfileData', ProfileData);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([]);
  console.log('first data', data);
  const [checkedInterests, setCheckedInterests] = useState(
    profileData?.interests,
  );
  useEffect(() => {
    setCheckedInterests(profileData?.interests);
  }, [profileData?.interests]);

  console.log('/////////sxfbjjs', profileData?.interests);
  console.log('checkedInterests', checkedInterests);
  const [low, setLow] = useState<number>(18);
  const [high, setHigh] = useState<number>(56);
  useEffect(() => {
    const getId = async () => {
      const userId = await getUserId();
      dispatch(
        getAllUsers({
          userId: userId,
          checkedInterests: checkedInterests,
          showIn: showIn,
          distance: distance,
          low: low,
          high: high,
        }),
      )
        .unwrap()
        .then((response: any) => {
          setData(response.users);
        });
    };
    getId();
    setCurrentIndex(0);
  }, [showIn, checkedInterests, distance, low, high]);

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

  // Function to convert degrees to radians
  const toRadians = (degrees: any) => {
    return (degrees * Math.PI) / 180;
  };
  const [activeScreen, setActiveScreen] = useState('HOME');
  return (
    <View style={styles.pageContainer}>
      <HeaderComponent
        showNotifications={true}
        setActiveScreen={setActiveScreen}
        activeScreen={activeScreen}
      />
      {activeScreen === 'HOME' ? (
        <>
          <ScrollView
            style={styles.pageContainer2}
            showsVerticalScrollIndicator={false}>
            <View style={{marginTop: 20}}>
              <AnimatedStack
                data={data}
                renderItem={({item}: any) => <Card user={item} />}
                currentIndex={currentIndex}
                setData={setData}
                setCurrentIndex={setCurrentIndex}
                profileData={profileData}
              />
            </View>
          </ScrollView>
        </>
      ) : activeScreen === 'Filters' ? (
        <FilterSection
          showIn={showIn}
          setShowIn={setShowIn}
          checkedInterests={checkedInterests}
          setCheckedInterests={setCheckedInterests}
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
  },
  pageContainer2: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ededed',
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
