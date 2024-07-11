import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import HeaderComponent from '../../components/Dashboard/header/header';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {ProfileData, getAllUsers} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterSection from '../FilterSection/filterSection';
import NotificationScreen from '../Notification/notification';
import TinderSwipe from './AnimatedStack/TinderSwipe';

const HomeScreen = () => {
  const [activeScreen, setActiveScreen] = useState('HOME');
  const [apply, setApply] = useState(false);
  const dispatch: any = useAppDispatch();
  // );
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const [low, setLow] = useState<number>(18);
  const [high, setHigh] = useState<number>(56);
  const [showIn, setShowIn] = useState(profileData?.showInDistance || false);
  const [distance, setDistance] = useState(
    parseInt(profileData?.distance) || 50,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<any>([]);
  const [checkedInterests, setCheckedInterests] = useState(
    profileData?.interests || 'Everyone',
  );
  const [checkedRelationShip, setCheckedRelationShip] = useState(
    profileData?.partnerType || '',
  );
  console.log('----------q', checkedRelationShip);

  const getProfileData = async () => {
    try {
      let responseData = await dispatch(ProfileData());
    } catch (error) {
      console.log('iueswdfggsw', error);
    }
  };

  useEffect(() => {
    dispatch(
      getAllUsers({
        userId: profileData?._id,
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
  }, [apply]);

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    setCheckedInterests(profileData?.interests);
  }, [profileData?.interests]);

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
