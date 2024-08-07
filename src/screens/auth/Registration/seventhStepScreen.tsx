import React from 'react';
import {useEffect, useState} from 'react';
import {
  Platform,
  PermissionsAndroid,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {updateProfileData, uploadImages} from '../../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader/Loader';
import ImageResizer from 'react-native-image-resizer'; // Add this library for image resizing

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

const SeventhStepScreen = ({
  profileImages,
  setProfileImages,
  title,
  errors,
}: {
  profileImages: any;
  setProfileImages: any;
  title?: any;
  images?: any;
  control?: any;
  errors?: any;
}) => {
  const [uploadError, setUploadError] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
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
        // Permissions granted
      } else {
        // Permissions denied
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
        // Permissions granted
      } else {
        // Permissions denied
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
        setLoader(true);

        if (response?.assets && response.assets.length > 0) {
          try {
            const asset: any = response.assets[0];

            // Resize the image
            const resizedImage = await ImageResizer.createResizedImage(
              asset.uri,
              800, // new width
              800, // new height
              'JPEG',
              80, // quality
            );

            const formData = new FormData();
            formData.append('image', {
              name: resizedImage.name,
              fileName: resizedImage.name,
              type: asset.type,
              uri: resizedImage.uri,
            });

            const uploadedImageUrl = await dispatch(uploadImages(formData))
              .unwrap()
              .then((response: any) => response.secureUrl);

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
          setUploadError(true);
        }
        setLoader(false);
      }
    });
  };

  const handleRemoveImage = async (index: number) => {
    if (profileImages.length === 0) {
      try {
        launchImageLibrary({mediaType: 'photo'}, async response => {
          if (!response?.didCancel && !response?.errorMessage) {
            if (response?.assets && response.assets.length > 0) {
              try {
                const asset = response.assets[0];
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

                setProfileImages([uploadedImageUrl]);
                setUploadError(false);
              } catch (error) {
                console.error('Error uploading image:', error);
                setUploadError(true);
              }
            } else {
              setUploadError(true);
            }
          }
        });
      } catch (error) {
        console.error('Error handling image removal:', error);
      }
    } else {
      const updatedImages = [...profileImages];
      updatedImages?.splice(index, 1);
      setProfileImages(updatedImages);
      setUploadError(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add Photos</Text>
      <Text style={styles.paragraphText}>
        Pick Some photos for your profile
      </Text>
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
              <Image
                source={require('../../../assets/images/Plus.png')}
                style={{width: 28, height: 28}}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {errors && (
        <Text
          style={{
            color: 'red',
            textAlign: 'center',
            fontFamily: 'Sansation_Regular',
            marginTop: 30,
          }}>
          Please select any picture or select from gallery.
        </Text>
      )}
      {loader ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  containerdm: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  imageContainerdm: {
    borderRadius: 14,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderStyle: 'dashed',
    backgroundColor: '#E0E0E0',
    position: 'relative',
    width: 90,
    height: 90,
    marginHorizontal: 3,
  },
  dummyImagedm: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  addRemoveButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
    marginTop: 10,
    textAlign: 'center',
  },
  paragraphText: {
    fontFamily: 'Sansation-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
    marginVertical: 10,
  },
});

export default SeventhStepScreen;
