import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {getAllUsers, ProfileData} from '../../../store/Auth/auth';
import BackButton from '../../../components/commonBackbutton/BackButton';
import TinderSwipe from '../../Home/AnimatedStack/TinderSwipe';
import Loader from '../../../components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Label from '../../../components/Label';
import MainButton from '../../../components/ButtonComponent/MainButton';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [totalLikesPossible, setTotalLikesPossible] = useState<any>(0);
  const [totalSuperLikesPossible, setTotalSuperLikesPossible] =
    useState<any>(0);

  const navigation = useNavigation<any>();

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
    if (!endReached && data.length == 0 && userData?.checkedInterests) {
      setLoading(true);
      fetchNewData();
    }
  }, [data.length, page]);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
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
          const getLastKeyValuePair = (obj: any) => {
            const entries = Object.entries(obj); // Convert to array of [key, value]
            return entries[entries.length - 1]; // Get the last element
          };
          const isEmptyObject = (obj: any) => Object.keys(obj).length === 0;

          const [lastKey, lastValue] = getLastKeyValuePair(
            !isEmptyObject(res.data?.totalLikedToday)
              ? res.data?.totalLikedToday
              : {'0': 0},
          );

          const [lastKeySuper, lastValueSuper] = getLastKeyValuePair(
            !isEmptyObject(res.data?.totalSuperLikedToday)
              ? res.data?.totalSuperLikedToday
              : {'0': 0},
          );

          setTotalLikesPossible(lastValue); // Outputs: "2024-09-03", 21
          setTotalSuperLikesPossible(lastValueSuper);
          fetchNewData();
        });
    }
  }, [userData]);

  useEffect(() => {
    fetchNewData();
  }, [userData]);

  const fetchNewData = () => {
    if (userId != '') {
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
          const newUsers = response.users;
          const filteredData = await newUsers.filter((item: any) => {
            return item?.habits1[4]?.optionSelected[0] == name;
          });
          const uniqueUsers = await newUsers.map((user: any) => user._id);
          setViewedUsers((prev: any) => [...prev, ...uniqueUsers]);
          setData(filteredData);
          setLoading(false);
          setPage(prev => prev + 1);
          if (newUsers.length < 10) {
            setEndReached(true);
          }
        });
    }
  };

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
          setModalOpen={setModalOpen}
          setReason={setReason}
          setTotalLikesPossible={setTotalLikesPossible}
          totalLikesPossible={totalLikesPossible}
          setTotalSuperLikesPossible={setTotalSuperLikesPossible}
          totalSuperLikesPossible={totalSuperLikesPossible}
        />
      </View>
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
});

export default ExploreHome;
