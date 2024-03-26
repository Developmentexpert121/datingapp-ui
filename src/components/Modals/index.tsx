import { View, Text, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import Label from "../Label";
// import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";

import Modal from "react-native-modal";
import MainButton from "../ButtonComponent/MainButton";
import { useAppDispatch } from "../../store/store";
interface LoginFailModalProps {
  label?: string | undefined;
  onPress?: () => void | undefined;
  text?: string | undefined;
}
const LoginFailModal = ({ label, onPress, text }: LoginFailModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useAppDispatch();

  return (
    <Modal
      animationIn={"slideInDown"}
      isVisible={false}
      style={{ backgroundColor: "transparent", margin: 0 }}
    >
      <View style={styles.modal}>
        <View style={styles.modalstyle}>
          <Label
            text={label ?? "Login Failed, Please try again"}
            style={styles.textstyle}
          />

          <MainButton
            style={{ width: "85%", marginTop: 30 }}
            label={text ?? "Sign In Again"}
            onPress={() => {
              onPress && onPress();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoginFailModal;
const styles = StyleSheet.create({
  textstyle: {
    width: "50%",
    fontSize: 18,
    // fontWeight: "400",
    lineHeight: 36,
    color: "#071731",
    textAlign: "center",
  },
  modalstyle: {
    height: 230,
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
    backgroundColor: "#00000066",
  },
});
