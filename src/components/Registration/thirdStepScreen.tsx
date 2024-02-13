import React, {useState} from 'react';
import { Slider } from 'react-native-elements';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';

const ThirdStepScreen = ({distance, setDistance}:any) => {

    const handleSliderChange = (value:any) => {
      setDistance(value);
    };

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Text style={styles.headerText}>Your distance preference?</Text>
      <Text style={styles.paragraphText}>Use the slider to set the maximum distance that you want to potential matches to be located</Text>

      <View style={styles.sliderContainer}>
 
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Distance Preference</Text>
        <Text style={styles.value}>{distance} Mi</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={50}
        value={distance}
        onValueChange={handleSliderChange}
        step={1}
        thumbTintColor="#BB2CBB"
        minimumTrackTintColor="#BB2CBB"
        maximumTrackTintColor="gray"
        thumbStyle={styles.thumbStyle}
      />

      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  paragraphText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center'

  },
  sliderContainer: {
    padding: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  slider: {
    width: '100%',
  },
  thumbStyle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

export default ThirdStepScreen;
