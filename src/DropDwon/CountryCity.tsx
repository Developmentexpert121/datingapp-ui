import React, {useState, useEffect, FC} from 'react';
import {View, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import DropdownPicker, {ItemType} from 'react-native-dropdown-picker';

// Define types for country and city items
type CountryItem = {
  label: string;
  value: string;
};

type CityItem = {
  label: string;
  value: string;
};

// Define types for component styles
interface Styles {
  container: ViewStyle;
  dropdown: TextStyle;
}

const CountryCity: FC = () => {
  // State variables
  const [country, setCountry] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [countryList, setCountryList] = useState<CountryItem[]>([]);
  const [cityList, setCityList] = useState<CityItem[]>([]);

  // Load country list from an API or data source
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countries: CountryItem[] = data.map((country: any) => ({
          label: country.name.common,
          value: country.cca2, // Use country code as value
        }));
        setCountryList(countries);
      });
  }, []);

  // Load city list from an API or data source based on selected country
  useEffect(() => {
    if (country) {
      fetch(`https://geodataapi.com/api/cities?country_code=${country}`)
        .then(response => response.json())
        .then(data => {
          const cities: CityItem[] = data.map((city: any) => ({
            label: city.name,
            value: city.id, // Use city ID as value
          }));
          setCityList(cities);
        });
    } else {
      setCityList([]);
    }
  }, [country]);

  return (
    <View style={styles.container}>
      {/* Country Dropdown */}
      <DropdownPicker
        items={countryList}
        value={country}
        onChangeValue={(value: any) => setCountry(value)}
        placeholder="Select a country"
        style={styles.dropdown}
      />

      {/* City Dropdown */}
      <DropdownPicker
        items={cityList}
        value={city}
        onChangeValue={(value: any) => setCity(value)}
        placeholder="Select a city"
        style={styles.dropdown}
        disabled={!country} // Disable city dropdown if no country selected
      />
    </View>
  );
};

const styles: Styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: '80%',
    marginBottom: 20,
  },
});

export default CountryCity;
