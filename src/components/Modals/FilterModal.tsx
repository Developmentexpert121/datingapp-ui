// import { Pressable, StyleSheet, Text, View } from "react-native";
// import React, { useState } from "react";
// import Modal from "react-native-modal";
// // import CustomButton from "../customBotton";
// import Label from "../Label";
// import { ms } from "react-native-size-matters";
// // import { light } from "../../Theme";
// // import { sortState } from "../../utils/appConsts";
// import MainButton from "../ButtonComponent/MainButton";
// interface IFilterProps {
//   isVisible: boolean;
//   onApply?: (e: string) => void | undefined;
//   onCancel?: () => void;
// }
// const FilterModal = ({ isVisible, onApply, onCancel }: IFilterProps) => {
//   const filters = [
//     { label: "Default", value: sortState.DEFAULT },
//     { label: "Latest Properties", value: sortState.LATEST },
//     { label: "From A-Z Properties", value: sortState.ASC },
//     { label: "From Z-A Properties", value: sortState.DESC },
//   ];
//   const [selectedSort, setselectedSort] = useState<string>(filters[0].value);
//   const Radio = ({ checked }: { checked: boolean }) => (
//     <View style={styles.outerRadio}>
//       {checked ? <View style={styles.radio} /> : null}
//     </View>
//   );
//   return (
//     <Modal isVisible={isVisible} onBackdropPress={onCancel}>
//       <View style={styles.container}>
//         <Label
//           text="Sort Property List"
//           style={{
//             textAlign: "center",
//             fontSize: ms(18),
//             fontFamily: "Inter-Medium",
//           }}
//         />
//         <View style={styles.body}>
//           {filters.map((val, ind) => {
//             return (
//               <Pressable
//                 onPress={() => setselectedSort(val.value)}
//                 style={styles.radioWrap}
//               >
//                 <Radio checked={val.value === selectedSort} />
//                 <Label text={val.label} style={styles.label} />
//               </Pressable>
//             );
//           })}
//         </View>
//         <View style={styles.buttonsContainer}>
//           <MainButton
//             label="Close"
//             style={styles.button}
//             onPress={onCancel}
//           />
//           <MainButton
//             label="Apply"
//             style={styles.button}
//             onPress={() => {
//               onApply && onApply(selectedSort);
//               onCancel && onCancel();
//             }}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default FilterModal;

// const styles = StyleSheet.create({
//   body: {
//     marginVertical: 15,
//     marginTop: 20,
//   },
//   button: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   label: {
//     marginLeft: ms(10),
//   },
//   radioWrap: {
//     flexDirection: "row",
//     marginVertical: 5,
//   },
//   container: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//   },
//   radio: {
//     height: 10,
//     width: 10,
//     borderRadius: 10 / 2,
//     backgroundColor: light.colors.primary,
//     // padding: 3,
//     borderColor: light.colors.primary,
//   },
//   outerRadio: {
//     height: 18,
//     width: 18,
//     borderRadius: 18 / 2,
//     // backgroundColor: light.colors.primary,
//     // padding: 3,
//     borderColor: light.colors.primary,
//     borderWidth: 0.8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
