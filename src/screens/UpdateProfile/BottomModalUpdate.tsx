import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {updateProfileData} from '../../store/Auth/auth';
import AppTextInput from '../../components/AppTextInput/AppTextInput';
import MainButton from '../../components/ButtonComponent/MainButton';

interface UpdateForm {
  work: string;
  education: string;
  interest: string;
  language: string;
  name: string;
  password: string;
}
const defaultValues = {
  work: '',
  education: '',
  interest: '',
  language: '',
  name: '',
  password: '',
};
// const getUserId = async () => {
//   try {
//     const userId: any = await AsyncStorage.getItem('userId');

//     if (userId !== null) {
//       return JSON.parse(userId);
//     } else {
//       return null;
//     }
//   } catch (error) {
//     return null;
//   }
// };

const schema = yup.object().shape({
  //name: yup.string().required('Name is required'),
});
const BottomModalUpdate = ({isOpen, onClose, title, value}: any) => {
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

  const dataEducation = [
    {text: 'Bachelors'},
    {text: 'In college'},
    {text: 'High school'},
    {text: 'PHD'},
    {text: 'Masters'},
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
    } else if (title.toLowerCase() === 'education') {
      field = 'education';
      fieldValue = education;
    } else if (title.toLowerCase() === 'relationship goals') {
      field = 'partnerType';
      fieldValue = selectedAvatar;
    } else {
      // Extract "" from the title string
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
    profileData?.allInterests?.split(', ') || [],
  );

  console.log('=======', interests);
  const [education, setEducation] = useState<string>('');
  console.log('++++++++++', education);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  console.log('____________', selectedAvatar);

  const toggleChip = (interest: string) => {
    if (education === interest) {
      setEducation('');
    } else {
      console.log('wwwwwwwwwwwwwwwwwwwwwCalled');
      setEducation(interest);
    }
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
      // const updatedInterests = [...interests, interest];
      // setInterests(updatedInterests);
    }
  };

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
          {title === 'Education' ? (
            <View style={{marginHorizontal: 40, rowGap: 10, marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  borderRadius: 15,
                  backgroundColor: '#AC25AC',
                  paddingHorizontal: 12,
                }}>
                <Text
                  style={{
                    color: 'white',
                    paddingVertical: 6,
                    fontFamily: 'Sansation-Regular',
                  }}>
                  {education}
                </Text>
              </View>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {dataEducation.map((item, index) => {
                  if (!education.includes(item.text)) {
                    return <ListItem2 key={index} item={item.text} />;
                  }
                  return null; // Don't render the chip if it's already selected
                })}
              </View>
            </View>
          ) : title === 'Interests' ? (
            <View
              style={{
                marginHorizontal: 35,
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
              <View
                style={{
                  flexDirection: 'row',
                  borderRadius: 15,
                  backgroundColor: '#AC25AC',
                  paddingHorizontal: 12,
                }}>
                <Text
                  style={{
                    color: 'white',
                    paddingVertical: 6,
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

export default BottomModalUpdate;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  drawer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
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
