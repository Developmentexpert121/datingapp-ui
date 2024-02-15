import React from 'react';
import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import  {launchImageLibrary} from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import axios from 'axios';
import http from '../../services/http/http-common';
// import screenImage1 from '../../assets/images/screenImage1.png';
const DummyProfileImages = [
    require('../../assets/images/screenImage1.png'),
    require('../../assets/images/screenImage2.png'),
    require('../../assets/images/screenImage1.png'),
    require('../../assets/images/screenImage2.png'),
    require('../../assets/images/screenImage1.png'),
    require('../../assets/images/screenImage2.png'),
    // require('../../assets/images/screenImage1.png'),
    // require('../../assets/images/screenImage2.png'),
    // require('../../assets/images/screenImage1.png'),
  ];
const SeventhStepScreen = ({uploadError, setUploadError, selectedImage, setSelectedImage, title}:any) => {
  const [uploadferImage, setUploadedImage] = useState<any>();
  const [doc, setDoc] = useState<any>(null);

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

  const handleSelectImage2 = async() => {
    // Handle the selection logic based on the selectedImage state
    if (selectedImage) {
      console.log('Image selected:', selectedImage);
      // Handle the case where an image is selected
      // You can upload the selected image here
      //const file = selectedImage?.uri ?? selectedImage;
      const formData = new FormData();
      //formData.append('file', screenImage1);
    // formData.append('file', {
    //   uri: selectedImage,
    //   type: 'image/jpeg', // Change the type if necessary
    //   name: 'image.jpg', // Change the name if necessary
    // });
console.log('ddddddddddddddddddddddddd');
    const response = await axios.post('http://localhost:8000/api/user/upload-pic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
      console.log('response        ', response);
    } else {
      // Handle the case where no image is selected
      console.log('No image selected');
    }
  };

  const handleSelectImage3 = async () => {
    const formData:any = new FormData();
    console.log('selectImage ============ ', doc);
    console.log('doc.uri ', doc?.[0]?.uri);
    console.log('doc.fileName ', doc?.[0]?.fileName);
    console.log('doc.type ', doc?.[0]?.type);
    const decodedFileUri = decodeURIComponent(doc.uri);
    const decodedFileName = decodeURIComponent(doc.fileName);
    //formData.append('file', selectedImage?.uri);
    //Platform.OS === 'ios' ? doc.uri.replace('file://', '') :
    formData.append('file', {
      name: doc?.[0]?.fileName,
      type: doc?.[0]?.type,
      uri:  doc?.[0]?.uri,
    });
    console.log('formDataformDataformData', formData);
    try {
      const response = await http.post('/user/upload-pic',formData);
      console.log('Upload response:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSelectImage = async () => {
    try {
      const formData:any = new FormData();
      formData.append('file', {
        name: doc?.[0]?.fileName,
        type: doc?.[0]?.type,
        uri: doc?.[0]?.uri,
      });
  
      console.log('formData:', formData);
  
      const response = await http.post('/user/upload-pic', formData,{
        headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }}
      );
      console.log('Upload response:', response.data);
      
      // Handle success (if needed)
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error (if needed)
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
        <TouchableOpacity onPress={() => (setSelectedImage(item), setUploadError(false))} style={styles.imageContainerdm} key={index}>
          <Image source={item} style={styles.dummyImagedm} />
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
