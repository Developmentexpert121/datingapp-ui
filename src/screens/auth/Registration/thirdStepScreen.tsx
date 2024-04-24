import React, {useState} from 'react';
import {Slider} from 'react-native-elements';
import {View, Text, Image, StyleSheet, SafeAreaView} from 'react-native';

const ThirdStepScreen = ({distance, setDistance}: any) => {
  const handleSliderChange = (value: any) => {
    setDistance(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Your distance preference?</Text>
        <Text style={styles.paragraphText}>
          Use the slider to set the maximum distance you want to potential
          matches to be located
        </Text>

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
            thumbTintColor="#AC25AC"
            minimumTrackTintColor="#AC25AC"
            maximumTrackTintColor="gray"
            thumbStyle={styles.thumbStyle}
          />
        </View>
        <View style={{flexGrow: 1}}></View>
        <View style={styles.containerBtn}>
          <Text style={styles.containerBtnText}>
            You can change preferences later in settings
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 40,
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
    marginBottom: 8,
  },
  paragraphText: {
    fontFamily: 'Sansation-Regular',
    fontSize: 14,
    marginBottom: 20,
    color: '#575757',
  },
  sliderContainer: {},
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    color: 'black',
  },
  slider: {
    width: '100%',
  },
  thumbStyle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: '#AC25AC',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  containerBtn: {
    alignItems: 'center',
  },
  containerBtnText: {
    fontFamily: 'Sansation-Regular',
    fontSize: 16,
    marginBottom: 20,
    color: '#575757',
    textAlign:"center"
  },
});

export default ThirdStepScreen;
