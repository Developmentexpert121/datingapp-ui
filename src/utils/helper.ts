import { countryCodes } from "react-native-country-codes-picker";


export function findFlagByDialCode(dialCode: string) {
    // Find the country object with the given dial_code
    const country = countryCodes.find(
      (country) => country.dial_code === dialCode
    );
  
    // If the country is found, return its flag; otherwise, return null or any default value
    return country ? country.flag : null;
  }