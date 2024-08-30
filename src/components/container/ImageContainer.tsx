import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native';
import React from 'react';
import Label from '../Label';
import {useNavigation} from '@react-navigation/native';
import {BackIC} from '../../assets/svgs';

interface Iprops {
  children?: any;
  isScroll?: boolean;
  bgImage?: any;
  title?: string;
  subTitle?: string;
  customsubTitleStyle?: StyleProp<TextStyle>;
}
function ImageContainer({
  children,
  isScroll,
  title,
  subTitle,
  customsubTitleStyle,
}: Iprops) {
  const bgColor = '#FFC7FF';
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{...styles.container, backgroundColor: bgColor}}>
        <View style={{borderWidth: 0}}>
          <Image
            source={require('../../assets/images/login_Image.png')}
            resizeMode="contain"
            style={styles.image}
          />

          <Pressable
            style={{marginTop: 40, marginLeft: 10}}
            onPress={() => navigation.goBack()}>
            <BackIC style={{height: 20, width: 20}} />
          </Pressable>
        </View>
        <View style={styles.innerContainer}>
          <View style={{alignItems: 'center'}}>
            <Label
              text={title}
              fontFamily="Inter-Medium"
              style={{
                fontSize: 26,
                marginVertical: 10,
                color: '#000',
              }}
            />
            <Label
              text={subTitle}
              style={[styles.subTitleStyle, customsubTitleStyle]}
            />
          </View>
          {isScroll ? (
            <KeyboardAvoidingView
              style={{...styles.container}}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              enabled>
              <ScrollView
                style={{flexGrow: 1}}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}>
                {children}
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            children
          )}
        </View>
      </View>
    </View>
  );
}

export default ImageContainer;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  innerContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    bottom: 20,
    position: 'absolute',
  },
  image: {
    position: 'absolute',
    opacity: 0.7,
    width: Dimensions.get('screen').width,
    height: 450,
  },
  subTitleStyle: {
    marginBottom: 20,
    color: '#4B4B4B',
    fontSize: 14,
  },
});
