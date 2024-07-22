import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {getAllUsers, ProfileData} from '../../../store/Auth/auth';
import TinderSwipe from './AnimatedStack/TinderSwipe';
import BackButton from '../../../components/commonBackbutton/BackButton';
import {useRoute} from '@react-navigation/native';

const exploreHome = (Data: any) => {
  const route = useRoute();
  const {name}: any = Data.route.params || {}; // Access the name parameter
  console.log('++++++++', name);

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
    profileData._id &&
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
    <SafeAreaView style={styles.pageContainer}>
      <BackButton title={name} />
      <View style={styles.pageContainer2}>
        {/* Display the name */}
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
    // borderWidth: 2,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default exploreHome;
