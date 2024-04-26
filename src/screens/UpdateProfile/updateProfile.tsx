import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonBackbutton from '../../components/commonBackbutton/CommonBackbutton';
import {Slider} from 'react-native-elements';
import SeventhStepScreen from '../auth/Registration/seventhStepScreen';
import AppTextInput from '../../components/AppTextInput/AppTextInput';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {updateProfileData} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainButton from '../../components/ButtonComponent/MainButton';
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
  //name: yup.string().required('Name is required'),
});

const BottomDrawer = ({isOpen, onClose, title, value}: any) => {
  const dispatch: any = useAppDispatch();
  const profileData = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const Data = [
    {text: 'Lodo'},
    {text: 'Cricket'},
    {text: 'Football'},
    {text: 'Shopping'},
    {text: 'Coffee'},
    {text: 'Movies'},
    {text: 'Dancing'},
    {text: 'Bikes'},
    {text: 'Games'},
    {text: 'Photography'},
    {text: 'Swimming'},
    {text: 'Travel'},
  ];
  const avatars = [
    {id: '1', text: 'Long term partner'},
    {id: '2', text: 'Long term open to short'},
    {id: '3', text: 'Short term open to long'},
    {id: '4', text: 'Short term fun'},
    {id: '5', text: 'New friends'},
    {id: '6', text: 'Still figuring it out'},
    // Add more avatars as needed
  ];

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: {errors},
  } = useForm<UpdateForm>({
    defaultValues,
    resolver: yupResolver<any>(schema),
  });

  useEffect(() => {
    setValue(title, value);
  }, [title]);

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

  const onSubmit = (data: any) => {
    let field;
    let fieldValue;
    if (title.toLowerCase() === 'interests') {
      field = 'allInterests';
      fieldValue = interests.join(',');
    } else if (title.toLowerCase() === 'relationship goals') {
      field = 'partnerType';
      fieldValue = selectedAvatar;
    } else {
      // Extract "email" from the title string
      field = title?.toLowerCase().split(' ')[0];
      fieldValue = data[title];
    }

    dispatch(
      updateProfileData({
        field: field,
        value: fieldValue,
        id: getUserId(),
      }),
    ).then(() => onClose());
  };

  const ListItem = ({item, index}: any) => (
    <TouchableOpacity onPress={() => toggleChip(item)}>
      <View style={styles.listItem}>
        <Text
          style={{
            color: 'white',
            paddingVertical: 6,
            paddingHorizontal: 12,
            fontFamily: 'Sansation-Regular',
          }}>
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const ListItem2 = ({item}: any) => (
    <TouchableOpacity onPress={() => toggleChip(item)}>
      <View style={styles.listItem2}>
        <Text
          style={{
            color: 'grey',
            paddingVertical: 6,
            paddingHorizontal: 12,
            fontFamily: 'Sansation-Regular',
          }}>
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const [interests, setInterests] = useState(
    profileData?.allInterests?.split(',') || [],
  );

  const toggleChip = (interest: string) => {
    if (selectedAvatar === interest) {
      setSelectedAvatar('');
    } else {
      setSelectedAvatar(interest);
    }
    if (interests.includes(interest)) {
      // If interest is already selected, remove it
      const updatedInterests = interests.filter(
        (item: string) => item !== interest,
      );
      setInterests(updatedInterests);
    } else {
      // If interest is not selected, add it
      const updatedInterests = [...interests, interest];
      setInterests(updatedInterests);
    }
  };
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.drawer}>
          <Text style={styles.drawerText}>{title}</Text>
          {title === 'Interests' ? (
            <View
              style={{
                marginHorizontal: 40,
                rowGap: 10,
              }}>
              <View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {interests?.map((item: string, index: number) => (
                    <ListItem key={index} item={item} />
                  ))}
                </View>
              </View>

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {Data.map((item, index) => {
                  if (!interests.includes(item.text)) {
                    return <ListItem2 key={index} item={item.text} />;
                  }
                  return null; // Don't render the chip if it's already selected
                })}
              </View>
            </View>
          ) : title === 'Relationship Goals' ? (
            <View style={{marginHorizontal: 40, rowGap: 10, marginTop: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    backgroundColor: '#AC25AC',
                    color: 'white',
                    borderRadius: 32,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    fontFamily: 'Sansation-Regular',
                  }}>
                  {selectedAvatar}
                </Text>
              </View>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {avatars.map((item, index) => {
                  if (!selectedAvatar.includes(item.text)) {
                    return <ListItem2 key={index} item={item.text} />;
                  }
                  return null; // Don't render the chip if it's already selected
                })}
              </View>
            </View>
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <AppTextInput
                placeholder={'Enter Your ' + title.split(' ')[0]}
                name={title}
                control={control}
                errors={Boolean(errors?.work)}
              />
            </View>
          )}
          <MainButton
            buttonStyle={{width: '80%'}}
            onPress={handleSubmit(onSubmit)}
            ButtonName={'Save'}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const UpdateProfile = () => {
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const dispatch: any = useAppDispatch();
  const [height, setHeight] = useState(parseInt(profileData?.height) || 0);
  const [title, setTitle] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [profileImages, setProfileImages] = useState<any>(
    profileData?.profilePic?.split(',') || [],
  );

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
    {title: 'Education', name: profileData?.education},
    {title: 'Interests', name: profileData?.allInterests},
    {title: 'Relationship Goals', name: profileData?.partnerType},
  ];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
  return (
    <SafeAreaView style={{flex: 1}}>
      <CommonBackbutton title="Edit Pro" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SeventhStepScreen
          profileImages={profileImages}
          setProfileImages={setProfileImages}
        />
        <View style={[styles.boxContainer, {marginTop: 28}]}>
          <View style={styles.distance}>
            <Text style={styles.textName}>Height</Text>
            <Text style={{fontFamily: 'Sansation-Regular'}}>{height} MT</Text>
          </View>
          <View style={styles.line} />
          <Slider
            style={styles.slider}
            minimumValue={2}
            maximumValue={12}
            value={height}
            onSlidingComplete={handleSliderChange}
            step={1}
            thumbTintColor="#AC25AC"
            minimumTrackTintColor="#AC25AC"
            maximumTrackTintColor="gray"
            thumbStyle={styles.thumbStyle}
          />
        </View>
        {dataArr &&
          dataArr.map((item, index) => (
            <View style={styles.boxContainer} key={index}>
              <Text style={styles.textName}>{item.title}</Text>
              <View style={styles.line} />
              <View>
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
