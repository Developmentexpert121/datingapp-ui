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
const DummyProfileImages = [
  require('../../assets/images/screenImage1.png'),
  require('../../assets/images/screenImage2.png'),
  require('../../assets/images/screenImage1.png'),
  require('../../assets/images/screenImage2.png'),
  '',
  '',
  // require('../../assets/images/screenImage1.png'),
  // require('../../assets/images/screenImage2.png'),
  // require('../../assets/images/screenImage1.png'),
];
const SeventhStepScreen = ({
  uploadError,
  setUploadError,
  selectedImage,
  setSelectedImage,
  title,
}: any) => {
  const [uploadferImage, setUploadedImage] = useState<any>();

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
        console.log(
          '=============--------------======================',
          imageUri,
        );
        setSelectedImage({uri: imageUri});
        setUploadError(false);
      }
    });
  };

  // const openImagePicker = () => {
  //   const options = {
  //     title: 'Select Image',
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };

  //   ImagePicker?.showImagePicker(options, (response:any) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else {
  //       const source:any = { uri: response.uri };
  //       setSelectedImage(source);
  //     }
  //   });
  // };

  const handleSelectImage = () => {
    // Handle the selection logic based on the selectedImage state
    if (selectedImage) {
      // Handle the case where an image is selected
      // You can upload the selected image here
      const formData = new FormData();
      // formData.append('image', {
      //   uri: imageUri,
      //   type: 'image/jpeg', // Change the type if necessary
      //   name: 'image.jpg', // Change the name if necessary
      // });

      // const response = await axios.post('http://your-server-url/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      console.log('Image selected:', selectedImage);
    } else {
      // Handle the case where no image is selected
      console.log('No image selected');
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
              onPress={() => (setSelectedImage(item), setUploadError(false))}
              style={styles.imageContainerdm}
              key={index}>
              <Image source={item} style={styles.dummyImagedm} />
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
