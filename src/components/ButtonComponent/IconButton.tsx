import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import React, {useState} from 'react';
// import { light } from "../../Theme";

interface Iprops {
  icon: any;
  backgroundColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}
const IconButton = ({
  icon,
  // backgroundColor = light.colors.background,
  style,
  onPress,
  disabled,
}: Iprops) => {
  const [disable, setdisable] = useState<boolean>(false);

  const _onPress = () => {
    setdisable(true);
    onPress && onPress();
    setTimeout(() => {
      setdisable(false);
    }, 500);
  };
  return (
    <Pressable
      disabled={disabled || disable}
      onPress={_onPress}
      style={[styles.container, style]}>
      {icon}
    </Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});
