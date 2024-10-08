import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Controller} from 'react-hook-form';

const SixthStepScreen = ({hobbies, control, errors}: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us about yourself!</Text>
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
              style={[styles.textArea, {height: 80}]}
              multiline
              numberOfLines={4}
              placeholder="This is your bio..."
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
    flexGrow: 1,
    paddingHorizontal: 40,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: 'Sansation-Regular',
    fontSize: 14,
    marginBottom: 16,
    color: '#575757',
  },
  textArea: {
    fontSize: 16,
    textAlignVertical: 'top',
    fontFamily: 'Sansation-Regular',
    padding: 10,
    paddingTop: 10,
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 2,
  },
  boxContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingLeft: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});

export default SixthStepScreen;
