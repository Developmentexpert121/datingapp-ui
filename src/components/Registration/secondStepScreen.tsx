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
      image: require('../../assets/images/screenImage1.png'),
    },
    {
      id: '2',
      name: 'Long term open to short',
      image: require('../../assets/images/screenImage1.png'),
    },
    {
      id: '3',
      name: 'Shirt term open to long',
      image: require('../../assets/images/screenImage1.png'),
    },
    {
      id: '4',
      name: 'Short term fun',
      image: require('../../assets/images/screenImage1.png'),
    },
    {
      id: '5',
      name: 'New friends',
      image: require('../../assets/images/screenImage1.png'),
    },
    {
      id: '6',
      name: 'Still figuring it out',
      image: require('../../assets/images/screenImage1.png'),
    },
    // Add more avatars as needed
  ];

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.headerText}>Right now I'am looking for...</Text>
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
                  <View style={styles.avatarImageContainer}>
                    <Image source={item.image} style={styles.avatarImage} />
                  </View>
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
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  paragraphText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'gray',
    borderRadius: 10,
    overflow: 'hidden',
  },
  avatarImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  avatarLabel: {
    fontSize: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
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
