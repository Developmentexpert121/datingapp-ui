import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';
import Card from '../../components/Dashboard/homeCard/homeCard';
import AnimatedStack from '../../components/AnimatedStack/animatedStack';
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

  console.log(profileData);

  const [showIn, setShowIn] = useState(profileData?.showInDistance);

  const [distance, setDistance] = useState(
    parseInt(profileData?.distance) || 0,
  );
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
  const [checkedInterests, setCheckedInterests] = React.useState(
    profileData?.interests,
  );
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
            <View style={{marginTop: 40, borderWidth: 0}}>
              <AnimatedStack
                data={data}
                renderItem={({item}: any) => <Card user={item} />}
                currentIndex={currentIndex}
                setData={setData}
                setCurrentIndex={setCurrentIndex}
                profileData={profileData}
              />
            </View>
            <View style={styles.container}>
              {allUsers[currentIndex]?.habits1?.map((item: any, index: any) => {
                let imagePath;
                switch (item.imagePath) {
                  case 'src/assets/images/bottleofchampagne.png':
                    imagePath = require('../../assets/images/bottleofchampagne.png');
                    break;
                  case 'src/assets/images/smoking.png':
                    imagePath = require('../../assets/images/smoking.png');
                    break;
                  case 'src/assets/images/Mandumbbells.png':
                    imagePath = require('../../assets/images/Mandumbbells.png');
                    break;
                  case 'src/assets/images/dogheart.png':
                    imagePath = require('../../assets/images/dogheart.png');
                    break;
                  case 'src/assets/images/datestep.png':
                    imagePath = require('../../assets/images/datestep.png');
                    break;
                  // Add more cases for other image paths as needed
                }
                return (
                  <View style={styles.item}>
                    {imagePath && (
                      <Image
                        source={imagePath}
                        style={{height: 20, width: 20}}
                      />
                    )}
                    <Text
                      key={index.id}
                      style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
                      {item.selectedText}
                    </Text>
                  </View>
                );
              })}
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
    // borderWidth: 2,
  },
  pageContainer2: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ededed',
    // borderWidth: 2,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    marginVertical: 12,
    // borderWidth:2
  },
  locText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 16,
    columnGap: 2,
    borderWidth: 0,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10, // Adjust as needed
    marginHorizontal: 20,
    marginTop: 120,
    borderWidth: 0,
  },
  item: {
    borderWidth: 1.4,
    borderRadius: 52,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    columnGap: 4,
    backgroundColor: '#FFFFFF',
  },
});

export default HomeScreen;
