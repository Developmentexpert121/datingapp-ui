import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  FlatList,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Svg, {Circle, Text as SvgText} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {ListItem} from 'react-native-elements';
import CommonBackbutton from '../../components/commonBackbutton/CommonBackbutton';
import LinearGradient from 'react-native-linear-gradient';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {updateProfileData} from '../../store/Auth/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import FooterComponent from '../../components/Dashboard/footer/footer';

const {width} = Dimensions.get('window');
const eightyPercentWidth: number = width * 0.84;
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

const data = [
  {
    title: 'Premium',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '999INR',
  },
  {
    title: 'Premium Plus',
    description:
      'Maximize your dating with all the benefits of premium with extra features included',
    price: '1,999INR',
  },
  // Add more data as needed
];
const data2 = [
  'Unlimited likes',
  'See who likes you',
  'Priority likes',
  'Unlimited Rewards',
];
const Box = ({item, isActive}: any) => (
  <LinearGradient
    colors={[
      item.title === 'Premium' ? '#AC25AC' : '#101010',
      item.title === 'Premium' ? '#FF4FFF' : '#494949',
    ]}
    start={{x: 0, y: 0.5}}
    end={{x: 1, y: 0.5}}
    style={[styles.boxContainer]}>
    <Text style={styles.text}>{item.title}</Text>
    <Text style={styles.text2}>{item.description}</Text>
    <TouchableOpacity>
      <Text style={styles.upbtn}>Upgrade from {item.price}</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const TickListItem = ({item}: any) => (
  <TouchableOpacity>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        columnGap: 10,
        paddingVertical: 5,
      }}>
      <Icon name="checkmark-done" size={24} color="#AC25AC" />
      <View>
        <Text
          style={{
            fontFamily: 'Sansation-Regular',
            color: 'black',
            fontSize: 16,
          }}>
          {item}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ProfileSection = () => {
  const [isScrollEnabled, setIsScrollEnabled] = useState<boolean>(true);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isContentFullyVisible =
      layoutMeasurement.height + contentOffset.y >= contentSize.height;
    setIsScrollEnabled(!isContentFullyVisible);
  };

  const profileData = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const dispatch: any = useAppDispatch();

  const [profileCompletion, setProfileComplition] = useState(0);

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

    fields?.forEach(field => {
      if (field?.trim() !== '') {
        filledFieldsCount++;
      }
    });

    const totalFields = fields?.length;
    const percentageValue = Math.round((filledFieldsCount / totalFields) * 100);
    setProfileComplition(percentageValue);

    dispatch(
      updateProfileData({
        field: 'profilePercentage',
        value: percentageValue,
        id: getUserId(),
      }),
    );
  }, [
    profileData?.phone,
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

  const navigation = useNavigation();

  const profileImage = profileData?.profilePic?.split(',')[0];

  const calculateStrokeDasharray = (percentage: any) => {
    const circumference = 465; // 2 * π * radius (140 * 2 * π)
    const completedLength = (percentage / 100) * circumference;
    return [completedLength, circumference];
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef: any = useRef(null);

  const renderBox = ({item, index}: any) => (
    <Box item={item} isActive={index === activeIndex} />
  );

  const handleDotPress = (index: any) => {
    setActiveIndex(index);
    flatListRef.current.scrollToIndex({animated: true, index});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CommonBackbutton title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{width: '100%', height: '100%'}}>
        <View style={styles.containerTop}>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Feather
                name="settings"
                size={24}
                color="#AC25AC"
                style={styles.settingIcon}
              />
            </TouchableOpacity>
            <View style={styles.profileImageContainer}>
              <View>
                <Svg height="154" width="154" style={styles.progressCircle}>
                  <Circle
                    cx="76"
                    cy="76"
                    r="74"
                    stroke="#D6D6D6" // Set a background color for the circle
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
                    strokeDasharray={calculateStrokeDasharray(
                      profileCompletion,
                    )}
                    transform="rotate(-90, 75, 75)"
                  />
                  {/* <SvgText
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle"
            fontSize="24"
            fill="#3498db">
            {`${profileCompletion}%`}
          </SvgText> */}
                </Svg>
                <Image
                  source={{uri: profileImage}}
                  style={styles.profileImage}
                />
                <View style={styles.completionContainer}>
                  <Text style={styles.completionText}>
                    {profileCompletion}% Complete
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdateProfile')}>
              <Icons
                name="mode-edit"
                size={24}
                color="#AC25AC"
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Sansation-Bold',
                fontSize: 20,
                color: 'black',
                marginTop: 10,
              }}>
              {profileData.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
                columnGap: 2,
              }}>
              <Ionicons name="location" size={20} color="#AC25AC" />
              <Text
                style={{
                  fontFamily: 'Sansation-Regular',
                  fontSize: 18,
                }}>
                {profileData.city}, {profileData.country}
              </Text>
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={data}
            renderItem={renderBox}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={event => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const index = Math.floor(offsetX / 300); // Assuming each box has a width of 300
              setActiveIndex(index);
            }}
          />
          <View style={styles.dotsContainer}>
            {data.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDotPress(index)}>
                <View
                  style={[
                    styles.dot,
                    index === activeIndex && styles.activeDot,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{flex: 0, paddingTop: 16}}>
          <FlatList
            scrollEnabled={false}
            data={data2}
            renderItem={({item}) => <TickListItem item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerTop: {
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
    // borderWidth: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    position: 'relative',
    alignItems: 'center',
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
  editIcon: {
    marginRight: 30,
    backgroundColor: '#FFE1FF',
    color: '#AC25AC',
    borderRadius: 20,
    padding: 8,
  },
  settingIcon: {
    marginLeft: 30,
    borderRadius: 20,
    backgroundColor: '#FFE1FF',
    color: '#AC25AC',
    padding: 8,
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
  boxContainer: {
    borderRadius: 6,
    padding: 16,
    alignItems: 'center',
    paddingHorizontal: 28,
    marginHorizontal: 30,
    marginBottom: 5,
    width: eightyPercentWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  text: {
    alignItems: 'center',
    color: 'white',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
  },
  text2: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 4,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
  },
  upbtn: {
    alignSelf: 'center',
    color: 'black',
    backgroundColor: '#F99A21',
    fontFamily: 'Sansation-Regular',
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#AC25AC',
  },
});

export default ProfileSection;
