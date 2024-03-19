import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Text,
  Image,
} from 'react-native';
import Card from '../homeCard/homeCard';
import users from '../../../assets/data/users';
import AnimatedStack from '../../AnimatedStack/animatedStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import HeaderComponent from '../header/header';
import FooterComponent from '../footer/footer';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {getAllUsers} from '../../../store/Auth/auth';
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

  const [showIn, setShowIn] = useState(profileData?.showInDistance);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [data, setData] = useState([]);

  useEffect(() => {
    const getId = async () => {
      const userId = await getUserId();
      dispatch(getAllUsers(userId))
        .unwrap()
        .then((response: any) => {
          setData(response.users);
        });
    };

    getId();
    setCurrentIndex(0);
  }, [showIn]);

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
        <View style={styles.pageContainer}>
          <AnimatedStack
            data={data}
            renderItem={({item}: any) => <Card user={item} />}
            currentIndex={currentIndex}
            setData={setData}
            setCurrentIndex={setCurrentIndex}
            profileData={profileData}
          />

          <View style={styles.locText}>
            <Ionicons name="location-sharp" size={20} color="#AC25AC" />
            <Text style={{fontFamily: 'Sansation_Regular', color: 'black'}}>
              {
                profileData.location && allUsers[currentIndex]?.location // Check if both locations are available
                  ? `${Math.round(
                      calculateDistance(
                        profileData.location.latitude,
                        profileData.location.longitude,
                        allUsers[currentIndex].location.latitude,
                        allUsers[currentIndex].location.longitude,
                      ),
                    ).toFixed(0)} miles away` // Calculate distance and round off to the nearest whole number
                  : 'Distance information unavailable' // Display a message if distance information is missing
              }
            </Text>
          </View>
          <View style={styles.container}>
            {allUsers[currentIndex]?.habits1?.map((item: any, index: any) => {
              let imagePath;
              switch (item.imagePath) {
                case 'src/assets/images/bottleofchampagne.png':
                  imagePath = require('../../../assets/images/bottleofchampagne.png');
                  break;
                case 'src/assets/images/smoking.png':
                  imagePath = require('../../../assets/images/smoking.png');
                  break;
                case 'src/assets/images/Mandumbbells.png':
                  imagePath = require('../../../assets/images/Mandumbbells.png');
                  break;
                case 'src/assets/images/dogheart.png':
                  imagePath = require('../../../assets/images/dogheart.png');
                  break;
                case 'src/assets/images/datestep.png':
                  imagePath = require('../../../assets/images/datestep.png');
                  break;
                // Add more cases for other image paths as needed
              }
              return (
                <View style={styles.item}>
                  {imagePath && (
                    <Image source={imagePath} style={{height: 20, width: 20}} />
                  )}

                  <Text
                    key={index.id}
                    style={{fontFamily: 'Sansation_Regular', color: 'black'}}>
                    {item.selectedText}
                  </Text>
                </View>
              );
            })}
          </View>

          <FooterComponent />
        </View>
      ) : activeScreen === 'Filters' ? (
        <FilterSection showIn={showIn} setShowIn={setShowIn} />
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
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    marginVertical: 12,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',

    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#AC25AC',
  },

  locText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 16,
    columnGap: 2,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10, // Adjust as needed
    marginHorizontal: 20,
    marginBottom: 20,
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
