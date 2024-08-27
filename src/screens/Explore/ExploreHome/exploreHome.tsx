import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, ActivityIndicator} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {getAllUsers, ProfileData} from '../../../store/Auth/auth';
import BackButton from '../../../components/commonBackbutton/BackButton';
import TinderSwipe from '../../Home/AnimatedStack/TinderSwipe';
import Loader from '../../../components/Loader/Loader';

const ExploreHome = (Data: any) => {
  const {name}: any = Data.route.params || {};
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
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    // Show the loader for 2 seconds on initial mount
    const timer = setTimeout(() => {
      setLoading(false); // Hide loader after 2 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  useEffect(() => {
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
    setNoProfilesLoader(true);
    if (profileData._id) {
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
          const filteredData = response.users.filter((item: any) => {
            return item?.habits1[4]?.optionSelected[0] == name;
          });
          setData(filteredData);
          setNoProfilesLoader(false);
        });
    }
    apply && setApply(false);
  }, [apply, trigger]);

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
          noProfilesLoader={noProfilesLoader}
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
