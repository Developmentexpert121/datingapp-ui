import React from 'react';
import {useEffect, useState} from 'react';
import {
  Platform,
  PermissionsAndroid,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {updateProfileData, uploadImages} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserId = async () => {
  try {
    const userId: any = await AsyncStorage.getItem('userId');

    if (userId !== null) {
      console.log(JSON.parse(userId));
      return JSON.parse(userId);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const SeventhStepScreen = ({
  profileImages,
  setProfileImages,
  title,
}: {
  profileImages: any;
  setProfileImages: any;
  title?: any;
}) => {
  const [uploadError, setUploadError] = useState<boolean>(false);

  const dispatch: any = useAppDispatch();

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await requestAndroidPermissions();
    } else {
      await requestIOSPermissions();
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);
  const requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      if (
        granted['android.permission.CAMERA'] === 'granted' &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted' &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
      ) {
        console.log('Permissions granted');
      } else {
        console.log('Permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestIOSPermissions = async () => {
    try {
      const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      const photoPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (cameraPermission === 'granted' && photoPermission === 'granted') {
        console.log('Permissions granted');
      } else {
        console.log('Permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (title !== 'Registeration') {
      let fieldValue = profileImages?.join(',');
      dispatch(
        updateProfileData({
          field: 'profilePic',
          value: fieldValue,
          id: getUserId(),
        }),
      );
    }
  }, [profileImages]);

  const handleImageSelection = async () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (!response?.didCancel && !response?.errorMessage) {
        if (response?.assets && response.assets.length > 0) {
          try {
            const asset = response.assets[0]; // Assuming you want to upload only the first selected image
            console.log(asset);
            const formData = new FormData();
            formData.append('image', {
              name: asset.fileName,
              fileName: asset.fileName,
              type: asset.type,
              uri: asset.uri,
            });

            const uploadedImageUrl = await dispatch(uploadImages(formData))
              .unwrap()
              .then((response: any) => response.secureUrl);
            console.log(uploadedImageUrl);

            setProfileImages((prevImages: any) => [
              ...prevImages,
              uploadedImageUrl,
            ]);
            setUploadError(false);
          } catch (error) {
            console.error('Error uploading image:', error);
            setUploadError(true);
          }
        } else {
          setUploadError(true); // Set error if no images are selected
        }
      }
    });
  };
  console.log('Lengthhh', profileImages.length);
  const handleRemoveImage = async (index: number) => {
    // If there's only one image left, open the image picker for replacement
    if (profileImages.length === 1) {
      try {
        launchImageLibrary({mediaType: 'photo'}, async response => {
          if (!response?.didCancel && !response?.errorMessage) {
            if (response?.assets && response.assets.length > 0) {
              try {
                const asset = response.assets[0]; // Assuming you want to upload only the first selected image
                console.log(asset);
                const formData = new FormData();
                formData.append('image', {
                  name: asset.fileName,
                  fileName: asset.fileName,
                  type: asset.type,
                  uri: asset.uri,
                });

                const uploadedImageUrl = await dispatch(uploadImages(formData))
                  .unwrap()
                  .then((response: any) => response.imageUrl);
                console.log(uploadedImageUrl);

                setProfileImages([uploadedImageUrl]);
                setUploadError(false);
              } catch (error) {
                console.error('Error uploading image:', error);
                setUploadError(true);
              }
            } else {
              setUploadError(true); // Set error if no images are selected
            }
          }
        });
      } catch (error) {
        // User cancelled image selection, do nothing
      }
    } else {
      // If there are multiple images, remove the selected image
      const updatedImages = [...profileImages];
      updatedImages?.splice(index, 1);
      setProfileImages(updatedImages);
      setUploadError(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerdm}>
        {[
          ...profileImages,
          ...Array(Math.max(6 - (profileImages?.length || 0), 0)),
        ]?.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              if (item) {
                handleRemoveImage(index);
              } else {
                handleImageSelection();
              }
            }}
            style={[styles.imageContainerdm, !item && {borderWidth: 2}]}
            key={index}>
            {item && <Image source={{uri: item}} style={styles.dummyImagedm} />}

            <View
              style={[
                styles.addRemoveButton,
                item && {transform: [{rotate: '45deg'}]},
              ]}>
              <FontAwesome6
                name="plus"
                size={20}
                style={{
                  color: 'white',
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {uploadError && (
        <Text
          style={{
            color: 'red',
            textAlign: 'center',
            fontFamily: 'Sansation_Regular',
          }}>
          Please select any picture or select from gallery
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  containerdm: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjust as needed
    rowGap: 20,
  },
  imageContainerdm: {
    borderRadius: 14,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderStyle: 'dashed',
    backgroundColor: '#E0E0E0',
    position: 'relative',
    width: 100,
    height: 160,
  },
  dummyImagedm: {
    width: 100,
    height: 160,
    borderRadius: 12,
  },
  addRemoveButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#AC25AC',
    justifyContent: 'center',
    alignItems: 'center',
    width: 26,
    height: 26,
    borderRadius: 13,
    shadowColor: '#AC25AC',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
  },
});

export default SeventhStepScreen;
