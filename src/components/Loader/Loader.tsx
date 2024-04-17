import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
interface LoaderProps {
  color?: string | undefined;
}
const Loader = ({ color }: LoaderProps) => {
  return (
    <TouchableOpacity
      disabled
      activeOpacity={1}
      style={{
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: "center",
        backgroundColor: color ?? "#FFFFFF22",
      }}
    >
      <LottieView
        source={require("../../assets/loaderFile/loaderGif.json")}
        style={{
          width: 50,
          height: 50,
          alignSelf: "center",
        }}
        autoPlay
      />
    </TouchableOpacity>
  );
};

export default Loader;

const styles = StyleSheet.create({});
