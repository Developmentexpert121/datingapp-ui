// import { View, Text, Alert, StyleSheet, Linking } from "react-native";
// import React, { useState } from "react";
// import Label from "../Label";
// // import CustomButton from "../customBotton";
// // import { light } from "../../Theme";
// import VersionCheck from "react-native-version-check";
// import Modal from "react-native-modal";
// import MainButton from "../ButtonComponent/MainButton";
// // interface LoginFailModalProps {
// //   onPress?: () => void | undefined;
// //   onCancel?:()=>void;
// //   visible:boolean
// // }
// const AppUpdateModal = () => {
//   const [visible, setVisible] = useState<boolean>(false);
//   const [storeUrl, setstoreUrl] = useState<string>("");
//   VersionCheck.needUpdate().then(async (res) => {
//     console.log(res.isNeeded); // true
//     if (res.isNeeded) {
//       setstoreUrl(res.storeUrl);
//       setVisible(true);
//       //   Linking.openURL(res.storeUrl);  // open store if update is needed.
//     }
//   });

//   return (
//     <Modal
//       style={{ backgroundColor: "transparent",margin:0 }}
//       animationIn="slideInDown"
//       isVisible={visible}
//     >
//       <View style={styles.modal}>
//         <View style={styles.modalstyle}>
//           {/* <Label
//             text={"Exit App"}
//             style={styles.textstyle}
//           /> */}
//           <Label
//             text={`New version available\n\nPlease!, we request you to Upgrade to the Latest version of us`}
//             style={styles.bodyText}
//           />

//           <MainButton
//             style={{ width: "85%", marginTop: 15 }}
//             label={"Update Now"}
//             onPress={() => {
//               storeUrl && Linking.openURL(storeUrl || "");
//             }}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default AppUpdateModal;

// const styles = StyleSheet.create({
//   textstyle: {
//     // width: "50%",
//     fontSize: 18,
//     // fontWeight: "400",
//     lineHeight: 36,
//     color: "#071731",
//     textAlign: "center",
//   },
//   bodyText: {
//     // width: "50%",
//     fontSize: 18,
//     marginHorizontal: 30,
//     // fontWeight: "400",
//     // lineHeight: 36,
//     color: "#071731",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   modalstyle: {
//     // height: 230,
//     width: "90%",
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modal: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
