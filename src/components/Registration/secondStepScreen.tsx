import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

const SecondStepScreen = ({partnerType, control, errors}: any) => {
  const avatars = [
    {
      id: '1',
      name: 'Long term partner',
      image: require('../../assets/images/kiss.png'),
    },
    {
      id: '2',
      name: 'Long term open to short',
      image: require('../../assets/images/date.png'),
    },
    {
      id: '3',
      name: 'Shirt term open to long',
      image: require('../../assets/images/love-you.png'),
    },
    {
      id: '4',
      name: 'Short term fun',
      image: require('../../assets/images/hug.png'),
    },
    {
      id: '5',
      name: 'New friends',
      image: require('../../assets/images/people.png'),
    },
    {
      id: '6',
      name: 'Still figuring it out',
      image: require('../../assets/images/thinking.png'),
    },
    // Add more avatars as needed
  ];

  return (
    <SafeAreaView>
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
                  <Image source={item.image} style={styles.avatarImage} />

                  <Text style={styles.avatarLabel}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
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
    fontFamily: 'Sansation_Bold',
    marginBottom: 8,
  },
  paragraphText: {
    fontFamily: 'Sansation_Regular',
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
  },
  avatarImageContainer: {},
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
    fontFamily: 'Sansation_Bold',
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
