import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, ActivityIndicator} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {getAllUsers, ProfileData} from '../../../store/Auth/auth';
import BackButton from '../../../components/commonBackbutton/BackButton';
import TinderSwipe from '../../Home/AnimatedStack/TinderSwipe';
import Loader from '../../../components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExploreHome = (Data: any) => {
  const {name}: any = Data.route.params || {};
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState<any>({});
  const [viewedUsers, setViewedUsers] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const getUserId = async () => {
    try {
      const userId: any = await AsyncStorage.getItem('userId');

      if (userId !== null) {
        setUserId(JSON.parse(userId));
        return JSON.parse(userId);
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    console.log('-5-');

    if (!endReached && data.length == 0 && userData?.checkedInterests) {
      console.log('-6-', page);
      setLoading(true);
      fetchNewData();
    }
  }, [data.length]);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    console.log('-1-', !userData?.checkedInterests);
    if (!userData?.checkedInterests) {
      dispatch(ProfileData())
        .unwrap()
        .then((res: any) => {
          setUserData({
            checkedInterests: res.data.interests,
            showIn: res.data.showInDistance,
            distance: parseInt(res.data.distance) || 50,
            checkedRelationShip: res.data.partnerType,
          });
          console.log('-2-');

          fetchNewData();
        });
    }
  }, [userData]);

  useEffect(() => {
    fetchNewData();
  }, [userData]);

  const fetchNewData = () => {
    console.log('-3-');

    if (userId != '') {
      console.log('-4-', page);
      console.log(viewedUsers);
      dispatch(
        getAllUsers({
          userId: userId,
          low: 18,
          high: 65,
          page: page,
          viewedUsers:
            page === 1 ? JSON.stringify([]) : JSON.stringify(viewedUsers),
          ...userData,
        }),
      )
        .unwrap()
        .then(async (response: any) => {
          console.log('-7-');
          const newUsers = response.users;
          console.log('response ', newUsers.length);
          const filteredData = await newUsers.filter((item: any) => {
            return item?.habits1[4]?.optionSelected[0] == name;
          });
          const uniqueUsers = await newUsers.map((user: any) => user._id);
          setViewedUsers((prev: any) => [...prev, ...uniqueUsers]);
          setData(filteredData);
          setLoading(false);
          setPage(prev => prev + 1);
          if (newUsers.length < 10) {
            console.log('End Reached');
            setEndReached(true);
          }
        });
    }
  };

  console.log('DAtalength  ', data.length);

  if (loading) {
    // Show loader while loading is true
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <BackButton title={name} />
      <View style={styles.pageContainer2}>
        <TinderSwipe
          data={data}
          setData={setData}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          profileData={profileData}
        />
      </View>
    </SafeAreaView>
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
    height: '100%',
    backgroundColor: '#ededed',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ededed',
  },
});

export default ExploreHome;
