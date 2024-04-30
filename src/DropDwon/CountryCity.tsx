import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from 'country-state-city';

const CountryCity: React.FC = () => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const [states, setStates] = useState<IState[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
      setSelectedState(null);
      setCities([]);
    }
  }, [selectedCountry]);

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

  return (
    <View style={styles.container}>
      <DropDownPicker
        zIndex={5}
        open={countryOpen}
        value={selectedCountry}
        items={countries.map(country => ({
          label: country.name,
          value: country.isoCode,
        }))}
        setOpen={setCountryOpen}
        setValue={setSelectedCountry}
        onChangeValue={setSelectedCountry}
        style={styles.dropdown}
        maxHeight={400}
        dropDownDirection="AUTO"
        searchable={true}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          maxHeight: 200,
          overflow: 'scroll',
        }}
        // searchablePlaceholder="Search for a country"
      />

      <DropDownPicker
        zIndex={4}
        open={stateOpen}
        value={selectedState}
        items={states.map(state => ({
          label: state.name,
          value: state.isoCode,
        }))}
        setOpen={setStateOpen}
        setValue={setSelectedState}
        onChangeValue={setSelectedState}
        style={styles.dropdown}
        disabled={!selectedCountry}
        maxHeight={400}
        dropDownDirection="AUTO"
        searchable={true}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          maxHeight: 200,
          overflow: 'scroll',
        }}
        // searchablePlaceholder="Search for a state"
      />
      <DropDownPicker
        zIndex={3}
        open={cityOpen}
        value={selectedCity}
        items={cities.map(city => ({
          label: city.name,
          value: city.name,
        }))}
        setOpen={setCityOpen}
        setValue={setSelectedCity}
        onChangeValue={setSelectedCity}
        style={styles.dropdown}
        disabled={!selectedState}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          maxHeight: 200,
          overflow: 'scroll',
        }}
        maxHeight={400}
        dropDownDirection="AUTO"
        searchable={true}
        // searchablePlaceholder="Search for a city"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  dropdown: {
    marginVertical: 10,
    width: '90%',
  },
  dropdownContainer: {
    height: 400,
    position: 'absolute',
  },
});
export default CountryCity;
