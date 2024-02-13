import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { Slider } from 'react-native-elements';
import CommonBackbutton from "../../commonBackbutton/backButton";

const FilterSection = () => {
  const navigation = useNavigation();
  const options = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
    {value: 'Non-Binary', label: 'Non-Binary'},
    {value: 'Transgender', label: 'Transgender'},
  ];

  const options2 = [
    {value: 'men', label: 'Men'},
    {value: 'women', label: 'Women'},
    {value: 'everyone', label: 'Everyone'},
  ];

  const [checked, setChecked] = useState(null);
  const [distance, setDistance] = useState(20);

  const handleSliderChange = (value:any) => {
    setDistance(value);
  };
  const renderItem = ({ item }:any) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => setChecked(item.value)}
    >
      <Ionicons
        name={checked === item.value ? 'radio-button-on' : 'radio-button-off'}
        size={24}
        color="#BB2CBB"
      />
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );
  return (
    <View>
     <CommonBackbutton title="Filter" />
      <View style={styles.boxContainer}>
    <View style={styles.labelContainer}>
        <Text style={styles.label}>Maximum Distance</Text>
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
      <View style={styles.labelContainer}>
        <Text style={styles.label1}>Only show people in range</Text>
        <Ionicons
        name={checked === true ? 'radio-button-on' : 'radio-button-off'}
        size={24}
        color="#BB2CBB"
      />
    </View>
    </View>

    <View style={styles.boxContainer}>
    <Text style={styles.label}>Show me</Text>
      <FlatList
        data={options2}
        renderItem={renderItem}
        keyExtractor={(item) => item.value}
      />
    </View>

    <View style={styles.boxContainer}>
    <View style={styles.labelContainer}>
        <Text style={styles.label}>Age Range</Text>
        <Text style={styles.value}>{distance}</Text>
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
      <View style={styles.labelContainer}>
        <Text style={styles.label1}>Only show people in range</Text>
        <Ionicons
        name={checked === true ? 'radio-button-on' : 'radio-button-off'}
        size={24}
        color="#BB2CBB"
      />
    </View>
    </View>

      <View style={styles.boxContainer}>
        <Text style={styles.label}>Gender</Text>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item.value}
      />
    </View>

   
    </View>
  );
};

export default FilterSection;

const styles = StyleSheet.create({
  backPress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 15,
  },
  backPressIcon: {
    marginRight: 8,
    color: '#BB2CBB',
  },
  stepsText: {
    color: 'grey',
    fontSize: 20,
    //backgroundColor: '#BB2CBB',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 80,
  },

  boxContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    marginRight: 10,
  },
  slider: {
    width: '100%',
  },
  thumbStyle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginBottom: 8,
  },
  label: {
    fontSize: 18,
    //marginBottom: 8,
    fontWeight: 'bold',
  },
  label1: {
    fontSize: 14,
   // marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
   // marginBottom: 16,
  },
});
