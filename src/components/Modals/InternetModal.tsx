import {
  View,
  Text,
  // Modal,
  Alert,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Label from "../Label";
import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";
import Modal from "react-native-modal";
interface LoginFailModalProps {
  label?: string | undefined;
  onPress?: () => void | undefined;
  text?: string | undefined;
}
const InternetModal: React.FC = ({
  label,
  onPress,
  text,
}: LoginFailModalProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isConnected, setConnected] = useState<boolean>(true);

  const handleConnectivityChange = (connectionInfo: any) => {
    const isConnectedNow = connectionInfo.isConnected;
    setConnected(isConnectedNow);

    if (!isConnectedNow) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    setConnected(true);
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View>
      {isConnected ? null : (
        <Modal
          animationIn={"slideInDown"}
          isVisible={modalVisible}
          style={{ margin: 0 }}
          onBackButtonPress={() => {}}
        >
          <View style={styles.modal}>
            <View style={styles.modalstyle}>
              <Label text={label ?? "Oops!!!"} style={styles.textstyle} />
              <Image source={require("../../assets/git/noInternet.gif")} />
              <Label
                text={label ?? "No Internet Connection"}
                style={styles.textstyle}
              />

              {/* <CustomButton
                style={{ width: "85%", marginTop: 30 }}
                label={text ?? "Ok"}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              /> */}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default InternetModal;
const styles = StyleSheet.create({
  textstyle: {
    width: "70%",
    fontSize: 18,
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
