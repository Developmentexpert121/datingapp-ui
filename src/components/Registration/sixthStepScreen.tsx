import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

const SixthStepScreen = ({hobbies, control, errors}: any) => {
  // const [hobbies, setHobbies] = useState('');
  console.log('errrrrrrrrrrrrrrrrrrrrrrr ', errors);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your hobbies?</Text>
      <Text style={styles.paragraph}>
        You like what you like. Now, let everyone know.
      </Text>
      <Controller
        name={hobbies}
        control={control}
        rules={{required: true}}
        defaultValue=""
        render={({field: {onChange, onBlur, value}}) => (
          <View style={[styles.boxContainer, errors && styles.errorBorder]}>
            <TextInput
              style={[styles.textArea]}
              multiline
              numberOfLines={4}
              placeholder="Write at least 5 hobbies..."
              placeholderTextColor="#A9A9A9"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
    marginLeft: 10,
  },
  textAreaContainer: {
    //borderWidth: 1,
    borderRadius: 10,
    borderColor: '#AC25AC',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  textArea: {
    fontSize: 16,
    textAlignVertical: 'top',
    //minHeight:100
    //paddingLeft: 10,
    //elevation:2,
    //borderRadius: 10
  },

  errorBorder: {
    borderColor: 'red',
    borderWidth: 2,
  },
  boxContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    //padding: 20,
    marginHorizontal: 15,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SixthStepScreen;
