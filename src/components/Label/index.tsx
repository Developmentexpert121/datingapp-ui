import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import React from "react";
// import { light } from "../../Theme";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface Iprops {
  text?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  icon?: JSX.Element;
  opacity?: any;
  numberOfLines?: number | undefined;
  fontFamily?: string;
  boxStyle?: StyleProp<ViewStyle>;
}

const Label = ({
  text,
  style,
  onPress,
  opacity,
  numberOfLines,
  // fontFamily = "Inter-Regular",
}: Iprops) => {
  // const { colors } = light;
  return (
    <Text
      onPress={onPress}
      style={[styles.text,  style]}
      numberOfLines={numberOfLines}
    >
      {text}
    </Text>
  );
};
export default Label;
const styles = StyleSheet.create({
  text: {
    fontSize: moderateScale(16),
    // textAlign: 'center',
    fontFamily: "Sansation-Regular",
    // color:light.colors.text
  },
});
