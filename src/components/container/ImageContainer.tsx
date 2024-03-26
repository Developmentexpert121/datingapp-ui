// import {
//   Dimensions,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleProp,
//   StyleSheet,
//   Text,
//   TextStyle,
//   View,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Alert,
// } from "react-native";
// import React from "react";
// import { light } from "../../Theme";
// import Label from "../Label";
// import { Back1WhiteIC } from "../../assets/svgs";
// import { useNavigation } from "@react-navigation/native";

// interface Iprops {
//   children?: any;
//   isScroll?: boolean;
//   bgImage?: any;
//   title?: string;
//   subTitle?: string;
//   customsubTitleStyle?: StyleProp<TextStyle>;
// }
// function ImageContainer({
//   children,
//   isScroll,
//   title,
//   subTitle,
//   customsubTitleStyle,
// }: Iprops) {
//   const bgColor = light.colors?.primary;
//   const navigation = useNavigation();
//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar barStyle={"dark-content"} />
//       <View style={{ ...styles.container, backgroundColor: bgColor }}>
//         <View>
//           <Image
//             // source={require("../../assets/images/newBG.png")}
//             resizeMode="contain"
//             style={styles.image}
//           />

//           <Pressable
//             style={{ marginTop: 40, marginLeft: 10 }}
//             onPress={() => navigation.goBack()}
//           >
//             <Back1WhiteIC style={{ height: 20, width: 20 }} />
//           </Pressable>
//         </View>
//         <View style={styles.innerContainer}>
//           <View style={{ alignItems: "center" }}>
//             <Label
//               text={title}
//               fontFamily="Inter-Medium"
//               style={{
//                 fontSize: 26,
//                 marginVertical: 10,
//                 color: light.colors.titaltext,
//               }}
//             />
//             <Label
//               text={subTitle}
//               style={[styles.subTitleStyle, customsubTitleStyle]}
//             />
//           </View>
//           {isScroll ? (
//             <KeyboardAvoidingView
//               style={{ ...styles.container }}
//               behavior={Platform.OS === "ios" ? "padding" : undefined}
//               enabled
//             >
//               <ScrollView
//                 style={{ flexGrow: 1 }}
//                 keyboardShouldPersistTaps="always"
//                 showsVerticalScrollIndicator={false}
                
//               >
//                 {children}
//               </ScrollView>
//             </KeyboardAvoidingView>
//           ) : (
//             children
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// export default ImageContainer;
// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//   },
//   innerContainer: {
//     flex: 1,
//     backgroundColor: light.colors.white,
//     marginTop: 90,
//     borderTopLeftRadius: 35,
//     borderTopRightRadius: 35,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   image: {
//     // backgroundColor:"red",
//     position: "absolute",
//     opacity: 0.7,
//     // width:100
//     // width: Dimensions.get("screen").width,
//     // height: 300,
//     // top:-Dimensions.get("screen").height+200,
//     // bottom:100
//   },
//   subTitleStyle: {
//     marginBottom: 20,
//     color: "#4B4B4B",
//     fontSize: 14,
//   },
// });
