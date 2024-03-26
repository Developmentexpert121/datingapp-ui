import { View, Text, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import Label from "../Label";
// import CustomButton from "../customBotton";

// import { light } from "../../Theme";
import Modal from "react-native-modal";
import MainButton from "../ButtonComponent/MainButton";
interface LoginFailModalProps {
  onPress?: () => void | undefined;
  onCancel?: () => void;
  visible: boolean;
  onDismiss?: () => void;
}
const AppExitModal = ({
  onPress,
  onCancel,
  visible,
  onDismiss,
}: LoginFailModalProps) => {
  // const route = useRoute<any>();
  // console.log(route?.name);

  // console.log({routeName});

  return (
    <Modal
      style={{ backgroundColor: "transparent",margin:0 }}
      animationIn={"slideInDown"}
      isVisible={visible}
    >
      <View style={styles.modal}>
        <View style={styles.modalstyle}>
          {/* <Label
            text={"Exit App"}
            style={styles.textstyle}
          /> */}
          <Label
            text={"Are you sure want to exit the App?"}
            style={styles.bodyText}
          />

          <MainButton
            style={{ width: "85%", marginTop: 15 }}
            label={"Cancel"}
            onPress={() => {
              onCancel && onCancel();
            }}
          />
          <MainButton
            style={{
              width: "85%",
              marginTop: 0,
              // backgroundColor: light.colors.cancel,
              marginBottom: 15,
            }}
            label={"Exit App"}
            onPress={() => {
              onPress && onPress();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AppExitModal;
const styles = StyleSheet.create({
  textstyle: {
    // width: "50%",
    fontSize: 18,
    // fontWeight: "400",
    lineHeight: 36,
    color: "#071731",
    textAlign: "center",
  },
  bodyText: {
    // width: "50%",
    fontSize: 18,
    marginHorizontal: 30,
    // fontWeight: "400",
    // lineHeight: 36,
    color: "#071731",
    textAlign: "center",
    marginTop: 20,
  },
  modalstyle: {
    // height: 230,
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
