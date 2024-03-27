// import {
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   // ScrollView,
//   StatusBar,
//   StyleProp,
//   StyleSheet,
//   Text,
//   View,
//   ViewStyle,
// } from "react-native";
// import React from "react";
// import withTheme from "../../Theme/withTheme";
// import { light } from "../../Theme";
// import { ScrollView } from "react-native-virtualized-view";
// import { findScrollEnd } from "../../utils/helper";
// interface Iprops {
//   children?: any;
//   isScroll?: boolean;
//   color?: string;
//   customContainerStyle?: StyleProp<ViewStyle>;
//   innerContainerStyle?: StyleProp<ViewStyle>;
//   onScrollEnd?: ((e: boolean) => void) | undefined;
// }
// function Container({
//   children,
//   isScroll,
//   color,
//   innerContainerStyle,
//   customContainerStyle,
//   onScrollEnd,
// }: Iprops) {
//   const bgColor = light.colors?.white;
//   return (
//     <View
//       style={[
//         styles.container,
//         { backgroundColor: color ? color : bgColor, paddingHorizontal: 15 },
//         customContainerStyle,
//       ]}
//     >
//       <StatusBar barStyle={"dark-content"} />
//       <View
//         style={[
//           styles.container,
//           ,
//           { backgroundColor: color ? color : bgColor },
//           innerContainerStyle,
//         ]}
//       >
//         {isScroll ? (
//           <KeyboardAvoidingView
//             style={[
//               styles.container,
//               ,
//               { backgroundColor: color ? color : bgColor },
//               innerContainerStyle,
//             ]}
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//             enabled
//           >
//             <ScrollView
//               style={{ flexGrow: 1 }}
//               nestedScrollEnabled
//               showsVerticalScrollIndicator={false}
//               onMomentumScrollEnd={({ nativeEvent }) =>
//                 onScrollEnd && onScrollEnd(findScrollEnd(nativeEvent))
//               }
//             >
//               {children}
//             </ScrollView>
//           </KeyboardAvoidingView>
//         ) : (
//           children
//         )}
//       </View>
//     </View>
//   );
// }

// export default Container;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
