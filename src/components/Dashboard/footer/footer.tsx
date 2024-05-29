// import React, {useEffect, useState} from 'react';
// import {View, StyleSheet, Pressable, SafeAreaView, Text} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {useAppDispatch, useAppSelector} from '../../../store/store';
// import {footerStatus} from '../../../store/Activity/activity';
// import {getReceivers} from '../../../store/Auth/auth';
// import {
//   ChatIC,
//   ChatpressIC,
//   FindIC,
//   FindpressIc,
//   FireIC,
//   FirepressIC,
//   LoveIC,
//   LovepressIC,
//   ProfileIC,
//   ProfilepressIC,
// } from '../../../assets/svgs';
// interface Receiver {
//   senderMessages: any[]; // Assuming senderMessages is an array of any type
//   // Define other properties if they exist in your receiver data
// }
// const FooterComponent = () => {
//   const [receiverData, setReceiverData] = useState<Receiver[]>([]);
//   const [totalSenderMessages, setTotalSenderMessages] = useState(undefined);
//   const dispatch: any = useAppDispatch();
//   const activeScreen = useAppSelector(
//     (state: any) => state.ActivityLoader.footerStatus,
//   );
//   const profileData: any = useAppSelector(
//     (state: any) => state?.Auth?.data?.profileData,
//   );
//   const navigation = useNavigation();
//   const color = '#b5b5b5';
//   // const color = "#BB2CBB"
//   //   const activeColor = '#F76C6B';
//   const activeColor = '#BB2CBB';
//   const handleView = (route: any, icon: any) => {
//     //setActiveScreen(icon);
//     dispatch(footerStatus({footerStatus: icon}));
//     navigation.navigate(route);
//   };
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await dispatch(
//           getReceivers({senderId: profileData?._id}),
//         ).unwrap();
//         setReceiverData(response.receivers);
//       } catch (error) {
//         console.error('eeeeee', error);
//       }
//     };

//     const calculateTotalSenderMessages = () => {
//       let total: any = receiverData.forEach(receiver => {
//         total += receiver.senderMessages?.length;
//       });
//       setTotalSenderMessages(total);
//     };
//     const intervalId = setInterval(() => {
//       fetchData();
//       calculateTotalSenderMessages();
//     }, 5000); // Poll every 5 seconds

//     fetchData(); // Fetch data immediately on component mount
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <SafeAreaView style={styles.root}>
//       <View style={styles.horizontalLine}></View>
//       <View style={styles.pageContainer}>
//         <View style={styles.topNavigation}>
//           <Pressable
//             onPress={() => handleView('Home', 'HOME')}
//             style={styles.iconView}>
//             <View style={{alignItems: 'flex-end'}}>
//               <Text style={{top: 5}}></Text>
//               {activeScreen === 'HOME' ? <FirepressIC /> : <FireIC />}
//             </View>
//           </Pressable>
//           <Pressable
//             onPress={() => handleView('Explore', 'EXPLORED')}
//             style={styles.iconView}>
//             <View style={{alignItems: 'flex-end'}}>
//               <Text style={{top: 5}}></Text>
//               {activeScreen === 'EXPLORED' ? <FindpressIc /> : <FindIC />}
//             </View>
//           </Pressable>
//           <Pressable
//             onPress={() => handleView('Liked', 'LIKED')}
//             style={styles.iconView}>
//             <View style={{alignItems: 'flex-end'}}>
//               <Text style={{top: 5}}></Text>
//               {activeScreen === 'LIKED' ? <LovepressIC /> : <LoveIC />}
//             </View>
//           </Pressable>
//           <Pressable
//             onPress={() => handleView('ChatScreen', 'CHAT')}
//             style={styles.iconView}>
//             <View style={{alignItems: 'flex-end'}}>
//               <Text style={{top: 8, color: '#AC25AC'}}>
//                 {totalSenderMessages}
//               </Text>
//               {activeScreen === 'CHAT' ? <ChatpressIC /> : <ChatIC />}
//             </View>
//           </Pressable>

//           <Pressable
//             onPress={() => handleView('Profile', 'PROFILE')}
//             style={styles.iconView}>
//             <View style={{alignItems: 'flex-end'}}>
//               <Text style={{top: 5}}>{}</Text>
//               {activeScreen === 'PROFILE' ? <ProfilepressIC /> : <ProfileIC />}
//             </View>
//           </Pressable>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     justifyContent: 'center',
//     height: 80,
//     // borderWidth: 1,
//   },
//   pageContainer: {},
//   topNavigation: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     // alignItems: 'center',
//     width: '100%',
//     height: 70,
//     padding: 10,
//     borderWidth: 0,
//     marginBottom: 10,
//   },
//   icon: {
//     width: 30,
//     height: 30,
//   },
//   horizontalLine: {
//     height: 2,
//     backgroundColor: '#AC25AC',
//   },
//   iconView: {
//     height: '100%',
//     width: 'auto',
//     borderWidth: 0,
//     justifyContent: 'center',
//   },
// });

// export default FooterComponent;
