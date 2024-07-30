import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {
  InrestFriendsIC,
  InrestFunIC,
  InrestLongIC,
  InrestOutIC,
  InrestPartnerIC,
  InrestShortIC,
} from '../../../assets/svgs';

const SecondStepScreen = ({partnerType, control, errors}: any) => {
  const avatars = [
    {
      id: '1',
      name: 'Long term partner',
      image: <InrestPartnerIC />,
    },
    {
      id: '2',
      name: 'Long term open to short',
      image: <InrestShortIC />,
    },
    {
      id: '3',
      name: 'Short term open to long',
      image: <InrestLongIC />,
    },
    {
      id: '4',
      name: 'Short term fun',
      image: <InrestFunIC />,
    },
    {
      id: '5',
      name: 'New friends',
      image: <InrestFriendsIC />,
    },
    {
      id: '6',
      name: 'Still figuring it out',
      image: <InrestOutIC />,
    },
    // Add more avatars as needed
  ];

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Right now I'm looking for...</Text>
        <Text style={styles.paragraphText}>
          Increase compatiblity by sharing yours
        </Text>

        <View style={styles.avatarContainer}>
          {avatars.map(item => (
            <Controller
              key={item.id}
              name={partnerType}
              control={control}
              defaultValue={null}
              render={({field: {onChange, value}}) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    errors && styles.errorBorder,
                    styles.avatarItem,
                    value === item.name && styles.selectedAvatar, // Add selected style if the avatar is selected
                  ]}
                  onPress={() => onChange(item.name)}>
                  {/* <Image source={item.image} style={styles.avatarImage} /> */}
                  <Text>{item.image}</Text>
                  <Text style={styles.avatarLabel}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
    marginBottom: 8,
  },
  paragraphText: {
    fontFamily: 'Sansation-Regular',
    fontSize: 16,
    marginBottom: 20,
    color: '#575757',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarItem: {
    height: 90,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#E8E8E8',
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'transparent',
    margin: 2,
  },
  avatarImage: {
    width: 32,
    height: 32,

    marginBottom: 2,
  },
  avatarLabel: {
    fontSize: 10,
    alignItems: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: 'black',
  },
  selectedAvatar: {
    borderColor: '#AC25AC', // Add border color for selected avatar
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 2,
  },
});

export default SecondStepScreen;
