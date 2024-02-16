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
import {Slider} from 'react-native-elements';
import CommonBackbutton from '../../commonBackbutton/backButton';

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

  const handleSliderChange = (value: any) => {
    setDistance(value);
  };
  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => setChecked(item.value)}>
      <Ionicons
        name={checked === item.value ? 'radio-button-on' : 'radio-button-off'}
        size={24}
        color="#AC25AC"
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
          thumbTintColor="#AC25AC"
          minimumTrackTintColor="#AC25AC"
          maximumTrackTintColor="gray"
          thumbStyle={styles.thumbStyle}
        />
        <View style={styles.labelContainer}>
          <Text style={styles.label1}>Only show people in range</Text>
          <Ionicons
            name={checked === true ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color="#AC25AC"
          />
        </View>
      </View>

      <View style={styles.boxContainer}>
        <Text style={styles.label}>Show me</Text>
        <FlatList
          data={options2}
          renderItem={renderItem}
          keyExtractor={item => item.value}
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
          thumbTintColor="#AC25AC"
          minimumTrackTintColor="#AC25AC"
          maximumTrackTintColor="gray"
          thumbStyle={styles.thumbStyle}
        />
        <View style={styles.labelContainer}>
          <Text style={styles.label1}>Only show people in range</Text>
          <Ionicons
            name={checked === true ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color="#AC25AC"
          />
        </View>
      </View>

      <View style={styles.boxContainer}>
        <Text style={styles.label}>Gender</Text>
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={item => item.value}
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
    color: '#AC25AC',
  },
  stepsText: {
    color: 'grey',
    fontSize: 20,
    //backgroundColor: '#AC25AC',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 80,
  },

  boxContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 30,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    columnGap: 8,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Sansation_Regular',
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
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Sansation_Bold',
  },
  label1: {
    fontSize: 14,
    fontFamily: 'Sansation_Regular',
  },
  value: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Sansation_Regular',
    textAlign: 'center',
    // marginBottom: 16,
  },
});
