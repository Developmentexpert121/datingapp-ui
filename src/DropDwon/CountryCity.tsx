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
import Spacing from '../constants/Spacing';
import Colors from '../constants/Colors';
import {Controller} from 'react-hook-form';

const CountryCity: React.FC = (Props: any) => {
  const {
    name,
    control,
    errors,
    borderColor,
    borderWidth,
    marginLeft,
    textstyle,
    autoCapitalize,
    ...textInputProps
  } = Props;
  const [focused, setFocused] = useState<boolean>(false);
  const hasError = errors;

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
    setCountries(allCountries ?? '');
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
    // <Controller
    //   name={name}
    //   control={control}
    //   rules={{required: true}}
    //   defaultValue=""
    //   render={({field: {onChange, onBlur, value}}) => (
    <View style={styles.container}>
      {/* country */}
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
        style={[
          styles.dropdown,
          hasError
            ? styles.errorBorder
            : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
        ]}
        maxHeight={400}
        dropDownDirection="TOP"
        searchable={true}
        autoScroll={true}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          maxHeight: 200,
          overflow: 'hidden',
        }}
        //
        placeholder={'Country'}
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.textStyle}
      />
      {/* State */}
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
        style={[
          styles.dropdown,
          hasError
            ? styles.errorBorder
            : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
        ]}
        disabled={!selectedCountry}
        // maxHeight={400}
        dropDownDirection="TOP"
        searchable={true}
        // autoScroll={true}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          // maxHeight: 300,
          overflow: 'scroll',
        }}
        placeholder={'State'}
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.textStyle}
      />
      {/* City */}
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
        style={[
          styles.dropdown,
          hasError
            ? styles.errorBorder
            : {borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)'},
        ]}
        disabled={!selectedState}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          maxHeight: 300,
          overflow: 'scroll',
        }}
        // maxHeight={400}
        dropDownDirection="TOP"
        searchable={true}
        placeholder={'City'}
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.textStyle}
      />
    </View>
    //   )}
    // />
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    // borderWidth: 1,
  },
  dropdown: {
    marginVertical: 10,
    width: '80%',
    height: 45,
    // backgroundColor: 'red',
  },
  dropdownContainer: {
    height: 400,
    position: 'absolute',
    width: '80%',
  },
  placeholderStyle: {color: Colors.darkText},
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
export default CountryCity;
