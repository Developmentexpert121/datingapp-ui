import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {ProfileData, updateProfileData} from '../../store/Auth/auth';
import AppTextInput from '../../components/AppTextInput/AppTextInput';
import MainButton from '../../components/ButtonComponent/MainButton';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from '../../components/AppTextInput/PhoneInput';
import {name} from '@stream-io/video-react-native-sdk';

interface UpdateForm {
  name: string;
  email: string;
  password: string;
  gender: string;
  setCallingCode: any;
  callingCode: any;
  abde: any;
  zxcv: any;
}
const defaultValues = {
  abde: '',
  zxcv: '',
  name: '',
  email: '',
  password: '',
  gender: '',
  setCallingCode: '',
  callingCode: '',
};
const schema = yup.object().shape({
  // gender: yup.string().required('gender is required'),
});
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
const BottomDrawer = ({
  isOpen,
  onClose,
  title,
  value,
  callingCode,
  setCallingCode,
}: any) => {
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const [phone, setPhone] = useState<object>({});

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<UpdateForm>({
    defaultValues,
    resolver: yupResolver<any>(schema),
  });

  useEffect(() => {
    setValue(title, value);
  }, [title]);

  const onSubmit = (data: any) => {
    const fieldValue = data[title];
    let field;
    if (title.toLowerCase() === 'show me') {
      field = 'interests';
    } else if (title.toLowerCase() === 'phone number') {
      // field = 'partnerType';
      title?.toLowerCase().split(' ')[0];
      setPhone({
        countryCode: callingCode,
        number: data.phone,
      });
      // fieldValue = selectedAvatar;
    } else {
      // Extract "email" from the title string
      field = title?.toLowerCase().split(' ')[0];
    }

    dispatch(
      updateProfileData({
        field: field,
        value: fieldValue,
        id: getUserId(),
      }),
    ).then(() => onClose());
  };

  const ListItem = ({item}: any) => (
    <View style={styles.listItem}>
      <Text style={{color: 'white', padding: 4}}>{item}</Text>
    </View>
  );

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
          {title === 'interests' ? (
            <View>
              <FlatList
                data={value.split(',')}
                renderItem={({item}) => <ListItem item={item} />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3} // Display three items per row
              />
            </View>
          ) : title === 'Phone Number' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                // borderWidth: 2,
              }}>
              <PhoneInput
                placeholder={'Enter Your ' + title.split(' ')[0]}
                name={title}
                control={control}
              />
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                // borderWidth: 2,
              }}>
              <AppTextInput
                placeholder={'Enter Your ' + title.split(' ')[0]}
                name={title}
                control={control}
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

export default BottomDrawer;

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
    width: '32%', // Each list item takes one-third of the width
    // height: 100,
    // borderWidth: 1,
    backgroundColor: '#AC25AC',
    //borderColor: 'black',
    color: 'white',
    marginRight: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
