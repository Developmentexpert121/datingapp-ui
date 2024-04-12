import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  Platform,
} from "react-native";
import React from "react";
// import { Back1Ic, BackIc, BackWhiteIc, BoxBackIc } from "../../assets/svgs";
import Label from "../Label";
// import { light } from "../../Theme";
import { useNavigation } from "@react-navigation/native";
// import IconButton from "../customBotton/IconButton";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import IconButton from "../ButtonComponent/IconButton";
import { ChevronLeftIC } from "../../assets/svgs";
type Iprops = {
  label?: string;
  onPress?: () => void;
  RightIcon?: React.FunctionComponent<any>;
  leftIconBGColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
};
const CustomHeader = ({
  label,
  onPress,
  RightIcon,
  leftIconBGColor,
  containerStyle,
}: Iprops) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, containerStyle]}>
      <IconButton
        onPress={() => navigation.goBack()}
        icon={<ChevronLeftIC />}
        backgroundColor={leftIconBGColor}
      />
      <Label text={label} style={styles.text} />
      <View
        style={{
          height: 40,
          width: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {RightIcon && <RightIcon />}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: Platform.OS == "android" ? 45 : 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderWidth: 1,
  },
  label: { flex: 1, alignItems: "center" },
  button: {
    height: 40,
    width: 40,
    // backgroundColor: light.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  text: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
  },
});
