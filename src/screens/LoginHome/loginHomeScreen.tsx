import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {useAppSelector} from '../../store/store';
const images = [
  require('../../assets/images/screenImage1.jpg'),
  require('../../assets/images/screenImage2.jpg'),
];
type Props = NativeStackScreenProps<RootStackParamList, 'Loginhome'>;
const LoginHomeScreen: React.FC<Props> = ({navigation: {navigate}}) => {

  const signInInfo: any = useAppSelector(
    (state: any) => state?.Auth?.data?.signInInfo,
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (currentImageIndex < images.length - 1) {
  //       setCurrentImageIndex(currentImageIndex + 1);
  //     }
  //   }, 6000); // Change the delay time (in milliseconds) as needed

  //   return () => clearTimeout(timer);
  // }, [currentImageIndex]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFC7FF',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //paddingHorizontal: 20,
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{
          flex: 3 / 5,
          borderWidth: 0,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/images/login_Image.png')}
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
        />
      </View>
      <View
        style={{
          flex: 2 / 5,
          width: '100%',
          height: '100%',
          // justifyContent: 'center',
          alignItems: 'center',
          // borderWidth: 1,
        }}>
        <View>
          <Text style={styles.label}>What's your email?</Text>
          <Text style={styles.subText}>
            Don't lose access to your account,{'\n'}verify your email.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate('Register')}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already a member?</Text>
          <TouchableOpacity onPress={() => navigate('Login')}>
            <Text style={styles.touchableText}> Log In</Text>
          </TouchableOpacity>
        </View>
        {signInInfo && (
          <Text
            style={{
              fontFamily: 'Sansation-Regular',
              color: 'red',
              fontSize: 14,
              textAlign: 'center',
            }}>
            {signInInfo}
          </Text>
        )}

        <Text style={styles.termsText}>Terms of use and privacy</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    //paddingHorizontal: 20,
    backgroundColor: '#FFC7FF',
    width: '100%',
    height: '100%',
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image1: {
    width: '100%',
    height: '100%',
  },
  image2: {
    width: '100%',
    height: '60%',
  },
  label: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  subText: {
    marginTop: 8,
    fontFamily: 'Sansation-Regular',
    textAlign: 'center',
    color: 'black',
  },
  button: {
    backgroundColor: '#AC25AC',
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 26,
    width: '60%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Sansation-Regular',
  },
  termsText: {
    // marginTop: 36,
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'Sansation-Regular',
    bottom: 20,
    position: 'absolute',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 0,
  },
  loginText: {
    color: 'black',
    marginRight: 5,
    fontFamily: 'Sansation-Regular',
  },
  touchableText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: 'Sansation-Bold',
  },
});

export default LoginHomeScreen;
