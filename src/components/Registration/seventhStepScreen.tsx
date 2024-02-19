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
import axios from 'axios';
import http from '../../services/http/http-common';
import {useAppDispatch} from '../../store/store';
import {UploadImage} from '../../store/Auth/auth';
const DummyProfileImages = [
  {uri: require('../../assets/images/screenImage1.png'), id: 'image1'},
  {uri: require('../../assets/images/screenImage2.png'), id: 'image2'},
  {uri: require('../../assets/images/screenImage1.png'), id: 'image3'},
  {uri: require('../../assets/images/screenImage2.png'), id: 'image4'},
  {uri: require('../../assets/images/screenImage1.png'), id: 'image5'},
  {uri: require('../../assets/images/screenImage2.png'), id: 'image6'},
];
const SeventhStepScreen = ({
  uploadError,
  setUploadError,
  selectedImage,
  setSelectedImage,
  title,
  profileImage,
  setProfileImage,
}: any) => {
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);
  const dispatch: any = useAppDispatch();
  console.log('selectedImageselectedImage          ', selectedImage);
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

  const openImagePicker = () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log('response===================== ', response);
        setDoc(response?.assets);
        console.log(
          '=============--------------======================',
          imageUri,
        );
        setSelectedImage({uri: imageUri});
        setUploadError(false);
      }
    });
  };

  const handleSelectImage = async () => {
    setUploadError(false);
    try {
      const formData: any = new FormData();
      if (doc === null) {
        console.log('docccccccccccc ', doc);
        formData.append('file', {
          name: 'screenImage2.png',
          fileName: 'screenImage2.png',
          type: 'image/png',
          uri: Image.resolveAssetSource(selectedImage).uri,
        });
        console.log('formdata', formData._parts);
        dispatch(UploadImage(formData))
          .unwrap()
          .then((res: any) => {
            console.log('res+++++++++', res);
            setProfileImage(res.imageUrl);
          });
      } else {
        formData.append('file', {
          name: doc?.[0]?.fileName,
          fileName: doc?.[0]?.fileName,
          type: doc?.[0]?.type,
          uri: doc?.[0]?.uri,
        });

        dispatch(UploadImage(formData))
          .unwrap()
          .then((res: any) => {
            console.log('res+++++++++', res);
            setProfileImage(res.imageUrl);
          });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <Image source={selectedImage} style={styles.selectedImage} />
      ) : (
        <View style={styles.containerdm}>
          {DummyProfileImages.map((item, index) => (
            <TouchableOpacity
              onPress={() => (
                setSelectedImage(item.uri),
                setUploadError(false),
                console.log('item ', item)
              )}
              style={styles.imageContainerdm}
              key={index}>
              <Image source={item.uri} style={styles.dummyImagedm} />
              <View style={styles.addRemoveButton}>
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
      )}
      <View
        style={{
          flexDirection: 'row',
          columnGap: 10,
          marginBottom: 16,
          marginTop: 20,
        }}>
        <TouchableOpacity onPress={openImagePicker} style={styles.uploadButton}>
          <Text style={styles.buttonText}>
            {selectedImage ? 'Change Image' : 'Select from gallary'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSelectImage}
          style={styles.selectButton}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
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
  selectedImage: {
    width: 98,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  dummyImage: {
    width: 98,
    height: 150,
    borderRadius: 5,
  },
  imageContainer: {
    margin: 5,
    flexDirection: 'row',
  },
  uploadButton: {
    backgroundColor: '#AC25AC',
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Sansation_Regular',
  },

  containerdm: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjust as needed
    rowGap: 20,
    position: 'relative',
  },
  imageContainerdm: {
    borderWidth: 2,
    borderRadius: 14,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderStyle: 'dashed',
    backgroundColor: '#E0E0E0',
  },
  dummyImagedm: {
    width: 98,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 14,
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
