import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonBackbutton from '../../components/commonBackbutton/CommonBackbutton';
import {Slider} from 'react-native-elements';
import SeventhStepScreen from '../auth/Registration/seventhStepScreen';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {updateProfileData} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EditTextIC} from '../../assets/svgs';
import BottomModalUpdate from './BottomModalUpdate';

interface UpdateForm {
  work: string;
  education: string;
  interest: string;
  language: string;
  name: string;
  email: string;
  password: string;
}

const defaultValues = {
  work: '',
  education: '',
  interest: '',
  language: '',
  name: '',
  email: '',
  password: '',
};

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

const UpdateProfile = () => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  console.log('dsfhkshdfis', profileData);

  const dispatch: any = useAppDispatch();
  const [height, setHeight] = useState(parseFloat(profileData?.height) || 3);
  const [title, setTitle] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [profileImages, setProfileImages] = useState<any>(
    profileData?.profilePic?.split(',') || [],
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getHeightInFeetAndInches = (height: number) => {
    const feet = Math.floor(height);
    const inches = Math.round((height - feet) * 12);
    return {feet, inches};
  };

  const {feet, inches} = getHeightInFeetAndInches(height);

  const handleSliderChange = (value: any) => {
    setHeight(value);
  };

  useEffect(() => {
    dispatch(
      updateProfileData({
        field: 'height',
        value: height,
        id: getUserId(),
      }),
    );
  }, [height]);

  const dataArr = [
    {title: 'Work', name: profileData?.work},
    // {
    //   title: 'Education',
    //   name: profileData?.habits2[2]?.selectedText
    //     ? profileData?.habits2[2]?.selectedText
    //     : '',
    // },
    {title: 'Interests', name: profileData?.allInterests},
    {title: 'Relationship Goals', name: profileData?.partnerType},
  ];
  console.log('first', dataArr);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleModal = (item: any) => {
    setTitle(item?.title);
    setValue(item?.name);
    setIsDrawerOpen(true);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CommonBackbutton title="Edit Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SeventhStepScreen
          profileImages={profileImages}
          setProfileImages={setProfileImages}
        />
        <View style={[styles.boxContainer, {marginTop: 28}]}>
          <View style={styles.distance}>
            <Text style={styles.textName}>Height</Text>
            <Text style={{fontFamily: 'Sansation-Regular'}}>
              {feet} FT {inches} IN
            </Text>
          </View>
          <View style={styles.line} />
          <Slider
            style={styles.slider}
            minimumValue={3}
            maximumValue={9}
            value={height}
            onSlidingComplete={handleSliderChange}
            // step={1}
            thumbTintColor="#AC25AC"
            minimumTrackTintColor="#AC25AC"
            maximumTrackTintColor="gray"
            thumbStyle={styles.thumbStyle}
          />
        </View>
        {dataArr &&
          dataArr.map((item, index) => (
            <View style={styles.boxContainer} key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: 20}} />
                <Text style={styles.textName}>{item.title}</Text>
                <EditTextIC onPress={() => handleModal(item)} />
              </View>
              <View style={styles.line} />
              <View style={{}}>
                <View
                  style={styles.textField}
                  // onPress={() => handleModal(item)}
                >
                  <Text style={{fontFamily: 'Sansation-Regular'}}>
                    {item.name}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        <BottomModalUpdate
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title={title}
          value={value}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: 10,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 5,
  },
  textName: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  line: {
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  textField: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 4,
  },
  slider: {
    marginHorizontal: 20,
  },
  thumbStyle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: '#AC25AC',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  distance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
});
