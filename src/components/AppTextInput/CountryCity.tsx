import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from 'country-state-city';
import Spacing from '../../constants/Spacing';
import Colors from '../../constants/Colors';

interface IProps {
  valueCountry: (country: string) => void;
  valueState: (state: string) => void;
  valueCity: (city: string) => void;
  errors?: string;
}

const CountryCity: React.FC<IProps> = ({
  errors,
  valueCountry,
  valueState,
  valueCity,
}) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [states, setStates] = useState<IState[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  // console.log('selectedCountry', selectedCountry);
  // console.log('selectedState', selectedState);
  // Fetch all countries when the component mounts
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries ?? '');
  }, []);

  // Fetch states of selected country
  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
      setSelectedState(null);
      setCities([]);
    }
  }, [selectedCountry]);
  //
  //
  // Fetch cities of selected state
  useEffect(() => {
    if (selectedState) {
      const stateCities = City.getCitiesOfState(
        selectedCountry as string,
        selectedState,
      );
      setCities(stateCities);
      setSelectedCity(null);
    }
  }, [selectedState, selectedCountry]);

  //
  //
  // Pass selected country value to parent component
  useEffect(() => {
    if (selectedCountry) {
      valueCountry(selectedCountry);
    }
  }, [selectedCountry, valueCountry]);
  useEffect(() => {
    if (selectedState) {
      valueState(selectedState);
    }
  }, [selectedState, valueState]);

  useEffect(() => {
    if (selectedCity) {
      valueCity(selectedCity);
    }
  }, [selectedCity, valueCity]);
  return (
    <View style={styles.container}>
      {/* Country Dropdown */}
      <DropDownPicker
        open={countryOpen}
        value={selectedCountry}
        items={countries.map(country => ({
          label: country.name,
          value: country.isoCode,
        }))}
        setOpen={setCountryOpen}
        setValue={setSelectedCountry}
        style={[
          styles.dropdown,
          errors
            ? styles.errorBorder
            : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
        ]}
        dropDownDirection="TOP"
        searchable
        placeholder="Country"
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.textStyle}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          // maxHeight: 200,
          overflow: 'hidden',
        }}
      />

      {/* State Dropdown */}
      <DropDownPicker
        open={stateOpen}
        value={selectedState}
        items={states.map(state => ({
          label: state.name,
          value: state.isoCode,
        }))}
        setOpen={setStateOpen}
        setValue={setSelectedState}
        onChangeValue={value => setSelectedState(value)}
        style={[
          styles.dropdown,
          errors
            ? styles.errorBorder
            : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
        ]}
        disabled={!selectedCountry}
        dropDownDirection="TOP"
        searchable
        placeholder="State"
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.textStyle}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          // maxHeight: 200,
          overflow: 'hidden',
        }}
      />

      {/* City Dropdown */}
      <DropDownPicker
        open={cityOpen}
        value={selectedCity}
        items={cities.map(city => ({
          label: city.name,
          value: city.name,
        }))}
        setOpen={setCityOpen}
        setValue={setSelectedCity}
        onChangeValue={value => setSelectedCity(value)}
        style={[
          styles.dropdown,
          errors
            ? styles.errorBorder
            : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
        ]}
        // disabled={!selectedState}
        dropDownDirection="TOP"
        searchable
        placeholder="City"
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.textStyle}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          // maxHeight: 200,
          overflow: 'hidden',
        }}
      />
    </View>
  );
};

export default CountryCity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dropdown: {
    marginVertical: 10,
    width: '80%',
    height: 45,
    borderRadius: 12,
  },
  dropdownContainer: {
    position: 'absolute',
    width: '80%',
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  placeholderStyle: {
    color: Colors.darkText,
  },
  textStyle: {
    fontFamily: 'Sansation-Regular',
    fontSize: 16,
    padding: Spacing,
    backgroundColor: Colors.onPrimary,
  },
  errorBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
