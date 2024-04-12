import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

const FirstStepScreen = ({interests, control, errors}: any) => {
  const options = [{value: 'Women'}, {value: 'Men'}, {value: 'Everyone'}];
  const [checked, setChecked] = useState('');

  return (
    <SafeAreaView>
      <View
        style={{
          paddingHorizontal: 40,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text style={styles.textLabel}>Who are you interested in seeing? </Text>
        {options.map((item: any, index) => (
          <View key={index} style={styles.containerBtn}>
            <Controller
              name={interests}
              control={control}
              defaultValue=""
              render={({field: {onChange, value}}) => (
                <TouchableOpacity
                  style={[
                    value === item.value && styles.checkedBtn,
                    styles.button,
                    {borderColor: errors ? 'red' : '#747474'},
                  ]}
                  onPress={() => onChange(item.value)}>
                  <Text
                    style={[
                      styles.buttonText,
                      {color: value === item.value ? 'white' : 'black'},
                    ]}>
                    {item.value}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textLabel: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
    marginBottom: 28,
  },
  containerBtn: {
    width: '90%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    padding: 10,
    borderRadius: 37,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#747474',
  },
  checkedBtn: {
    backgroundColor: '#AC25AC',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
  },
});

export default FirstStepScreen;
