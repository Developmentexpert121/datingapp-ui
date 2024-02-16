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
  console.log('errors22222222222222222222 ', errors);
  return (
    <SafeAreaView>
      <View>
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
                    {borderColor: errors ? 'red' : '#AC25AC'},
                  ]}
                  onPress={() => onChange(item.value)}>
                  <Text style={styles.buttonText}>{item.value}</Text>
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
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  containerBtn: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 250,
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#AC25AC',
  },
  checkedBtn: {
    backgroundColor: '#AC25AC',
  },
  buttonText: {
    color: 'grey',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FirstStepScreen;
