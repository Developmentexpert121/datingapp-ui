import React from 'react';
import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import  {launchImageLibrary} from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import axios from 'axios';
import http from '../../services/http/http-common';
import { useAppDispatch } from '../../store/store';
import { UploadImage } from '../../store/Auth/auth';
const DummyProfileImages = [
  { uri: require('../../assets/images/screenImage1.png'), id: 'image1' },
  { uri: require('../../assets/images/screenImage2.png'), id: 'image2' },
  { uri: require('../../assets/images/screenImage1.png'), id: 'image3' },
  { uri: require('../../assets/images/screenImage2.png'), id: 'image4' },
  { uri: require('../../assets/images/screenImage1.png'), id: 'image5' },
  { uri: require('../../assets/images/screenImage2.png'), id: 'image6' },
  ];
const SeventhStepScreen = ({uploadError, setUploadError, selectedImage, setSelectedImage, title, profileImage, setProfileImage}:any) => {
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);
  const dispatch:any = useAppDispatch();
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
    const options:any = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response:any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log('response===================== ', response);
        setDoc(response?.assets)
        console.log('=============--------------======================', imageUri)
        setSelectedImage({ uri: imageUri });
        setUploadError(false);
      }
    });
  };

  const handleSelectImage = async () => {
    setUploadError(false);
    try {
      const formData:any = new FormData();
      if(doc===null){
        console.log("docccccccccccc ", doc);
        formData.append('file', {
          name: 'screenImage2.png',
          fileName: 'screenImage2.png',
          type: 'image/png',
          uri: Image.resolveAssetSource(selectedImage).uri
        });
        console.log("formdata", formData._parts);
        dispatch(UploadImage(formData)).unwrap().then((res:any)=>{
          console.log("res+++++++++", res);
          setProfileImage(res.imageUrl);
        })
      }else{
        formData.append('file', {
          name: doc?.[0]?.fileName,
          fileName: doc?.[0]?.fileName,
          type: doc?.[0]?.type,
          uri: doc?.[0]?.uri,
        });
  
        dispatch(UploadImage(formData)).unwrap().then((res:any)=>{
          console.log("res+++++++++", res);
          setProfileImage(res.imageUrl);
        })
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  return (<View style={styles.container}>
    <Text style={{marginBottom:5}}>Choose {title ?? ''} profile or upload from gallary</Text>
    {selectedImage ? (
      <Image source={selectedImage} style={styles.selectedImage} />
    ) :
    (
      <View style={styles.containerdm}>
      {DummyProfileImages.map((item, index) => (
        <TouchableOpacity onPress={() => (setSelectedImage(item.uri), setUploadError(false), console.log('item ', item))} style={styles.imageContainerdm} key={index}>
          <Image source={item.uri} style={styles.dummyImagedm} />
        </TouchableOpacity>
      ))}
    </View>
        
    )
    }
    <TouchableOpacity onPress={openImagePicker} style={styles.uploadButton}>
      <Text style={styles.buttonText}>{selectedImage ? 'Change Image' : 'Select from gallary'}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleSelectImage} style={styles.selectButton}>
      <Text style={styles.buttonText}>Upload</Text>
    </TouchableOpacity>
    {uploadError && <Text style={{color:'red'}}>plz select any profile or select from gallery</Text>}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  dummyImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  imageContainer: {
    margin: 5,
    flexDirection: 'row'
  },
  uploadButton: {
    backgroundColor: '#BB2CBB',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },

  containerdm: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjust as needed
  },
  imageContainerdm: {
    marginBottom: 10, // Adjust spacing between rows
  },
  dummyImagedm: {
    width: 100, // Adjust image width as needed
    height: 100, // Adjust image height as needed
    resizeMode: 'cover',
    borderRadius: 15, //
  },
});


export default SeventhStepScreen;
