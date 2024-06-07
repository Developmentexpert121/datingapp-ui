import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonBackbutton from '../../components/commonBackbutton/CommonBackbutton';
import {Slider} from 'react-native-elements';
import SeventhStepScreen from '../auth/Registration/seventhStepScreen';
import * as yup from 'yup';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {updateProfileData} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomDrawer from './BottomDrawer';
import {EditTextIC} from '../../assets/svgs';

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

const schema = yup.object().shape({
  // name: yup.string().required('Name is required'),
});

const UpdateProfile = () => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  console.log('/333', profileData);
  console.log('/333', profileData?.habits2[2]?.selectedText);

  const dispatch: any = useAppDispatch();
  const [height, setHeight] = useState(parseInt(profileData?.height) || 100);
  // console.log('kjfjdsfg', height);
  const [title, setTitle] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [profileImages, setProfileImages] = useState<any>(
    profileData?.profilePic?.split(',') || [],
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [marginBottom, setMarginBottom] = useState(0);

  // console.log('title', value);
  const getFirstThreeDigits = (number: number) => {
    // Convert number to string, slice the first three digits, then convert back to number
    return parseFloat(number.toFixed(3));
  };

  const formattedHeight = getFirstThreeDigits(height);

  const handleSliderChange = (value: any) => {
    setHeight(value);
  };

  // useEffect(() => {
  //   dispatch(
  //     updateProfileData({
  //       field: 'height',
  //       value: height,
  //       id: getUserId(),
  //     }),
  //   );
  // }, [height]);

  const dataArr = [
    {title: 'Work', name: profileData?.work},
    {title: 'Education', name: profileData?.habits2[0]?.selectedText},
    {title: 'Interests', name: profileData?.allInterests},
    {title: 'Relationship Goals', name: profileData?.partnerType},
  ];

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleModal = (item: any) => {
    setTitle(item?.title);
    setValue(item?.name);
    setIsDrawerOpen(true);
  };
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     () => {
  //       setKeyboardShown(true);
  //       setMarginBottom(300);
  //     },
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     'keyboardDidHide',
  //     () => {
  //       setKeyboardShown(false);
  //       setMarginBottom(0);
  //     },
  //   );

  //   // Clean up listeners
  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);

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
              {formattedHeight} CM
            </Text>
          </View>
          <View style={styles.line} />
          <Slider
            style={styles.slider}
            minimumValue={100}
            maximumValue={250}
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
                <View style={{width: 20}}></View>
                <Text style={styles.textName}>{item.title}</Text>
                <EditTextIC
                  // style={{right: 1}}
                  onPress={() => handleModal(item)}
                />
              </View>
              <View style={styles.line} />
              <View style={{}}>
                <TouchableOpacity
                  style={styles.textField}
                  onPress={() => handleModal(item)}>
                  <Text style={{fontFamily: 'Sansation-Regular'}}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        <BottomDrawer
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 32,
  },
  drawerText: {
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 40,
    color: 'black',
    fontFamily: 'Sansation-Bold',
  },
  listItem: {
    backgroundColor: '#AC25AC',
    marginRight: 4,
    borderRadius: 38,
    alignItems: 'center',
    marginBottom: 10,
  },

  listItem2: {
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderColor: 'grey',
    marginRight: 4,
    borderRadius: 38,
    alignItems: 'center',
    marginBottom: 10,
  },
});
