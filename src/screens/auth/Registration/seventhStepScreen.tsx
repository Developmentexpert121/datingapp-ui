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
  Alert,
  Linking,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import {useAppDispatch} from '../../../store/store';
import {updateProfileData, uploadImages} from '../../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader/Loader';
import ImageResizer from 'react-native-image-resizer'; // Add this library for image resizing
import ImagePicker from 'react-native-image-crop-picker';

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
  uploadError,
  setUploadError,
}: {
  profileImages: any;
  setProfileImages: any;
  title?: any;
  images?: any;
  control?: any;
  errors?: any;
  uploadError?: any;
  setUploadError?: any;
}) => {
  const [loader, setLoader] = useState<boolean>(false);
  const dispatch: any = useAppDispatch();

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      return await requestAndroidPermissions();
    } else {
      return await requestIOSPermissions();
    }
  };

  // useEffect(() => {
  //   requestPermissions();
  // }, []);

  const requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      console.log(granted);

      if (
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else if (
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        showPermissionAlert();
        return false;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestIOSPermissions = async () => {
    try {
      const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      const photoPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (cameraPermission === 'granted' && photoPermission === 'granted') {
        return true;
      } else {
        showPermissionAlert();
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      'Permissions Required',
      'Please go to your app settings and enable the necessary permissions.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
      ],
      {cancelable: true},
    );
  };

  useEffect(() => {
    if (title !== 'Registration') {
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

  const handleImageSelection = async (index?: number) => {
    const hasPermission: any = await requestPermissions();

    console.log('-----', hasPermission);

    if (!hasPermission) {
      console.warn('Permissions not granted.');
      return;
    }
    try {
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
      });

      if (image) {
        setLoader(true);

        // Resize the image
        const resizedImage = await ImageResizer.createResizedImage(
          image.path,
          800, // new width
          800, // new height
          'JPEG',
          80, // quality
        );

        const formData = new FormData();
        formData.append('image', {
          name: resizedImage.name,
          fileName: resizedImage.name,
          type: image.mime,
          uri: resizedImage.uri,
        });

        const uploadedImageUrl = await dispatch(uploadImages(formData))
          .unwrap()
          .then((response: any) => response.secureUrl);

        if (typeof index === 'number') {
          // Replace the existing image
          const updatedImages = [...profileImages];
          updatedImages[index] = uploadedImageUrl;
          setProfileImages(updatedImages);
        } else {
          // Add a new image
          setProfileImages((prevImages: any) => [
            ...prevImages,
            uploadedImageUrl,
          ]);
        }
        setUploadError(false);
        setLoader(false);
      }
    } catch (error) {
      console.error('Error selecting or cropping image:', error);
      setUploadError(true);
      setLoader(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    if (profileImages.length <= 2) {
      setUploadError(true);
      return;
    }

    const updatedImages = [...profileImages];
    updatedImages.splice(index, 1);
    setProfileImages(updatedImages);
    setUploadError(false);
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
        ].map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              if (item && profileImages.length > 2) {
                handleRemoveImage(index);
              } else if (item && profileImages.length <= 2) {
                handleImageSelection(index);
              } else {
                handleImageSelection();
              }
            }}
            style={[styles.imageContainerdm, !item && {borderWidth: 2}]}
            key={index}>
            {item && <Image source={{uri: item}} style={styles.dummyImagedm} />}
            {profileImages.length < 2 && title === 'Registeration' && !item && (
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
            )}

            {(profileImages.length >= 3 || index >= 2) && (
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
            )}
          </TouchableOpacity>
        ))}
      </View>
      {uploadError && profileImages.length < 2 && (
        <Text style={styles.errorText}>
          Please select a minimum of 2 pictures.
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
    marginHorizontal: 5.1,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontFamily: 'Sansation_Regular',
    marginTop: 30,
  },
});

export default SeventhStepScreen;
