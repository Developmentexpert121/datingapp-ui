import React, {useEffect, useState, FC} from 'react';
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
import {Text} from 'react-native-elements';

// Define an interface for the props
interface CountryCityProps {
  valueCountry: (country: string) => void;
  valueState: (state: string) => void;
  valueCity: (city: string) => void;
  errors?: string;
  onSetScrollEnabled?: (enabled: boolean) => void;
}

// Define the CountryCity component using TypeScript
const CountryCity: FC<CountryCityProps> = ({
  errors,
  valueCountry,
  valueState,
  valueCity,
  onSetScrollEnabled,
}) => {
  // Define state variables and their types
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [states, setStates] = useState<IState[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  // Fetch all countries when the component mounts
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries ?? []);
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

  // Fetch cities of selected state
  useEffect(() => {
    if (selectedState) {
      const stateCities = City.getCitiesOfState(
        selectedCountry!,
        selectedState,
      );
      setCities(stateCities);
      setSelectedCity(null);
    }
  }, [selectedState, selectedCountry]);

  // Pass selected country, state, and city values to the parent component
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

  // Handle the opening of the country dropdown
  const handleCountryOpen = (isOpen: any) => {
    setCountryOpen(isOpen);
    setStateOpen(false); // Close state dropdown
    setCityOpen(false); // Close city dropdown
    if (onSetScrollEnabled) {
      onSetScrollEnabled(!isOpen);
    }
  };

  // Handle the opening of the state dropdown
  const handleStateOpen = (isOpen: any) => {
    setStateOpen(isOpen);
    setCountryOpen(false); // Close country dropdown
    setCityOpen(false); // Close city dropdown
    if (onSetScrollEnabled) {
      onSetScrollEnabled(!isOpen);
    }
  };

  // Handle the opening of the city dropdown
  const handleCityOpen = (isOpen: any) => {
    setCityOpen(isOpen);
    setCountryOpen(false); // Close country dropdown
    setStateOpen(false); // Close state dropdown
    if (onSetScrollEnabled) {
      onSetScrollEnabled(!isOpen);
    }
  };
  // console.log('::::', errors);
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
        setOpen={handleCountryOpen}
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
        setOpen={handleStateOpen}
        setValue={setSelectedState}
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
        setOpen={handleCityOpen}
        setValue={setSelectedCity}
        style={[
          styles.dropdown,
          errors
            ? styles.errorBorder
            : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
        ]}
        disabled={!selectedState}
        dropDownDirection="TOP"
        searchable
        placeholder="City"
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.textStyle}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
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
    height: 35,
  },
  errorBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
