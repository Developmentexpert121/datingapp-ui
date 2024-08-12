// import React, {useState} from 'react';
// import {Modal, Platform, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
// import TouchableImage from '../touchableImage';
// import {appImages} from '../../utils/appImages';
// import {uploadDocFile} from '../../helper/globalFunctions';
// import MediaPicker from '../imagePicker';

// interface Option {
//   img: string;
//   text: string;
//   onPress: () => Promise<void> | void;
// }

// interface Props {
//   handleImageSelect: () => void;
//   handleAudio: (audio: any) => void;
//   handleDoc: (doc: any) => void;
// }

// const MediaOption: React.FC<{options: Option[]}> = ({options}) => (
//   <View style={styles.optionsContainer}>
//     {options.map((item, index) => (
//       <View key={index} style={styles.padding}>
//         <TouchableImage
//           style={styles.option}
//           source={item.img}
//           onPress={item.onPress}
//           text={item.text}
//           textStyle={styles.textStyle}
//         />
//       </View>
//     ))}
//   </View>
// );

// const Media: React.FC<Props> = ({
//   handleImageSelect,
//   handleAudio,
//   handleDoc,
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const handleImagePress = () => setModalVisible(!modalVisible);
//   const onClose = () => setModalVisible(false);

//   return (
//     <>
//       <Modal
//         onRequestClose={onClose}
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         statusBarTranslucent={true}>
//         <TouchableWithoutFeedback onPress={onClose}>
//           <View style={styles.modalContainer}>
//             <MediaOption
//               options={[
//                 {
//                   img: appImages.document,
//                   text: 'Document',
//                   onPress: async () => {
//                     onClose();
//                     const selectedFile = await uploadDocFile('image_PDF_DOC');
//                     handleDoc(selectedFile);
//                   },
//                 },
//                 {
//                   img: appImages.cam,
//                   text: 'Camera',
//                   onPress: () => {
//                     onClose();
//                     MediaPicker.openImagePicker();
//                   },
//                 },
//                 {
//                   img: appImages.gallery,
//                   text: 'Gallery',
//                   onPress: () => {
//                     onClose();
//                     MediaPicker.openMediaSelection();
//                   },
//                 },
//                 {
//                   img: appImages.audio,
//                   text: 'Audio',
//                   onPress: async () => {
//                     onClose();
//                     const selectedAudio = await uploadDocFile('audio');
//                     handleAudio(selectedAudio);
//                   },
//                 },
//                 {
//                   img: appImages.location,
//                   text: 'Location',
//                   onPress: () => {
//
//                   },
//                 },

//                 {
//                   img: appImages.payment,
//                   text: 'Payment',
//                   onPress: () => {
//
//                   },
//                 },
//                 {
//                   img: appImages.contact,
//                   text: 'Contact',
//                   onPress: () => {
//
//                   },
//                 },
//                 {
//                   img: appImages.poll,
//                   text: 'Poll',
//                   onPress: () => {
//
//                   },
//                 },
//               ]}
//             />
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//       <MediaPicker onImageSelect={handleImageSelect} />
//       <TouchableImage onPress={handleImagePress} source={appImages.media} />
//     </>
//   );
// };

// export default Media;
// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     position: 'relative',
//     zIndex: 9999,
//     paddingBottom: Platform.OS === 'android' ? sh(8.5) : sh(13),
//   },
//   optionsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     width: '92%',
//     borderRadius: 30,
//     backgroundColor: "#fff",
//     alignItems: 'center',
//     padding: 10,
//   },
//   option: {
//     flexWrap: 'wrap',
//     height: 45,
//     width: 80,
//   },
//   padding: {paddingVertical: 10},
//   textStyle: {width: '100%'},
// });
