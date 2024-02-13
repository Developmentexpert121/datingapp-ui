import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
const images = [
  require('../../assets/images/screenImage1.png'),
  require('../../assets/images/screenImage2.png'),
//  require('./path-to-your-image3.jpg'),
];
type Props = NativeStackScreenProps<RootStackParamList, 'Loginhome'>;
const LoginHomeScreen: React.FC<Props> = ({navigation: {navigate}}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }, 6000); // Change the delay time (in milliseconds) as needed

    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Image source={images[currentImageIndex]} style={currentImageIndex===images.length-1? styles.image2: styles.image1} resizeMode="cover" />
      {(currentImageIndex===images.length-1) &&
      <View>
      <Text style={styles.label}>What's your email?</Text>
      <Text style={styles.subText}>Don't lose access to your account, verify your email.</Text>

      <TouchableOpacity style={styles.button} onPress={()=>navigate('Register')}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
  <Text style={styles.loginText}>Already a member?</Text>
  <TouchableOpacity onPress={() => navigate('Login')}>
    <Text style={styles.touchableText}> Log In</Text>
  </TouchableOpacity>
</View>
      <Text style={styles.termsText}>Terms of use and privacy</Text>
      </View>}
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
  image1: {
    width: '100%',
    height: '100%',
  },
  image2: {
    width: '100%',
    height: '60%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  subText: {
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
  },
  button: {
    backgroundColor: '#BB2CBB',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    
  },
  termsText: {
    color: 'gray',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: 'blue',
    marginRight: 5
  },
  touchableText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginHomeScreen;
