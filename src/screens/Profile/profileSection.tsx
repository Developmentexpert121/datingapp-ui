import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, {Circle} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import CommonBackbutton from '../../components/commonBackbutton/CommonBackbutton';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {updateProfileData} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubscriptionUi from './SubscriptionComponent/SubscriptionUi';

const {width} = Dimensions.get('window');
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

const ProfileSection: React.FC = () => {
  const profileData = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const dispatch: any = useAppDispatch();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    let filledFieldsCount = 0;
    const fields = [
      profileData?.phone || '',
      profileData?.email || '',
      String(profileData?.location?.longitude) || '',
      String(profileData?.location?.latitude) || '',
      profileData?.interests || '',
      profileData?.language || '',
      profileData?.gender || '',
      profileData?.profilePic || '',
      profileData?.work || '',
      profileData?.education || '',
      profileData?.allInterests || '',
      profileData?.partnerType || '',
    ];

    fields.forEach(field => {
      if (typeof field === 'string' && field.trim() !== '') {
        filledFieldsCount++;
      }
    });

    const totalFields = fields?.length;
    const percentageValue = Math.round((filledFieldsCount / totalFields) * 100);
    setProfileCompletion(percentageValue);

    dispatch(
      updateProfileData({
        field: 'profilePercentage',
        value: percentageValue,
        id: getUserId(),
      }),
    );
  }, [
    profileData?.email,
    profileData?.location?.longitude,
    profileData?.location?.longitude,
    profileData?.interests,
    profileData?.language,
    profileData?.gender,
    profileData?.profilePic,
    profileData?.work,
    profileData?.education,
    profileData?.allInterests,
    profileData?.partnerType,
  ]);

  const profileImage = profileData?.profilePic?.split(',')[0];

  const calculateStrokeDasharray = (percentage: any) => {
    const circumference = 465; // 2 * π * radius (140 * 2 * π)
    const completedLength = (percentage / 100) * circumference;
    return [completedLength, circumference];
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <CommonBackbutton title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.topSection}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Image
                source={require('../../assets/images/Setting.png')}
                style={styles.icon}
              />
              {/* <SettingIC /> */}
            </TouchableOpacity>
            <View style={styles.profileImageContainer}>
              <Svg height="154" width="154" style={styles.progressCircle}>
                <Circle
                  cx="76"
                  cy="76"
                  r="74"
                  stroke="#D6D6D6"
                  strokeWidth="4"
                  fill="transparent"
                />
                <Circle
                  cx="74"
                  cy="76"
                  r="74"
                  stroke="#AC25AC"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={calculateStrokeDasharray(profileCompletion)}
                  transform="rotate(-90, 75, 75)"
                />
              </Svg>
              <Image source={{uri: profileImage}} style={styles.profileImage} />
              <View style={styles.completionContainer}>
                <Text style={styles.completionText}>
                  {profileCompletion}% Complete
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdateProfile')}>
              <Image
                source={require('../../assets/images/Edit.png')}
                style={styles.icon}
              />
              {/* <EditIC /> */}
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profileData.name}</Text>
            <View style={styles.userLocationContainer}>
              <Ionicons name="location" size={20} color="#AC25AC" />
              <Text style={styles.userLocationText}>
                {profileData.city}, {profileData.country}
              </Text>
            </View>
          </View>
        </View>

        <SubscriptionUi />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
  },
  topSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 22,
    marginTop: 10,
    shadowColor: '#AC25AC',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  progressCircle: {
    position: 'absolute',
  },
  profileImage: {
    margin: 10,
    width: 132,
    height: 132,
    borderRadius: 66,
  },
  completionContainer: {
    position: 'absolute',
    bottom: 0,
    right: 18,
    backgroundColor: '#AC25AC',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 22,
    shadowColor: '#000',
    elevation: 6,
  },
  completionText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Regular',
  },
  icon: {
    marginHorizontal: 20,
    width: 40,
    height: 40,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Sansation-Bold',
    fontSize: 20,
    color: 'black',
    marginTop: 10,
  },
  userLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    columnGap: 2,
  },
  userLocationText: {
    fontFamily: 'Sansation-Regular',
    fontSize: 18,
  },
});

export default ProfileSection;
